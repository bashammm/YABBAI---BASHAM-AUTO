import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { SOL_RECIPIENT } from './mission';

export const MAINNET_RPC_URL = 'https://api.mainnet-beta.solana.com';

let connectionInstance: Connection | null = null;

export function getSolanaConnection(): Connection {
  if (!connectionInstance) {
    connectionInstance = new Connection(MAINNET_RPC_URL, {
      commitment: 'confirmed',
    });
  }
  return connectionInstance;
}

export interface LiveWalletData {
  balanceSol: number;
  slot: number;
  lastUpdated: string;
}

export interface LiveSignatureInfo {
  signature: string;
  slot: number;
  blockTime: number | null;
  err: any;
  memo: string | null;
  confirmationStatus: string | null;
}

/**
 * Fetch live on-chain SOL balance for a given wallet address from Solana Mainnet
 */
export async function fetchLiveBalance(walletAddress: string = SOL_RECIPIENT): Promise<LiveWalletData | null> {
  try {
    const conn = getSolanaConnection();
    const pubkey = new PublicKey(walletAddress);
    const balanceLamports = await conn.getBalance(pubkey);
    const slot = await conn.getSlot();

    return {
      balanceSol: balanceLamports / LAMPORTS_PER_SOL,
      slot,
      lastUpdated: new Date().toISOString(),
    };
  } catch (err) {
    console.error('Failed to fetch live balance from Solana RPC:', err);
    return null;
  }
}

/**
 * Fetch recent real finalized signatures for a wallet address from Solana Mainnet
 */
export async function fetchLiveSignatures(
  walletAddress: string = SOL_RECIPIENT,
  limit: number = 5
): Promise<LiveSignatureInfo[]> {
  try {
    const conn = getSolanaConnection();
    const pubkey = new PublicKey(walletAddress);
    const sigs = await conn.getSignaturesForAddress(pubkey, { limit });

    return sigs.map((s) => ({
      signature: s.signature,
      slot: s.slot,
      blockTime: s.blockTime,
      err: s.err,
      memo: s.memo,
      confirmationStatus: s.confirmationStatus || 'finalized',
    }));
  } catch (err) {
    console.error('Failed to fetch live signatures from Solana RPC:', err);
    return [];
  }
}

/**
 * Verify if a transaction signature exists and is confirmed on Solana Mainnet
 */
export async function verifySignatureOnChain(signature: string): Promise<{
  valid: boolean;
  status: string | null;
  slot?: number;
  err?: any;
  raw?: any;
}> {
  try {
    const conn = getSolanaConnection();
    const statusRes = await conn.getSignatureStatus(signature, { searchTransactionHistory: true });
    
    if (statusRes && statusRes.value) {
      return {
        valid: true,
        status: statusRes.value.confirmationStatus || 'confirmed',
        slot: statusRes.value.slot,
        err: statusRes.value.err,
        raw: statusRes.value,
      };
    }

    return { valid: false, status: null };
  } catch (err) {
    console.warn('Error checking tx status on Solana RPC:', err);
    return { valid: false, status: null };
  }
}

/**
 * Check if a browser Solana wallet extension is present (Phantom, Solflare, etc.)
 */
export function getInjectedSolanaProvider(): any | null {
  if (typeof window === 'undefined') return null;
  const anyWindow = window as any;
  if (anyWindow.solana && anyWindow.solana.isPhantom) {
    return anyWindow.solana;
  }
  if (anyWindow.solflare && anyWindow.solflare.isSolflare) {
    return anyWindow.solflare;
  }
  if (anyWindow.solana) {
    return anyWindow.solana;
  }
  return null;
}

/**
 * Connect to injected Solana wallet
 */
export async function connectInjectedWallet(): Promise<{ publicKey: string } | null> {
  const provider = getInjectedSolanaProvider();
  if (!provider) {
    return null;
  }
  try {
    const resp = await provider.connect();
    return { publicKey: resp.publicKey.toString() };
  } catch (err) {
    console.error('Wallet connection rejected:', err);
    throw err;
  }
}

/**
 * Send real SOL transaction on-chain via connected wallet
 */
export async function sendRealSolTransfer({
  toAddress,
  amountSol,
}: {
  toAddress: string;
  amountSol: number;
}): Promise<{ signature: string; slot: number }> {
  const provider = getInjectedSolanaProvider();
  if (!provider || !provider.publicKey) {
    throw new Error('No Solana wallet connected. Please connect Phantom or Solflare first.');
  }

  const conn = getSolanaConnection();
  const fromPubkey = provider.publicKey;
  const toPubkey = new PublicKey(toAddress);

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey,
      toPubkey,
      lamports: Math.round(amountSol * LAMPORTS_PER_SOL),
    })
  );

  const { blockhash, lastValidBlockHeight } = await conn.getLatestBlockhash('confirmed');
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = fromPubkey;

  // Request signature from wallet
  const { signature } = await provider.signAndSendTransaction(transaction);

  // Confirm transaction
  const confirmation = await conn.confirmTransaction(
    {
      signature,
      blockhash,
      lastValidBlockHeight,
    },
    'confirmed'
  );

  const slot = confirmation.context?.slot || (await conn.getSlot());

  return { signature, slot };
}

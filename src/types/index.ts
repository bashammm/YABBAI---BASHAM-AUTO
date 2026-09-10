export interface Lead {
  id: string;
  biz: string;
  niche: string;
  region: string;
  email: string;
  phone: string;
  pain: string;
  fit: string;
  score: number;
  stage: 'SCOUT' | 'QUALIFY' | 'PITCH' | 'CLOSE' | 'BUILD' | 'SHIP' | 'SUPPORT' | 'LOST';
  source: string;
  notes?: string;
  created_at: string;
  estimatedValue?: number;
}

export interface Client {
  id: string;
  biz: string;
  package: string;
  setup_fee: number;
  setup_paid: boolean;
  tier: string;
  mrr: number;
  status: 'QUEUED' | 'BUILDING' | 'TESTING' | 'LIVE' | 'NEEDS_ATTENTION';
  build_pct: number;
  health: 'GREEN' | 'AMBER' | 'RED';
  created_via: 'PAYPAL' | 'SOLANA' | 'CARD' | 'DIRECT';
  created_at: string;
  deliverables: string[];
  techStack?: string[];
  primaryContact?: string;
}

export interface Approval {
  id: string;
  type: 'OUTREACH_PITCH' | 'QUOTE_PROPOSAL' | 'BUILD_HANDOVER' | 'LICENSE_CHECK';
  title: string;
  detail: string;
  payload: Record<string, any>;
  agent: string;
  license?: string;
  license_class?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface MissionEvent {
  id: string;
  cycle_n: number;
  agent: string;
  message: string;
  created_at: string;
  severity?: 'normal' | 'gate' | 'success' | 'alert';
}

export interface Payment {
  id: string;
  method: 'PAYPAL' | 'SOLANA' | 'CARD';
  purpose: string;
  biz: string;
  package: string;
  tier: string;
  amount_usd: number;
  mrr: number;
  sol_amount?: number;
  recipient?: string;
  reference: string;
  status: 'confirmed' | 'pending' | 'verifying';
  client_id?: string;
  created_at: string;
}

export interface VaultWithdrawal {
  id: string;
  amount_sol: number;
  amount_usd_est: number;
  destination_wallet: string;
  tx_signature: string;
  status: 'confirmed' | 'processing' | 'pending';
  memo?: string;
  priority_fee_sol: number;
  created_at: string;
  tx_mode?: 'onchain' | 'simulated';
  slot?: number;
  verified_onchain?: boolean;
}

export interface PackageDef {
  name: string;
  fee: number;
  popular?: boolean;
  badge?: string;
  description: string;
  turnaround: string;
  features: string[];
  idealFor: string;
}

export interface TierDef {
  name: string;
  mrr: number;
  description: string;
  features: string[];
}

export interface AuditResult {
  industry: string;
  monthlyLeads: number;
  avgDealSize: number;
  manualHoursPerWeek: number;
  annualLostRevenue: number;
  annualTimeCost: number;
  totalAnnualLeak: number;
  hoursReclaimedPerYear: number;
  roiMultiplier: number;
  recommendedPackage: 'Fork' | 'Merge' | 'Forge';
  blueprint: {
    systemName: string;
    description: string;
    phase1: string;
    phase2: string;
    phase3: string;
    keyIntegrations: string[];
  };
}

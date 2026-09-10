import React, { useState, useEffect } from 'react';
import { Check, ShieldCheck, Copy, ArrowRight, CreditCard, DollarSign, Wallet, QrCode, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PACKAGES, TIERS, USD, USD_TO_SOL, SOL_RECIPIENT } from '../../lib/mission';
import { Client, Payment } from '../../types';

interface PricingCheckoutProps {
  initialPackage?: string;
  initialScope?: string;
  voucherUnlocked?: boolean;
  onPaymentSuccess: (payment: Payment, client: Client) => void;
  openEnquiry: () => void;
}

export const PricingCheckout: React.FC<PricingCheckoutProps> = ({
  initialPackage = 'Merge',
  initialScope = '',
  voucherUnlocked = false,
  onPaymentSuccess,
  openEnquiry,
}) => {
  const [selectedPkg, setSelectedPkg] = useState(initialPackage);
  const [isCustom, setIsCustom] = useState(false);
  const [customFee, setCustomFee] = useState(2500);
  const [selectedTier, setSelectedTier] = useState('Optimize');

  // Checkout inputs
  const [biz, setBiz] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [scope, setScope] = useState(initialScope);
  const [promoCode, setPromoCode] = useState(voucherUnlocked ? 'PULSE250' : '');
  const [promoApplied, setPromoApplied] = useState(voucherUnlocked);

  // Payment method
  const [payMethod, setPayMethod] = useState<'card' | 'paypal' | 'solana'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [solSignature, setSolSignature] = useState('');
  const [copiedSol, setCopiedSol] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (initialPackage) {
      setSelectedPkg(initialPackage);
    }
  }, [initialPackage]);

  useEffect(() => {
    if (initialScope) {
      setScope(initialScope);
    }
  }, [initialScope]);

  useEffect(() => {
    if (voucherUnlocked && !promoApplied) {
      setPromoCode('PULSE250');
      setPromoApplied(true);
    }
  }, [voucherUnlocked]);

  const packageObj = PACKAGES.find((p) => p.name === selectedPkg) || PACKAGES[1];
  const tierObj = TIERS.find((t) => t.name === selectedTier) || TIERS[1];

  let rawFee = isCustom ? customFee : packageObj.fee;
  const discount = promoApplied && promoCode.trim().toUpperCase() === 'PULSE250' ? 250 : 0;
  const finalFee = Math.max(100, rawFee - discount);
  const solAmount = USD_TO_SOL(finalFee);

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'PULSE250') {
      setPromoApplied(true);
      setError(null);
    } else {
      setError('Invalid voucher code. Play PULSE rhythm game to unlock PULSE250!');
    }
  };

  const handleCopySol = () => {
    navigator.clipboard.writeText(SOL_RECIPIENT);
    setCopiedSol(true);
    setTimeout(() => setCopiedSol(false), 2500);
  };

  const handleConfirmPayment = async () => {
    if (!biz.trim()) {
      setError('Please provide your project or community name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email.');
      return;
    }

    if (payMethod === 'solana' && solSignature.trim().length < 20) {
      setError('Please provide your Solana transaction signature or hash.');
      return;
    }

    setError(null);
    setIsProcessing(true);

    // Simulate real gateway / on-chain verification
    await new Promise((r) => setTimeout(r, 1200));

    const clientId = `client-${Date.now().toString().slice(-4)}`;
    const paymentId = `pay-${Date.now().toString().slice(-4)}`;

    const newPayment: Payment = {
      id: paymentId,
      method: payMethod.toUpperCase() as 'PAYPAL' | 'SOLANA' | 'CARD',
      purpose: `${isCustom ? 'Custom' : selectedPkg} Package Build`,
      biz: biz.trim(),
      package: isCustom ? 'Custom' : selectedPkg,
      tier: selectedTier,
      amount_usd: finalFee,
      mrr: tierObj.mrr,
      sol_amount: payMethod === 'solana' ? solAmount : undefined,
      recipient: payMethod === 'solana' ? SOL_RECIPIENT : undefined,
      reference:
        payMethod === 'solana'
          ? solSignature.trim()
          : payMethod === 'paypal'
          ? `PP-${Date.now().toString().slice(-8)}`
          : `CARD-STR-${Date.now().toString().slice(-8)}`,
      status: 'confirmed',
      client_id: clientId,
      created_at: new Date().toISOString(),
    };

    const newClient: Client = {
      id: clientId,
      biz: biz.trim(),
      package: isCustom ? 'Custom' : selectedPkg,
      setup_fee: finalFee,
      setup_paid: true,
      tier: selectedTier,
      mrr: tierObj.mrr,
      status: 'QUEUED',
      build_pct: 10,
      health: 'GREEN',
      created_via: payMethod.toUpperCase() as 'PAYPAL' | 'SOLANA' | 'CARD',
      created_at: new Date().toISOString(),
      deliverables: [
        'Kickoff brief & repo access ingested',
        'Upstream candidates licence-cleared',
        'Fork branch initialized',
      ],
      techStack: ['TBD during onboarding'],
      primaryContact: `${biz.trim()} (${email.trim()})`,
    };

    setIsProcessing(false);
    setCompleted(true);
    onPaymentSuccess(newPayment, newClient);
  };

  return (
    <section id="pricing-section" className="border-t border-line bg-void py-16 scroll-mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-xs border border-purple/40 bg-purple/10 px-3 py-1 text-[10px] uppercase tracking-[2.5px] text-purple font-bold">
            <DollarSign className="h-3 w-3" />
            <span>Fixed-Price Product Builds</span>
          </div>
          <h2 className="mt-4 font-display text-3xl sm:text-5xl font-black text-ink">
            Packages & Transparent Checkout
          </h2>
          <p className="mt-3 text-[13px] text-dim font-mono leading-relaxed">
            One fixed setup fee to engineer and deliver your production AI agent system. Optional monthly care tier to keep it monitored and optimized. No retainers you can't leave.
          </p>
        </div>

        {/* 3 Main Packages */}
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {PACKAGES.map((pkg) => {
            const isSelected = !isCustom && selectedPkg === pkg.name;
            return (
              <div
                key={pkg.name}
                onClick={() => {
                  setIsCustom(false);
                  setSelectedPkg(pkg.name);
                }}
                className={`cursor-pointer rounded-xs border p-6 flex flex-col justify-between transition-all duration-200 ${
                  isSelected
                    ? 'border-purple bg-panel ring-1 ring-purple shadow-[0_0_24px_rgba(153,69,255,0.25)]'
                    : 'border-line bg-panel/60 hover:border-purple/50 hover:bg-panel'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xl font-black text-ink">{pkg.name}</span>
                    {pkg.badge && (
                      <span className="rounded bg-purple/15 border border-purple/40 px-2 py-0.5 text-[9px] uppercase tracking-[1.5px] font-bold text-purple">
                        {pkg.badge}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-display text-3xl font-black text-green">{USD(pkg.fee)}</span>
                    <span className="text-[10px] uppercase tracking-[1.5px] text-dim">one-off setup</span>
                  </div>

                  <div className="mt-1 text-[11px] font-mono text-purple font-semibold">
                    Turnaround: {pkg.turnaround}
                  </div>

                  <p className="mt-3 text-[12px] text-dim font-mono leading-relaxed">{pkg.description}</p>

                  <div className="mt-4 border-t border-line-subtle pt-4 space-y-2">
                    <div className="text-[10px] uppercase tracking-[1px] text-dim font-bold">What’s Included:</div>
                    {pkg.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-[11.5px] text-ink font-mono">
                        <Check className="h-3.5 w-3.5 text-green shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-line">
                  <button
                    className={`w-full py-2.5 text-[11px] font-bold uppercase tracking-[2px] rounded-xs transition ${
                      isSelected
                        ? 'bg-purple text-white shadow-[0_0_15px_rgba(153,69,255,0.4)]'
                        : 'border border-line bg-panel2 text-dim hover:text-ink hover:border-purple'
                    }`}
                  >
                    {isSelected ? '✓ Selected' : `Choose ${pkg.name}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Scope Option */}
        <div className="mt-6 border border-line bg-panel2/60 p-6 rounded-xs">
          <label className="flex items-center gap-3 text-[13px] font-bold text-ink cursor-pointer">
            <input
              type="checkbox"
              checked={isCustom}
              onChange={(e) => setIsCustom(e.target.checked)}
              className="accent-purple h-4 w-4"
            />
            <span>Custom Scope — Name the niche, the upstream repos, and your budget</span>
          </label>

          {isCustom && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 items-end border-t border-line-subtle pt-4">
              <div>
                <label className="block text-[10px] uppercase tracking-[1.5px] text-dim mb-1 font-bold">
                  Setup Budget (USD):
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={500}
                    max={50000}
                    step={100}
                    value={customFee}
                    onChange={(e) => setCustomFee(Number(e.target.value))}
                    className="w-48 border border-line bg-panel px-3 py-2 text-[14px] font-display font-bold text-green outline-none focus:border-purple rounded-xs"
                  />
                  <span className="text-[11px] text-dim font-mono">Min $300 USD</span>
                </div>
              </div>
              <p className="text-[11.5px] text-dim font-mono">
                Have a unique API, legacy ERP, or multi-tenant database? Name your budget and scope below.
              </p>
            </div>
          )}
        </div>

        {/* Monthly Care Tiers Selector */}
        <div className="mt-12">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <div className="text-[10px] uppercase tracking-[2px] text-purple font-bold">
                Ongoing Operational Optimization
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-black text-ink">
                Select Your Stewardship Tier
              </h3>
            </div>
            <span className="text-[11px] text-dim font-mono">Optional · Cancel anytime · No lock-in</span>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {TIERS.map((t) => {
              const isSelected = selectedTier === t.name;
              return (
                <div
                  key={t.name}
                  onClick={() => setSelectedTier(t.name)}
                  className={`cursor-pointer border p-5 rounded-xs transition ${
                    isSelected
                      ? 'border-green bg-panel ring-1 ring-green/50 shadow-[0_0_18px_rgba(20,241,149,0.15)]'
                      : 'border-line bg-panel/50 hover:border-green/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-[16px] font-bold text-ink">{t.name}</span>
                    <span className="font-display text-[15px] font-bold text-green">{USD(t.mrr)}/mo</span>
                  </div>
                  <p className="mt-2 text-[11.5px] text-dim font-mono leading-relaxed">{t.description}</p>
                  <ul className="mt-3 space-y-1 text-[11px] text-dim2 font-mono">
                    {t.features.map((f, i) => (
                      <li key={i}>• {f}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* The Checkout Terminal Box */}
        <div className="mt-14 max-w-3xl mx-auto border border-line bg-panel p-6 sm:p-8 rounded-xs shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
            <div>
              <div className="text-[10px] uppercase tracking-[2px] text-purple font-bold">Instant Order</div>
              <h3 className="font-display text-xl font-black text-ink">Build Intake & Checkout</h3>
            </div>
            <div className="text-right">
              <div className="font-display text-2xl font-black text-green">
                {USD(finalFee)} <span className="text-[11px] text-dim font-normal">setup</span>
              </div>
              <div className="text-[10.5px] text-dim font-mono">
                + {USD(tierObj.mrr)}/mo ({selectedTier} tier)
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[9.5px] uppercase tracking-[1.5px] text-dim mb-1 font-bold">
                  Project / Community Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Trailhead Collective"
                  value={biz}
                  onChange={(e) => setBiz(e.target.value)}
                  className="w-full border border-line bg-panel2 px-3 py-2 text-[12px] text-ink outline-none focus:border-purple rounded-xs"
                />
              </div>

              <div>
                <label className="block text-[9.5px] uppercase tracking-[1.5px] text-dim mb-1 font-bold">
                  Work Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="maya@trailheadcollective.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-line bg-panel2 px-3 py-2 text-[12px] text-ink outline-none focus:border-purple rounded-xs"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[9.5px] uppercase tracking-[1.5px] text-dim mb-1 font-bold">
                  Phone (Optional)
                </label>
                <input
                  type="text"
                  placeholder="+1 720 555 0142"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-line bg-panel2 px-3 py-2 text-[12px] text-ink outline-none focus:border-purple rounded-xs"
                />
              </div>

              <div>
                <label className="block text-[9.5px] uppercase tracking-[1.5px] text-dim mb-1 font-bold">
                  Voucher / Game Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. PULSE250"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full border border-line bg-panel2 px-3 py-2 text-[12px] text-ink outline-none focus:border-purple rounded-xs uppercase font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="border border-purple px-3 text-[10px] font-bold text-purple uppercase rounded-xs hover:bg-purple hover:text-white"
                  >
                    Apply
                  </button>
                </div>
                {promoApplied && (
                  <div className="mt-1 text-[10px] text-green font-mono">
                    ✓ PULSE250 Applied: -$250 USD Voucher Discount
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[9.5px] uppercase tracking-[1.5px] text-dim mb-1 font-bold">
                Scope & Deliverables Description:
              </label>
              <textarea
                rows={3}
                placeholder="Describe the niche, any open-source projects that almost fit, and the platform you want it shipped to (web, CLI, plugin, mobile)."
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                className="w-full border border-line bg-panel2 p-3 text-[12px] font-mono text-ink outline-none focus:border-purple rounded-xs resize-none"
              />
            </div>

            {/* Payment Method Selector */}
            <div className="pt-2">
              <label className="block text-[10px] uppercase tracking-[1.5px] text-dim mb-2 font-bold">
                Select Payment Vector:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPayMethod('card')}
                  className={`border p-3 text-center rounded-xs transition flex flex-col items-center gap-1 ${
                    payMethod === 'card'
                      ? 'border-purple bg-purple/15 text-ink font-bold'
                      : 'border-line bg-panel2 text-dim hover:text-ink'
                  }`}
                >
                  <CreditCard className="h-4 w-4 text-purple" />
                  <span className="text-[11px] font-mono">Credit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPayMethod('paypal')}
                  className={`border p-3 text-center rounded-xs transition flex flex-col items-center gap-1 ${
                    payMethod === 'paypal'
                      ? 'border-purple bg-purple/15 text-ink font-bold'
                      : 'border-line bg-panel2 text-dim hover:text-ink'
                  }`}
                >
                  <DollarSign className="h-4 w-4 text-green" />
                  <span className="text-[11px] font-mono">PayPal</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPayMethod('solana')}
                  className={`border p-3 text-center rounded-xs transition flex flex-col items-center gap-1 ${
                    payMethod === 'solana'
                      ? 'border-purple bg-purple/15 text-ink font-bold'
                      : 'border-line bg-panel2 text-dim hover:text-ink'
                  }`}
                >
                  <Wallet className="h-4 w-4 text-green" />
                  <span className="text-[11px] font-mono">Solana (SOL)</span>
                </button>
              </div>
            </div>

            {/* Sub-Forms for Payment Methods */}
            {payMethod === 'card' && (
              <div className="border border-line-subtle bg-panel2 p-4 rounded-xs space-y-3">
                <div className="text-[10px] uppercase tracking-[1px] text-dim">
                  Secure Direct Checkout
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Card Number (4000 1234 5678 9010)"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full border border-line bg-panel px-3 py-2 text-[12px] font-mono text-ink rounded-xs outline-none focus:border-purple"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardExp}
                    onChange={(e) => setCardExp(e.target.value)}
                    className="border border-line bg-panel px-3 py-2 text-[12px] font-mono text-ink rounded-xs outline-none focus:border-purple"
                  />
                  <input
                    type="text"
                    placeholder="CVC (123)"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="border border-line bg-panel px-3 py-2 text-[12px] font-mono text-ink rounded-xs outline-none focus:border-purple"
                  />
                </div>
              </div>
            )}

            {payMethod === 'paypal' && (
              <div className="border border-line-subtle bg-panel2 p-4 rounded-xs text-[12px] text-dim font-mono leading-relaxed">
                Clicking confirm opens direct PayPal checkout. Funds route to the Director's verified merchant PayPal account.
              </div>
            )}

            {payMethod === 'solana' && (
              <div className="border border-purple/40 bg-panel2 p-4 rounded-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-green font-bold">
                    Send exactly {solAmount} SOL
                  </span>
                  <span className="text-[10px] text-dim font-mono">Phantom / Solflare</span>
                </div>

                <div className="text-[10.5px] text-dim font-mono">Open Solana Treasury Address (verifiable on Solscan):</div>
                <div className="flex items-center gap-2">
                  <code className="block flex-1 overflow-x-auto border border-line bg-panel p-2 text-[10.5px] font-mono text-ink rounded-xs">
                    {SOL_RECIPIENT}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopySol}
                    className="border border-line bg-panel px-3 py-2 text-[10px] text-purple hover:border-purple rounded-xs flex items-center gap-1 font-bold"
                  >
                    <Copy className="h-3 w-3" />
                    <span>{copiedSol ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div>
                  <label className="block text-[9.5px] uppercase tracking-[1px] text-dim mb-1">
                    Paste Transaction Signature / Hash:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 5KmN8jZ9wL2...or tx hash"
                    value={solSignature}
                    onChange={(e) => setSolSignature(e.target.value)}
                    className="w-full border border-line bg-panel px-3 py-2 text-[11px] font-mono text-ink rounded-xs outline-none focus:border-purple"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="border border-red/40 bg-red/10 p-3 rounded-xs flex items-center gap-2 text-[11px] text-red font-mono">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {completed ? (
              <div className="border border-green/50 bg-green/10 p-4 rounded-xs text-center space-y-2">
                <div className="text-green font-display text-[16px] font-black flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Payment Confirmed · Build Queued in Mission Control!
                </div>
                <p className="text-[12px] text-ink font-mono">
                  Welcome aboard, {biz}. An onboarding ticket has been created and your build starts today.
                </p>
              </div>
            ) : (
              <div className="pt-2">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleConfirmPayment}
                  className="w-full rounded-xs bg-green py-3 text-[12px] font-bold uppercase tracking-[2px] text-void hover:bg-green-hover hover:shadow-[0_0_24px_rgba(20,241,149,0.4)] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>
                    {isProcessing
                      ? 'Verifying Payment & Ingesting Build…'
                      : `Pay ${USD(finalFee)} & Start Build Today`}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

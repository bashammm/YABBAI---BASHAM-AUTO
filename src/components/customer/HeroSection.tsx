import React, { useState, useEffect } from 'react';
import { Sparkles, Bot, Shield, CheckCircle, ArrowRight, TrendingUp, Clock, DollarSign, Zap } from 'lucide-react';
import { USD, PACKAGES, TIERS } from '../../lib/mission';

interface HeroSectionProps {
  onOpenAudit: () => void;
  onOpenDemo: () => void;
  onOpenPricing: () => void;
  onOpenEnquiry: () => void;
}

const TICKER_ITEMS = [
  '🥾 Trailhead Collective (Colorado): trip-planner + gear-share merged, 2,300 members migrated off spreadsheets',
  '🎮 Pixel Foundry (Berlin): abandoned Minecraft server manager revived as a maintained fork, 40 servers back online',
  '🧶 Loomcraft Patterns: open knitting editor forked, PDF export + marketplace added, v1.0.0 on npm',
  '🔬 Tidepool Citizen Science (Lisbon): six data apps merged into one pipeline, 800 volunteers logging again',
  '🚚 Harbour Freight Co-op: from-scratch consignment tracker open-sourced, 31 outside contributors in month one',
];

const STEPS = [
  {
    num: '01',
    title: 'Name the Niche',
    desc: 'Tell us the corner of the universe that needs a tool — a hobby, a trade, a game, a lab, a market. We scan what already exists and what is missing.',
  },
  {
    num: '02',
    title: 'Fork, Merge, or Forge',
    desc: 'We pick the path: adapt one proven repo, merge several into one product, or build from scratch. Fixed price, checkout by card, PayPal, or SOL.',
  },
  {
    num: '03',
    title: 'Agent Loop + Human Gate',
    desc: 'Eight agents scout, license-check, build, and test. No release ships and no message goes out without Director sign-off.',
  },
  {
    num: '04',
    title: 'Ship It Open Source',
    desc: 'Published under your name on GitHub and the right registry, with a paid layer if you want one. Optional monthly stewardship keeps it alive.',
  },
];

const PROOF_CARDS = [
  {
    title: 'Human-Approved Gates',
    badge: 'DIRECTOR SIGN-OFF',
    desc: 'No rogue releases. No agent publishes a package, messages a community, or moves money without explicit approval.',
    tone: 'amber',
  },
  {
    title: 'License-Clean Forks',
    badge: 'AUDITED BY AGT-FORGE',
    desc: 'Every upstream repo and dependency is checked for fork, rebrand, and resale rights before a line is changed.',
    tone: 'green',
  },
  {
    title: 'Open Treasury',
    badge: 'FULL TRANSPARENCY',
    desc: 'Every sale and support contract is ledgered in Mission Control with the on-chain SOL treasury visible on Solscan.',
    tone: 'purple',
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenAudit,
  onOpenDemo,
  onOpenPricing,
  onOpenEnquiry,
}) => {
  const [tickerIndex, setTickerIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % TICKER_ITEMS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Background cyber grid effect */}
      <div className="absolute inset-0 bg-[radial-gradient(#9945ff_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.07] pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-purple/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Live Social Proof Ticker */}
      <div className="border-b border-line bg-panel2/60 px-4 py-2 text-center text-[10.5px] uppercase tracking-[1.5px] text-dim">
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="inline-block h-2 w-2 rounded-full bg-green animate-ping" />
          <span className="font-semibold text-green">LIVE OPERATIONS:</span>
          <span className="text-ink transition-all duration-300 font-mono">
            {TICKER_ITEMS[tickerIndex]}
          </span>
        </div>
      </div>

      {/* Main Hero Container */}
      <div className="relative mx-auto max-w-5xl px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-28 text-center">
        {/* Origin Badge */}
        <div className="inline-flex items-center gap-2 rounded-xs border border-purple/40 bg-purple/10 px-3.5 py-1 text-[10px] uppercase tracking-[2.5px] text-purple">
          <Sparkles className="h-3 w-3 text-green" />
          <span>Basham Automations · Open-Source Foundry · Worldwide</span>
        </div>

        {/* Headline */}
        <h1 className="mt-6 font-display text-3xl font-black leading-tight sm:text-5xl md:text-6xl text-ink tracking-tight">
          A product for every niche <br />
          <span className="bg-gradient-to-r from-purple via-green to-purple bg-clip-text text-transparent">
            forked, merged, forged
          </span>{' '}
          and shipped open source
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl text-[14px] sm:text-[15px] leading-relaxed text-dim font-mono">
          Recreation, gaming, creators, science, commerce, trades — wherever a good tool is missing or abandoned, we adapt what exists or build what doesn't, then release it under your name. Fixed price from {USD(PACKAGES[0].fee)}. No retainers you can't leave.
        </p>

        {/* Primary CTA Row */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
          <button
            id="hero-audit-cta"
            onClick={onOpenAudit}
            className="group rounded-xs bg-green px-6 py-3.5 text-[11px] font-bold uppercase tracking-[2px] text-void transition hover:bg-green-hover hover:shadow-[0_0_26px_rgba(20,241,149,0.45)] flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            <span>Run 60s Opportunity Scan</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>

          <button
            id="hero-demo-cta"
            onClick={onOpenDemo}
            className="rounded-xs border border-line bg-panel px-6 py-3.5 text-[11px] font-bold uppercase tracking-[2px] text-ink transition hover:border-purple hover:bg-panel2 flex items-center gap-2"
          >
            <Bot className="h-4 w-4 text-purple" />
            <span>Test-Drive Live Agents</span>
          </button>

          <button
            id="hero-packages-cta"
            onClick={onOpenPricing}
            className="rounded-xs bg-purple/20 border border-purple/60 px-5 py-3.5 text-[11px] font-bold uppercase tracking-[2px] text-ink transition hover:bg-purple hover:text-white"
          >
            <span>See Packages ({USD(PACKAGES[0].fee)})</span>
          </button>
        </div>

        {/* Value Anchor Micro-copy */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-[10px] uppercase tracking-[1.5px] text-dim">
          <div className="flex items-center gap-1.5">
            <CheckCircle className="h-3.5 w-3.5 text-green" />
            <span>Setup from {USD(PACKAGES[0].fee)}</span>
          </div>
          <div className="hidden sm:inline text-line">•</div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="h-3.5 w-3.5 text-green" />
            <span>Optional Stewardship from {USD(TIERS[0].mrr)}/mo</span>
          </div>
          <div className="hidden sm:inline text-line">•</div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="h-3.5 w-3.5 text-green" />
            <span>Pay Card, PayPal or SOL</span>
          </div>
        </div>

        {/* Live Quick Metrics Strip */}
        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4 max-w-4xl mx-auto">
          <div className="border border-line bg-panel/70 p-4 rounded-xs text-left">
            <div className="text-[10px] uppercase tracking-[1.5px] text-dim flex items-center gap-1">
              <Clock className="h-3 w-3 text-purple" /> Fork to Release
            </div>
            <div className="mt-1 font-display text-xl font-extrabold text-ink">3–5 Days</div>
            <div className="text-[10.5px] text-dim2">Instead of months from scratch</div>
          </div>
          <div className="border border-line bg-panel/70 p-4 rounded-xs text-left">
            <div className="text-[10px] uppercase tracking-[1.5px] text-dim flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green" /> Niches Served
            </div>
            <div className="mt-1 font-display text-xl font-extrabold text-green">10+</div>
            <div className="text-[10.5px] text-dim2">And counting</div>
          </div>
          <div className="border border-line bg-panel/70 p-4 rounded-xs text-left">
            <div className="text-[10px] uppercase tracking-[1.5px] text-dim flex items-center gap-1">
              <DollarSign className="h-3 w-3 text-amber" /> Build Hours Saved
            </div>
            <div className="mt-1 font-display text-xl font-extrabold text-amber">~80%</div>
            <div className="text-[10.5px] text-dim2">Forking vs. starting blank</div>
          </div>
          <div className="border border-line bg-panel/70 p-4 rounded-xs text-left">
            <div className="text-[10px] uppercase tracking-[1.5px] text-dim flex items-center gap-1">
              <Zap className="h-3 w-3 text-purple" /> Licence Audit
            </div>
            <div className="mt-1 font-display text-xl font-extrabold text-purple">100%</div>
            <div className="text-[10.5px] text-dim2">Every upstream, every dep</div>
          </div>
        </div>
      </div>

      {/* 3 Proof Pillars */}
      <section className="border-y border-line bg-panel/40 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-4 md:grid-cols-3">
            {PROOF_CARDS.map((card) => (
              <div
                key={card.title}
                className="border border-line bg-panel p-6 rounded-xs transition hover:border-purple/60 hover:bg-panel2/80"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[9px] uppercase tracking-[2px] font-bold px-2 py-0.5 rounded ${
                      card.tone === 'amber'
                        ? 'bg-amber/10 text-amber border border-amber/30'
                        : card.tone === 'green'
                        ? 'bg-green/10 text-green border border-green/30'
                        : 'bg-purple/10 text-purple border border-purple/30'
                    }`}
                  >
                    {card.badge}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-[16px] font-bold text-ink">{card.title}</h3>
                <p className="mt-2 text-[12px] leading-relaxed text-dim font-mono">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4-Step How It Works */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-[10px] uppercase tracking-[2.5px] text-purple font-bold">
                Clear & Predictable Engineering
              </div>
              <h2 className="mt-1 font-display text-2xl font-black text-ink">How a Product Gets Made Here</h2>
            </div>
            <p className="text-[12px] text-dim max-w-md font-mono">
              From checkout to a public release in 3 to 21 days depending on the path, with every stage visible in Mission Control.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <div
                key={step.num}
                className="border border-line bg-panel/60 p-5 rounded-xs relative group hover:border-purple/50 transition"
              >
                <div className="text-[12px] font-display font-black text-purple">{step.num}</div>
                <div className="mt-2 font-display text-[14px] font-bold text-ink">{step.title}</div>
                <p className="mt-2 text-[11.5px] leading-relaxed text-dim font-mono">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

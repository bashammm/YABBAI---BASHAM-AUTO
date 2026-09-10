import React from 'react';
import { Cpu, Terminal, Sparkles, Shield, Gamepad2, ArrowRight } from 'lucide-react';

interface SiteNavProps {
  currentTab: 'home' | 'audit' | 'demo' | 'pricing' | 'mission' | 'pulse';
  onSelectTab: (tab: 'home' | 'audit' | 'demo' | 'pricing' | 'mission' | 'pulse') => void;
  openEnquiry: () => void;
  openAudit: () => void;
  voucherUnlocked?: boolean;
}

export const SiteNav: React.FC<SiteNavProps> = ({
  currentTab,
  onSelectTab,
  openEnquiry,
  openAudit,
  voucherUnlocked,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-void/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            id="nav-logo-btn"
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-2 text-left transition hover:opacity-90"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-purple/20 border border-purple text-green">
              <Cpu className="h-4 w-4" />
            </div>
            <div>
              <div className="font-display text-[15px] font-black tracking-[0.5px] text-ink">
                YABBAI <span className="text-purple">//</span> <span className="text-dim text-[12px] font-normal tracking-wide">BASHAM AUTOMATIONS</span>
              </div>
              <div className="text-[9px] uppercase tracking-[1.5px] text-green flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-green animate-pulse" />
                8 Agents Active · Open-Source Foundry · Worldwide
              </div>
            </div>
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 text-[11px] uppercase tracking-[1.5px] font-medium text-dim">
          <button
            id="nav-home-btn"
            onClick={() => onSelectTab('home')}
            className={`px-3 py-1.5 rounded-xs transition ${
              currentTab === 'home' ? 'text-ink bg-panel border border-line' : 'hover:text-ink'
            }`}
          >
            Overview
          </button>
          <button
            id="nav-audit-btn"
            onClick={() => {
              onSelectTab('home');
              openAudit();
            }}
            className="px-3 py-1.5 rounded-xs transition hover:text-green flex items-center gap-1 text-green"
          >
            <Sparkles className="h-3 w-3" />
            60s Scan
          </button>
          <button
            id="nav-demo-btn"
            onClick={() => onSelectTab('demo')}
            className={`px-3 py-1.5 rounded-xs transition ${
              currentTab === 'demo' ? 'text-ink bg-panel border border-line' : 'hover:text-ink'
            }`}
          >
            Agent Demo
          </button>
          <button
            id="nav-pricing-btn"
            onClick={() => onSelectTab('pricing')}
            className={`px-3 py-1.5 rounded-xs transition ${
              currentTab === 'pricing' ? 'text-ink bg-panel border border-line' : 'hover:text-ink'
            }`}
          >
            Packages
          </button>
          <button
            id="nav-pulse-btn"
            onClick={() => onSelectTab('pulse')}
            className={`px-3 py-1.5 rounded-xs transition flex items-center gap-1.5 ${
              currentTab === 'pulse' ? 'text-purple bg-panel border border-purple' : 'text-purple/80 hover:text-purple'
            }`}
          >
            <Gamepad2 className="h-3.5 w-3.5" />
            Pulse
            {voucherUnlocked && (
              <span className="ml-1 rounded bg-green/20 px-1 py-0.2 text-[8px] text-green border border-green/40">
                $250 OFF
              </span>
            )}
          </button>
          <button
            id="nav-mission-btn"
            onClick={() => onSelectTab('mission')}
            className={`px-3 py-1.5 rounded-xs transition flex items-center gap-1.5 ${
              currentTab === 'mission' ? 'text-amber bg-panel border border-amber/40' : 'hover:text-ink'
            }`}
          >
            <Terminal className="h-3 w-3 text-amber" />
            Mission Control
          </button>
        </nav>

        {/* Quick CTA Actions */}
        <div className="flex items-center gap-2.5">
          <button
            id="nav-enquire-btn"
            onClick={openEnquiry}
            className="hidden sm:inline-flex rounded-xs border border-line bg-panel/80 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[1.5px] text-ink transition hover:border-purple hover:bg-panel"
          >
            Enquire
          </button>
          <button
            id="nav-buy-package-btn"
            onClick={() => onSelectTab('pricing')}
            className="rounded-xs bg-purple px-4 py-2 text-[10px] font-bold uppercase tracking-[1.5px] text-white transition hover:bg-purple-hover hover:shadow-[0_0_20px_rgba(153,69,255,0.4)] flex items-center gap-1.5"
          >
            <span>Buy Package</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation */}
      <div className="flex lg:hidden overflow-x-auto border-t border-line px-3 py-2 gap-2 text-[10px] uppercase tracking-[1.5px]">
        <button
          onClick={() => onSelectTab('home')}
          className={`px-2.5 py-1 whitespace-nowrap rounded ${
            currentTab === 'home' ? 'bg-panel border border-line text-ink' : 'text-dim'
          }`}
        >
          Home
        </button>
        <button
          onClick={() => {
            onSelectTab('home');
            openAudit();
          }}
          className="px-2.5 py-1 whitespace-nowrap rounded text-green border border-green/30"
        >
          60s Scan
        </button>
        <button
          onClick={() => onSelectTab('demo')}
          className={`px-2.5 py-1 whitespace-nowrap rounded ${
            currentTab === 'demo' ? 'bg-panel border border-line text-ink' : 'text-dim'
          }`}
        >
          Agent Demo
        </button>
        <button
          onClick={() => onSelectTab('pricing')}
          className={`px-2.5 py-1 whitespace-nowrap rounded ${
            currentTab === 'pricing' ? 'bg-panel border border-line text-ink' : 'text-dim'
          }`}
        >
          Packages
        </button>
        <button
          onClick={() => onSelectTab('mission')}
          className={`px-2.5 py-1 whitespace-nowrap rounded ${
            currentTab === 'mission' ? 'bg-panel border border-amber text-amber' : 'text-dim'
          }`}
        >
          Mission Control
        </button>
        <button
          onClick={() => onSelectTab('pulse')}
          className={`px-2.5 py-1 whitespace-nowrap rounded text-purple border border-purple/30`}
        >
          Pulse {voucherUnlocked ? '($250 OFF)' : ''}
        </button>
      </div>
    </header>
  );
};

export const SiteFooter: React.FC<{
  onSelectTab: (tab: any) => void;
  openEnquiry: () => void;
}> = ({ onSelectTab, openEnquiry }) => {
  return (
    <footer className="mt-24 border-t border-line bg-void px-5 py-14">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="font-display text-[15px] font-black text-ink">
              YABBAI <span className="text-purple">//</span> BASHAM AUTOMATIONS
            </div>
            <p className="mt-3 text-[12px] leading-relaxed text-dim">
              An open-source product foundry. We fork, merge, and forge tools for every niche in the universe, ship them under your name, and keep them alive. Fixed-price builds, watched by a human director.
            </p>
            <div className="mt-4 text-[11px] text-green flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" />
              Every fork licence-audited for resale
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-[2px] font-bold text-ink">Builds</div>
            <ul className="mt-3 space-y-2 text-[12px] text-dim">
              <li>
                <button onClick={() => onSelectTab('pricing')} className="hover:text-ink">
                  Fork ($900 USD)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('pricing')} className="hover:text-ink">
                  Merge ($2,400 USD)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('pricing')} className="hover:text-ink">
                  Forge ($6,000 USD)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('pricing')} className="hover:text-ink">
                  Custom Scope & Budget
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('pricing')} className="hover:text-ink">
                  Stewardship Tiers ($300–$2,200/mo)
                </button>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-[2px] font-bold text-ink">Platform & Tech</div>
            <ul className="mt-3 space-y-2 text-[12px] text-dim">
              <li>
                <button onClick={() => onSelectTab('demo')} className="hover:text-ink">
                  Test-Drive the Agents
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('mission')} className="hover:text-amber">
                  Director Mission Control
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('pulse')} className="hover:text-purple">
                  YabbAI Pulse Rhythm Game
                </button>
              </li>
              <li>
                <a
                  href="https://solscan.io/account/HTN1fvHwbzKiMwh9YXZEe3eooiMdoCAs3TweWdiSZV5i"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-green"
                >
                  Open Solana Treasury (Solscan)
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-[2px] font-bold text-ink">Director Contact</div>
            <div className="mt-3 text-[12px] text-dim space-y-1.5">
              <div>Thomas Basham · Director</div>
              <div className="text-ink font-mono text-[11px]">basham_x@proton.me</div>
              <div className="text-[11px] text-dim2">Remote-first · Melbourne (UTC+10) · Serving every timezone</div>
            </div>
            <button
              onClick={openEnquiry}
              className="mt-4 inline-block border border-line px-3.5 py-2 text-[10px] uppercase tracking-[1.5px] font-bold text-ink hover:border-purple"
            >
              Send Direct Enquiry
            </button>
          </div>
        </div>

        <div className="mt-12 border-t border-line-subtle pt-8 flex flex-wrap items-center justify-between gap-4 text-[10px] uppercase tracking-[1.5px] text-dim">
          <div>
            © {new Date().getFullYear()} Basham Automations. Shipped products are open source under their own licences. Prices in USD.
          </div>
          <div>
            Secure Payments via PayPal (Cards/Balance) & Solana Verified On-Chain Transfer
          </div>
        </div>
      </div>
    </footer>
  );
};

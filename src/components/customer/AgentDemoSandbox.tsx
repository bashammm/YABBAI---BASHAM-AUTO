import React, { useState } from 'react';
import { Bot, Terminal, Send, Shield, ArrowRight, RefreshCw, FileText, GitFork, Rocket } from 'lucide-react';
import { generateAIAgentResponse } from '../../lib/gemini';

interface AgentDemoSandboxProps {
  onSelectPackage: (pkgName: string) => void;
}

type AgentType = 'quoter' | 'extractor' | 'retention';

const AGENT_TABS = [
  {
    id: 'quoter' as AgentType,
    name: 'Fork Planner',
    tag: 'AGT-SCOUT',
    role: 'Takes a niche request, finds upstream repos worth forking, and prices the adaptation in seconds.',
    icon: GitFork,
    defaultPrompt: 'Our rock-climbing gym wants a route-setting and member log app. Everything on the market is closed and charges per member. Is there something open we can fork?',
    presets: [
      'Need a tournament bracket + Discord bot for our 400-player fighting-game community.',
      'Looking for an open podcast host with listener paywalls for a true-crime show.',
      'We run a beekeeping co-op and want hive inspection logging with weather data.',
    ],
  },
  {
    id: 'extractor' as AgentType,
    name: 'Licence & Dependency Audit',
    tag: 'AGT-FORGE',
    role: 'Reads a package manifest, flags copyleft contamination, and confirms fork / rebrand / resale rights.',
    icon: FileText,
    defaultPrompt: `package.json
name: open-trip-planner
license: MIT
dependencies:
  react ^19 (MIT)
  leaflet ^1.9 (BSD-2)
  stripe ^14 (MIT)
  date-fns ^3 (MIT)
  some-gpl-lib ^2 (GPL-3.0)`,
    presets: [
      'requirements.txt: fastapi (MIT), sqlalchemy (MIT), pandas (BSD-3), pdfminer.six (MIT)',
      'Cargo.toml: tokio (MIT), serde (MIT/Apache-2), sqlx (MIT/Apache-2), ffmpeg-sys (LGPL)',
    ],
  },
  {
    id: 'retention' as AgentType,
    name: 'Release & Launch Writer',
    tag: 'AGT-SHIPPER',
    role: 'Turns a diff into release notes, a changelog, and launch posts for the community that asked.',
    icon: Rocket,
    defaultPrompt: 'Draft release notes for v1.1.0: added offline mode, CSV export, plugin API; fixed sync bug #42.',
    presets: [
      'Write a launch post for the climbing-gym app for r/climbing and the Mountain Project forum.',
      'Announce that the abandoned server manager is now maintained again; invite old contributors back.',
    ],
  },
];

export const AgentDemoSandbox: React.FC<AgentDemoSandboxProps> = ({ onSelectPackage }) => {
  const [activeTab, setActiveTab] = useState<AgentType>('quoter');
  const currentAgent = AGENT_TABS.find((t) => t.id === activeTab)!;

  const [input, setInput] = useState(currentAgent.defaultPrompt);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<{
    reply: string;
    data?: any;
    latencyMs: number;
  } | null>(null);

  const handleTabSwitch = (id: AgentType) => {
    setActiveTab(id);
    const agt = AGENT_TABS.find((t) => t.id === id)!;
    setInput(agt.defaultPrompt);
    setOutput(null);
  };

  const handleRun = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    try {
      const res = await generateAIAgentResponse(activeTab, input);
      setOutput(res);
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="demo-section" className="border-t border-line bg-void py-16 scroll-mt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-xs border border-purple/40 bg-purple/10 px-3 py-1 text-[10px] uppercase tracking-[2.5px] text-purple font-bold">
            <Bot className="h-3.5 w-3.5" />
            <span>Interactive Production Sandbox</span>
          </div>
          <h2 className="mt-4 font-display text-2xl sm:text-4xl font-black text-ink">
            Test-Drive the Foundry Agents
          </h2>
          <p className="mt-3 text-[13px] text-dim font-mono leading-relaxed">
            Plan a fork, audit a licence, write a release. Notice how anything that publishes or reaches out triggers an Amber Director Gate.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {AGENT_TABS.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabSwitch(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xs text-[11px] uppercase tracking-[1.5px] font-bold border transition ${
                  isSelected
                    ? 'border-purple bg-panel text-ink shadow-[0_0_18px_rgba(153,69,255,0.25)]'
                    : 'border-line bg-panel/60 text-dim hover:text-ink hover:border-purple/40'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isSelected ? 'text-green' : 'text-dim'}`} />
                <span>{tab.name}</span>
                <span className="text-[9px] text-purple font-mono">[{tab.tag}]</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Workspace */}
        <div className="mt-6 grid gap-6 lg:grid-cols-12 items-stretch">
          {/* Input Panel */}
          <div className="lg:col-span-6 border border-line bg-panel p-6 rounded-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[2px] font-bold text-dim flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5 text-purple" />
                  Request Feed
                </span>
                <span className="text-[10px] text-green font-mono">Status: Awaiting Input</span>
              </div>

              <p className="mt-2 text-[12px] text-dim font-mono leading-relaxed">{currentAgent.role}</p>

              {/* Text Area */}
              <div className="mt-4">
                <label className="block text-[9.5px] uppercase tracking-[1.5px] text-dim mb-1">
                  Test Prompt / Raw Text:
                </label>
                <textarea
                  rows={6}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full border border-line bg-panel2 p-3 text-[12px] font-mono text-ink outline-none focus:border-purple rounded-xs resize-none"
                />
              </div>

              {/* Presets */}
              <div className="mt-3">
                <div className="text-[9.5px] uppercase tracking-[1px] text-dim mb-1.5">Quick Presets:</div>
                <div className="flex flex-col gap-1.5">
                  {currentAgent.presets.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInput(preset)}
                      className="text-left text-[11px] font-mono text-dim hover:text-ink bg-panel2/60 border border-line-subtle px-2.5 py-1.5 rounded-xs transition hover:border-purple/50 truncate"
                    >
                      → {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Run Button */}
            <div className="mt-6 pt-4 border-t border-line flex items-center justify-between">
              <span className="text-[10px] text-dim font-mono">Latency ~600ms</span>
              <button
                id="run-agent-demo-btn"
                onClick={handleRun}
                disabled={loading || !input.trim()}
                className="rounded-xs bg-purple px-5 py-2.5 text-[11px] font-bold uppercase tracking-[1.5px] text-white hover:bg-purple-hover hover:shadow-[0_0_18px_rgba(153,69,255,0.4)] disabled:opacity-50 flex items-center gap-1.5"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Agent Thinking…</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Trigger {currentAgent.tag}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Output Panel */}
          <div className="lg:col-span-6 border border-line bg-panel2/80 p-6 rounded-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[2px] font-bold text-green flex items-center gap-1.5">
                  <Bot className="h-3.5 w-3.5" />
                  Agent Synthesized Execution
                </span>
                {output && (
                  <span className="text-[10px] font-mono text-dim">
                    Processed in {output.latencyMs}ms
                  </span>
                )}
              </div>

              {!output ? (
                <div className="my-14 text-center">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-panel border border-line text-dim">
                    <Terminal className="h-5 w-5" />
                  </div>
                  <div className="mt-3 text-[13px] font-display font-bold text-ink">
                    Agent Ready For Ingestion
                  </div>
                  <p className="mt-1 text-[11.5px] text-dim font-mono max-w-xs mx-auto">
                    Click "Trigger {currentAgent.tag}" to execute this workflow on live prompt logic.
                  </p>
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  {/* Result Box */}
                  <div className="border border-line bg-void/70 p-4 rounded-xs font-mono text-[12px] leading-relaxed text-ink whitespace-pre-wrap max-h-72 overflow-y-auto">
                    {output.reply}
                  </div>

                  {/* Director Gate Banner */}
                  <div className="border border-amber/40 bg-amber/10 p-3 rounded-xs flex items-center gap-2.5 text-[11px] text-amber font-mono">
                    <Shield className="h-4 w-4 shrink-0 text-amber" />
                    <div>
                      <span className="font-bold">Human-in-the-Loop Guarantee:</span> No package is published, no community is messaged, and no funds move without Director approval.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Call to Action */}
            <div className="mt-6 pt-4 border-t border-line flex flex-wrap items-center justify-between gap-3">
              <span className="text-[11px] text-dim font-mono">
                Ready to get your niche its own product?
              </span>
              <button
                onClick={() => onSelectPackage('Fork')}
                className="rounded-xs bg-green px-4 py-2 text-[10px] font-bold uppercase tracking-[1.5px] text-void hover:bg-green-hover hover:shadow-[0_0_15px_rgba(20,241,149,0.35)] flex items-center gap-1.5"
              >
                <span>Start a Fork ($900)</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

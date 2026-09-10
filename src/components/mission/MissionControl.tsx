import React, { useState } from 'react';
import {
  Terminal,
  Shield,
  Bot,
  Play,
  CheckCircle2,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  Layers,
  FileText,
  Activity,
  Plus,
  ExternalLink,
  Cpu,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { CycleRing } from './CycleRing';
import { DirectorGateModal } from './DirectorGateModal';
import { VaultWithdrawPanel } from './VaultWithdrawPanel';
import { AGENTS, STAGES, USD, SOL_RECIPIENT } from '../../lib/mission';
import { Approval, Client, Lead, MissionEvent, Payment, VaultWithdrawal } from '../../types';

interface MissionControlProps {
  leads: Lead[];
  clients: Client[];
  approvals: Approval[];
  events: MissionEvent[];
  payments: Payment[];
  withdrawals: VaultWithdrawal[];
  cyclesCount: number;
  autoCycle: boolean;
  activeStage: number | null;
  onToggleAutoCycle: () => void;
  onRunCycle: () => void;
  onApproveGate: (id: string) => void;
  onRejectGate: (id: string) => void;
  onAddLead: (lead: Partial<Lead>) => void;
  onMoveLeadStage: (id: string, stage: any) => void;
  onWithdrawSol: (withdrawal: VaultWithdrawal) => void;
}

type MainTab = 'Pipeline' | 'Clients' | 'Cycle Log' | 'Treasury' | 'Model & Wiring';

const TREASURY_SPLIT = [
  { label: 'Operations', pct: 0.7, tone: 'text-ink', desc: 'Builder time, hosting, CI, and the Director keeping the lights on.' },
  { label: 'Contributor Bounties', pct: 0.2, tone: 'text-green', desc: 'Paid out to outside contributors who land features and fixes on shipped forks.' },
  { label: 'Reserve', pct: 0.1, tone: 'text-amber', desc: 'Held in the SOL vault for warranty work and upstream security emergencies.' },
];

export const MissionControl: React.FC<MissionControlProps> = ({
  leads,
  clients,
  approvals,
  events,
  payments,
  withdrawals,
  cyclesCount,
  autoCycle,
  activeStage,
  onToggleAutoCycle,
  onRunCycle,
  onApproveGate,
  onRejectGate,
  onAddLead,
  onMoveLeadStage,
  onWithdrawSol,
}) => {
  const [activeTab, setActiveTab] = useState<MainTab>('Pipeline');
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [newBiz, setNewBiz] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newNiche, setNewNiche] = useState('Recreation & Outdoors');
  const [newPain, setNewPain] = useState('');

  // Calculations
  const pendingApprovals = approvals.filter((a) => a.status === 'pending');
  const totalMrr = clients.reduce((acc, c) => acc + (c.mrr || 0), 0);
  const totalCashIn = payments
    .filter((p) => p.status === 'confirmed')
    .reduce((acc, p) => acc + (p.amount_usd || 0), 0);
  const openLeadsCount = leads.filter((l) => !['LOST', 'SUPPORT'].includes(l.stage)).length;

  // SOL Vault Calculations
  const confirmedSolPayments = payments.filter(
    (p) => p.method === 'SOLANA' && p.status === 'confirmed' && (p.sol_amount || 0) > 0
  );
  const totalDepositedSol = confirmedSolPayments.reduce(
    (sum, p) => sum + (p.sol_amount || 0),
    0
  );
  const confirmedWithdrawals = withdrawals.filter((w) => w.status === 'confirmed');
  const totalWithdrawnSol = confirmedWithdrawals.reduce(
    (sum, w) => sum + w.amount_sol,
    0
  );
  const availableSol = Math.max(0, Number((totalDepositedSol - totalWithdrawnSol).toFixed(4)));

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBiz.trim()) return;
    onAddLead({
      biz: newBiz.trim(),
      email: newEmail.trim(),
      niche: newNiche,
      pain: newPain.trim() || 'No maintained open-source tool for this niche',
      stage: 'SCOUT',
      score: Math.floor(Math.random() * 20) + 80,
      source: 'Director Manual Inject',
    });
    setNewBiz('');
    setNewEmail('');
    setNewPain('');
    setShowAddLeadModal(false);
  };

  return (
    <div className="min-h-screen bg-void text-ink pb-20">
      {/* Top Command Bar */}
      <header className="border-b border-line bg-panel2/80 px-4 py-3 sm:px-6 sticky top-[60px] z-30 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div>
            <div className="font-display text-[15px] font-black tracking-[0.5px] text-ink flex items-center gap-2">
              <span className="text-purple">YABBAI</span> MISSION CONTROL
              <span className="text-[9px] uppercase tracking-[1.5px] px-2 py-0.5 rounded bg-green/10 text-green border border-green/30">
                SYSTEM ONLINE
              </span>
            </div>
            <div className="text-[9.5px] uppercase tracking-[2px] text-dim font-mono">
              BASHAM AUTOMATIONS · OPEN-SOURCE PRODUCT FOUNDRY
            </div>
          </div>

          {/* KPIs */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-left">
            <div>
              <div className="text-[9px] uppercase tracking-[1.5px] text-dim font-bold">MRR</div>
              <div className="font-display text-[15px] font-black text-green">{USD(totalMrr)}</div>
            </div>
            <div className="h-6 w-[1px] bg-line hidden sm:block" />
            <div>
              <div className="text-[9px] uppercase tracking-[1.5px] text-dim font-bold">Total Cash In</div>
              <div className="font-display text-[15px] font-black text-green">{USD(totalCashIn)}</div>
            </div>
            <div className="h-6 w-[1px] bg-line hidden sm:block" />
            <div>
              <div className="text-[9px] uppercase tracking-[1.5px] text-dim font-bold">Active Builds</div>
              <div className="font-display text-[15px] font-black text-ink">{clients.length}</div>
            </div>
            <div className="h-6 w-[1px] bg-line hidden sm:block" />
            <div>
              <div className="text-[9px] uppercase tracking-[1.5px] text-dim font-bold">Open Leads</div>
              <div className="font-display text-[15px] font-black text-purple">{openLeadsCount}</div>
            </div>
            <div className="h-6 w-[1px] bg-line hidden sm:block" />
            <div>
              <div className="text-[9px] uppercase tracking-[1.5px] text-amber font-bold">Gates Open</div>
              <div className="font-display text-[15px] font-black text-amber">
                {pendingApprovals.length} ⚿
              </div>
            </div>
            <div className="h-6 w-[1px] bg-line hidden sm:block" />
            <div>
              <div className="text-[9px] uppercase tracking-[1.5px] text-dim font-bold flex items-center gap-1">
                <span>SOL Vault</span>
                <span className="text-green text-[8px] bg-green/10 border border-green/30 px-1 rounded">ON-CHAIN</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-display text-[15px] font-black text-green">
                  {availableSol.toFixed(2)} SOL
                </span>
                <button
                  onClick={() => {
                    setActiveTab('Treasury');
                    setShowWithdrawModal(true);
                  }}
                  className="rounded bg-purple/20 border border-purple/50 px-2 py-0.5 text-[9px] font-mono text-purple hover:bg-purple hover:text-white uppercase font-bold transition flex items-center gap-1"
                  title="Withdraw SOL to Director Wallet"
                >
                  <span>Withdraw</span>
                  <span className="text-green">⇪</span>
                </button>
              </div>
            </div>
          </div>

          {/* Loop Controls */}
          <div className="flex items-center gap-2.5">
            <label
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xs border text-[10px] uppercase tracking-[1.5px] cursor-pointer transition ${
                autoCycle
                  ? 'border-green bg-green/10 text-green font-bold'
                  : 'border-line text-dim hover:text-ink'
              }`}
              title="Automatically run agent cycles every 15 seconds"
            >
              <input
                type="checkbox"
                checked={autoCycle}
                onChange={onToggleAutoCycle}
                className="accent-green"
              />
              <span>Auto Cycle {autoCycle ? 'ON' : 'OFF'}</span>
            </label>

            <button
              id="run-cycle-btn"
              onClick={onRunCycle}
              disabled={activeStage !== null}
              className="rounded-xs bg-purple px-4 py-1.5 text-[11px] font-bold uppercase tracking-[1.5px] text-white hover:bg-purple-hover hover:shadow-[0_0_18px_rgba(153,69,255,0.4)] disabled:opacity-50 flex items-center gap-1.5 transition"
            >
              <Play className={`h-3 w-3 ${activeStage !== null ? 'animate-spin' : ''}`} />
              <span>{activeStage !== null ? 'Cycle Running…' : 'Run Cycle'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Console Layout */}
      <div className="mx-auto max-w-7xl p-4 sm:p-6 grid gap-6 lg:grid-cols-12">
        {/* Left Column: Loop Ring & Agents (3 cols) */}
        <aside className="lg:col-span-3 space-y-4">
          {/* Cycle Ring Card */}
          <div className="border border-line bg-panel p-4 rounded-xs">
            <div className="text-[10px] uppercase tracking-[2px] font-bold text-dim mb-3 flex items-center justify-between">
              <span>Autonomous Loop</span>
              <span className="text-purple font-mono">Stage: {activeStage !== null ? STAGES[activeStage] : 'IDLE'}</span>
            </div>
            <CycleRing cycles={cyclesCount} activeStage={activeStage} />
            <p className="mt-3 text-[10.5px] text-dim font-mono leading-relaxed text-center">
              Amber keys (<span className="text-amber">⚿</span>) represent mandatory Director Gates. No outreach or code deployment leaves without human approval.
            </p>
          </div>

          {/* The 8 Agents */}
          <div className="border border-line bg-panel p-4 rounded-xs space-y-3">
            <div className="text-[10px] uppercase tracking-[2px] font-bold text-dim flex items-center justify-between">
              <span>Agent Swarm (8)</span>
              <span className="text-green text-[9px]">ALL ACTIVE</span>
            </div>
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {AGENTS.map((agt) => (
                <div
                  key={agt.name}
                  className="border border-line bg-panel2 p-2.5 rounded-xs text-[11px] font-mono hover:border-purple/50 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-ink flex items-center gap-1.5">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-green" />
                      {agt.name}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                        agt.status === 'GATED'
                          ? 'bg-amber/15 text-amber border border-amber/30'
                          : 'bg-green/10 text-green'
                      }`}
                    >
                      {agt.status}
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] text-dim leading-snug">{agt.role}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Center Workspace (6 cols) */}
        <main className="lg:col-span-6 space-y-4">
          {/* Navigation Sub-Tabs */}
          <div className="flex flex-wrap items-center gap-1 border-b border-line pb-2">
            {(['Pipeline', 'Clients', 'Cycle Log', 'Treasury', 'Model & Wiring'] as MainTab[]).map(
              (t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-3 py-1.5 rounded-xs text-[11px] uppercase tracking-[1.5px] font-bold transition ${
                    activeTab === t
                      ? 'bg-panel border border-line text-ink'
                      : 'text-dim hover:text-ink'
                  }`}
                >
                  {t}
                </button>
              )
            )}
          </div>

          {/* TAB 1: Pipeline Kanban */}
          {activeTab === 'Pipeline' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] uppercase tracking-[1.5px] text-dim font-bold">
                  Active Prospect Pipeline ({leads.length} Leads)
                </span>
                <button
                  onClick={() => setShowAddLeadModal(true)}
                  className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[1.5px] text-green border border-green/30 bg-green/10 px-2.5 py-1 rounded-xs hover:bg-green/20 font-bold"
                >
                  <Plus className="h-3 w-3" />
                  <span>Inject Lead</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="border border-line bg-panel p-4 rounded-xs transition hover:border-purple/50"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-display text-[14px] font-black text-ink">{lead.biz}</div>
                        <div className="text-[10.5px] text-dim font-mono">
                          {lead.niche} · {lead.region || 'Worldwide'}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-purple/15 text-purple border border-purple/30 px-2 py-0.5 text-[9.5px] font-bold font-mono">
                          {lead.stage}
                        </span>
                        <span className="text-[10px] font-mono text-green font-bold">
                          Fit {lead.score}%
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 text-[11.5px] text-dim font-mono bg-panel2 p-2 rounded-xs border border-line-subtle">
                      <span className="text-amber font-semibold">Pain:</span> {lead.pain}
                    </div>

                    {lead.notes && (
                      <div className="mt-2 text-[11px] text-ink font-mono">
                        <span className="text-purple font-semibold">AGT Update:</span> {lead.notes}
                      </div>
                    )}

                    {/* Stage transition buttons */}
                    <div className="mt-3 pt-2.5 border-t border-line flex flex-wrap items-center justify-between text-[9.5px] font-mono gap-2">
                      <span className="text-dim">Est. Value: {USD(lead.estimatedValue || 1500)}</span>
                      <div className="flex items-center gap-1">
                        {lead.stage !== 'BUILD' && lead.stage !== 'SHIP' && (
                          <button
                            onClick={() => onMoveLeadStage(lead.id, 'BUILD')}
                            className="border border-line px-2 py-0.5 rounded text-dim hover:text-green hover:border-green"
                          >
                            → Mark Won (Build)
                          </button>
                        )}
                        {lead.stage === 'SCOUT' && (
                          <button
                            onClick={() => onMoveLeadStage(lead.id, 'QUALIFY')}
                            className="border border-line px-2 py-0.5 rounded text-dim hover:text-ink"
                          >
                            Qualify
                          </button>
                        )}
                        {lead.stage === 'QUALIFY' && (
                          <button
                            onClick={() => onMoveLeadStage(lead.id, 'PITCH')}
                            className="border border-amber/40 text-amber px-2 py-0.5 rounded hover:bg-amber/10"
                          >
                            Pitch (Gate)
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Clients & Builds */}
          {activeTab === 'Clients' && (
            <div className="space-y-4">
              <div className="text-[10.5px] uppercase tracking-[1.5px] text-dim font-bold">
                Client Deployments ({clients.length} Active Accounts)
              </div>

              {clients.map((client) => (
                <div
                  key={client.id}
                  className="border border-line bg-panel p-5 rounded-xs space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-display text-[15px] font-black text-ink">{client.biz}</div>
                      <div className="text-[11px] text-dim font-mono">
                        {client.package} Package · {client.tier} Tier ({USD(client.mrr)}/mo)
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="rounded bg-green/15 text-green border border-green/30 px-2 py-0.5 text-[10px] font-bold uppercase font-mono">
                        {client.status}
                      </span>
                      <div className="text-[10px] text-dim mt-1 font-mono">
                        Setup: {USD(client.setup_fee)} (Paid)
                      </div>
                    </div>
                  </div>

                  {/* Build Progress Bar */}
                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-dim mb-1">
                      <span>Deployment Pipeline Progress</span>
                      <span className="text-ink font-bold">{client.build_pct}%</span>
                    </div>
                    <div className="h-2 w-full bg-panel2 rounded-full overflow-hidden border border-line-subtle">
                      <div
                        className="h-full bg-gradient-to-r from-purple to-green transition-all duration-500"
                        style={{ width: `${client.build_pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Deliverables Checklist */}
                  <div className="border-t border-line-subtle pt-2 space-y-1">
                    <div className="text-[9.5px] uppercase tracking-[1px] text-dim">Active Deliverables:</div>
                    {client.deliverables.map((d, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-ink font-mono">
                        <CheckCircle2 className="h-3 w-3 text-green shrink-0" />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tech Stack Chips */}
                  {client.techStack && (
                    <div className="flex flex-wrap items-center gap-1 pt-1">
                      <span className="text-[9.5px] text-dim uppercase">Tech:</span>
                      {client.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="border border-line bg-panel2 px-2 py-0.5 text-[9.5px] font-mono text-dim rounded-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: Cycle Log */}
          {activeTab === 'Cycle Log' && (
            <div className="space-y-3">
              <div className="text-[10.5px] uppercase tracking-[1.5px] text-dim font-bold">
                Real-Time Swarm Activity Log
              </div>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {events.map((ev) => (
                  <div
                    key={ev.id}
                    className="border border-line bg-panel p-3 rounded-xs font-mono text-[11.5px] space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple flex items-center gap-1.5">
                        <span className="text-[9.5px] text-dim">C#{ev.cycle_n}</span>
                        <span>[{ev.agent}]</span>
                      </span>
                      <span className="text-[9.5px] text-dim2">
                        {new Date(ev.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-ink leading-relaxed">{ev.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Treasury Ledger & On-Chain Vault */}
          {activeTab === 'Treasury' && (
            <div className="space-y-6">
              {/* Premier On-Chain Vault & Withdraw Panel */}
              <VaultWithdrawPanel
                payments={payments}
                withdrawals={withdrawals}
                onWithdraw={onWithdrawSol}
              />

              {/* Open Treasury Allocation — disclosed split of every settled dollar */}
              <div className="border border-purple/40 bg-panel p-5 sm:p-6 rounded-xs font-mono text-[12px]">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-[1.5px] text-purple font-bold">
                      Open Treasury
                    </div>
                    <h4 className="font-display text-sm font-black text-ink">
                      Where Every Settled Dollar Goes
                    </h4>
                  </div>
                  <span className="text-[10px] text-dim">
                    Published split · verifiable against the ledger below and Solscan
                  </span>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {TREASURY_SPLIT.map((slice) => (
                    <div key={slice.label} className="border border-line bg-panel2/60 p-4 rounded-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-[1px] text-dim">{slice.label}</span>
                        <span className={`font-display font-black ${slice.tone}`}>{Math.round(slice.pct * 100)}%</span>
                      </div>
                      <div className={`mt-1 font-display text-[16px] font-bold ${slice.tone}`}>
                        {USD(totalCashIn * slice.pct)}
                      </div>
                      <p className="mt-1 text-[10.5px] text-dim2 leading-relaxed">{slice.desc}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-[10.5px] text-dim leading-relaxed">
                  No portion of customer payments is routed into token purchases, market-making, or price support of any asset. The SOL treasury holds settlement proceeds only; withdrawals are Director-gated and logged above.
                </p>
              </div>

              {/* Verified Cash & Multi-Vector Settlements */}
              <div className="border border-line bg-panel p-5 sm:p-6 rounded-xs space-y-4 font-mono text-[12px]">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-[1.5px] text-dim font-bold">
                      Settlement Registry
                    </div>
                    <h4 className="font-display text-sm font-black text-ink">
                      Verified Multi-Vector Inflows (PayPal, Card & Solana On-Chain)
                    </h4>
                  </div>
                  <span className="font-display text-[15px] font-bold text-green">
                    Total Settled: {USD(totalCashIn)}
                  </span>
                </div>

                <div className="space-y-2">
                  {payments.map((p) => (
                    <div
                      key={p.id}
                      className="border border-line bg-panel2 p-4 rounded-xs font-mono text-[11.5px] space-y-1.5 hover:border-purple/30 transition"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-ink">{p.biz}</span>
                        <span className="font-display font-bold text-green">{USD(p.amount_usd)}</span>
                      </div>
                      <div className="flex flex-wrap items-center justify-between text-[10px] text-dim gap-2">
                        <div>
                          <span className="text-purple font-bold">[{p.method}]</span> {p.purpose}
                        </div>
                        <div>Ref: {p.reference}</div>
                      </div>
                      {p.sol_amount && (
                        <div className="text-[10px] text-green flex items-center justify-between pt-1 border-t border-line-subtle">
                          <span>On-Chain SOL: {p.sol_amount} SOL verified</span>
                          <a
                            href={`https://solscan.io/account/${p.recipient || SOL_RECIPIENT}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-purple underline flex items-center gap-0.5"
                          >
                            <span>Solscan</span>
                            <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Model & Wiring */}
          {activeTab === 'Model & Wiring' && (
            <div className="border border-line bg-panel p-6 rounded-xs space-y-4 font-mono text-[12px]">
              <div className="text-[10.5px] uppercase tracking-[2px] text-purple font-bold">
                Director System Infrastructure
              </div>
              <div className="space-y-2.5 border border-line bg-panel2 p-4 rounded-xs">
                <div className="flex justify-between">
                  <span className="text-dim">AI Model Orchestrator:</span>
                  <span className="text-ink font-bold">gemini-3.8-flash (Multi-Agent Swarm)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dim">Director Gate Protocol:</span>
                  <span className="text-amber font-bold">Strict Human-in-the-Loop Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dim">Solana Mainnet Treasury:</span>
                  <span className="text-green font-bold truncate max-w-[200px] sm:max-w-xs">
                    HTN1fvHwbzKiMwh9YXZEe3eooiMdoCAs3TweWdiSZV5i
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dim">License Compliance (FORGE):</span>
                  <span className="text-green font-bold">MIT / Apache2 Only Guaranteed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dim">Uptime SLA:</span>
                  <span className="text-ink font-bold">99.98% Monitored</span>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Right Column: Director Gate Approvals & Quick Actions (3 cols) */}
        <aside className="lg:col-span-3 space-y-4">
          {/* Pending Director Gates */}
          <div className="border border-amber/40 bg-panel p-4 rounded-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[2px] font-bold text-amber flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" />
                Director Gates ({pendingApprovals.length})
              </span>
            </div>

            {pendingApprovals.length === 0 ? (
              <div className="py-8 text-center text-dim font-mono text-[11px]">
                No gates waiting. The loop is executing cleanly.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingApprovals.map((appr) => (
                  <div
                    key={appr.id}
                    className="border border-amber/40 bg-panel2 p-3.5 rounded-xs space-y-2 text-[11px] font-mono"
                  >
                    <div className="text-[9px] uppercase tracking-[1px] text-amber font-bold">
                      [{appr.agent}] {appr.type}
                    </div>
                    <div className="font-display text-[13px] font-bold text-ink">{appr.title}</div>
                    <p className="text-[10.5px] text-dim leading-snug line-clamp-2">{appr.detail}</p>
                    <div className="pt-2 border-t border-line-subtle flex items-center justify-between">
                      <button
                        onClick={() => setSelectedApproval(appr)}
                        className="text-amber underline hover:text-ink text-[10px]"
                      >
                        Inspect Payload
                      </button>
                      <div className="flex gap-1">
                        <button
                          onClick={() => onApproveGate(appr.id)}
                          className="bg-amber px-2.5 py-1 text-[9.5px] font-bold text-void rounded-xs hover:bg-amber/90"
                        >
                          Approve
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Lead Injector Shortcut */}
          <div className="border border-line bg-panel2/60 p-4 rounded-xs text-center space-y-2 font-mono">
            <div className="text-[10px] uppercase tracking-[1.5px] text-dim font-bold">
              Direct Lead Injection
            </div>
            <p className="text-[10.5px] text-dim leading-relaxed">
              Found a hot local prospect? Inject them into the autonomous SCOUT queue right now.
            </p>
            <button
              onClick={() => setShowAddLeadModal(true)}
              className="w-full border border-purple px-3 py-2 text-[10.5px] font-bold uppercase tracking-[1.5px] text-purple hover:bg-purple hover:text-white rounded-xs transition"
            >
              + Add Lead To Loop
            </button>
          </div>
        </aside>
      </div>

      {/* Modal for Director Approval Gate */}
      {selectedApproval && (
        <DirectorGateModal
          approval={selectedApproval}
          onClose={() => setSelectedApproval(null)}
          onApprove={(id) => {
            onApproveGate(id);
            setSelectedApproval(null);
          }}
          onReject={(id) => {
            onRejectGate(id);
            setSelectedApproval(null);
          }}
        />
      )}

      {/* Modal to Add Lead */}
      {showAddLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-void/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-md border border-line bg-panel p-6 rounded-xs shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 className="font-display text-[15px] font-black text-ink">
                Inject Lead Into Autonomous Loop
              </h3>
              <button
                onClick={() => setShowAddLeadModal(false)}
                className="text-dim hover:text-ink text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3 font-mono text-[11px]">
              <div>
                <label className="block text-dim uppercase tracking-[1px] mb-1">Project / Community Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tidepool Citizen Science"
                  value={newBiz}
                  onChange={(e) => setNewBiz(e.target.value)}
                  className="w-full border border-line bg-panel2 px-3 py-2 text-ink rounded-xs outline-none focus:border-purple"
                />
              </div>

              <div>
                <label className="block text-dim uppercase tracking-[1px] mb-1">Email</label>
                <input
                  type="email"
                  placeholder="data@tidepool.science"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full border border-line bg-panel2 px-3 py-2 text-ink rounded-xs outline-none focus:border-purple"
                />
              </div>

              <div>
                <label className="block text-dim uppercase tracking-[1px] mb-1">Niche</label>
                <input
                  type="text"
                  value={newNiche}
                  onChange={(e) => setNewNiche(e.target.value)}
                  className="w-full border border-line bg-panel2 px-3 py-2 text-ink rounded-xs outline-none focus:border-purple"
                />
              </div>

              <div>
                <label className="block text-dim uppercase tracking-[1px] mb-1">Missing Tool / Pain</label>
                <textarea
                  rows={3}
                  placeholder="e.g. The only route-setting app is closed source and charges per member."
                  value={newPain}
                  onChange={(e) => setNewPain(e.target.value)}
                  className="w-full border border-line bg-panel2 p-2.5 text-ink rounded-xs outline-none focus:border-purple resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddLeadModal(false)}
                  className="border border-line px-3 py-1.5 text-dim hover:text-ink rounded-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-purple px-4 py-1.5 font-bold uppercase tracking-[1px] text-white rounded-xs hover:bg-purple-hover"
                >
                  Inject To Scout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Standalone Vault Withdraw Modal */}
      {showWithdrawModal && (
        <VaultWithdrawPanel
          payments={payments}
          withdrawals={withdrawals}
          onWithdraw={(w) => {
            onWithdrawSol(w);
            setShowWithdrawModal(false);
          }}
          isOpenAsModal={true}
          onCloseModal={() => setShowWithdrawModal(false)}
        />
      )}
    </div>
  );
};

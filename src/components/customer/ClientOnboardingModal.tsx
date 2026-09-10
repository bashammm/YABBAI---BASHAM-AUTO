import React, { useState } from 'react';
import { X, CheckCircle2, Shield, ArrowRight, Cpu, Layers } from 'lucide-react';
import { Client } from '../../types';

interface ClientOnboardingModalProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (clientId: string, updates: Partial<Client>) => void;
}

const COMMON_STACKS = [
  'Xero',
  'QuickBooks',
  'GitHub',
  'GitLab',
  'npm / PyPI / crates.io',
  'Vercel / Netlify',
  'Docker / Fly.io',
  'Postgres / Supabase',
  'Stripe',
  'PayPal',
  'Discord',
  'Slack',
  'Steam / Twitch APIs',
  'Home Assistant / MQTT',
  'Cal.com',
  'Solana / EVM RPC',
];

export const ClientOnboardingModal: React.FC<ClientOnboardingModalProps> = ({
  client,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen || !client) return null;

  const [contact, setContact] = useState(client.primaryContact || '');
  const [selectedTools, setSelectedTools] = useState<string[]>(client.techStack || []);
  const [customTool, setCustomTool] = useState('');
  const [primaryObjective, setPrimaryObjective] = useState('');
  const [saved, setSaved] = useState(false);

  const toggleTool = (tool: string) => {
    setSelectedTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    );
  };

  const handleAddCustomTool = () => {
    if (customTool.trim() && !selectedTools.includes(customTool.trim())) {
      setSelectedTools([...selectedTools, customTool.trim()]);
      setCustomTool('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(client.id, {
      primaryContact: contact,
      techStack: selectedTools,
      deliverables: [
        `Tech stack registered: ${selectedTools.join(', ')}`,
        'Upstream repo selection underway',
        'Staging agent endpoints created',
      ],
      build_pct: 25,
      status: 'BUILDING',
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-void/85 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl border border-line bg-panel p-6 sm:p-8 rounded-xs shadow-2xl space-y-5">
        <div className="flex items-start justify-between border-b border-line pb-4">
          <div>
            <div className="text-[10px] uppercase tracking-[2px] font-bold text-green">
              Client Kickoff Portal
            </div>
            <h3 className="font-display text-xl font-black text-ink">
              System Ingestion: {client.biz}
            </h3>
            <div className="text-[11px] text-dim font-mono mt-0.5">
              Package: {client.package} · Status: {client.status}
            </div>
          </div>
          <button onClick={onClose} className="text-dim hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>

        {saved ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="h-10 w-10 text-green mx-auto" />
            <div className="font-display text-lg font-bold text-ink">
              Onboarding Ingested Successfully
            </div>
            <p className="text-[12px] text-dim font-mono max-w-sm mx-auto">
              Your target platforms were routed to AGT-BUILDER and the Director. Your private channel invite is on its way.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-[12px] font-mono">
            <div>
              <label className="block text-[10px] uppercase tracking-[1px] text-dim mb-1 font-bold">
                Primary Contact Name & Mobile
              </label>
              <input
                type="text"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Marcus Vance · +61 412 889 201"
                className="w-full border border-line bg-panel2 px-3 py-2 text-ink rounded-xs outline-none focus:border-purple"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[1px] text-dim mb-1 font-bold">
                Select Your Existing Software Stack:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-48 overflow-y-auto p-1 border border-line bg-panel2 rounded-xs">
                {COMMON_STACKS.map((tool) => {
                  const checked = selectedTools.includes(tool);
                  return (
                    <button
                      type="button"
                      key={tool}
                      onClick={() => toggleTool(tool)}
                      className={`text-left p-2 text-[11px] rounded-xs border transition ${
                        checked
                          ? 'border-purple bg-purple/20 text-ink font-bold'
                          : 'border-line-subtle bg-panel text-dim hover:text-ink'
                      }`}
                    >
                      {checked ? '✓ ' : '+ '}
                      {tool}
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Tool */}
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  placeholder="Add proprietary CRM / tool..."
                  value={customTool}
                  onChange={(e) => setCustomTool(e.target.value)}
                  className="flex-1 border border-line bg-panel2 px-2.5 py-1.5 text-[11px] text-ink rounded-xs outline-none focus:border-purple"
                />
                <button
                  type="button"
                  onClick={handleAddCustomTool}
                  className="border border-line px-3 py-1.5 text-[10px] uppercase tracking-[1px] text-dim hover:text-ink hover:border-purple rounded-xs"
                >
                  Add
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[1px] text-dim mb-1 font-bold">
                Highest Priority Goal For This Build:
              </label>
              <textarea
                rows={3}
                value={primaryObjective}
                onChange={(e) => setPrimaryObjective(e.target.value)}
                placeholder="e.g. Automatically capture emergency calls, create SimPRO job, and send instant quote SMS."
                className="w-full border border-line bg-panel2 p-2.5 text-ink rounded-xs outline-none focus:border-purple resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="border border-line px-4 py-2 text-[11px] text-dim hover:text-ink rounded-xs uppercase tracking-[1px]"
              >
                Skip For Now
              </button>
              <button
                type="submit"
                className="bg-green px-5 py-2 text-[11px] font-bold uppercase tracking-[1.5px] text-void rounded-xs hover:bg-green-hover flex items-center gap-1.5 shadow-[0_0_15px_rgba(20,241,149,0.35)]"
              >
                <span>Lock In Scope & Start</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

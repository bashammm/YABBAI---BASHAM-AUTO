import React, { useState, useMemo } from 'react';
import { Sparkles, Sliders, DollarSign, Clock, ShieldAlert, Check, ArrowRight, Bot, Download, Layers } from 'lucide-react';
import { calculateAuditMetrics, INDUSTRY_DEFAULTS } from '../../lib/gemini';
import { USD, PACKAGES } from '../../lib/mission';

interface AuditCalculatorProps {
  onSelectPackage: (pkgName: string, prefillNotes?: string) => void;
  onEnquireWithAudit: (auditSummary: string) => void;
}

export const AuditCalculator: React.FC<AuditCalculatorProps> = ({
  onSelectPackage,
  onEnquireWithAudit,
}) => {
  const industries = Object.keys(INDUSTRY_DEFAULTS);
  const [industry, setIndustry] = useState(industries[0]);
  const currentDefaults = INDUSTRY_DEFAULTS[industry];

  const [monthlyLeads, setMonthlyLeads] = useState(currentDefaults.typicalLeads);
  const [avgDeal, setAvgDeal] = useState(currentDefaults.avgDeal);
  const [hoursAdmin, setHoursAdmin] = useState(currentDefaults.hoursAdmin);
  const [bizName, setBizName] = useState('');
  const [generating, setGenerating] = useState(false);
  const [blueprintGenerated, setBlueprintGenerated] = useState(false);

  // Auto update sliders when industry flips if untouched
  const handleIndustryChange = (newInd: string) => {
    setIndustry(newInd);
    const d = INDUSTRY_DEFAULTS[newInd];
    if (d) {
      setMonthlyLeads(d.typicalLeads);
      setAvgDeal(d.avgDeal);
      setHoursAdmin(d.hoursAdmin);
    }
  };

  const audit = useMemo(() => {
    return calculateAuditMetrics(industry, monthlyLeads, avgDeal, hoursAdmin);
  }, [industry, monthlyLeads, avgDeal, hoursAdmin]);

  const handleGenerateBlueprint = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setBlueprintGenerated(true);
    }, 600);
  };

  const packageObj = PACKAGES.find((p) => p.name === audit.recommendedPackage) || PACKAGES[0];

  const handleClaim = () => {
    const summary = `Scan for ${bizName || 'Project'}: Niche: ${industry}, Annual Value: ${USD(
      audit.totalAnnualLeak
    )}, System: ${audit.blueprint.systemName}. Recommends ${audit.recommendedPackage} (${USD(packageObj.fee)}).`;
    onSelectPackage(audit.recommendedPackage, summary);
  };

  return (
    <section id="audit-section" className="border-t border-line bg-panel py-16 scroll-mt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-xs border border-green/40 bg-green/10 px-3 py-1 text-[10px] uppercase tracking-[2.5px] text-green font-bold">
            <Sparkles className="h-3 w-3" />
            <span>Interactive Niche Diagnostic</span>
          </div>
          <h2 className="mt-4 font-display text-2xl sm:text-4xl font-black text-ink">
            The 60-Second Opportunity Scan
          </h2>
          <p className="mt-3 text-[13px] text-dim font-mono leading-relaxed">
            Pick a niche and set the dials to match it. See what a maintained open-source product could earn and how many build hours a fork saves versus starting from nothing.
          </p>
        </div>

        {/* Diagnostic Canvas */}
        <div className="mt-12 grid gap-6 lg:grid-cols-12 items-start">
          {/* Left Column: Input Sliders & Industry Selection */}
          <div className="lg:col-span-6 border border-line bg-panel2/60 p-6 rounded-xs space-y-6">
            <div>
              <label className="block text-[10px] uppercase tracking-[2px] font-bold text-dim mb-2">
                Select Your Niche
              </label>
              <div className="grid grid-cols-2 gap-2">
                {industries.map((ind) => (
                  <button
                    key={ind}
                    onClick={() => handleIndustryChange(ind)}
                    className={`px-3 py-2.5 text-left text-[11px] font-medium rounded-xs border transition ${
                      industry === ind
                        ? 'border-purple bg-purple/15 text-ink font-bold shadow-[0_0_12px_rgba(153,69,255,0.2)]'
                        : 'border-line bg-panel text-dim hover:text-ink hover:border-purple/40'
                    }`}
                  >
                    {ind}
                  </button>
                ))}
              </div>
            </div>

            {/* Business Name (Optional) */}
            <div>
              <label className="block text-[10px] uppercase tracking-[2px] font-bold text-dim mb-1">
                Your Project / Community Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Trailhead Collective or Pixel Foundry"
                value={bizName}
                onChange={(e) => setBizName(e.target.value)}
                className="w-full border border-line bg-panel px-3 py-2 text-[12px] text-ink outline-none focus:border-purple rounded-xs"
              />
            </div>

            {/* Slider 1: Monthly Leads */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-dim uppercase tracking-[1px] font-semibold">
                  Reachable Users in the Niche (Monthly):
                </span>
                <span className="font-display font-bold text-purple text-[14px]">
                  {monthlyLeads} users/mo
                </span>
              </div>
              <input
                type="range"
                min={50}
                max={5000}
                step={50}
                value={monthlyLeads}
                onChange={(e) => setMonthlyLeads(Number(e.target.value))}
                className="w-full accent-purple h-1.5 bg-panel cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-dim2">
                <span>50 users</span>
                <span>2,500 users</span>
                <span>5,000+ users</span>
              </div>
            </div>

            {/* Slider 2: Average Deal Size */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-dim uppercase tracking-[1px] font-semibold">
                  Paid Tier / Seat / Support Price (USD):
                </span>
                <span className="font-display font-bold text-green text-[14px]">
                  {USD(avgDeal)}
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={500}
                step={5}
                value={avgDeal}
                onChange={(e) => setAvgDeal(Number(e.target.value))}
                className="w-full accent-green h-1.5 bg-panel cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-dim2">
                <span>$5</span>
                <span>$250</span>
                <span>$500+</span>
              </div>
            </div>

            {/* Slider 3: Hours on repetitive admin */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-dim uppercase tracking-[1px] font-semibold">
                  Hours Hand-Building or Hacking Tools (Weekly):
                </span>
                <span className="font-display font-bold text-amber text-[14px]">
                  {hoursAdmin} hrs / week
                </span>
              </div>
              <input
                type="range"
                min={4}
                max={40}
                step={1}
                value={hoursAdmin}
                onChange={(e) => setHoursAdmin(Number(e.target.value))}
                className="w-full accent-amber h-1.5 bg-panel cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-dim2">
                <span>4 hrs (Side project)</span>
                <span>20 hrs (Heavy)</span>
                <span>40 hrs (Full-time)</span>
              </div>
            </div>

            {/* Industry Typical Bottleneck Note */}
            <div className="border-t border-line-subtle pt-4 text-[11px] text-dim font-mono">
              <span className="text-amber font-bold">What's Missing Here:</span> {currentDefaults.bottleneck}
            </div>
          </div>

          {/* Right Column: Financial Leak Breakdown & Blueprint */}
          <div className="lg:col-span-6 space-y-4">
            {/* The Leak Card */}
            <div className="border border-red/40 bg-gradient-to-br from-red/10 via-panel to-panel p-6 rounded-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[2px] font-bold text-red flex items-center gap-1.5">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  Estimated Annual Value on the Table
                </span>
                <span className="text-[10px] font-mono text-dim">Calculated in USD</span>
              </div>

              <div className="mt-3 font-display text-4xl sm:text-5xl font-black text-red">
                {USD(audit.totalAnnualLeak)}
                <span className="text-dim text-[16px] font-normal tracking-normal"> / year</span>
              </div>

              {/* Sub-breakdowns */}
              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-line-subtle pt-4 text-left">
                <div>
                  <div className="text-[10px] uppercase tracking-[1px] text-dim">Paid Layer Revenue</div>
                  <div className="font-display text-[16px] font-bold text-ink">{USD(audit.annualLostRevenue)}</div>
                  <div className="text-[10px] text-dim2">~4% take the paid tier</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[1px] text-dim">Build Hours You'd Sink</div>
                  <div className="font-display text-[16px] font-bold text-ink">{USD(audit.annualTimeCost)}</div>
                  <div className="text-[10px] text-dim2">{audit.hoursReclaimedPerYear} hrs saved by forking</div>
                </div>
              </div>
            </div>

            {/* Blueprint Reveal or Generate Button */}
            {!blueprintGenerated ? (
              <div className="border border-line bg-panel2 p-6 rounded-xs text-center">
                <div className="text-[11px] uppercase tracking-[2px] text-purple font-bold">
                  Product Path Ready
                </div>
                <h3 className="mt-1 font-display text-lg font-bold text-ink">
                  Generate Your Fork / Merge / Forge Plan
                </h3>
                <p className="mt-2 text-[12px] text-dim font-mono max-w-md mx-auto">
                  Click below to draft the 3-phase build plan, pick the right path, and calculate package ROI.
                </p>
                <button
                  id="generate-blueprint-btn"
                  onClick={handleGenerateBlueprint}
                  disabled={generating}
                  className="mt-4 inline-flex items-center gap-2 rounded-xs bg-purple px-6 py-3 text-[11px] font-bold uppercase tracking-[2px] text-white hover:bg-purple-hover hover:shadow-[0_0_20px_rgba(153,69,255,0.4)] disabled:opacity-50"
                >
                  <Bot className="h-4 w-4" />
                  <span>{generating ? 'Scanning Upstream Repos…' : 'Draft My Product Plan'}</span>
                </button>
              </div>
            ) : (
              <div className="border border-green/50 bg-panel2 p-6 rounded-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] uppercase tracking-[2px] font-bold text-green flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5" />
                    Product Plan Generated
                  </div>
                  <div className="text-[11px] font-bold text-green bg-green/10 border border-green/30 px-2 py-0.5 rounded">
                    {audit.roiMultiplier}x Projected ROI
                  </div>
                </div>

                <div>
                  <h4 className="font-display text-[16px] font-black text-ink">
                    {audit.blueprint.systemName}
                  </h4>
                  <p className="mt-1 text-[12px] text-dim font-mono">{audit.blueprint.description}</p>
                </div>

                {/* 3 Phases */}
                <div className="space-y-2 border-t border-line-subtle pt-3 text-[11.5px] font-mono">
                  <div className="flex items-start gap-2 text-ink">
                    <span className="text-purple font-bold">P1:</span>
                    <span>{audit.blueprint.phase1}</span>
                  </div>
                  <div className="flex items-start gap-2 text-ink">
                    <span className="text-purple font-bold">P2:</span>
                    <span>{audit.blueprint.phase2}</span>
                  </div>
                  <div className="flex items-start gap-2 text-ink">
                    <span className="text-purple font-bold">P3:</span>
                    <span>{audit.blueprint.phase3}</span>
                  </div>
                </div>

                {/* Key Integrations Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] uppercase tracking-[1px] text-dim mr-1">Integrations:</span>
                  {audit.blueprint.keyIntegrations.map((tool) => (
                    <span
                      key={tool}
                      className="border border-line bg-panel px-2 py-0.5 text-[10px] font-mono text-ink rounded-xs"
                    >
                      {tool}
                    </span>
                  ))}
                </div>

                {/* Recommendation & Direct Action */}
                <div className="border-t border-line pt-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-[1.5px] text-dim">
                      Recommended Build
                    </div>
                    <div className="font-display text-[15px] font-black text-ink">
                      {audit.recommendedPackage} Package · {USD(packageObj.fee)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      id="claim-blueprint-btn"
                      onClick={handleClaim}
                      className="rounded-xs bg-green px-4 py-2.5 text-[11px] font-bold uppercase tracking-[1.5px] text-void hover:bg-green-hover hover:shadow-[0_0_16px_rgba(20,241,149,0.4)] flex items-center gap-1.5"
                    >
                      <span>Lock In & Start Build</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

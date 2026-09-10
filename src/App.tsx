import React, { useState, useEffect, useRef } from 'react';
import { SiteNav, SiteFooter } from './components/site/SiteNav';
import { HeroSection } from './components/customer/HeroSection';
import { AuditCalculator } from './components/customer/AuditCalculator';
import { AgentDemoSandbox } from './components/customer/AgentDemoSandbox';
import { PricingCheckout } from './components/customer/PricingCheckout';
import { MissionControl } from './components/mission/MissionControl';
import { PulseGame } from './components/pulse/PulseGame';
import { EnquiryModal } from './components/customer/EnquiryModal';
import { ClientOnboardingModal } from './components/customer/ClientOnboardingModal';
import { getInitialState, saveState, AppState } from './lib/store';
import { Approval, Client, Lead, MissionEvent, Payment, VaultWithdrawal } from './types';
import { STAGES } from './lib/mission';

type NavigationTab = 'home' | 'audit' | 'demo' | 'pricing' | 'mission' | 'pulse';

export default function App() {
  const [state, setState] = useState<AppState>(getInitialState);
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [selectedOnboardingClient, setSelectedOnboardingClient] = useState<Client | null>(null);
  const [checkoutPrefillPackage, setCheckoutPrefillPackage] = useState('Merge');
  const [checkoutPrefillScope, setCheckoutPrefillScope] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const cycleTimerRef = useRef<any>(null);

  // Sync state to localStorage whenever it changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  // Run a single full cycle step simulation
  const runCycle = () => {
    if (state.activeStage !== null) return; // already in progress

    let stageIndex = 0;
    setState((prev) => ({ ...prev, activeStage: 0 }));

    const interval = setInterval(() => {
      stageIndex++;
      if (stageIndex < STAGES.length) {
        const stageName = STAGES[stageIndex];
        setState((prev) => ({
          ...prev,
          activeStage: stageIndex,
        }));
      } else {
        clearInterval(interval);

        // Cycle finished
        const nextCycleN = state.cyclesCount + 1;
        const newEvent: MissionEvent = {
          id: `ev-${Date.now().toString().slice(-6)}`,
          cycle_n: nextCycleN,
          agent: 'TREASURER',
          message: `Cycle #${nextCycleN} completed. All 8 agents synchronized with zero runtime faults.`,
          created_at: new Date().toISOString(),
          severity: 'success',
        };

        // If cycle # is multiple of 2, auto-generate a realistic new lead or approval gate
        const maybeNewApproval: Approval = {
          id: `appr-${Date.now().toString().slice(-4)}`,
          type: 'OUTREACH_PITCH',
          title: `Autonomous Fork Roadmap: Opportunity #${nextCycleN}`,
          detail: 'PITCHER prepared a fork/merge plan with upstream candidates and a pricing model. Awaiting Director approval.',
          agent: 'PITCHER',
          payload: {
            prospect: `Niche Community #${nextCycleN}`,
            estimatedFee: 2400,
            guarantee: '10 day turnaround',
          },
          status: 'pending',
          created_at: new Date().toISOString(),
        };

        setState((prev) => ({
          ...prev,
          activeStage: null,
          cyclesCount: nextCycleN,
          events: [newEvent, ...prev.events],
          approvals: [maybeNewApproval, ...prev.approvals],
        }));

        showToast(`Cycle #${nextCycleN} completed successfully! Amber gate queued.`);
      }
    }, 450);
  };

  // Auto-cycle effect
  useEffect(() => {
    if (state.autoCycle) {
      cycleTimerRef.current = setInterval(() => {
        runCycle();
      }, 18000);
    } else if (cycleTimerRef.current) {
      clearInterval(cycleTimerRef.current);
    }

    return () => {
      if (cycleTimerRef.current) clearInterval(cycleTimerRef.current);
    };
  }, [state.autoCycle, state.cyclesCount]);

  const handleToggleAutoCycle = () => {
    setState((prev) => ({ ...prev, autoCycle: !prev.autoCycle }));
    showToast(`Auto-cycle ${!state.autoCycle ? 'enabled (18s interval)' : 'disabled'}`);
  };

  const handleApproveGate = (id: string) => {
    setState((prev) => {
      const target = prev.approvals.find((a) => a.id === id);
      const updatedApprovals = prev.approvals.map((a) =>
        a.id === id ? { ...a, status: 'approved' as const } : a
      );
      const newEv: MissionEvent = {
        id: `ev-${Date.now().toString().slice(-6)}`,
        cycle_n: prev.cyclesCount,
        agent: target?.agent || 'DIRECTOR',
        message: `DIRECTOR APPROVED: "${target?.title}". Dispatched payload downstream.`,
        created_at: new Date().toISOString(),
        severity: 'gate',
      };
      return {
        ...prev,
        approvals: updatedApprovals,
        events: [newEv, ...prev.events],
      };
    });
    showToast('Gate approved by Director. Task executed.');
  };

  const handleRejectGate = (id: string) => {
    setState((prev) => {
      const target = prev.approvals.find((a) => a.id === id);
      const updatedApprovals = prev.approvals.map((a) =>
        a.id === id ? { ...a, status: 'rejected' as const } : a
      );
      const newEv: MissionEvent = {
        id: `ev-${Date.now().toString().slice(-6)}`,
        cycle_n: prev.cyclesCount,
        agent: target?.agent || 'DIRECTOR',
        message: `DIRECTOR REJECTED: "${target?.title}". Returned to agent for refinement.`,
        created_at: new Date().toISOString(),
        severity: 'normal',
      };
      return {
        ...prev,
        approvals: updatedApprovals,
        events: [newEv, ...prev.events],
      };
    });
    showToast('Gate rejected. Sent back for re-scoping.');
  };

  const handleAddLead = (leadData: Partial<Lead>) => {
    const newLead: Lead = {
      id: `lead-${Date.now().toString().slice(-4)}`,
      biz: leadData.biz || 'New Product Request',
      niche: leadData.niche || 'Recreation & Outdoors',
      region: leadData.region || 'Worldwide',
      email: leadData.email,
      phone: leadData.phone,
      pain: leadData.pain || 'No maintained open-source tool for this niche',
      fit: 'High fit',
      score: leadData.score || 88,
      stage: leadData.stage || 'SCOUT',
      source: leadData.source || 'Direct Intake',
      notes: 'Ingested into autonomous agent operating loop.',
      created_at: new Date().toISOString(),
      estimatedValue: leadData.estimatedValue || 2400,
    };

    const newEv: MissionEvent = {
      id: `ev-${Date.now().toString().slice(-6)}`,
      cycle_n: state.cyclesCount,
      agent: 'SCOUT',
      message: `Request ingested: "${newLead.biz}". QUALIFIER scanning upstream repos.`,
      created_at: new Date().toISOString(),
      severity: 'normal',
    };

    setState((prev) => ({
      ...prev,
      leads: [newLead, ...prev.leads],
      events: [newEv, ...prev.events],
    }));

    showToast(`Request "${newLead.biz}" queued into Mission Control!`);
  };

  const handleMoveLeadStage = (id: string, newStage: any) => {
    setState((prev) => {
      const updated = prev.leads.map((l) => (l.id === id ? { ...l, stage: newStage } : l));
      return { ...prev, leads: updated };
    });
  };

  const handlePaymentSuccess = (payment: Payment, client: Client) => {
    const newEv: MissionEvent = {
      id: `ev-${Date.now().toString().slice(-6)}`,
      cycle_n: state.cyclesCount,
      agent: 'TREASURER',
      message: `NEW PAYMENT CONFIRMED: $${payment.amount_usd} USD via ${payment.method} for ${payment.biz}. Fork build queued.`,
      created_at: new Date().toISOString(),
      severity: 'success',
    };

    setState((prev) => ({
      ...prev,
      payments: [payment, ...prev.payments],
      clients: [client, ...prev.clients],
      events: [newEv, ...prev.events],
    }));

    showToast(`Payment Confirmed for ${payment.biz}!`);
    // Automatically trigger onboarding wizard
    setSelectedOnboardingClient(client);
  };

  const handleUpdateClient = (clientId: string, updates: Partial<Client>) => {
    setState((prev) => ({
      ...prev,
      clients: prev.clients.map((c) => (c.id === clientId ? { ...c, ...updates } : c)),
    }));
  };

  const handleWithdrawSol = (withdrawal: VaultWithdrawal) => {
    setState((prev) => {
      const newWithdrawals = [withdrawal, ...(prev.vaultWithdrawals || [])];
      const newEv: MissionEvent = {
        id: `ev-${Date.now()}`,
        cycle_n: prev.cyclesCount,
        agent: 'TREASURER',
        message: `TREASURY DISPATCH: Vault withdrawal of ${withdrawal.amount_sol} SOL (~$${withdrawal.amount_usd_est} USD) dispatched to ${withdrawal.destination_wallet}. Tx: ${withdrawal.tx_signature.slice(0, 10)}...${withdrawal.tx_signature.slice(-8)}`,
        created_at: new Date().toISOString(),
        severity: 'success',
      };
      return {
        ...prev,
        vaultWithdrawals: newWithdrawals,
        events: [newEv, ...prev.events],
      };
    });
    showToast(`Vault withdrawal of ${withdrawal.amount_sol} SOL dispatched to wallet!`);
  };

  const handleSelectPackageFromAudit = (pkgName: string, notes?: string) => {
    setCheckoutPrefillPackage(pkgName);
    if (notes) setCheckoutPrefillScope(notes);
    setCurrentTab('pricing');
    setTimeout(() => {
      document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  return (
    <div className="min-h-screen bg-void text-ink font-sans selection:bg-purple selection:text-white">
      {/* Toast banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 rounded-xs border border-green bg-panel2/95 px-4 py-3 text-[12px] font-mono text-green shadow-[0_0_20px_rgba(20,241,149,0.3)] backdrop-blur-md animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Main Navigation Bar */}
      <SiteNav
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        openEnquiry={() => setIsEnquiryOpen(true)}
        openAudit={() => {
          setCurrentTab('home');
          setTimeout(() => {
            document.getElementById('audit-section')?.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        }}
        voucherUnlocked={state.voucherUnlocked}
      />

      {/* Primary Page Views */}
      <main>
        {currentTab === 'home' && (
          <>
            <HeroSection
              onOpenAudit={() => {
                document.getElementById('audit-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenDemo={() => setCurrentTab('demo')}
              onOpenPricing={() => setCurrentTab('pricing')}
              onOpenEnquiry={() => setIsEnquiryOpen(true)}
            />

            <AuditCalculator
              onSelectPackage={handleSelectPackageFromAudit}
              onEnquireWithAudit={(summary) => {
                setCheckoutPrefillScope(summary);
                setIsEnquiryOpen(true);
              }}
            />

            <AgentDemoSandbox
              onSelectPackage={(pkg) => {
                setCheckoutPrefillPackage(pkg);
                setCurrentTab('pricing');
              }}
            />
          </>
        )}

        {currentTab === 'audit' && (
          <div className="pt-8">
            <AuditCalculator
              onSelectPackage={handleSelectPackageFromAudit}
              onEnquireWithAudit={(summary) => {
                setCheckoutPrefillScope(summary);
                setIsEnquiryOpen(true);
              }}
            />
          </div>
        )}

        {currentTab === 'demo' && (
          <div className="pt-8">
            <AgentDemoSandbox
              onSelectPackage={(pkg) => {
                setCheckoutPrefillPackage(pkg);
                setCurrentTab('pricing');
              }}
            />
          </div>
        )}

        {currentTab === 'pricing' && (
          <PricingCheckout
            initialPackage={checkoutPrefillPackage}
            initialScope={checkoutPrefillScope}
            voucherUnlocked={state.voucherUnlocked}
            onPaymentSuccess={handlePaymentSuccess}
            openEnquiry={() => setIsEnquiryOpen(true)}
          />
        )}

        {currentTab === 'pulse' && (
          <PulseGame
            voucherUnlocked={state.voucherUnlocked}
            onUnlockVoucher={(code) => {
              setState((prev) => ({ ...prev, voucherUnlocked: true, voucherCode: code }));
              showToast(`Voucher ${code} unlocked! -$250 USD applied to checkout!`);
            }}
            onGoToPricing={() => {
              setCurrentTab('pricing');
            }}
          />
        )}

        {currentTab === 'mission' && (
          <MissionControl
            leads={state.leads}
            clients={state.clients}
            approvals={state.approvals}
            events={state.events}
            payments={state.payments}
            withdrawals={state.vaultWithdrawals || []}
            cyclesCount={state.cyclesCount}
            autoCycle={state.autoCycle}
            activeStage={state.activeStage}
            onToggleAutoCycle={handleToggleAutoCycle}
            onRunCycle={runCycle}
            onApproveGate={handleApproveGate}
            onRejectGate={handleRejectGate}
            onAddLead={handleAddLead}
            onMoveLeadStage={handleMoveLeadStage}
            onWithdrawSol={handleWithdrawSol}
          />
        )}
      </main>

      {/* Modals */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        onSubmitEnquiry={handleAddLead}
        prefillScope={checkoutPrefillScope}
      />

      <ClientOnboardingModal
        isOpen={selectedOnboardingClient !== null}
        client={selectedOnboardingClient}
        onClose={() => setSelectedOnboardingClient(null)}
        onSave={handleUpdateClient}
      />

      {/* Global Footer */}
      <SiteFooter
        onSelectTab={(tab) => setCurrentTab(tab)}
        openEnquiry={() => setIsEnquiryOpen(true)}
      />
    </div>
  );
}

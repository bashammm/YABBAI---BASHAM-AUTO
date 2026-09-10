import React from 'react';
import { X, ShieldAlert, Check, Ban, FileText, Send, User, ShieldCheck } from 'lucide-react';
import { Approval } from '../../types';
import { USD } from '../../lib/mission';

interface DirectorGateModalProps {
  approval: Approval | null;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const DirectorGateModal: React.FC<DirectorGateModalProps> = ({
  approval,
  onClose,
  onApprove,
  onReject,
}) => {
  if (!approval) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-void/85 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl border border-amber/50 bg-panel p-6 rounded-xs shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-line pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xs bg-amber/15 border border-amber text-amber">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-[2px] font-bold text-amber">
                Director Gate · Human Sign-Off Required
              </div>
              <h3 className="font-display text-[15px] font-black text-ink">{approval.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-dim hover:text-ink transition p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Detail */}
        <p className="text-[12px] text-dim font-mono leading-relaxed">{approval.detail}</p>

        {/* Payload Inspector */}
        <div className="border border-line bg-panel2 p-4 rounded-xs font-mono text-[11.5px] space-y-2">
          <div className="text-[10px] uppercase tracking-[1.5px] text-purple font-bold">
            Synthesized Agent Payload ({approval.agent}):
          </div>
          <pre className="overflow-x-auto text-ink whitespace-pre-wrap bg-void/50 p-2.5 rounded-xs border border-line-subtle">
            {JSON.stringify(approval.payload, null, 2)}
          </pre>
        </div>

        {/* License Verification if applicable */}
        {approval.license && (
          <div className="flex items-center gap-2 text-[11px] text-green font-mono bg-green/10 border border-green/30 p-2.5 rounded-xs">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>
              Commercial Compliance Verified: License {approval.license} ({approval.license_class})
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between border-t border-line pt-4">
          <button
            onClick={() => onReject(approval.id)}
            className="border border-red/40 bg-red/10 px-4 py-2 text-[10.5px] font-bold uppercase tracking-[1.5px] text-red hover:bg-red/20 rounded-xs flex items-center gap-1.5"
          >
            <Ban className="h-3.5 w-3.5" />
            <span>Reject & Recalibrate</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="border border-line px-3.5 py-2 text-[10.5px] uppercase tracking-[1px] text-dim hover:text-ink rounded-xs"
            >
              Cancel
            </button>
            <button
              onClick={() => onApprove(approval.id)}
              className="bg-amber px-5 py-2 text-[10.5px] font-bold uppercase tracking-[1.5px] text-void hover:bg-amber/90 rounded-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,166,35,0.35)]"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Approve & Dispatch</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

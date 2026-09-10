import React, { useState } from 'react';
import { X, Send, Mail, CheckCircle2, Shield } from 'lucide-react';
import { Lead } from '../../types';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitEnquiry: (lead: Partial<Lead>) => void;
  prefillScope?: string;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  onSubmitEnquiry,
  prefillScope = '',
}) => {
  const [biz, setBiz] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [industry, setIndustry] = useState('Recreation & Outdoors');
  const [details, setDetails] = useState(prefillScope);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!biz.trim() || !email.trim()) return;

    onSubmitEnquiry({
      biz: biz.trim(),
      email: email.trim(),
      phone: phone.trim(),
      niche: industry,
      pain: details.trim() || 'Inbound product request from website',
      source: 'Direct Website Enquiry',
      stage: 'SCOUT',
      score: 92,
      estimatedValue: 2400,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-void/85 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg border border-line bg-panel p-6 sm:p-8 rounded-xs shadow-2xl space-y-5">
        <div className="flex items-start justify-between border-b border-line pb-4">
          <div>
            <div className="text-[10px] uppercase tracking-[2px] font-bold text-purple">
              Director Direct Channel
            </div>
            <h3 className="font-display text-xl font-black text-ink">
              Request a Product for Your Niche
            </h3>
          </div>
          <button onClick={onClose} className="text-dim hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="h-10 w-10 text-green mx-auto" />
            <div className="font-display text-lg font-bold text-ink">
              Enquiry Received By Thomas Basham
            </div>
            <p className="text-[12px] text-dim font-mono max-w-sm mx-auto">
              Your request is in the loop — SCOUT is already looking for upstream repos. You'll hear back within one business day at {email}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-[12px] font-mono">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-[10px] uppercase tracking-[1px] text-dim mb-1 font-bold">
                  Project / Community Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Trailhead Collective"
                  value={biz}
                  onChange={(e) => setBiz(e.target.value)}
                  className="w-full border border-line bg-panel2 px-3 py-2 text-ink rounded-xs outline-none focus:border-purple"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[1px] text-dim mb-1 font-bold">
                  Contact Name
                </label>
                <input
                  type="text"
                  placeholder="Maya Ortiz"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-line bg-panel2 px-3 py-2 text-ink rounded-xs outline-none focus:border-purple"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-[10px] uppercase tracking-[1px] text-dim mb-1 font-bold">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="maya@trailheadcollective.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-line bg-panel2 px-3 py-2 text-ink rounded-xs outline-none focus:border-purple"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[1px] text-dim mb-1 font-bold">
                  Phone (Optional)
                </label>
                <input
                  type="text"
                  placeholder="+1 720 555 0142"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-line bg-panel2 px-3 py-2 text-ink rounded-xs outline-none focus:border-purple"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[1px] text-dim mb-1 font-bold">
                Niche
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full border border-line bg-panel2 px-3 py-2 text-ink rounded-xs outline-none focus:border-purple"
              >
                <option value="Trades & Field Services">Trades & Field Services</option>
                <option value="Real Estate & Property">Real Estate & Property</option>
                <option value="Professional Services & Consulting">Professional Services & Consulting</option>
                <option value="E-Commerce & Retail">E-Commerce & Retail</option>
                <option value="Healthcare & Wellness Clinics">Healthcare & Wellness Clinics</option>
                <option value="Legal & Accounting">Legal & Accounting</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[1px] text-dim mb-1 font-bold">
                Describe the Tool Your Niche Is Missing
              </label>
              <textarea
                rows={4}
                required
                placeholder="What do you keep hacking together by hand? Is there an existing open-source project that almost fits, or an abandoned one you wish someone maintained?"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full border border-line bg-panel2 p-3 text-ink rounded-xs outline-none focus:border-purple resize-none"
              />
            </div>

            <div className="flex items-center gap-2 text-[10px] text-dim bg-panel2 p-2.5 rounded-xs border border-line-subtle">
              <Shield className="h-3.5 w-3.5 text-green shrink-0" />
              <span>Direct correspondence with Thomas Basham (Director, Basham Automations). No marketing spam.</span>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="border border-line px-4 py-2 text-[11px] text-dim hover:text-ink rounded-xs uppercase tracking-[1px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-purple px-5 py-2 text-[11px] font-bold uppercase tracking-[1.5px] text-white rounded-xs hover:bg-purple-hover flex items-center gap-1.5 shadow-[0_0_15px_rgba(153,69,255,0.4)]"
              >
                <Send className="h-3 w-3" />
                <span>Submit Enquiry</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

import { Approval, Client, Lead, MissionEvent, Payment, AuditResult, VaultWithdrawal } from '../types';
import { PACKAGES, TIERS, SOL_RECIPIENT } from './mission';

const STORAGE_KEY = 'yabbai_forge_os_v1';

export interface AppState {
  leads: Lead[];
  clients: Client[];
  approvals: Approval[];
  events: MissionEvent[];
  payments: Payment[];
  vaultWithdrawals: VaultWithdrawal[];
  cyclesCount: number;
  autoCycle: boolean;
  activeStage: number | null;
  voucherUnlocked: boolean;
  voucherCode: string;
}

const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-01',
    biz: 'Trailhead Collective',
    niche: 'Recreation & Outdoors',
    region: 'Colorado, US',
    email: 'hello@trailheadcollective.org',
    phone: '+1 720 555 0142',
    pain: 'Hiking club of 2,300 members runs trip sign-ups on a spreadsheet; every closed-source app charges per member.',
    fit: 'Tier 1 · Large community · Clear upstream (open trip-planner repo, MIT)',
    score: 94,
    stage: 'BUILD',
    source: 'Website Opportunity Scan',
    notes: 'Bought Merge. BUILDER merging trip-planner + gear-share + Stripe dues into one app.',
    created_at: new Date(Date.now() - 3600000 * 28).toISOString(),
    estimatedValue: 2400,
  },
  {
    id: 'lead-02',
    biz: 'Pixel Foundry Servers',
    niche: 'Gaming & Modding',
    region: 'Berlin, DE',
    email: 'admin@pixelfoundry.gg',
    phone: '+49 30 555 0199',
    pain: 'Their favourite Minecraft server manager was abandoned in 2024; 40 servers still depend on it.',
    fit: 'High fit · 12k Discord members · Upstream Apache-2',
    score: 89,
    stage: 'PITCH',
    source: 'Scout: abandoned repo scan',
    notes: 'Fork roadmap drafted. Awaiting Director approval to send.',
    created_at: new Date(Date.now() - 3600000 * 14).toISOString(),
    estimatedValue: 900,
  },
  {
    id: 'lead-03',
    biz: 'Open Cohort Academy',
    niche: 'Education & Learning',
    region: 'Nairobi, KE',
    email: 'ops@opencohort.africa',
    phone: '+254 20 555 0311',
    pain: 'Needs an LMS with cohort scheduling, mobile-money payments, and offline lessons — nothing exists in one package.',
    fit: 'Forge candidate · 3 partner schools · grant-funded',
    score: 91,
    stage: 'CLOSE',
    source: 'Inbound Referral',
    notes: 'Forge proposal sent ($6,000 USD). Open-core: free self-host, paid managed hosting.',
    created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
    estimatedValue: 6000,
  },
  {
    id: 'lead-04',
    biz: 'Ironbark Plumbing & Gas',
    niche: 'Local Business & Services',
    region: 'Melbourne, AU',
    email: 'dave@ironbarkplumbing.com.au',
    phone: '+61 423 771 904',
    pain: 'Wants a booking + quoting tool he owns instead of renting; found an open CRM but it needs trade-specific quoting.',
    fit: 'Fast-close Fork candidate',
    score: 82,
    stage: 'QUALIFY',
    source: 'Opportunity Scan',
    notes: 'Upstream open CRM (MIT) identified. QUALIFIER recommended Fork package.',
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    estimatedValue: 900,
  },
  {
    id: 'lead-05',
    biz: 'Tidepool Citizen Science',
    niche: 'Science & Research',
    region: 'Lisbon, PT',
    email: 'data@tidepool.science',
    phone: '+351 21 555 0877',
    pain: 'Volunteers log marine observations in six different apps; the maintainer graduated and the pipeline broke.',
    fit: 'High fit · 800 active volunteers · Zenodo-backed',
    score: 87,
    stage: 'SCOUT',
    source: 'Autonomous Scout AGT-01',
    notes: 'Found via GitHub issue thread asking for a maintainer. Extracted project lead contact.',
    created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
    estimatedValue: 2400,
  },
];

const INITIAL_CLIENTS: Client[] = [
  {
    id: 'client-01',
    biz: 'Trailhead Collective',
    package: 'Merge',
    setup_fee: 2400,
    setup_paid: true,
    tier: 'Upstream',
    mrr: 900,
    status: 'BUILDING',
    build_pct: 72,
    health: 'GREEN',
    created_via: 'PAYPAL',
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
    deliverables: [
      'Trip planner and gear-share repos merged',
      'Stripe membership dues wired',
      'Discord roster sync tested',
      'README and contributor guide in progress',
    ],
    techStack: ['Next.js', 'Postgres', 'Stripe', 'Discord'],
    primaryContact: 'Maya Ortiz (Club President)',
  },
  {
    id: 'client-02',
    biz: 'Loomcraft Patterns',
    package: 'Fork',
    setup_fee: 900,
    setup_paid: true,
    tier: 'Maintain',
    mrr: 300,
    status: 'LIVE',
    build_pct: 100,
    health: 'GREEN',
    created_via: 'SOLANA',
    created_at: new Date(Date.now() - 3600000 * 180).toISOString(),
    deliverables: [
      'Open knitting-pattern editor forked and rebranded',
      'PDF export and pattern marketplace added',
      'Published on GitHub + npm (v1.0.0)',
    ],
    techStack: ['SvelteKit', 'SQLite', 'Stripe'],
    primaryContact: 'Elena Rostova',
  },
  {
    id: 'client-03',
    biz: 'Harbour Freight Co-op',
    package: 'Forge',
    setup_fee: 6000,
    setup_paid: true,
    tier: 'Steward',
    mrr: 2200,
    status: 'LIVE',
    build_pct: 100,
    health: 'GREEN',
    created_via: 'CARD',
    created_at: new Date(Date.now() - 3600000 * 300).toISOString(),
    deliverables: [
      'Open-source consignment tracker built from scratch',
      'Driver dispatch and OCR modules',
      'Open-core: self-host free, managed cloud paid',
      '31 external contributors onboarded',
    ],
    techStack: ['Go', 'PostgreSQL', 'React', 'Docker'],
    primaryContact: 'Brett Higgins (Operations Head)',
  },
];

const INITIAL_APPROVALS: Approval[] = [
  {
    id: 'appr-01',
    type: 'OUTREACH_PITCH',
    title: 'Fork Roadmap: Pixel Foundry Servers',
    detail: 'PITCHER drafted a $900 USD Fork plan to revive the abandoned server manager with plugin support and a hosted tier.',
    agent: 'PITCHER',
    payload: {
      recipient: 'admin@pixelfoundry.gg',
      subject: 'Reviving your server manager as a maintained open-source fork',
      fee: 900,
      mrr: 300,
      timeline: '5 days',
    },
    status: 'pending',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'appr-02',
    type: 'BUILD_HANDOVER',
    title: 'Release QA: Trailhead Collective v1.0.0',
    detail: 'SHIPPER passed 14/14 integration tests. Ready for Director sign-off, tag, and public GitHub release.',
    agent: 'SHIPPER',
    payload: {
      client: 'Trailhead Collective',
      package: 'Merge',
      testsPassed: 14,
      testFailures: 0,
      documentationUrl: 'https://github.com/yabbai-forge/trailhead/releases/tag/v1.0.0',
    },
    status: 'pending',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'appr-03',
    type: 'LICENSE_CHECK',
    title: 'Upstream Audit: Trip-planner Base Repo',
    detail: 'FORGE inspected the upstream trip-planner and its 41 dependencies. No copyleft contamination. Resale permitted.',
    agent: 'FORGE',
    license: 'MIT',
    license_class: 'Resale Clean',
    payload: {
      library: 'open-trip-planner',
      version: '2.3.0',
      permittedUse: 'Fork, rebrand, and commercial redistribution allowed',
    },
    status: 'approved',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];

const INITIAL_PAYMENTS: Payment[] = [
  {
    id: 'pay-01',
    method: 'PAYPAL',
    purpose: 'Merge Package Build',
    biz: 'Trailhead Collective',
    package: 'Merge',
    tier: 'Upstream',
    amount_usd: 2400,
    mrr: 900,
    reference: 'PP-ORD-8829104',
    status: 'confirmed',
    client_id: 'client-01',
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
  {
    id: 'pay-02',
    method: 'SOLANA',
    purpose: 'Fork Package Build (On-chain)',
    biz: 'Loomcraft Patterns',
    package: 'Fork',
    tier: 'Maintain',
    amount_usd: 900,
    mrr: 300,
    sol_amount: 4.74,
    recipient: 'HTN1fvHwbzKiMwh9YXZEe3eooiMdoCAs3TweWdiSZV5i',
    reference: '5KmN8j...7X9q (Slot #288419201)',
    status: 'confirmed',
    client_id: 'client-02',
    created_at: new Date(Date.now() - 3600000 * 180).toISOString(),
  },
  {
    id: 'pay-03',
    method: 'CARD',
    purpose: 'Forge Package Build',
    biz: 'Harbour Freight Co-op',
    package: 'Forge',
    tier: 'Steward',
    amount_usd: 6000,
    mrr: 2200,
    reference: 'TXN-STR-994120',
    status: 'confirmed',
    client_id: 'client-03',
    created_at: new Date(Date.now() - 3600000 * 300).toISOString(),
  },
  {
    id: 'pay-04',
    method: 'SOLANA',
    purpose: 'Merge Package Build (On-chain Escrow)',
    biz: 'Solstice Homebrew Guild',
    package: 'Merge',
    tier: 'Upstream',
    amount_usd: 2400,
    mrr: 900,
    sol_amount: 12.63,
    recipient: SOL_RECIPIENT,
    reference: '4xJ8kP...9mQ2 (Slot #288412890)',
    status: 'confirmed',
    client_id: 'client-04',
    created_at: new Date(Date.now() - 3600000 * 96).toISOString(),
  },
];

const INITIAL_WITHDRAWALS: VaultWithdrawal[] = [
  {
    id: 'wth-01',
    amount_sol: 1.5,
    amount_usd_est: 285,
    destination_wallet: SOL_RECIPIENT,
    tx_signature: '4t39fjyTZGijZST5qjFZEwikFXwfifdhqYHjDV82LFuHi31rxnj3rP7UtxA9LqgYNvfFuWAJ5Nh26P5gz8LDpUqi',
    status: 'confirmed',
    memo: 'Director Operational Sweep · Hot Reserve',
    priority_fee_sol: 0.000005,
    created_at: new Date(Date.now() - 3600000 * 36).toISOString(),
    tx_mode: 'onchain',
    slot: 445763810,
    verified_onchain: true,
  },
];

const INITIAL_EVENTS: MissionEvent[] = [
  {
    id: 'ev-01',
    cycle_n: 42,
    agent: 'SCOUT',
    message: 'Scanned 3,100 GitHub repos tagged recreation, gaming, education. Flagged 14 abandoned projects with active issue threads asking for a maintainer.',
    created_at: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    severity: 'normal',
  },
  {
    id: 'ev-02',
    cycle_n: 42,
    agent: 'QUALIFIER',
    message: 'Scored Ironbark Plumbing fit: 82/100. Upstream open CRM is MIT, 2.1k stars, last commit 3 weeks ago.',
    created_at: new Date(Date.now() - 3600000 * 1.1).toISOString(),
    severity: 'normal',
  },
  {
    id: 'ev-03',
    cycle_n: 42,
    agent: 'PITCHER',
    message: 'Amber Gate Triggered: Fork roadmap drafted for Pixel Foundry Servers. Awaiting Director approval.',
    created_at: new Date(Date.now() - 3600000 * 0.8).toISOString(),
    severity: 'gate',
  },
  {
    id: 'ev-04',
    cycle_n: 41,
    agent: 'TREASURER',
    message: 'Verified Solana tx signature: 4.74 SOL deposited to HTN1fv...V5i. Ledger updated: +$900 USD.',
    created_at: new Date(Date.now() - 3600000 * 2.5).toISOString(),
    severity: 'success',
  },
  {
    id: 'ev-05',
    cycle_n: 41,
    agent: 'SHIPPER',
    message: 'Staging build deployed for Trailhead Collective. All 14 integration tests passed. Release candidate tagged.',
    created_at: new Date(Date.now() - 3600000 * 3.2).toISOString(),
    severity: 'normal',
  },
];

export function getInitialState(): AppState {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const withdrawals = (parsed.vaultWithdrawals || INITIAL_WITHDRAWALS).map((w: VaultWithdrawal) => {
          if (w.tx_signature?.startsWith('5KmN8jZ')) {
            return {
              ...w,
              tx_signature: '4t39fjyTZGijZST5qjFZEwikFXwfifdhqYHjDV82LFuHi31rxnj3rP7UtxA9LqgYNvfFuWAJ5Nh26P5gz8LDpUqi',
              slot: 445763810,
              tx_mode: 'onchain',
              verified_onchain: true,
            };
          }
          return w;
        });
        return {
          ...parsed,
          vaultWithdrawals: withdrawals,
          activeStage: null,
        };
      } catch (e) {
        console.error('Failed to parse saved state:', e);
      }
    }
  }

  return {
    leads: INITIAL_LEADS,
    clients: INITIAL_CLIENTS,
    approvals: INITIAL_APPROVALS,
    events: INITIAL_EVENTS,
    payments: INITIAL_PAYMENTS,
    vaultWithdrawals: INITIAL_WITHDRAWALS,
    cyclesCount: 42,
    autoCycle: false,
    activeStage: null,
    voucherUnlocked: false,
    voucherCode: 'PULSE250',
  };
}

export function saveState(state: AppState) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state:', e);
    }
  }
}

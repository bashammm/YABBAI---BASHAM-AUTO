import { PackageDef, TierDef } from '../types';

export const STAGES = [
  'SCOUT',
  'QUALIFY',
  'PITCH',
  'CLOSE',
  'BUILD',
  'SHIP',
  'SUPPORT',
  'REINVEST',
] as const;

export const GATED: Record<string, boolean> = {
  PITCH: true,
  SHIP: true,
  CLOSE: true,
};

export const AGENTS = [
  {
    name: 'SCOUT',
    code: 'AGT-01',
    role: 'Crawls GitHub, package registries, marketplaces and forums across every niche for unmet demand, abandoned repos, and fork-worthy products',
    status: 'ACTIVE',
    activeCount: 18,
  },
  {
    name: 'QUALIFIER',
    code: 'AGT-02',
    role: 'Scores each opportunity on audience size, upstream license, code health, and how fast it can be adapted and resold',
    status: 'ACTIVE',
    activeCount: 9,
  },
  {
    name: 'PITCHER',
    code: 'AGT-03',
    role: 'Drafts product briefs, fork roadmaps, README copy, and outreach to communities that asked for the thing (DIRECTOR GATED)',
    status: 'GATED',
    activeCount: 4,
  },
  {
    name: 'BUILDER',
    code: 'AGT-04',
    role: 'Forks, merges, and adapts upstream codebases — swaps branding, rewires integrations, adds the missing niche features',
    status: 'ACTIVE',
    activeCount: 6,
  },
  {
    name: 'SHIPPER',
    code: 'AGT-05',
    role: 'Runs the test suite, cuts a tagged release, publishes to GitHub / npm / PyPI / marketplaces with docs and demo (GATED)',
    status: 'GATED',
    activeCount: 3,
  },
  {
    name: 'SUPPORTER',
    code: 'AGT-06',
    role: 'Triages issues and PRs, watches upstream for security patches, and keeps every shipped fork in sync',
    status: 'ACTIVE',
    activeCount: 12,
  },
  {
    name: 'FORGE',
    code: 'AGT-07',
    role: 'Audits every upstream license (MIT / Apache-2 / GPL / AGPL) so forks stay compliant and resale rights are clear',
    status: 'ACTIVE',
    activeCount: 2,
  },
  {
    name: 'TREASURER',
    code: 'AGT-08',
    role: 'Verifies PayPal captures and Solana on-chain signatures; ledgers every sale, sponsorship, and support contract in USD/SOL',
    status: 'ACTIVE',
    activeCount: 15,
  },
] as const;

export const PACKAGES: PackageDef[] = [
  {
    name: 'Fork',
    fee: 900,
    popular: false,
    badge: 'Fastest Ship',
    description: 'Take a proven open-source product and adapt it to your niche — rebranded, reconfigured, and released under your name.',
    turnaround: '3–5 days',
    idealFor: 'Anyone who found the right tool but needs it tuned for their community, hobby, trade, or market.',
    features: [
      'Upstream repo selected and license-cleared by FORGE',
      'Rebrand, config, and niche-specific defaults applied',
      'One custom feature or integration added',
      'Published to GitHub with README, demo, and install guide',
      'Director-reviewed code and release notes',
      '14-day post-release fix warranty',
    ],
  },
  {
    name: 'Merge',
    fee: 2400,
    popular: true,
    badge: 'Most Popular',
    description: 'Combine two or more open-source projects into one coherent product that none of them were on their own.',
    turnaround: '7–12 days',
    idealFor: 'Builders who keep gluing three tools together by hand and want it shipped as one thing.',
    features: [
      'Everything in Fork',
      'Two to four upstream projects merged into a single codebase',
      'Unified auth, data model, and UI shell',
      'Packaged for the target platform (web, CLI, desktop, plugin, or mobile)',
      'Published to the relevant registry or marketplace',
      'Live Mission Control tracking of the build',
      'Recorded walkthrough and contributor guide',
    ],
  },
  {
    name: 'Forge',
    fee: 6000,
    popular: false,
    badge: 'From Scratch',
    description: 'A brand-new product built from the ground up for a niche that has nothing good yet — then open-sourced with a commercial layer.',
    turnaround: '14–21 days',
    idealFor: 'Communities, creators, and operators who want to own the category-defining tool in their corner of the universe.',
    features: [
      'Everything in Merge',
      'Product discovery across the niche (competitor and demand scan)',
      'Multi-agent build with test coverage and CI from day one',
      'Open-core setup: free tier public, paid tier (hosting, support, or pro features) wired in',
      'Full repo ownership and IP assignment',
      'Dedicated channel with the Director during the build',
      'License certification by AGT-FORGE',
      'First month of Upstream tier included ($900 value)',
    ],
  },
];

export const TIERS: TierDef[] = [
  {
    name: 'Maintain',
    mrr: 300,
    description: 'Keep the fork alive: dependency bumps, upstream security patches, issue triage.',
    features: [
      'Weekly upstream sync and dependency updates',
      'Security patch monitoring and hotfixes',
      'Up to 3 small changes or config tweaks monthly',
      'Issue and PR triage on your repo',
    ],
  },
  {
    name: 'Upstream',
    mrr: 900,
    description: 'Grow the product: a new feature every month, community management, release cadence.',
    features: [
      'All Maintain features',
      '1 new feature, integration, or platform port per month',
      'Monthly tagged release with changelog',
      'Priority 24-hour bug response',
      'Quarterly roadmap review with Thomas Basham',
    ],
  },
  {
    name: 'Steward',
    mrr: 2200,
    description: 'Embedded product partner: run the whole open-source line and its commercial layer.',
    features: [
      'All Upstream features',
      'Up to 3 new features or adjacent forks per month',
      'Sponsorship, marketplace, and pro-tier revenue setup',
      'Community moderation and contributor onboarding',
      '4-hour SLA and direct line to the Director',
    ],
  },
];

export const SOL_RECIPIENT = 'HTN1fvHwbzKiMwh9YXZEe3eooiMdoCAs3TweWdiSZV5i';
export const SOL_USD_RATE = 190; // 1 SOL ~ $190 USD estimated standard conversion

export const USD = (n: number) => '$' + Math.round(n).toLocaleString('en-US');

export const USD_TO_SOL = (usdAmount: number) => {
  return Number((usdAmount / SOL_USD_RATE).toFixed(3));
};

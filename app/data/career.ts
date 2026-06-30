export type CareerItem = {
  range: string;
  role: string;
  org: string;
  loc: string;
  body: string;
  current?: boolean;
};

export const CAREER: CareerItem[] = [
  {
    range: '2022 — PRESENT',
    role: 'COO & Board Member',
    org: 'dub',
    loc: 'New York',
    current: true,
    body: 'Partner to the CEO running a venture-backed consumer fintech. I own customer operations, finance, HR and G&A — much of it handled with AI tooling I build in-house.',
  },
  {
    range: '2018 — 2022',
    role: 'Head of Business Operations',
    org: 'Affirm',
    loc: 'San Francisco',
    body: 'Joined as Chief of Staff to the CCO, then built and ran the Business Operations department from scratch through the company\u2019s IPO. Learned how fast-growing fintechs break under regulatory pressure — and what it takes to hold them together when the stakes are real.',
  },
  {
    range: '2006 — 2018',
    role: 'U.S. Army Officer',
    org: 'Army Aviation',
    loc: 'Various',
    body: 'Twelve years in uniform. Fixed-wing reconnaissance, UAS command, and a tour with the 160th Special Operations Aviation Regiment building their first organic large UAS unit from scratch.',
  },
];

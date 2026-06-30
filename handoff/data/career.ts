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
    range: '2024 — PRESENT',
    role: 'COO & Board Member',
    org: 'dub',
    loc: 'New York',
    current: true,
    body: 'Partner to the CEO running a venture-backed consumer fintech. I own customer operations, finance, HR and G&A — much of it handled with AI tooling I build in-house.',
  },
  {
    range: '2021 — 2024',
    role: 'Operator Roles',
    org: 'Fintech / Early-Stage Ops',
    loc: 'NYC · Remote',
    body: 'Scaled operations functions across venture-backed fintechs. Built the systems — human and automated — that I now run on.',
  },
  {
    range: '2018 — 2021',
    role: 'Transition to Tech',
    org: 'MBA + Early Operator Work',
    loc: 'New York',
    body: 'Left the Army, moved into operating roles at venture-backed startups.',
  },
  {
    range: '2006 — 2018',
    role: 'U.S. Army Officer',
    org: 'Army Aviation',
    loc: 'Various',
    body: 'Twelve years in uniform. Aviation branch.',
  },
  {
    range: '2002 — 2006',
    role: 'Cadet',
    org: 'United States Military Academy',
    loc: 'West Point, NY',
    body: 'B.S., Class of 2006.',
  },
];

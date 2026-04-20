export type Credential = {
  label: string;
  issuer: string;
  note?: string;
};

export const CREDENTIALS: Credential[] = [
  { label: 'Commercial Pilot', issuer: 'FAA', note: 'Fixed Wing & Rotary' },
  { label: 'Commercial UAS Certificate', issuer: 'FAA Part 107' },
  { label: 'Series 99 — Operations Professional', issuer: 'FINRA' },
  { label: 'Securities Industry Essentials', issuer: 'FINRA' },
];

import Link from 'next/link';
import Nav from '@/app/components/Nav';
import Footer from '@/app/components/Footer';
import SectionHead from '@/app/components/SectionHead';
import CareerRow from '@/app/components/CareerRow';
import PodcastCard from '@/app/components/PodcastCard';
import { CAREER } from '@/app/data/career';
import { CREDENTIALS } from '@/app/data/credentials';
import { PODCASTS } from '@/app/data/podcasts';

const TIME_AND_MONEY = [
  {
    label: 'Angel investing',
    body: 'Early-stage checks into AI-native operators shipping close to their customers. Most recent: Truv, a consumer-permissioned financial data platform.',
  },
  {
    label: 'Stage 2 Capital',
    body: 'Catalyst LP in the B2B go-to-market fund. Active with portfolio companies on operations and scaling.',
  },
  {
    label: 'Context Ventures',
    body: 'Fund LP. Context backs military founders — the leadership and risk calibration translate into a real edge at seed.',
  },
  {
    label: 'Advisory',
    body: 'Advisor to Grady AI (AI-powered grading for higher ed) and a small number of scaling companies on operations, GTM, and AI adoption.',
  },
];

export default function About() {
  return (
    <>
      <Nav />
      <main className="bg-[var(--paper)] text-[var(--ink)]">
        <div className="max-w-[760px] mx-auto px-8 pt-16">
          {/* About */}
          <section className="pb-14 border-b border-[var(--rule)]">
            <SectionHead label="About" title="A short bio." />
            <div className="mt-6">
              <p className="font-serif italic text-[22px] leading-[1.5] text-[var(--ink)] m-0 mb-5">
                I run operations at a venture-backed fintech and ship AI systems in production.
              </p>
              <p className="font-serif text-[18px] leading-[1.7] text-[var(--ink-2)] m-0 mb-4">
                I&rsquo;m the COO of dub. My day job is turning a regulated consumer fintech into a company where one operator, leaning on AI, does the work of a team. I build a lot of the tooling myself.
              </p>
              <p className="font-serif text-[18px] leading-[1.7] text-[var(--ink-2)] m-0 mb-4">
                On the side I angel invest in founders doing the same — using AI as leverage, shipping quickly, staying close to customers. I advise a handful of scaling companies on operations and AI adoption.
              </p>
              <p className="font-serif text-[18px] leading-[1.7] text-[var(--ink-2)] m-0">
                Before all of that: twelve years in the Army. West Point &rsquo;06, Army Aviation. The operator instincts carried over; most of the specifics didn&rsquo;t.
              </p>
            </div>
          </section>

          {/* Career */}
          <section className="py-14 border-b border-[var(--rule)]">
            <SectionHead label="Career" title="In reverse chronology." />
            <div>
              {CAREER.map((item) => (
                <CareerRow key={item.range} item={item} />
              ))}
            </div>
          </section>

          {/* Licenses & Certifications */}
          <section className="py-14 border-b border-[var(--rule)]">
            <SectionHead label="Credentials" title="Licenses & certifications." />
            <ul className="list-none p-0 m-0">
              {CREDENTIALS.map((c) => (
                <li
                  key={c.label}
                  className="grid grid-cols-[1fr_auto] gap-6 py-4 border-t border-[var(--rule)] items-baseline"
                >
                  <div>
                    <div className="font-serif text-[18px] -tracking-[0.01em] text-[var(--ink)]">
                      {c.label}
                      {c.note && (
                        <span className="italic text-[var(--ink-3)]"> — {c.note}</span>
                      )}
                    </div>
                  </div>
                  <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--ink-4)]">
                    {c.issuer}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Where I put my time and money */}
          <section className="py-14 border-b border-[var(--rule)]">
            <SectionHead label="Where I put my time and money" title="Advisory and capital." />
            <p className="font-serif italic text-[20px] leading-[1.55] text-[var(--ink-3)] m-0 mb-2">
              Angel investor and advisor. I back operators building with AI and help scaling companies adopt it without breaking things.
            </p>
            <ul className="list-none p-0 m-0 mt-6">
              {TIME_AND_MONEY.map((item) => (
                <li
                  key={item.label}
                  className="grid grid-cols-[180px_1fr] gap-6 py-5 border-t border-[var(--rule)] items-baseline"
                >
                  <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--ink-4)]">
                    {item.label}
                  </div>
                  <p className="font-serif text-[18px] leading-[1.7] text-[var(--ink-2)] m-0">
                    {item.body}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* In conversation — podcast appearances */}
          <section className="py-14 border-b border-[var(--rule)]">
            <SectionHead label="In conversation" title="Selected appearances." />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8">
              {PODCASTS.map((podcast) => (
                <PodcastCard key={podcast.href} podcast={podcast} />
              ))}
            </div>
          </section>

          {/* Off the clock — personal life */}
          <section className="py-14">
            <SectionHead label="Off the clock" title="The other half." />
            <div className="mt-6">
              <p className="font-serif text-[18px] leading-[1.7] text-[var(--ink-2)] m-0 mb-4">
                Married to Lisa for thirteen years. We met in Germany while I was flying for the Army and we still go back every chance we get. Our Pomsky, Tanuki, is the best city dog in Manhattan — and the reason we know most of the quiet corners of it.
              </p>
              <p className="font-serif text-[18px] leading-[1.7] text-[var(--ink-2)] m-0 mb-6">
                Long Island kid. After fifteen years of military travel and a stint in San Francisco, I came back to New York and we&rsquo;ve been making up for lost time — food, wine, and more Broadway than is probably wise.
              </p>
              <Link
                href="/favorites"
                className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--accent)] hover:text-[var(--ink)] transition-colors"
              >
                See our NYC favorites →
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

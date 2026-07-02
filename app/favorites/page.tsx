import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/app/components/Nav';
import Footer from '@/app/components/Footer';

export const metadata: Metadata = {
  title: 'NYC Favorites — Brett & Lisa',
  description:
    "The New York restaurants, bars, and Broadway shows Brett and Lisa keep going back to — and where they take everyone who visits. A working guide to eating and theatre in the city.",
  alternates: { canonical: 'https://www.brettchereskin.com/favorites' },
  openGraph: {
    title: 'NYC Favorites — Brett & Lisa',
    description:
      'The restaurants, bars, and Broadway shows we keep going back to — and where we take everyone who visits.',
    type: 'website',
    url: 'https://www.brettchereskin.com/favorites',
  },
};

interface Spot {
  name: string;
  note?: string;
  visits?: string;
  url?: string;
}

interface Category {
  num: string;
  title: string;
  kicker: string;
  intro: string;
  spots: Spot[];
}

const categories: Category[] = [
  {
    num: '01',
    title: 'Omakase & Sushi',
    kicker: 'The regulars',
    intro:
      "Where we end up most weeks. If you only trust us on one category, trust this one.",
    spots: [
      { name: 'SourAji', note: 'Our absolute go-to. All-you-can-eat omakase and sake — what makes it unique.', visits: '8+', url: 'https://resy.com/cities/new-york-ny/venues/souraji' },
      { name: 'Kaki Sushi Omakase', note: 'BYOB sake with no corkage. Great for parties and group celebrations.', visits: '4', url: 'https://resy.com/cities/new-york-ny/venues/kaki' },
      { name: 'TSUMO', note: 'Incredible value — under $60 for a legit omakase.', visits: '3' },
      { name: 'Sushi by M', note: 'Two locations — one on 5th and a smaller "party room" on 4th. The party room has better vibes, but both are great.', url: 'http://www.sushibym.com' },
      { name: 'Takumi Omakase', note: 'BYOB and super fun vibe.', url: 'https://takumiomakase.com' },
      { name: 'Sushi Dairo', note: 'Super small, owned by the chefs. Phone reservations only.', url: 'https://omakasesushidairo.com' },
      { name: 'Kawa Omakase', note: 'New and up-and-coming.', url: 'https://kawaomakase.com' },
      { name: 'Kissaki Omakase Bowery', note: 'Not our favorite — pulled off the regular rotation.' },
    ],
  },
  {
    num: '02',
    title: 'Korean BBQ & Korean',
    kicker: 'Fire at the table',
    intro: 'Our K-town shortlist, from premium wagyu to the old-school charcoal spots.',
    spots: [
      { name: 'HOWOO', note: 'Our favorite KBBQ right now. Premium meats, owned by the Nubiani folks. Great for large groups and upleveled eating.', visits: '4', url: 'https://www.howoo.nyc' },
      { name: 'NUBIANI', note: "Love this place but hard to get a resy now. Also has a midtown east location that's easier to reserve.", visits: '4', url: 'https://www.nubianinyc.com' },
      { name: 'Cote', note: 'The Korean steakhouse. Michelin-starred for a reason.', url: 'https://www.cotekoreansteakhouse.com' },
      { name: 'HYUN', note: 'Pricey but insanely decadent — all-you-can-eat true A5 Wagyu. Once-in-a-lifetime type experience, not a daily event.', url: 'https://www.hyunnyc.com' },
      { name: 'New Wonjo', note: 'OG spot — one of the oldest in K-town. Try the raw marinated crab! They use charcoal which is nice.', url: 'https://newwonjo.com' },
      { name: 'Jongro BBQ', note: 'Fun spot with cool vibes — good for large groups and late nights in K-town.', url: 'https://www.jongrobbqny.com' },
    ],
  },
  {
    num: '03',
    title: 'Date Night',
    kicker: 'When it matters',
    intro: 'The list we pull from for birthdays, anniversaries, and talking someone into a second date.',
    spots: [
      { name: 'Noreetuh', note: "Favorite place right now. Celebrated Lisa's birthday here. Insane wine list featuring German wines (which Lisa loves). Large format dishes are great.", visits: '5', url: 'https://www.noreetuh.com' },
      { name: 'Minetta Tavern', note: 'The Red Label Burger is a must-order — my favorite burger in NYC, hands down.', url: 'https://www.minettatavernny.com' },
      { name: 'Carbone', note: 'Yes, it lives up to the hype.', url: 'https://carbonenewyork.com' },
      { name: 'Torrisi Bar & Restaurant', note: "The pasta. That's it. That's the review.", visits: '2', url: 'https://torrisinyc.com' },
      { name: 'COQODAQ', note: 'By the Cote group. Amazing brunch and the best Korean fried chicken ever.', url: 'https://www.coqodaq.com' },
      { name: 'Bangkok Supper Club', note: 'Amazing intense flavors and a very unique cocktail program. Hard to get in — arrive at 5 and grab a bar seat.', url: 'https://www.bangkoksupperclubnyc.com' },
      { name: 'Thai Diner', note: "Funky Thai spot — don't sleep on their brunch. Best fusion breakfast in the city.", url: 'https://www.thaidiner.com' },
      { name: 'Mr B Bar', note: 'Local favorite — fresh-from-Italy light bites and great wine. Like a sports bar and wine bar had a baby.', url: 'https://mrbbarnyc.com' },
      { name: 'Bar B', note: "Standing-only wine bar by a Japanese couple focused on amazing Italian wine and bites. Very unique concept you won't forget.", url: 'https://www.barbnyc.com' },
      { name: "Dickson's Farmstand", note: 'Hidden butcher shop in Chelsea Market. Great for housemade charcuterie and affordable wine. Check out their special events like the 175-day dry aged beef dinner.', url: 'https://www.dicksonsfarmstand.com' },
      { name: 'Au Cheval NYC', note: 'The burger. Worth the wait.', url: 'https://www.auchevaldiner.com/nyc/home' },
      { name: 'Leonetta NYC', note: 'Our large group go-to.', url: 'https://www.leonettanyc.com' },
    ],
  },
  {
    num: '04',
    title: 'Wine & Cocktails',
    kicker: 'Before or after',
    intro: 'Natural wine, rare spirits, and one speakeasy behind a suit shop.',
    spots: [
      { name: 'La Compagnie des Vins Surnaturels', note: 'French natural wines in NoLita. Perfect pre-dinner.', url: 'https://www.compagniedesvinssurnaturels.com/nyc' },
      { name: 'The Ten Bells', note: 'Natural wine bar on the LES. Great vibe. $1.50 oyster happy hour.', url: 'https://tenbellsnyc.com' },
      { name: 'Experimental Cocktail Club', note: 'Hidden below La Compagnie. Rare spirits and inventive cocktails.', url: 'https://www.experimentalcocktailclub.com/new-york' },
      { name: 'J. Bespoke', note: 'NYE 2026. What a night. Speakeasy hidden behind a suit shop.', url: 'https://www.jbespoke.com' },
    ],
  },
  {
    num: '05',
    title: 'Everything Else',
    kicker: 'The wide net',
    intro: 'Steakhouses, ramen, fondue, tasting menus — the spots that round out the year.',
    spots: [
      { name: 'Keens Steakhouse', note: 'Old-school NYC. Mutton chop is legendary.', url: 'https://www.keens.com' },
      { name: 'Laser Wolf Brooklyn', note: 'Israeli grill. Salatim spread alone is worth it.', url: 'https://www.laserwolfbrooklyn.com' },
      { name: 'The Lavaux', note: 'Swiss fondue bar. Cozy and unique.', url: 'https://thelavauxwinebar.com' },
      { name: 'ATOBOY', note: 'Korean tasting menu, beautiful plating.', url: 'https://www.atoboynyc.com' },
      { name: 'Nudibranch', note: 'Tiny, ambitious, unforgettable.', url: 'https://nudibranchnyc.com' },
      { name: 'Pig & Khao', note: 'Southeast Asian flavors. Now on the Upper West Side.', url: 'https://www.pigandkhao.com' },
      { name: 'OKONOMI / YUJI Ramen', note: 'When ramen is the mood.', url: 'https://www.okonomi.us' },
      { name: 'CheLi Manhattan', note: 'Shanghainese heat done right.', url: 'https://www.che-li.com' },
      { name: 'Kisa', note: 'Korean diner inspired by taxi driver restaurants. A newer addition.', url: 'https://www.kisaus.com' },
      { name: 'Odd Sister', note: 'Soho neighborhood spot. Coming soon to our regular rotation.', url: 'https://www.oddsisternyc.com' },
    ],
  },
];

const shows = [
  { name: 'All Out', date: 'Dec 2025', note: "Featuring the band Lawrence — we're huge fans. The live energy was unreal." },
  { name: 'Hadestown', date: '2025', note: 'We love this show. The music stays with you for days.' },
  { name: 'Moulin Rouge!', date: 'Apr 2024', note: 'Our go-to for out-of-town visitors. Took multiple groups. Never gets old.' },
  { name: 'Cabaret', date: '2024', note: 'The Kit Kat Club experience. Eddie Redmayne was mesmerizing.' },
  { name: 'Sunset Blvd.', date: '2024', note: 'Nicole Scherzinger. Unbelievable.' },
  { name: 'Shucked', date: '2023', note: 'Way funnier than it has any right to be. We still quote it.' },
  { name: 'The Lion King', date: 'Apr 2024', note: 'A classic for a reason.' },
  { name: 'Chicago', date: 'May 2024', note: 'A classic — and you can often get cheap tickets.' },
];

const totalSpots = categories.reduce((n, c) => n + c.spots.length, 0);

const ExternalArrow = () => (
  <svg className="inline-block w-3 h-3 ml-1 -translate-y-px opacity-40 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 17L17 7M9 7h8v8" />
  </svg>
);

function SpotRow({ spot }: { spot: Spot }) {
  const name = (
    <span className="font-serif text-[19px] leading-tight text-[var(--ink)]">
      {spot.name}
      {spot.url && <ExternalArrow />}
    </span>
  );

  return (
    <div className="group py-4 border-t border-[var(--rule)] first:border-t-0">
      <div className="flex items-baseline justify-between gap-4">
        {spot.url ? (
          <a href={spot.url} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent)] transition-colors">
            {name}
          </a>
        ) : (
          name
        )}
        {spot.visits && (
          <span className="flex-shrink-0 font-mono text-[10px] tracking-[0.12em] uppercase text-[var(--accent)] border border-[var(--accent)]/30 rounded-full px-2 py-0.5">
            {spot.visits} visits
          </span>
        )}
      </div>
      {spot.note && (
        <p className="mt-1.5 font-serif italic text-[15px] leading-[1.6] text-[var(--ink-3)] max-w-[52ch]">
          {spot.note}
        </p>
      )}
    </div>
  );
}

export default function Favorites() {
  return (
    <>
      <Nav />
      <main className="bg-[var(--paper)] text-[var(--ink)]">
        <div className="max-w-[960px] mx-auto px-8">

          {/* Hero */}
          <section className="pt-16 pb-12 border-b-2 border-[var(--ink)]">
            <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] tracking-[0.16em] uppercase text-[var(--ink-4)] mb-10">
              <span className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                A NYC Eating &amp; Theatre Guide
              </span>
              <span>Brett &amp; Lisa · New York</span>
            </div>

            <h1 className="font-serif font-normal -tracking-[0.02em] leading-[1.0] text-[var(--ink)] m-0" style={{ fontSize: 'clamp(48px, 8vw, 96px)' }}>
              NYC Favorites
            </h1>

            <p className="mt-8 font-serif text-[21px] leading-[1.55] text-[var(--ink-2)] max-w-[640px]">
              We&apos;ve been working our way through the city&apos;s food and theatre scene since moving
              back. These are the places we <span className="italic">keep going back to</span> — and where we
              take everyone who visits.
            </p>
            <p className="mt-4 font-mono text-[12px] tracking-[0.04em] text-[var(--ink-4)]">
              Most of these neighborhoods we found on foot, walking Tanuki.
            </p>

            {/* Stat strip */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 border border-[var(--ink)]">
              {[
                { k: 'Spots', v: `${totalSpots}` },
                { k: 'Categories', v: `${categories.length}` },
                { k: 'Most-visited', v: 'SourAji' },
                { k: 'Broadway shows', v: `${shows.length}` },
              ].map((s, i) => (
                <div
                  key={s.k}
                  className={`p-5 border-[var(--ink)] ${i < 3 ? 'border-b md:border-b-0 md:border-r' : 'border-b md:border-b-0'} ${i === 0 ? 'border-r' : ''} ${i === 2 ? 'md:border-r' : ''}`}
                >
                  <div className="font-serif text-[26px] leading-none text-[var(--ink)]">{s.v}</div>
                  <div className="mt-2 font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--ink-4)]">{s.k}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Categories */}
          {categories.map((cat) => (
            <section key={cat.title} className="py-14 border-b border-[var(--rule)]">
              <div className="md:grid md:grid-cols-[200px_1fr] md:gap-12">
                <div className="mb-6 md:mb-0">
                  <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-[var(--accent)]">
                    {cat.num} · {cat.kicker}
                  </div>
                  <h2 className="mt-2 font-serif font-normal -tracking-[0.01em] leading-[1.05] text-[var(--ink)]" style={{ fontSize: 'clamp(28px, 3.5vw, 38px)' }}>
                    {cat.title}
                  </h2>
                  <p className="mt-3 font-serif italic text-[15px] leading-[1.55] text-[var(--ink-3)] md:max-w-[180px]">
                    {cat.intro}
                  </p>
                </div>
                <div>
                  {cat.spots.map((spot) => (
                    <SpotRow key={spot.name} spot={spot} />
                  ))}
                </div>
              </div>
            </section>
          ))}

          {/* Broadway */}
          <section className="py-14 border-b border-[var(--rule)]">
            <div className="md:grid md:grid-cols-[200px_1fr] md:gap-12">
              <div className="mb-6 md:mb-0">
                <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-[var(--accent)]">
                  06 · On stage
                </div>
                <h2 className="mt-2 font-serif font-normal -tracking-[0.01em] leading-[1.05] text-[var(--ink)]" style={{ fontSize: 'clamp(28px, 3.5vw, 38px)' }}>
                  Broadway
                </h2>
                <p className="mt-3 font-serif italic text-[15px] leading-[1.55] text-[var(--ink-3)] md:max-w-[180px]">
                  TodayTix Gold members and lottery regulars. If it&apos;s on stage, we&apos;ve probably tried to see it.
                </p>
              </div>
              <div>
                {shows.map((show) => (
                  <div key={show.name} className="group py-4 border-t border-[var(--rule)] first:border-t-0">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="font-serif text-[19px] leading-tight text-[var(--ink)]">{show.name}</span>
                      <span className="flex-shrink-0 font-mono text-[10px] tracking-[0.12em] uppercase text-[var(--ink-4)]">
                        {show.date}
                      </span>
                    </div>
                    {show.note && (
                      <p className="mt-1.5 font-serif italic text-[15px] leading-[1.6] text-[var(--ink-3)] max-w-[52ch]">
                        {show.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* One more thing — ferry */}
          <section className="py-16">
            <div className="border-l-2 border-[var(--accent)] pl-6 max-w-[640px]">
              <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-[var(--accent)] mb-3">
                One more thing
              </div>
              <p className="font-serif text-[22px] leading-[1.5] text-[var(--ink)] m-0">
                If you&apos;re visiting, take the <span className="italic">NYC Ferry</span>. The views of the
                bridges — Brooklyn, Manhattan, Williamsburg — are the best in the city, and it&apos;s under
                $3 a ride with a 10-pack. We take every visitor on the East River route. It&apos;s
                non-negotiable.
              </p>
              <p className="mt-5 font-serif italic text-[15px] text-[var(--ink-3)]">
                This list is always evolving. If you&apos;ve got a rec, send it our way.
              </p>
            </div>
          </section>

          {/* Back link */}
          <section className="pb-20">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--ink-4)] hover:text-[var(--ink)] transition-colors"
            >
              ← Back to About
            </Link>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}

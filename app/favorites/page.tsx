import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Nav from '@/app/components/Nav';
import Footer from '@/app/components/Footer';

export const metadata: Metadata = {
  title: 'NYC Favorites — Brett & Lisa',
  description:
    "The New York restaurants, bars, and Broadway shows Brett and Lisa keep going back to — and where they take everyone who visits. A love letter to eating and theatre in the city.",
  alternates: { canonical: 'https://www.brettchereskin.com/favorites' },
  openGraph: {
    title: 'NYC Favorites — Brett & Lisa',
    description:
      'The restaurants, bars, and Broadway shows we keep going back to — and where we take everyone who visits.',
    type: 'website',
    url: 'https://www.brettchereskin.com/favorites',
  },
};

// Warm, hand-picked accents per category — richer than the old pastels, and the
// category photo carries the color so the page feels like a zine, not a résumé.
interface Spot {
  name: string;
  note?: string;
  visits?: string;
  url?: string;
  favorite?: boolean; // "current favorite" — only where our own note says so
  benched?: boolean; // tried it, pulled it from the rotation
}

interface Category {
  id: string;
  num: string;
  title: string;
  kicker: string;
  intro: string;
  image: string;
  imageAlt: string;
  tint: string; // warm badge/foreground color drawn from the photo
  spots: Spot[];
}

const categories: Category[] = [
  {
    id: 'omakase',
    num: '01',
    title: 'Omakase & Sushi',
    kicker: 'The regulars',
    intro: 'Where we end up most weeks. If you only trust us on one category, trust this one.',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=1600',
    imageAlt: 'Nigiri sushi on a wooden board',
    tint: '#b5623a',
    spots: [
      { name: 'SourAji', note: "Our absolute go-to. All-you-can-eat omakase and sake — we haven't found anything else like it in the city.", visits: '8+', favorite: true, url: 'https://resy.com/cities/new-york-ny/venues/souraji' },
      { name: 'Kaki Sushi Omakase', note: 'BYOB sake with no corkage. Great for parties and group celebrations.', visits: '4', url: 'https://resy.com/cities/new-york-ny/venues/kaki' },
      { name: 'TSUMO', note: 'Incredible value — under $60 for a legit omakase.', visits: '3' },
      { name: 'Sushi by M', note: 'Two locations — one on 5th and a smaller "party room" on 4th. The party room has better vibes, but both are great.', url: 'http://www.sushibym.com' },
      { name: 'Takumi Omakase', note: 'BYOB and super fun vibe.', url: 'https://takumiomakase.com' },
      { name: 'Sushi Dairo', note: 'Super small, owned by the chefs. Phone reservations only.', url: 'https://omakasesushidairo.com' },
      { name: 'Kawa Omakase', note: 'New and up-and-coming.', url: 'https://kawaomakase.com' },
      { name: 'Kissaki Omakase Bowery', note: 'Not our favorite — pulled off the regular rotation. Listed for honesty.', benched: true },
    ],
  },
  {
    id: 'korean',
    num: '02',
    title: 'Korean BBQ & Korean',
    kicker: 'Fire at the table',
    intro: 'Our K-town shortlist, from premium wagyu to the old-school charcoal spots.',
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=1600',
    imageAlt: 'Korean BBQ grilling over charcoal',
    tint: '#a8443f',
    spots: [
      { name: 'HOWOO', note: 'Our favorite KBBQ right now. Premium meats, owned by the Nubiani folks. Great for large groups and upleveled eating.', visits: '4', favorite: true, url: 'https://www.howoo.nyc' },
      { name: 'NUBIANI', note: "Love this place but hard to get a resy now. Also has a midtown east location that's easier to reserve.", visits: '4', url: 'https://www.nubianinyc.com' },
      { name: 'Cote', note: 'The Korean steakhouse. Michelin-starred for a reason.', url: 'https://www.cotekoreansteakhouse.com' },
      { name: 'HYUN', note: 'Pricey but insanely decadent — all-you-can-eat true A5 Wagyu. Once-in-a-lifetime type experience, not a daily event.', url: 'https://www.hyunnyc.com' },
      { name: 'New Wonjo', note: 'OG spot — one of the oldest in K-town. Try the raw marinated crab! They use charcoal which is nice.', url: 'https://newwonjo.com' },
      { name: 'Jongro BBQ', note: 'Fun spot with cool vibes — good for large groups and late nights in K-town.', url: 'https://www.jongrobbqny.com' },
    ],
  },
  {
    id: 'date-night',
    num: '03',
    title: 'Date Night',
    kicker: 'When it matters',
    intro: 'The list we pull from for birthdays, anniversaries, and talking someone into a second date.',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1600',
    imageAlt: 'Warm, candlelit restaurant dining room',
    tint: '#7c5cae',
    spots: [
      { name: 'Noreetuh', note: "Favorite place right now. Celebrated Lisa's birthday here. Insane wine list featuring German wines (which Lisa loves). Large format dishes are great.", visits: '5', favorite: true, url: 'https://www.noreetuh.com' },
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
    id: 'drinks',
    num: '04',
    title: 'Wine & Cocktails',
    kicker: 'Before or after',
    intro: 'Natural wine, rare spirits, and one speakeasy behind a suit shop.',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1600',
    imageAlt: 'Glasses of wine on a bar',
    tint: '#9c3f4a',
    spots: [
      { name: 'La Compagnie des Vins Surnaturels', note: 'French natural wines in NoLita. Perfect pre-dinner.', url: 'https://www.compagniedesvinssurnaturels.com/nyc' },
      { name: 'The Ten Bells', note: 'Natural wine bar on the LES. Great vibe. $1.50 oyster happy hour.', url: 'https://tenbellsnyc.com' },
      { name: 'Experimental Cocktail Club', note: 'Hidden below La Compagnie. Rare spirits and inventive cocktails.', url: 'https://www.experimentalcocktailclub.com/new-york' },
      { name: 'J. Bespoke', note: 'NYE 2026. What a night. Speakeasy hidden behind a suit shop.', url: 'https://www.jbespoke.com' },
    ],
  },
  {
    id: 'everything-else',
    num: '05',
    title: 'Everything Else',
    kicker: 'The wide net',
    intro: 'Steakhouses, ramen, fondue, tasting menus — the spots that round out the year.',
    image: 'https://images.unsplash.com/photo-1533777324565-a040eb52facd?q=80&w=1600',
    imageAlt: 'A spread of shared dishes on a table',
    tint: '#3f6d54',
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

const HERO_IMG = 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2000'; // warm NYC
const FERRY_IMG = 'https://images.unsplash.com/photo-1534430480872-3498386e7856?q=80&w=1600'; // bridge from water

const totalSpots = categories.reduce((n, c) => n + c.spots.length, 0);

const ExternalArrow = () => (
  <svg className="inline-block w-3 h-3 ml-1 -translate-y-px opacity-40 group-hover/spot:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 17L17 7M9 7h8v8" />
  </svg>
);

function SpotRow({ spot, tint }: { spot: Spot; tint: string }) {
  const name = (
    <span className={`font-serif text-[19px] leading-tight ${spot.benched ? 'text-[var(--ink-4)] line-through decoration-[var(--ink-4)]/40 decoration-1' : 'text-[var(--ink)]'}`}>
      {spot.name}
      {spot.url && <ExternalArrow />}
    </span>
  );

  return (
    <div className="group/spot py-4 border-t border-[var(--rule)] first:border-t-0">
      <div className="flex items-baseline justify-between gap-4">
        <span className="flex items-baseline gap-2 flex-wrap">
          {spot.url ? (
            <a href={spot.url} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent)] transition-colors">
              {name}
            </a>
          ) : (
            name
          )}
          {spot.favorite && (
            <span className="font-mono text-[10px] tracking-[0.1em] uppercase -rotate-1" style={{ color: tint }}>
              ★ current favorite
            </span>
          )}
        </span>
        {spot.benched ? (
          <span className="flex-shrink-0 font-mono text-[10px] tracking-[0.1em] uppercase text-[var(--ink-4)] border border-[var(--rule)] rounded-full px-2.5 py-0.5 rotate-2">
            benched
          </span>
        ) : (
          spot.visits && (
            <span
              className="flex-shrink-0 font-mono text-[10px] tracking-[0.1em] uppercase text-white rounded-full px-2.5 py-0.5 rotate-2"
              style={{ background: tint }}
            >
              {spot.visits} visits
            </span>
          )
        )}
      </div>
      {spot.note && (
        <p className="mt-1.5 font-serif italic text-[15px] leading-[1.6] text-[var(--ink-3)] max-w-[54ch]">
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

        {/* Hero — big warm photo, title overlaid */}
        <section className="relative">
          <div className="relative h-[62vh] min-h-[440px] w-full overflow-hidden">
            <Image src={HERO_IMG} alt="New York City at golden hour" fill priority quality={70} sizes="100vw" className="object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,24,20,0.82) 0%, rgba(26,24,20,0.25) 45%, rgba(26,24,20,0.35) 100%)' }} />
            <div className="absolute inset-x-0 bottom-0">
              <div className="max-w-[960px] mx-auto px-8 pb-10">
                <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] uppercase text-white/80 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  A NYC eating &amp; theatre guide · from Brett &amp; Lisa
                </div>
                <h1 className="font-serif font-normal -tracking-[0.02em] leading-[0.95] text-white m-0" style={{ fontSize: 'clamp(46px, 8.5vw, 104px)' }}>
                  Our NYC
                  <br />
                  <span className="italic">Favorites</span>
                </h1>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-[960px] mx-auto px-8">

          {/* Intro + stat strip */}
          <section className="py-12 border-b border-[var(--rule)]">
            <p className="font-serif text-[22px] leading-[1.55] text-[var(--ink-2)] max-w-[660px]">
              We&apos;ve been eating and theatre-ing our way through the city since moving back. These are
              the places we <mark className="bg-[#f5e6a8] text-[var(--ink)] px-1 rounded-sm">keep going back to</mark> — the
              standing reservations, the birthday spots, and the ones we drag every out-of-town visitor to.
            </p>
            <p className="mt-5 font-serif italic text-[16px] leading-[1.6] text-[var(--ink-3)] max-w-[660px]">
              House rules: nothing makes this page unless we&apos;d go back tomorrow. Visit counts are real
              (and probably undercounted). And when a place falls off the rotation, we say so instead of
              quietly deleting it.
            </p>
            <p className="mt-4 font-mono text-[12px] tracking-[0.04em] text-[var(--ink-4)]">
              🐕 Most of these neighborhoods we found on foot, walking Tanuki.
            </p>

            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 border border-[var(--ink)] rounded-lg overflow-hidden">
              {[
                { k: 'Spots', v: `${totalSpots}` },
                { k: 'Categories', v: `${categories.length}` },
                { k: 'Most-visited', v: 'SourAji' },
                { k: 'Broadway shows', v: `${shows.length}` },
              ].map((s, i) => (
                <div
                  key={s.k}
                  className={`p-5 border-[var(--ink)] ${i % 2 === 0 ? 'border-r' : ''} ${i < 2 ? 'border-b md:border-b-0' : ''} ${i === 2 ? 'md:border-r' : ''}`}
                >
                  <div className="font-serif text-[26px] leading-none text-[var(--ink)]">{s.v}</div>
                  <div className="mt-2 font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--ink-4)]">{s.k}</div>
                </div>
              ))}
            </div>

            {/* Jump nav */}
            <nav aria-label="Jump to a category" className="mt-8 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <a
                  key={cat.id}
                  href={`#${cat.id}`}
                  className="group/jump font-mono text-[11px] tracking-[0.08em] uppercase text-[var(--ink-3)] border border-[var(--rule)] rounded-full px-3 py-1.5 hover:border-[var(--ink)] hover:text-[var(--ink)] transition-colors"
                >
                  {cat.title}
                  <span className="text-[var(--ink-4)] group-hover/jump:text-[var(--ink-3)]"> · {cat.spots.length}</span>
                </a>
              ))}
              <a
                href="#broadway"
                className="group/jump font-mono text-[11px] tracking-[0.08em] uppercase text-[var(--ink-3)] border border-[var(--rule)] rounded-full px-3 py-1.5 hover:border-[var(--ink)] hover:text-[var(--ink)] transition-colors"
              >
                Broadway<span className="text-[var(--ink-4)] group-hover/jump:text-[var(--ink-3)]"> · {shows.length}</span>
              </a>
            </nav>
          </section>

          {/* Categories */}
          {categories.map((cat) => (
            <section key={cat.title} id={cat.id} className="py-12 border-b border-[var(--rule)] scroll-mt-24">
              {/* Banner photo with overlaid title */}
              <div className="relative h-52 md:h-64 w-full overflow-hidden rounded-xl mb-8">
                <Image src={cat.image} alt={cat.imageAlt} fill loading="lazy" quality={65} sizes="(max-width: 768px) 100vw, 896px" className="object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,24,20,0.85) 0%, rgba(26,24,20,0.1) 60%)' }} />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="inline-block font-mono text-[10px] tracking-[0.16em] uppercase text-white px-2 py-1 rounded-sm -rotate-1 mb-2" style={{ background: cat.tint }}>
                    {cat.num} · {cat.kicker}
                  </div>
                  <h2 className="font-serif font-normal -tracking-[0.01em] leading-[1.02] text-white m-0" style={{ fontSize: 'clamp(30px, 4.5vw, 46px)' }}>
                    {cat.title}
                  </h2>
                </div>
              </div>

              <p className="font-serif italic text-[17px] leading-[1.55] text-[var(--ink-3)] max-w-[620px] mb-2">
                {cat.intro}
              </p>

              <div>
                {cat.spots.map((spot) => (
                  <SpotRow key={spot.name} spot={spot} tint={cat.tint} />
                ))}
              </div>
            </section>
          ))}

          {/* Broadway */}
          <section id="broadway" className="py-12 border-b border-[var(--rule)] scroll-mt-24">
            <div className="mb-8">
              <div className="inline-block font-mono text-[10px] tracking-[0.16em] uppercase text-white px-2 py-1 rounded-sm -rotate-1 mb-3" style={{ background: '#b5623a' }}>
                06 · On stage
              </div>
              <h2 className="font-serif font-normal -tracking-[0.01em] leading-[1.02] text-[var(--ink)] m-0" style={{ fontSize: 'clamp(30px, 4.5vw, 46px)' }}>
                Broadway
              </h2>
              <p className="mt-3 font-serif italic text-[17px] leading-[1.55] text-[var(--ink-3)] max-w-[620px]">
                TodayTix Gold members and lottery regulars. If it&apos;s on stage, we&apos;ve probably tried to see it.
              </p>
            </div>
            <div>
              {shows.map((show) => (
                <div key={show.name} className="py-4 border-t border-[var(--rule)] first:border-t-0">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-serif text-[19px] leading-tight text-[var(--ink)]">{show.name}</span>
                    <span className="flex-shrink-0 font-mono text-[10px] tracking-[0.12em] uppercase text-[var(--ink-4)]">
                      {show.date}
                    </span>
                  </div>
                  {show.note && (
                    <p className="mt-1.5 font-serif italic text-[15px] leading-[1.6] text-[var(--ink-3)] max-w-[54ch]">
                      {show.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* One more thing — ferry, with photo */}
          <section className="py-14">
            <div className="relative overflow-hidden rounded-2xl">
              <Image src={FERRY_IMG} alt="A New York City bridge seen from the water" fill loading="lazy" quality={65} sizes="(max-width: 768px) 100vw, 896px" className="object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,24,20,0.9) 0%, rgba(26,24,20,0.55) 100%)' }} />
              <div className="relative z-10 p-8 md:p-12 max-w-[640px]">
                <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-white/80 mb-3">
                  ⛴️ One more thing
                </div>
                <p className="font-serif text-[22px] leading-[1.5] text-white m-0">
                  If you&apos;re visiting, take the <span className="italic">NYC Ferry</span>. The views of the
                  bridges — Brooklyn, Manhattan, Williamsburg — are the best in the city, and it&apos;s under
                  $3 a ride with a 10-pack. We take every visitor on the East River route. It&apos;s non-negotiable.
                </p>
                <p className="mt-5 font-serif italic text-[15px] text-white/70">
                  This list is always evolving. Got a spot we&apos;re missing?{' '}
                  <Link href="/contact" className="text-white underline decoration-white/40 underline-offset-4 hover:decoration-white">
                    Send it our way
                  </Link>
                  . ❤️
                </p>
              </div>
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

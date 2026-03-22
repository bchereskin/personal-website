'use client';

import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] as const },
  },
};

interface Spot {
  name: string;
  note?: string;
  visits?: string;
}

interface Category {
  title: string;
  badge?: string;
  emoji: string;
  bg: string;
  accent: string;
  border: string;
  image: string;
  imageAlt: string;
  spots: Spot[];
}

const categories: Category[] = [
  {
    title: 'Omakase & Sushi',
    badge: 'The Regulars',
    emoji: '🍣',
    bg: '#fef3c7',
    accent: '#92400e',
    border: '#fbbf24',
    image: 'https://blog.resy.com/wp-content/uploads/2023/05/Himitsu-1-2000x1125.jpg',
    imageAlt: 'Omakase sushi experience',
    spots: [
      { name: 'SourAji', note: 'Our absolute go-to. All-you-can-eat omakase and sake — what makes it unique.', visits: '8+' },
      { name: 'Kaki Sushi Omakase', note: 'BYOB sake with no corkage. Great for parties and group celebrations.', visits: '4' },
      { name: 'TSUMO', note: 'Incredible value — under $60 for a legit omakase.', visits: '3' },
      { name: 'Sushi by M', note: 'Small spot, big flavors.' },
      { name: 'Kissaki Omakase Bowery' },
      { name: 'Kawa Omakase' },
      { name: 'Takumi Omakase' },
      { name: 'Sushi Dairo' },
      { name: 'Omakase 33', note: 'Great for big groups.' },
    ],
  },
  {
    title: 'Korean BBQ & Korean',
    emoji: '🥩',
    bg: '#fce7f3',
    accent: '#9d174d',
    border: '#f472b6',
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=2070',
    imageAlt: 'Korean BBQ grill',
    spots: [
      { name: 'NUBIANI', note: 'Best Korean BBQ in the city. Period.', visits: '4' },
      { name: 'HOWOO', note: 'Counter top or dining room, always delivers.', visits: '4' },
      { name: 'New Wonjo', note: 'Classic K-town BBQ. The late-night move.' },
      { name: 'Miss Korea BBQ' },
      { name: 'Gogi 37' },
      { name: 'HYUN' },
    ],
  },
  {
    title: 'Date Night Spots',
    emoji: '🕯️',
    bg: '#ede9fe',
    accent: '#5b21b6',
    border: '#a78bfa',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070',
    imageAlt: 'Elegant restaurant dining',
    spots: [
      { name: 'Noreetuh', note: 'Hawaiian-inspired, incredible wine list. We keep coming back.', visits: '5' },
      { name: 'Carbone', note: 'Yes, it lives up to the hype.' },
      { name: 'Torrisi Bar & Restaurant', note: 'The pasta. That\'s it. That\'s the review.', visits: '2' },
      { name: 'Minetta Tavern' },
      { name: 'Sinsa', note: 'Valentine\'s Day prix fixe was memorable.' },
      { name: 'Dirty French' },
      { name: 'Au Cheval NYC', note: 'The burger. Worth the wait.' },
      { name: 'Leonetta NYC', note: 'Our large group go-to.' },
    ],
  },
  {
    title: 'Wine & Cocktails',
    emoji: '🍷',
    bg: '#fef2f2',
    accent: '#991b1b',
    border: '#fca5a5',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2070',
    imageAlt: 'Wine glasses',
    spots: [
      { name: 'La Compagnie des Vins Surnaturels', note: 'French natural wines in NoLita. Perfect pre-dinner.' },
      { name: 'The Ten Bells', note: 'Wine bar on the LES. Great vibe.' },
      { name: 'Experimental Cocktail Club' },
      { name: 'J. Bespoke', note: 'NYE 2026. What a night.' },
    ],
  },
  {
    title: 'Other Favorites',
    emoji: '⭐',
    bg: '#ecfdf5',
    accent: '#065f46',
    border: '#6ee7b7',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2070',
    imageAlt: 'NYC restaurant scene',
    spots: [
      { name: 'Keens Steakhouse', note: 'Old-school NYC. Mutton chop is legendary.' },
      { name: 'Laser Wolf Brooklyn', note: 'Israeli grill. Salatim spread alone is worth it.' },
      { name: 'The Lavaux', note: 'Swiss fondue bar. Cozy and unique.' },
      { name: 'ATOBOY', note: 'Korean tasting menu, beautiful plating.' },
      { name: 'Nudibranch', note: 'Tiny, ambitious, unforgettable.' },
      { name: 'Pig and Khao', note: 'Southeast Asian on the LES.' },
      { name: 'OKONOMI / YUJI Ramen', note: 'When ramen is the mood.' },
      { name: 'CheLi Manhattan', note: 'Sichuan heat done right.' },
      { name: 'Kisa', note: 'A newer addition to the rotation.' },
      { name: 'Odd Sister', note: 'Coming soon to our list.' },
    ],
  },
];

const shows = [
  { name: 'All Out', date: 'Dec 2025', note: 'Featuring the band Lawrence — we\'re huge fans. The live energy was unreal.', image: '/shows/allout.png' },
  { name: 'Hadestown', date: '2025', note: 'We love this show. The music stays with you for days.', image: '/shows/hadestown.jpg' },
  { name: 'Moulin Rouge!', date: 'Apr 2024', note: 'Our go-to for out-of-town visitors. Took multiple groups. Never gets old.', image: '/shows/moulinrouge.jpg' },
  { name: 'Cabaret', date: '2024', note: 'The Kit Kat Club experience. Eddie Redmayne was mesmerizing.', image: '/shows/cabaret.jpg' },
  { name: 'Sunset Blvd.', date: '2024', note: 'Nicole Scherzinger. Unbelievable.', image: '/shows/sunsetblvd.jpg' },
  { name: 'Shucked', date: '2023', note: 'Way funnier than it has any right to be. We still quote it.', image: '/shows/shucked.jpg' },
  { name: 'The Lion King', date: 'Apr 2024', note: 'A classic for a reason.', image: '/shows/lionking.jpg' },
  { name: 'Chicago', date: 'May 2024', image: '/shows/chicago.jpg' },
];

function SpotCard({ spot, accent, border }: { spot: Spot; accent: string; border: string }) {
  return (
    <motion.div variants={fadeIn}>
      <div
        className="rounded-xl p-4 h-full transition-all hover:scale-[1.02] hover:shadow-lg bg-white"
        style={{ border: `1px solid ${border}40` }}
      >
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-gray-900 text-sm">{spot.name}</h3>
          {spot.visits && (
            <span
              className="flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-bold"
              style={{ backgroundColor: `${border}30`, color: accent }}
            >
              {spot.visits}×
            </span>
          )}
        </div>
        {spot.note && (
          <p className="text-xs text-gray-500 italic leading-relaxed">&ldquo;{spot.note}&rdquo;</p>
        )}
      </div>
    </motion.div>
  );
}

export default function Favorites() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen" style={{ background: 'linear-gradient(180deg, #fafaf9 0%, #f5f5f4 50%, #fafaf9 100%)' }}>
        {/* Hero with NYC skyline */}
        <section className="relative pt-24 pb-16 px-6 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1534430480872-3498386e7856?q=80&w=2070"
              alt="NYC skyline"
              fill
              className="object-cover opacity-15"
              priority
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #fafaf9, transparent 30%, #fafaf9)' }} />
          </div>

          <div className="max-w-3xl mx-auto relative z-10 text-center pt-8">
            <motion.p
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="text-6xl mb-6"
            >
              🗽
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl font-black text-gray-900 mb-5 tracking-tight"
            >
              Brett & Lisa&apos;s
              <br />
              <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
                NYC Favorites
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-gray-600 max-w-xl mx-auto mb-4"
            >
              We&apos;ve been exploring the city&apos;s food and theatre scene since moving back.
              These are the places we keep going back to and where we take everyone who visits.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-gray-400 text-sm"
            >
              🐕 Most of these neighborhoods we discovered walking Tanuki.
            </motion.p>
          </div>
        </section>

        {/* Restaurant Categories */}
        {categories.map((cat, i) => (
          <section key={cat.title} className="py-8 px-6">
            <div className="max-w-5xl mx-auto">
              {/* Category hero image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5 }}
                className="relative h-48 md:h-56 rounded-2xl overflow-hidden mb-6"
              >
                <Image
                  src={cat.image}
                  alt={cat.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cat.emoji}</span>
                    <h2 className="text-2xl md:text-3xl font-black text-white">{cat.title}</h2>
                    {cat.badge && (
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold"
                        style={{ backgroundColor: cat.bg, color: cat.accent }}
                      >
                        {cat.badge}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.05 }}
                variants={stagger}
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3"
              >
                {cat.spots.map((spot) => (
                  <SpotCard key={spot.name} spot={spot} accent={cat.accent} border={cat.border} />
                ))}
              </motion.div>

              {i < categories.length - 1 && (
                <div className="mt-10 border-b border-gray-200" />
              )}
            </div>
          </section>
        ))}

        {/* Broadway */}
        <section className="py-14 px-6 mt-4" style={{ background: 'linear-gradient(180deg, #fafaf9 0%, #fef3c7 30%, #fef3c7 70%, #fafaf9 100%)' }}>
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <p className="text-5xl mb-4">🎭</p>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">Broadway</h2>
              <p className="text-gray-600 max-w-lg mx-auto">
                TodayTix Gold members and Broadway lottery regulars.
                If it&apos;s on stage, we&apos;ve probably tried to see it.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={stagger}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto"
            >
              {shows.map((show) => (
                <motion.div key={show.name} variants={fadeIn}>
                  <div className="bg-white rounded-2xl overflow-hidden border border-amber-200/50 hover:shadow-xl hover:scale-[1.02] transition-all h-full">
                    <div className="relative h-32 w-full">
                      <Image
                        src={show.image}
                        alt={show.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                    </div>
                    <div className="p-4 pt-1">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-bold text-gray-900">{show.name}</h3>
                        <span className="text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-medium flex-shrink-0 ml-2">
                          {show.date}
                        </span>
                      </div>
                      {show.note && (
                        <p className="text-sm text-gray-500 italic">&ldquo;{show.note}&rdquo;</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* NYC Ferry tip */}
        <section className="py-14 px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
              className="relative rounded-2xl overflow-hidden"
            >
              <Image
                src="https://images.unsplash.com/photo-1534430480872-3498386e7856?q=80&w=2070"
                alt="Brooklyn Bridge from the water"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-gray-900/20" />
              <div className="relative z-10 p-8 md:p-10 text-center">
                <p className="text-3xl mb-3">⛴️</p>
                <h3 className="text-xl font-bold text-white mb-3">One More Thing</h3>
                <p className="text-gray-200 mb-2 max-w-lg mx-auto">
                  If you&apos;re visiting, take the <strong className="text-white">NYC Ferry</strong>. The views of the
                  bridges — Brooklyn, Manhattan, Williamsburg — are the best free views in the city.
                  We take every visitor on the East River route. It&apos;s non-negotiable.
                </p>
                <p className="text-gray-400 text-sm italic mt-4">
                  This list is always evolving. If you have a rec, send it our way.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Back link */}
        <section className="py-10 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Back to About
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

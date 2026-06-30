export type Podcast = {
  href: string;
  image: string;
  imageFocus?: string;
  show: string;
  title: string;
  description: string;
};

export const PODCASTS: Podcast[] = [
  {
    href: 'https://www.youtube.com/watch?v=gn5EUo1ux40',
    image: 'https://i.ytimg.com/vi/gn5EUo1ux40/maxresdefault.jpg',
    show: 'Risk and Reason',
    title: 'Why "Move Fast" Breaks Fintechs',
    description: 'Risk, fraud, and operational discipline at scale, with Eli Wachs of Footprint.',
  },
  {
    href: 'https://thenest.concentrix.com/episode-12-dub/',
    image: 'https://thenest.concentrix.com/wp-content/uploads/2025/06/Brett-Chereskin-Chief-of-Operations-Dub.png',
    imageFocus: 'center 30%',
    show: 'CX Coffee Chat · Concentrix',
    title: 'How dub is making investing accessible',
    description: 'Scaling a community-driven fintech and using AI in customer operations.',
  },
  {
    href: 'https://www.youtube.com/watch?v=-x1IW7Cx53c',
    image: 'https://i.ytimg.com/vi/-x1IW7Cx53c/maxresdefault.jpg',
    show: 'In the Field',
    title: 'Eating an MRE with a U.S. Army pilot',
    description: 'Military-to-civilian transition, fixed-wing aviation, and a second career in tech.',
  },
  {
    href: 'https://www.youtube.com/watch?v=lqyusmbwBR4',
    image: 'https://i.ytimg.com/vi/lqyusmbwBR4/maxresdefault.jpg',
    show: 'Helping The Brave',
    title: 'Veteran transition & leadership',
    description: 'Notes on post-military life and building in the startup ecosystem.',
  },
];

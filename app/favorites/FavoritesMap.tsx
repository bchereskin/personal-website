'use client';

import { useEffect, useState } from 'react';

interface MapSpot {
  name: string;
  note?: string;
  category: string;
  color: string;
  lat: number;
  lng: number;
  url?: string;
}

const spots: MapSpot[] = [
  // Omakase & Sushi
  { name: 'SourAji', note: 'All-you-can-eat omakase and sake', category: 'Omakase', color: '#f59e0b', lat: 40.7265, lng: -73.9838, url: 'https://resy.com/cities/new-york-ny/venues/souraji' },
  { name: 'Kaki Sushi Omakase', note: 'BYOB sake, no corkage', category: 'Omakase', color: '#f59e0b', lat: 40.7178, lng: -73.9901, url: 'https://resy.com/cities/new-york-ny/venues/kaki' },
  { name: 'TSUMO', note: 'Under $60 omakase', category: 'Omakase', color: '#f59e0b', lat: 40.7484, lng: -73.9856 },
  { name: 'Sushi by M', note: 'Two locations — try the party room on 4th', category: 'Omakase', color: '#f59e0b', lat: 40.7320, lng: -73.9927, url: 'http://www.sushibym.com' },
  { name: 'Takumi Omakase', note: 'BYOB, fun vibe', category: 'Omakase', color: '#f59e0b', lat: 40.7185, lng: -73.9986, url: 'https://takumiomakase.com' },
  { name: 'Sushi Dairo', note: 'Phone reservations only', category: 'Omakase', color: '#f59e0b', lat: 40.7268, lng: -73.9863, url: 'https://omakasesushidairo.com' },
  { name: 'Kawa Omakase', note: 'New and up-and-coming', category: 'Omakase', color: '#f59e0b', lat: 40.7614, lng: -73.9857, url: 'https://kawaomakase.com' },
  { name: 'Kissaki Omakase Bowery', note: 'Pulled off regular rotation', category: 'Omakase', color: '#f59e0b', lat: 40.7237, lng: -73.9927 },

  // Korean BBQ
  { name: 'HOWOO', note: 'Favorite KBBQ right now', category: 'KBBQ', color: '#ec4899', lat: 40.7478, lng: -73.9876, url: 'https://www.howoo.nyc' },
  { name: 'NUBIANI', note: 'Hard to get a resy', category: 'KBBQ', color: '#ec4899', lat: 40.7471, lng: -73.9867, url: 'https://www.nubianinyc.com' },
  { name: 'Cote', note: 'Michelin-starred Korean steakhouse', category: 'KBBQ', color: '#ec4899', lat: 40.7408, lng: -73.9832, url: 'https://www.cotekoreansteakhouse.com' },
  { name: 'HYUN', note: 'All-you-can-eat A5 Wagyu', category: 'KBBQ', color: '#ec4899', lat: 40.7477, lng: -73.9870, url: 'https://www.hyunnyc.com' },
  { name: 'New Wonjo', note: 'OG K-town, charcoal, marinated crab', category: 'KBBQ', color: '#ec4899', lat: 40.7479, lng: -73.9878, url: 'https://newwonjo.com' },
  { name: 'Jongro BBQ', note: 'Fun vibes, great for groups', category: 'KBBQ', color: '#ec4899', lat: 40.7481, lng: -73.9873, url: 'https://www.jongrobbqny.com' },

  // Date Night
  { name: 'Noreetuh', note: 'Favorite right now. German wine list.', category: 'Date Night', color: '#8b5cf6', lat: 40.7271, lng: -73.9842, url: 'https://www.noreetuh.com' },
  { name: 'Minetta Tavern', note: 'Red Label Burger — best in NYC', category: 'Date Night', color: '#8b5cf6', lat: 40.7303, lng: -74.0001, url: 'https://www.minettatavernny.com' },
  { name: 'Carbone', note: 'Lives up to the hype', category: 'Date Night', color: '#8b5cf6', lat: 40.7268, lng: -74.0005, url: 'https://carbonenewyork.com' },
  { name: 'Torrisi', note: 'The pasta. That\'s the review.', category: 'Date Night', color: '#8b5cf6', lat: 40.7227, lng: -73.9957, url: 'https://torrisinyc.com' },
  { name: 'COQODAQ', note: 'Best Korean fried chicken ever', category: 'Date Night', color: '#8b5cf6', lat: 40.7406, lng: -73.9904, url: 'https://www.coqodaq.com' },
  { name: 'Bangkok Supper Club', note: 'Arrive at 5, grab a bar seat', category: 'Date Night', color: '#8b5cf6', lat: 40.7380, lng: -74.0065, url: 'https://www.bangkoksupperclubnyc.com' },
  { name: 'Thai Diner', note: 'Best fusion breakfast in the city', category: 'Date Night', color: '#8b5cf6', lat: 40.7191, lng: -73.9951, url: 'https://www.thaidiner.com' },
  { name: 'Mr B Bar', note: 'Sports bar × wine bar', category: 'Date Night', color: '#8b5cf6', lat: 40.7305, lng: -73.9940, url: 'https://mrbbarnyc.com' },
  { name: 'Bar B', note: 'Standing-only Japanese wine bar', category: 'Date Night', color: '#8b5cf6', lat: 40.7260, lng: -73.9920, url: 'https://www.barbnyc.com' },
  { name: 'Dickson\'s Farmstand', note: 'Chelsea Market butcher shop', category: 'Date Night', color: '#8b5cf6', lat: 40.7424, lng: -74.0061, url: 'https://www.dicksonsfarmstand.com' },
  { name: 'Au Cheval', note: 'The burger. Worth the wait.', category: 'Date Night', color: '#8b5cf6', lat: 40.7158, lng: -74.0023, url: 'https://www.auchevaldiner.com/nyc/home' },
  { name: 'Leonetta', note: 'Our large group go-to', category: 'Date Night', color: '#8b5cf6', lat: 40.7454, lng: -73.9805, url: 'https://www.leonettanyc.com' },

  // Wine & Cocktails
  { name: 'La Compagnie des Vins Surnaturels', note: 'Natural wines, NoLita', category: 'Wine', color: '#ef4444', lat: 40.7188, lng: -73.9990, url: 'https://www.compagniedesvinssurnaturels.com/nyc' },
  { name: 'The Ten Bells', note: '$1.50 oyster happy hour', category: 'Wine', color: '#ef4444', lat: 40.7186, lng: -73.9887, url: 'https://tenbellsnyc.com' },
  { name: 'Experimental Cocktail Club', note: 'Hidden below La Compagnie', category: 'Wine', color: '#ef4444', lat: 40.7434, lng: -73.9912, url: 'https://www.experimentalcocktailclub.com/new-york' },
  { name: 'J. Bespoke', note: 'Speakeasy behind a suit shop', category: 'Wine', color: '#ef4444', lat: 40.7427, lng: -73.9849, url: 'https://www.jbespoke.com' },

  // Other Favorites
  { name: 'Keens Steakhouse', note: 'Mutton chop is legendary', category: 'Other', color: '#10b981', lat: 40.7501, lng: -73.9870, url: 'https://www.keens.com' },
  { name: 'Laser Wolf Brooklyn', note: 'Israeli grill, rooftop views', category: 'Other', color: '#10b981', lat: 40.7165, lng: -73.9625, url: 'https://www.laserwolfbrooklyn.com' },
  { name: 'The Lavaux', note: 'Swiss fondue bar', category: 'Other', color: '#10b981', lat: 40.7345, lng: -74.0074, url: 'https://thelavauxwinebar.com' },
  { name: 'ATOBOY', note: 'Korean tasting menu', category: 'Other', color: '#10b981', lat: 40.7441, lng: -73.9836, url: 'https://www.atoboynyc.com' },
  { name: 'Nudibranch', note: 'Tiny, ambitious, unforgettable', category: 'Other', color: '#10b981', lat: 40.7270, lng: -73.9848, url: 'https://nudibranchnyc.com' },
  { name: 'Pig & Khao', note: 'Southeast Asian, now UWS', category: 'Other', color: '#10b981', lat: 40.7843, lng: -73.9753, url: 'https://www.pigandkhao.com' },
  { name: 'OKONOMI / YUJI Ramen', note: 'When ramen is the mood', category: 'Other', color: '#10b981', lat: 40.7087, lng: -73.9461, url: 'https://www.okonomi.us' },
  { name: 'CheLi Manhattan', note: 'Shanghainese heat', category: 'Other', color: '#10b981', lat: 40.7278, lng: -73.9884, url: 'https://www.che-li.com' },
  { name: 'Kisa', note: 'Korean taxi driver diner vibes', category: 'Other', color: '#10b981', lat: 40.7222, lng: -73.9890, url: 'https://www.kisaus.com' },
  { name: 'Odd Sister', note: 'Soho neighborhood spot', category: 'Other', color: '#10b981', lat: 40.7235, lng: -73.9990, url: 'https://www.oddsisternyc.com' },
];

const categories = [
  { name: 'Omakase', color: '#f59e0b', emoji: '🍣' },
  { name: 'KBBQ', color: '#ec4899', emoji: '🥩' },
  { name: 'Date Night', color: '#8b5cf6', emoji: '🕯️' },
  { name: 'Wine', color: '#ef4444', emoji: '🍷' },
  { name: 'Other', color: '#10b981', emoji: '⭐' },
];

export default function FavoritesMap() {
  const [MapComponents, setMapComponents] = useState<{
    MapContainer: typeof import('react-leaflet').MapContainer;
    TileLayer: typeof import('react-leaflet').TileLayer;
    CircleMarker: typeof import('react-leaflet').CircleMarker;
    Popup: typeof import('react-leaflet').Popup;
  } | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    import('react-leaflet').then((mod) => {
      setMapComponents({
        MapContainer: mod.MapContainer,
        TileLayer: mod.TileLayer,
        CircleMarker: mod.CircleMarker,
        Popup: mod.Popup,
      });
    });
    // @ts-expect-error -- CSS module import for side effects
    import('leaflet/dist/leaflet.css');
  }, []);

  const filtered = activeCategory
    ? spots.filter((s) => s.category === activeCategory)
    : spots;

  if (!MapComponents) {
    return (
      <div className="w-full h-[500px] rounded-2xl bg-gray-100 flex items-center justify-center">
        <p className="text-gray-400">Loading map...</p>
      </div>
    );
  }

  const { MapContainer, TileLayer, CircleMarker, Popup } = MapComponents;

  return (
    <div>
      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
            !activeCategory
              ? 'bg-gray-900 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          All ({spots.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeCategory === cat.name
                ? 'text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
            style={activeCategory === cat.name ? { backgroundColor: cat.color } : {}}
          >
            {cat.emoji} {cat.name} ({spots.filter((s) => s.category === cat.name).length})
          </button>
        ))}
      </div>

      {/* Map */}
      <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200">
        <MapContainer
          center={[40.7350, -73.9930]}
          zoom={13}
          style={{ height: '500px', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          {filtered.map((spot) => (
            <CircleMarker
              key={spot.name}
              center={[spot.lat, spot.lng]}
              radius={8}
              pathOptions={{
                fillColor: spot.color,
                color: '#fff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.9,
              }}
            >
              <Popup>
                <div className="min-w-[160px]">
                  <p className="font-bold text-gray-900 text-sm mb-0.5">{spot.name}</p>
                  <p className="text-xs font-medium mb-1" style={{ color: spot.color }}>{spot.category}</p>
                  {spot.note && <p className="text-xs text-gray-500 italic">{spot.note}</p>}
                  {spot.url && (
                    <a
                      href={spot.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                    >
                      Visit website →
                    </a>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

import Navigation from '@/app/components/Navigation';

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            Brett Chereskin
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            COO at dub | West Point Graduate | Army Veteran
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mb-6">
            12-year Army veteran turned tech operator. I bring military precision
            to startup chaos—scaling operations, building teams, and turning
            ambitious visions into reality.
          </p>
          <p className="text-base text-gray-500 max-w-xl">
            Based in New York City. Commercial pilot. Passionate about defense tech,
            fintech, and helping non-technical leaders harness AI.
          </p>
        </div>
      </main>
    </>
  );
}
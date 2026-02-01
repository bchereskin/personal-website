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
          <p className="text-xl text-gray-600 mb-8">
            COO | Advisor | Builder
          </p>
          <p className="text-lg text-gray-500 max-w-2xl">
            Welcome to my digital space. I'm passionate about operations,
            technology, and building great products.
          </p>
        </div>
      </main>
    </>
  );
}
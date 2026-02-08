import Navigation from '@/app/components/Navigation';
import Link from 'next/link';

export default function About() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pt-24 px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              About Me
            </h1>
            <p className="text-xl text-gray-700">
              12-year Army veteran turned tech operator. I bring military precision
              to startup chaos—scaling operations, building teams, and turning
              ambitious visions into reality.
            </p>
          </div>

          {/* Career Journey */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Career Journey
            </h2>
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">Current</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">COO at dub</h3>
                <p className="text-gray-500 text-sm mb-3">New York City</p>
                <p className="text-gray-700">
                  Leading operations at a NYC-based fintech company. I drive growth
                  by building scalable systems, leading cross-functional teams, and
                  turning strategic vision into execution. Focused on creating the
                  operational foundation that enables rapid, sustainable growth.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900">Business Operations at Affirm</h3>
                <p className="text-gray-500 text-sm mb-3">San Francisco Bay Area</p>
                <p className="text-gray-700">
                  Drove operational initiatives at one of the leading buy-now-pay-later
                  fintech companies. Streamlined processes and helped scale the business
                  through a period of rapid growth.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">12 Years</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">U.S. Army Officer</h3>
                <p className="text-gray-500 text-sm mb-3">Multiple Duty Stations</p>
                <p className="text-gray-700">
                  Served 12 years as an Army officer with assignments across the globe.
                  Led teams in high-stakes environments, managed complex operations, and
                  developed the leadership skills that now drive my approach to business.
                </p>
                <p className="text-gray-500 text-sm mt-3">
                  Fort Huachuca, AZ • Hohenfels, Germany • Wiesbaden, Germany • Fort Rucker, AL
                </p>
              </div>
            </div>
          </section>

          {/* Education & Credentials */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Education & Credentials
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-2">West Point</h3>
                <p className="text-gray-500 text-sm mb-3">United States Military Academy • Class of 2006</p>
                <p className="text-gray-700">
                  Four-year undergraduate program combining rigorous academics with
                  military leadership training. Commissioned as an Army officer upon graduation.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Licenses & Certifications</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span><strong>Commercial Pilot</strong> — Fixed Wing & Rotary (FAA)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span><strong>Series 99</strong> — Operations Professional (FINRA)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span><strong>Securities Industry Essentials</strong> (FINRA)</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Advisory & Interests */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Advisory Work
            </h2>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <p className="text-gray-700 mb-4">
                I advise early-stage startups on operations, scaling, and go-to-market
                strategy. My sweet spot is helping founders navigate the transition from
                scrappy startup to structured scale-up—bringing operational rigor without
                killing the speed that makes startups great.
              </p>
              <p className="text-gray-700 mb-4">
                Particular focus areas:
              </p>
              <ul className="space-y-2 text-gray-700 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Defense Tech</strong> — Bridging military needs with startup innovation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Fintech</strong> — Operations at scale in regulated environments</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>AI + Enterprise</strong> — Helping non-technical leaders harness AI</span>
                </li>
              </ul>
              <Link
                href="/contact"
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Get in touch
              </Link>
            </div>
          </section>

          {/* Personal */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Beyond Work
            </h2>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <p className="text-gray-700">
                Based in <strong>New York City</strong>. When I'm not building operations
                or advising startups, you might find me flying (I hold commercial pilot
                licenses in both fixed-wing and rotary aircraft), exploring the city, or
                writing about how non-technical leaders can leverage AI tools to amplify
                their impact.
              </p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

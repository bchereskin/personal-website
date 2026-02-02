import Navigation from '@/app/components/Navigation';

export default function Projects() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pt-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Projects
          </h1>
          <p className="text-xl text-gray-700 mb-12">
            From military operations to startup growth—here's where I've made an impact.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Current Role - dub */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">Current</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                dub
              </h3>
              <p className="text-gray-700 mb-4">
                Chief Operating Officer driving growth and operations at a
                NYC-based fintech company. Building scalable systems,
                leading cross-functional teams, and turning strategy into execution.
              </p>
              <a
                href="https://www.dubapp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Visit dub →
              </a>
            </div>

            {/* Affirm */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">Previous</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Affirm
              </h3>
              <p className="text-gray-700 mb-4">
                Business Operations at one of the leading buy-now-pay-later
                fintech companies. Drove operational initiatives, streamlined
                processes, and helped scale the business through rapid growth.
              </p>
              <a
                href="https://affirm.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Visit Affirm →
              </a>
            </div>

            {/* Military Service */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">12 Years</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                U.S. Army
              </h3>
              <p className="text-gray-700 mb-4">
                West Point graduate (Class of 2006). Served across multiple
                commands including deployments to Germany. Commercial pilot
                certified in both fixed-wing and rotary aircraft.
              </p>
              <span className="text-gray-500 font-medium">
                Ft Huachuca • Hohenfels • Wiesbaden • Fort Rucker
              </span>
            </div>

            {/* Advisory */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Advisory Work
              </h3>
              <p className="text-gray-700 mb-4">
                Advising early-stage startups on operations, scaling, and
                go-to-market strategy. Particular focus on defense tech,
                fintech, and companies building at the intersection of
                AI and enterprise.
              </p>
              <a
                href="/contact"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Get in touch →
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
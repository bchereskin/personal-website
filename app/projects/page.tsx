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
          <p className="text-xl text-gray-600 mb-12">
            Things I've built and companies I've helped grow
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Current Company */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Current Company
              </h3>
              <p className="text-gray-600 mb-4">
                Chief Operating Officer - Leading operations, product strategy, 
                and scaling efforts at [Your Startup Name]
              </p>
              <a 
                href="https://yourcompany.com" 
                target="_blank"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Visit →
              </a>
            </div>

            {/* Previous Work */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Previous Roles
              </h3>
              <p className="text-gray-600 mb-4">
                [Previous Company] - [Your Role]
                <br />
                Key achievements and impact...
              </p>
              <a 
                href="#" 
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Learn more →
              </a>
            </div>

            {/* Personal Projects */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Photo Newsletter Generator
              </h3>
              <p className="text-gray-600 mb-4">
                AI-powered tool to organize photos and generate beautiful 
                newsletter PDFs. Perfect for preschool reports or vacation recaps.
              </p>
              <span className="text-orange-600 font-medium">
                Coming Soon 🚧
              </span>
            </div>

            {/* Add More Projects */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border-2 border-dashed border-gray-300">
              <h3 className="text-2xl font-bold text-gray-400 mb-3">
                More Projects
              </h3>
              <p className="text-gray-400 mb-4">
                Additional projects and consulting work will be added here
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
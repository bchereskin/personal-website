import Navigation from '@/app/components/Navigation';

export default function Contact() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50 pt-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Let's Connect
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Interested in consulting, advisory work, or just want to chat? 
            Reach out through any of these channels.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Email */}
            <a 
              href="mailto:your.email@example.com"
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <div className="text-4xl mb-4">📧</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">your.email@example.com</p>
            </a>

            {/* LinkedIn */}
            <a 
              href="https://linkedin.com/in/yourprofile"
              target="_blank"
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">LinkedIn</h3>
              <p className="text-gray-600">Connect professionally</p>
            </a>

            {/* Twitter/X */}
            <a 
              href="https://twitter.com/yourhandle"
              target="_blank"
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <div className="text-4xl mb-4">🐦</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Twitter</h3>
              <p className="text-gray-600">@yourhandle</p>
            </a>

            {/* Schedule */}
            <a 
              href="https://calendly.com/yourlink"
              target="_blank"
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Schedule a Call</h3>
              <p className="text-gray-600">Book time on my calendar</p>
            </a>
          </div>

          {/* Optional: Simple contact form placeholder */}
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Send a Quick Message
            </h2>
            <p className="text-gray-600 mb-4">
              Want to add a contact form here? We can integrate one in a future iteration 
              using services like Formspree, Netlify Forms, or custom backend logic.
            </p>
            <p className="text-sm text-gray-500">
              For now, the links above are the best way to reach me!
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
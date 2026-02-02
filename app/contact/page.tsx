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

          <div className="grid md:grid-cols-3 gap-8">
            {/* Email */}
            <a
              href="mailto:Brett.Chereskin@gmail.com"
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <div className="text-4xl mb-4">📧</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">Brett.Chereskin@gmail.com</p>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/brettchereskin/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">LinkedIn</h3>
              <p className="text-gray-600">Connect professionally</p>
            </a>

            {/* Twitter/X */}
            <a
              href="https://twitter.com/BChereskin"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <div className="text-4xl mb-4">𝕏</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Twitter / X</h3>
              <p className="text-gray-600">@BChereskin</p>
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
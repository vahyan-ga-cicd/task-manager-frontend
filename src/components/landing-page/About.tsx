export default function About() {
  return (
    <section id="about" className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          
          <div className="mb-12 lg:mb-0 relative">
          
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 transform skew-y-3 sm:skew-y-0 sm:-rotate-3 sm:rounded-3xl opacity-20"></div>
            <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden aspect-square flex items-center justify-center border border-gray-100">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-50 rounded-tr-full opacity-50"></div>
              
              <div className="text-center p-8 z-10">
                <div className="w-24 h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <svg className="w-12 h-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Built for Professionals</h3>
                <p className="mt-2 text-gray-500">Simplify your day with our modern approach to task management.</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">About Us</h2>
            <h3 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              A better way to work
            </h3>
            <p className="mt-6 text-lg text-gray-500 leading-relaxed">
              We started TaskMaster with a simple belief: managing your daily work shouldn&apos;t be a chore. We observed teams struggling with overly complex tools that required days of training, so we built an alternative.
            </p>
            <p className="mt-4 text-lg text-gray-500 leading-relaxed">
              Our refined interface removes distractions, allowing you to focus on executing tasks efficiently. Whether you&apos;re an independent freelancer or a scaling team, our platform adapts to your workflow flawlessly.
            </p>
            
            <div className="mt-8 flex gap-4">
              <div className="flex flex-col">
                <span className="text-4xl font-extrabold text-blue-600">99%</span>
                <span className="mt-1 text-sm font-medium text-gray-500 uppercase tracking-wide">Uptime</span>
              </div>
              <div className="w-px bg-gray-200"></div>
              <div className="flex flex-col">
                <span className="text-4xl font-extrabold text-blue-600">24/7</span>
                <span className="mt-1 text-sm font-medium text-gray-500 uppercase tracking-wide">Support</span>
              </div>
              <div className="w-px bg-gray-200"></div>
              <div className="flex flex-col">
                <span className="text-4xl font-extrabold text-blue-600">10k+</span>
                <span className="mt-1 text-sm font-medium text-gray-500 uppercase tracking-wide">Users</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-24 lg:pt-44 lg:pb-36 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/40">

      {/* Background Blur Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-blue-400/20 blur-3xl opacity-60"></div>
        <div className="absolute top-1/2 -right-32 w-[28rem] h-[28rem] rounded-full bg-indigo-400/20 blur-3xl opacity-60"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">

        {/* Small Badge */}
        <div className="inline-block mb-6 px-4 py-1.5 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
          🚀 Productivity Made Simple
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Manage your tasks
          <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            with ease and clarity
          </span>
        </h1>

        {/* Description */}
        <p className="mt-6 max-w-2xl text-lg md:text-xl text-gray-600 mx-auto leading-relaxed">
          The simple, professional, and powerful way to organize your workflow,
          collaborate with your team, and achieve your goals faster.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-10">
          <Link
            href="/signup"
            className="w-full sm:w-auto px-8 py-4 text-lg font-semibold rounded-full text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1"
          >
            Get Started for Free
          </Link>

          <Link
            href="#features"
            className="w-full sm:w-auto px-8 py-4 text-lg font-semibold rounded-full text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-100 transition-all"
          >
            Learn More
          </Link>
        </div>

        {/* Preview Card */}
        

      </div>
    </section>
  );
}
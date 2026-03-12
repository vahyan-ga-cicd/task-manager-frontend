import Features from "../landing-page/Features";
import Hero from "../landing-page/Hero";
import Navbar from "../landing-page/Navbar";
import About from "../landing-page/About";
import Footer from "../landing-page/Footer";

export default function LandingLayout() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-white selection:bg-blue-200 selection:text-blue-900">
      <Navbar />

      <main className="flex-grow">
        <Hero />
        <Features />
        <About />
      </main>

      <Footer />
    </div>
  );
}

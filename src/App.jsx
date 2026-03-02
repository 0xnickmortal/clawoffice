import Hero from './sections/Hero'
import Features from './sections/Features'
import HowItWorks from './sections/HowItWorks'
import Waitlist from './sections/Waitlist'
import Footer from './sections/Footer'
import ScrollReveal from './components/ScrollReveal'

function App() {
  return (
    <div className="snap-y snap-mandatory h-screen overflow-y-auto scroll-smooth">
      <section id="hero" className="snap-start">
        <Hero />
      </section>

      <section id="features" className="snap-start">
        <ScrollReveal>
          <Features />
        </ScrollReveal>
      </section>

      <section id="how-it-works" className="snap-start">
        <ScrollReveal>
          <HowItWorks />
        </ScrollReveal>
      </section>

      <section id="waitlist" className="snap-start">
        <ScrollReveal>
          <Waitlist />
        </ScrollReveal>
      </section>

      <div className="snap-start">
        <Footer />
      </div>
    </div>
  )
}

export default App

import Hero from './sections/Hero'
import Features from './sections/Features'
import { HowItWorksSection, sections as howItWorksSections } from './sections/HowItWorks'
import Waitlist from './sections/Waitlist'
import Footer from './sections/Footer'
import ScrollReveal from './components/ScrollReveal'
import BrowsePage from './pages/marketplace/BrowsePage'
import CreateListingPage from './pages/marketplace/CreateListingPage'
import ListingDetailPage from './pages/marketplace/ListingDetailPage'
import MyListingsPage from './pages/marketplace/MyListingsPage'

function App() {
  const path = window.location.pathname

  // Marketplace pages
  if (path.startsWith('/marketplace')) {
    if (path === '/marketplace/create') return <CreateListingPage />
    if (path.startsWith('/marketplace/listing/')) return <ListingDetailPage />
    if (path === '/marketplace/my') return <MyListingsPage />
    return <BrowsePage />
  }

  // Landing page
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

      <section id="how-it-works">
        {howItWorksSections.map((section, i) => (
          <HowItWorksSection key={i} section={section} />
        ))}
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

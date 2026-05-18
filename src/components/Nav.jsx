import { useState, useEffect } from 'react'
import PixelIcon from './PixelIcon'

const Nav = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-sv-brown/95 backdrop-blur-md shadow-lg border-b-4 border-sv-wood-dark'
        : 'bg-black/30 backdrop-blur-sm'
    }`}>
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-3 group">
          <span className="text-sv-gold transition-transform duration-200 group-hover:-translate-y-0.5 drop-shadow-[1px_1px_0_rgba(0,0,0,0.6)]">
            <PixelIcon name="logo" size={24} />
          </span>
          <span className="font-[var(--font-pixel)] text-xs text-sv-gold drop-shadow-[1px_1px_0_rgba(0,0,0,0.6)]">
            Open Office
          </span>
        </a>

        <div className="hidden md:flex items-center gap-6 text-sm">
          <a href="#features" className="text-white/80 hover:text-sv-gold transition-colors drop-shadow-[1px_1px_0_rgba(0,0,0,0.4)]">Features</a>
          <a href="#how-it-works" className="text-white/80 hover:text-sv-gold transition-colors drop-shadow-[1px_1px_0_rgba(0,0,0,0.4)]">How It Works</a>
          <a href="#pricing" className="text-white/80 hover:text-sv-gold transition-colors drop-shadow-[1px_1px_0_rgba(0,0,0,0.4)]">Pricing</a>
          <a href="/marketplace" className="text-white/80 hover:text-sv-gold transition-colors drop-shadow-[1px_1px_0_rgba(0,0,0,0.4)]">Marketplace</a>
          <a href="#waitlist" className="sv-btn !text-[10px] !py-2 !px-4 !shadow-none !border-2">
            Join Waitlist
          </a>
        </div>
      </div>
    </nav>
  )
}

export default Nav

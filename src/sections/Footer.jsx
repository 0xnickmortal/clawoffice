import PixelIcon from '../components/PixelIcon'

const Footer = () => {
  return (
    <footer className="py-12 sm:py-16 px-4 sm:px-6 bg-sv-brown text-sv-panel">
      <div className="max-w-6xl mx-auto">
        {/* Main row: three columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 mb-10">
          {/* Brand column */}
          <div>
            <a href="#hero" className="flex items-center gap-3 mb-4 group w-fit">
              <span className="text-sv-gold transition-transform duration-200 group-hover:-translate-y-0.5">
                <PixelIcon name="logo" size={28} />
              </span>
              <span className="font-[var(--font-pixel)] text-xs text-sv-gold">
                Open Office
              </span>
            </a>
            <p className="text-sm text-sv-panel/60 leading-relaxed max-w-xs">
              Your AI team in a pixel-art office. Hire agents, assign roles, watch them collaborate.
            </p>
          </div>

          {/* Sitemap column */}
          <div>
            <p className="font-[var(--font-pixel)] text-[10px] text-sv-gold/80 tracking-widest uppercase mb-4">
              Explore
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#features" className="text-sv-panel/70 hover:text-sv-gold transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-sv-panel/70 hover:text-sv-gold transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-sv-panel/70 hover:text-sv-gold transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="/marketplace" className="text-sv-panel/70 hover:text-sv-gold transition-colors">
                  Marketplace
                </a>
              </li>
              <li>
                <a href="#waitlist" className="text-sv-panel/70 hover:text-sv-gold transition-colors">
                  Join Waitlist
                </a>
              </li>
            </ul>
          </div>

          {/* Community column */}
          <div>
            <p className="font-[var(--font-pixel)] text-[10px] text-sv-gold/80 tracking-widest uppercase mb-4">
              Community
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/nicepkg/openclaw-office"
                  target="_blank"
                  rel="noopener"
                  className="text-sv-panel/70 hover:text-sv-gold transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://discord.gg/rqnTwVS2tB"
                  target="_blank"
                  rel="noopener"
                  className="text-sv-panel/70 hover:text-sv-gold transition-colors"
                >
                  Discord
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@clawdoffice.com"
                  className="text-sv-panel/70 hover:text-sv-gold transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider line — small pixel dashes */}
        <div className="flex gap-1 mb-6 opacity-30">
          {Array.from({ length: 60 }).map((_, i) => (
            <span key={i} className="inline-block w-2 h-px bg-sv-gold" />
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] text-sv-panel/40 font-[var(--font-pixel)]">
            &copy; {new Date().getFullYear()} Open Office
          </p>
          <p className="text-[10px] text-sv-panel/40">
            Made with pixel love.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

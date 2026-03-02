const Footer = () => {
  return (
    <footer className="py-10 px-6 bg-sv-brown text-sv-panel">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="text-xl">🏢</span>
          <span className="font-[var(--font-pixel)] text-[9px] text-sv-gold">ClawdOffice</span>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <a href="https://github.com/nicepkg/openclaw-office" target="_blank" rel="noopener" className="text-sv-panel/70 hover:text-sv-gold transition-colors">
            GitHub
          </a>
          <a href="https://discord.gg/rqnTwVS2tB" target="_blank" rel="noopener" className="text-sv-panel/70 hover:text-sv-gold transition-colors">
            Discord
          </a>
          <a href="mailto:hello@clawdoffice.com" className="text-sv-panel/70 hover:text-sv-gold transition-colors">
            Contact
          </a>
        </div>

        <p className="text-[9px] text-sv-panel/40 font-[var(--font-pixel)]">
          &copy; {new Date().getFullYear()} ClawdOffice
        </p>
      </div>
    </footer>
  )
}

export default Footer

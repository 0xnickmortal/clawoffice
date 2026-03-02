import PixelButton from '../components/PixelButton'
import AnimatedHero from '../components/AnimatedHero'

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background scene */}
      <AnimatedHero />

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        {/* Title */}
        <h1 className="font-[var(--font-pixel)] text-2xl md:text-3xl lg:text-4xl text-white leading-[2] mb-6 drop-shadow-[3px_3px_0_rgba(0,0,0,0.6)]">
          Your OpenClaw Team,
          <br />
          <span className="text-sv-gold drop-shadow-[3px_3px_0_rgba(0,0,0,0.6)]">One Pixel Office</span> Away
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-lg text-white max-w-xl mx-auto mb-10 leading-relaxed drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
          Hire AI agents. Assign roles. Watch them collaborate.
          <br />
          All in a cozy pixel-art office.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <PixelButton href="#waitlist" variant="primary">
            Join the Waitlist
          </PixelButton>
          <PixelButton href="#how-it-works" variant="green">
            See How It Works
          </PixelButton>
        </div>
      </div>
    </section>
  )
}

export default Hero

import { useEffect, useRef } from 'react'
import anime from 'animejs'
import PixelIcon from '../components/PixelIcon'

const features = [
  {
    icon: 'agents',
    title: 'Multi-Agent Teams',
    desc: 'Hire engineers, designers, PMs — each with their own skills and personality.',
    accent: 'text-sv-blue',
  },
  {
    icon: 'brain',
    title: 'Memory & Learning',
    desc: 'Agents remember past conversations and build context over time.',
    accent: 'text-sv-purple',
  },
  {
    icon: 'gamepad',
    title: 'Gamified Office',
    desc: "Watch your agents work in a pixel-art office. It's like Stardew Valley meets AI.",
    accent: 'text-sv-green',
  },
  {
    icon: 'link',
    title: 'Multi-Channel',
    desc: 'Connect Discord, Telegram, or chat directly in the browser.',
    accent: 'text-sv-blue',
  },
  {
    icon: 'handshake',
    title: 'Agent Collaboration',
    desc: 'Agents can delegate tasks, share context, and work together autonomously.',
    accent: 'text-sv-orange',
  },
  {
    icon: 'clipboard',
    title: 'The Talent Board',
    desc: 'Browse community-built agent resumes or publish your own. Hire pre-configured agents with one click.',
    accent: 'text-sv-gold',
  },
]

const Features = () => {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const gridRef = useRef(null)
  const playedRef = useRef(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    // Pre-hide
    const cards = gridRef.current?.querySelectorAll('.feature-card') || []
    cards.forEach((c) => {
      c.style.opacity = '0'
      c.style.transform = 'scale(0.9) translateY(20px)'
    })
    if (headerRef.current) {
      headerRef.current.style.opacity = '0'
      headerRef.current.style.transform = 'translateY(24px)'
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !playedRef.current) {
          playedRef.current = true

          // Header in first
          anime({
            targets: headerRef.current,
            opacity: [0, 1],
            translateY: [24, 0],
            duration: 600,
            easing: 'easeOutQuad',
          })

          // Cards stagger from center, with chunky overshoot
          anime({
            targets: cards,
            opacity: [0, 1],
            scale: [0.9, 1],
            translateY: [20, 0],
            duration: 700,
            delay: anime.stagger(80, { grid: [3, 2], from: 'center', start: 200 }),
            easing: 'easeOutBack',
          })

          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  // Icon pixel-bounce on card hover
  const handleCardEnter = (e) => {
    const icon = e.currentTarget.querySelector('.feature-icon')
    if (!icon) return
    anime.remove(icon)
    anime({
      targets: icon,
      translateY: [
        { value: -6, duration: 120, easing: 'steps(2)' },
        { value: 0, duration: 120, easing: 'steps(2)' },
        { value: -3, duration: 100, easing: 'steps(2)' },
        { value: 0, duration: 100, easing: 'steps(2)' },
      ],
    })
  }

  return (
    <div ref={sectionRef} className="min-h-screen flex items-center py-16 sm:py-24 px-4 sm:px-6 bg-sv-panel">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div ref={headerRef} className="text-center mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="inline-block w-2 h-2 bg-sv-orange" />
            <span className="font-[var(--font-pixel)] text-[10px] text-sv-wood tracking-widest uppercase">
              Features
            </span>
            <span className="inline-block w-2 h-2 bg-sv-orange" />
          </div>
          <h2 className="font-[var(--font-pixel)] text-sm sm:text-lg md:text-xl text-sv-brown mb-4 leading-relaxed">
            Everything You Need
          </h2>
          <p className="text-sm sm:text-base text-sv-text-light max-w-xl mx-auto">
            Build your dream AI team with tools that actually make it fun.
          </p>
        </div>

        {/* Feature grid */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="feature-card sv-box p-5 sm:p-6 hover:-translate-y-1 transition-transform duration-200 cursor-default"
              onMouseEnter={handleCardEnter}
            >
              <div className={`feature-icon mb-3 sm:mb-4 ${f.accent}`}>
                <PixelIcon name={f.icon} size={36} />
              </div>
              <h3 className="font-[var(--font-pixel)] text-[10px] sm:text-xs text-sv-brown mb-2 sm:mb-3 leading-relaxed">
                {f.title}
              </h3>
              <p className="text-sm text-sv-text-light leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Features

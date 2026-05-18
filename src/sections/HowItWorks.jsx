import { useEffect, useRef } from 'react'
import anime from 'animejs'
import PixelIcon from '../components/PixelIcon'

const BLOB_BASE = 'https://tmrogv2sbt3kmiyn.public.blob.vercel-storage.com'

const sections = [
  {
    icon: 'mouse',
    title: 'Deploy Agents in Clicks',
    desc: 'Hire up to 12 agents — each runs its own independent AI gateway. Pick a role, choose a model, and they show up at their desk ready to work.',
    video: `${BLOB_BASE}/deploy-agents.mp4`,
    reverse: false,
  },
  {
    icon: 'bolt',
    title: 'Parallel Multi-Tasking',
    desc: 'Multiple agents work on different projects simultaneously. A frontend dev builds your UI while a backend dev wires up the API — all at the same time.',
    video: `${BLOB_BASE}/parallel-work.mp4`,
    reverse: true,
  },
  {
    icon: 'clipboard',
    title: 'PM Agent Orchestration',
    desc: "The Project Manager doesn't just track tasks — it hires devs, breaks down complex goals, delegates work, and collects results automatically.",
    video: `${BLOB_BASE}/pm-agent.mp4`,
    reverse: false,
  },
  {
    icon: 'loop',
    title: 'Hot-Swap LLM Models',
    desc: 'Switch between Claude, GPT, Gemini, DeepSeek and more mid-conversation. No context lost, no restart needed.',
    video: `${BLOB_BASE}/model-switch.mp4`,
    reverse: true,
  },
  {
    icon: 'brain',
    title: 'Memory Transfer',
    desc: 'Fire an agent and their knowledge stays. Transfer work memory to a new hire so they pick up right where the last one left off.',
    video: `${BLOB_BASE}/memory-transfer.mp4`,
    reverse: false,
  },
  {
    icon: 'gamepad',
    title: 'Discord Integration',
    desc: "@mention any agent in Discord to assign tasks directly. Manage your AI team the same way you'd manage real employees in a company channel.",
    video: `${BLOB_BASE}/discord.mp4`,
    reverse: true,
  },
]

const HowItWorksSection = ({ section, index }) => {
  const ref = useRef(null)
  const textRef = useRef(null)
  const iconRef = useRef(null)
  const videoBoxRef = useRef(null)
  const stepRef = useRef(null)
  const playedRef = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Pre-hide
    const text = textRef.current
    if (text) {
      text.querySelectorAll('.hw-anim').forEach((c) => {
        c.style.opacity = '0'
        c.style.transform = 'translateY(20px)'
      })
    }
    if (iconRef.current) {
      iconRef.current.style.opacity = '0'
      iconRef.current.style.transform = 'scale(0)'
    }
    if (videoBoxRef.current) {
      videoBoxRef.current.style.opacity = '0'
      videoBoxRef.current.style.transform = 'scale(0.96)'
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !playedRef.current) {
          playedRef.current = true

          // Step number — typewriter feel via steps easing
          anime({
            targets: stepRef.current,
            opacity: [0, 1],
            translateX: [-10, 0],
            duration: 400,
            easing: 'steps(6)',
          })

          // Icon pops in with chunky bounce
          anime({
            targets: iconRef.current,
            opacity: [0, 1],
            scale: [0, 1],
            rotate: [-15, 0],
            duration: 700,
            delay: 200,
            easing: 'easeOutBack',
          })

          // Title + description stagger
          anime({
            targets: text.querySelectorAll('.hw-anim'),
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 600,
            delay: anime.stagger(120, { start: 400 }),
            easing: 'easeOutQuad',
          })

          // Video box scales in
          anime({
            targets: videoBoxRef.current,
            opacity: [0, 1],
            scale: [0.96, 1],
            duration: 700,
            delay: 600,
            easing: 'easeOutBack',
          })

          observer.disconnect()
        }
      },
      { threshold: 0.25 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const stepNum = String(index + 1).padStart(2, '0')
  const total = String(sections.length).padStart(2, '0')

  return (
    <div ref={ref} className="min-h-screen flex items-center snap-start px-6 sm:px-10 lg:px-16 bg-sv-panel-dark">
      <div className="max-w-7xl mx-auto w-full">
        <div className={`flex flex-col ${section.reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-10 sm:gap-14`}>
          {/* Text side */}
          <div ref={textRef} className="md:w-5/12 text-center md:text-left">
            {/* Step indicator */}
            <div ref={stepRef} className="font-[var(--font-pixel)] text-[10px] text-sv-wood/70 tracking-widest mb-4 flex items-center justify-center md:justify-start gap-2">
              <span className="text-sv-orange">{stepNum}</span>
              <span className="inline-block w-6 h-px bg-sv-wood/40" />
              <span>{total}</span>
            </div>

            <div className="inline-flex items-center gap-4 mb-5">
              <span ref={iconRef} className="text-sv-orange inline-block">
                <PixelIcon name={section.icon} size={48} />
              </span>
              <h3 className="hw-anim font-[var(--font-pixel)] text-xs sm:text-sm text-sv-brown leading-relaxed text-left">
                {section.title}
              </h3>
            </div>
            <p className="hw-anim text-base sm:text-lg text-sv-text-light leading-relaxed">
              {section.desc}
            </p>
          </div>

          {/* Video side */}
          <div className="md:w-7/12">
            <div ref={videoBoxRef} className="sv-box p-2 sm:p-3">
              <div className="relative w-full bg-black rounded" style={{ aspectRatio: '16 / 9' }}>
                <video
                  className="w-full h-full rounded object-cover"
                  src={section.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster="/screenshots/hero.jpg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Original App.jsx imports `sections` and maps without index — pass index here
const HowItWorksList = () =>
  sections.map((section, i) => <HowItWorksSection key={i} section={section} index={i} />)

export { HowItWorksSection, sections, HowItWorksList }
export default HowItWorksSection

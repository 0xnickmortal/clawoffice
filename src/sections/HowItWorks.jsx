import ScrollReveal from '../components/ScrollReveal'

const BLOB_BASE = 'https://qi4c9kvcmytz7knp.private.blob.vercel-storage.com'

const sections = [
  {
    icon: '🖱️',
    title: 'Deploy Agents in Clicks',
    desc: 'Hire up to 12 agents — each runs its own independent AI gateway. Pick a role, choose a model, and they show up at their desk ready to work.',
    video: `${BLOB_BASE}/deploy-agents.mp4`,
    reverse: false,
  },
  {
    icon: '⚡',
    title: 'Parallel Multi-Tasking',
    desc: 'Multiple agents work on different projects simultaneously. A frontend dev builds your UI while a backend dev wires up the API — all at the same time.',
    video: `${BLOB_BASE}/parallel-work.mp4`,
    reverse: true,
  },
  {
    icon: '📋',
    title: 'PM Agent Orchestration',
    desc: 'The Project Manager doesn\'t just track tasks — it hires devs, breaks down complex goals, delegates work, and collects results automatically.',
    video: `${BLOB_BASE}/pm-agent.mp4`,
    reverse: false,
  },
  {
    icon: '🔄',
    title: 'Hot-Swap LLM Models',
    desc: 'Switch between Claude, GPT, Gemini, DeepSeek and more mid-conversation. No context lost, no restart needed.',
    video: `${BLOB_BASE}/model-switch.mp4`,
    reverse: true,
  },
  {
    icon: '🧠',
    title: 'Memory Transfer',
    desc: 'Fire an agent and their knowledge stays. Transfer work memory to a new hire so they pick up right where the last one left off.',
    video: `${BLOB_BASE}/memory-transfer.mp4`,
    reverse: false,
  },
  {
    icon: '🎮',
    title: 'Discord Integration',
    desc: '@mention any agent in Discord to assign tasks directly. Manage your AI team the same way you\'d manage real employees in a company channel.',
    video: `${BLOB_BASE}/discord.mp4`,
    reverse: true,
  },
]

const HowItWorksSection = ({ section }) => (
  <div className="min-h-screen flex items-center snap-start px-6 sm:px-10 lg:px-16 bg-sv-panel-dark">
    <div className="max-w-7xl mx-auto w-full">
      <ScrollReveal>
        <div className={`flex flex-col ${section.reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-10 sm:gap-14`}>
          {/* Text side */}
          <div className="md:w-5/12 text-center md:text-left">
            <div className="inline-flex items-center gap-3 mb-5">
              <span className="text-4xl sm:text-5xl">{section.icon}</span>
              <h3 className="font-[var(--font-pixel)] text-xs sm:text-sm text-sv-brown leading-relaxed">
                {section.title}
              </h3>
            </div>
            <p className="text-base sm:text-lg text-sv-text-light leading-relaxed">
              {section.desc}
            </p>
          </div>

          {/* Video side */}
          <div className="md:w-7/12">
            <div className="sv-box p-2 sm:p-3">
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
      </ScrollReveal>
    </div>
  </div>
)

export { HowItWorksSection, sections }
export default HowItWorksSection

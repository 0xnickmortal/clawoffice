const features = [
  {
    icon: '🤖',
    title: 'Multi-Agent Teams',
    desc: 'Hire engineers, designers, PMs — each with their own skills and personality.',
    color: 'bg-sv-blue/10 border-sv-blue/30',
  },
  {
    icon: '🧠',
    title: 'Memory & Learning',
    desc: 'Agents remember past conversations and build context over time.',
    color: 'bg-sv-purple/10 border-sv-purple/30',
  },
  {
    icon: '🎮',
    title: 'Gamified Office',
    desc: "Watch your agents work in a pixel-art office. It's like Stardew Valley meets AI.",
    color: 'bg-sv-green/10 border-sv-green/30',
  },
  {
    icon: '🔗',
    title: 'Multi-Channel',
    desc: 'Connect Discord, Telegram, or chat directly in the browser.',
    color: 'bg-sv-blue/10 border-sv-blue/30',
  },
  {
    icon: '🤝',
    title: 'Agent Collaboration',
    desc: 'Agents can delegate tasks, share context, and work together autonomously.',
    color: 'bg-sv-orange/10 border-sv-orange/30',
  },
{
    icon: '📋',
    title: 'The Talent Board',
    desc: 'Browse community-built agent resumes or publish your own. Hire pre-configured agents with one click.',
    color: 'bg-sv-gold/10 border-sv-gold/30',
  },
]

const Features = () => {
  return (
    <div className="min-h-screen flex items-center py-24 px-6 bg-sv-panel">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="font-[var(--font-pixel)] text-[10px] text-sv-wood tracking-widest uppercase">&#9670; Features &#9670;</span>
          </div>
          <h2 className="font-[var(--font-pixel)] text-lg md:text-xl text-sv-brown mb-4 leading-relaxed">
            Everything You Need
          </h2>
          <p className="text-sv-text-light max-w-xl mx-auto">
            Build your dream AI team with tools that actually make it fun.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="sv-box p-6 hover:-translate-y-1 transition-transform duration-200"
            >
              <span className="text-4xl block mb-4">{f.icon}</span>
              <h3 className="font-[var(--font-pixel)] text-[10px] text-sv-brown mb-3 leading-relaxed">{f.title}</h3>
              <p className="text-sm text-sv-text-light leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Features

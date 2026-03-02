const steps = [
  {
    num: '1',
    icon: '🧑‍💼',
    title: 'Hire Your Agents',
    desc: 'Pick a role (engineer, designer, PM), choose an AI model, and give them a name. They show up at their desk, ready to work.',
  },
  {
    num: '2',
    icon: '💬',
    title: 'Assign Tasks',
    desc: 'Chat with your agents directly, or use the project manager to create and delegate tasks automatically.',
  },
  {
    num: '3',
    icon: '👀',
    title: 'Watch Them Work',
    desc: 'See your agents collaborating in real-time in the pixel office. They chat, share files, and deliver results.',
  },
]

const HowItWorks = () => {
  return (
    <div className="min-h-screen flex items-center py-16 sm:py-24 px-4 sm:px-6 bg-sv-panel-dark">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-block mb-4">
            <span className="font-[var(--font-pixel)] text-[10px] text-sv-wood tracking-widest uppercase">&#9670; Guide &#9670;</span>
          </div>
          <h2 className="font-[var(--font-pixel)] text-sm sm:text-lg md:text-xl text-sv-brown mb-4 leading-relaxed">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-sv-text-light">Three steps to your AI-powered office.</p>
        </div>

        {/* Steps */}
        <div className="space-y-6 sm:space-y-8 md:space-y-0 md:grid md:grid-cols-3 md:gap-8 mb-10 sm:mb-16">
          {steps.map((step, i) => (
            <div key={i} className="relative text-center">
              {/* Connector */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-14 left-[60%] w-[80%] border-t-[3px] border-dashed border-sv-wood/30" />
              )}

              {/* Icon box */}
              <div className="relative inline-block mb-4 sm:mb-6">
                <div className="sv-box w-20 h-20 sm:w-28 sm:h-28 flex items-center justify-center">
                  <span className="text-3xl sm:text-5xl">{step.icon}</span>
                </div>
                <span className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-sv-orange border-3 border-[#b85c10] text-white text-[10px] sm:text-xs font-[var(--font-pixel)] flex items-center justify-center shadow-md">
                  {step.num}
                </span>
              </div>

              <h3 className="font-[var(--font-pixel)] text-[10px] sm:text-xs text-sv-brown mb-2 sm:mb-3 leading-relaxed">{step.title}</h3>
              <p className="text-sm text-sv-text-light leading-relaxed max-w-xs mx-auto">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Video preview */}
        <div className="sv-box p-2 sm:p-3 max-w-4xl mx-auto">
          <div className="relative w-full bg-black rounded" style={{ aspectRatio: '16 / 9' }}>
            {/* Replace src with your recorded video */}
            <video
              className="w-full h-full rounded"
              src="/videos/demo.mp4"
              autoPlay
              loop
              muted
              playsInline
              poster="/screenshots/hero.jpg"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HowItWorks

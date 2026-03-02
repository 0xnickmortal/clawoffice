const tiers = [
  {
    name: 'Free',
    icon: '🌱',
    price: '$0',
    period: '/mo',
    desc: 'Try it out',
    accent: false,
    features: [
      '1 agent',
      '50 messages / day',
      'Basic models',
      '1 project',
      'Community support',
    ],
    cta: 'Get Started',
    btnClass: '',
  },
  {
    name: 'Pro',
    icon: '⭐',
    price: '$19',
    period: '/mo',
    desc: 'For solo developers',
    accent: true,
    badge: '★ Most Popular ★',
    features: [
      '5 agents',
      '500 messages / day',
      'All AI models (Claude, GPT, Gemini...)',
      'Unlimited projects',
      'Discord + Telegram',
      'Agent memory & collaboration',
      'Email support',
    ],
    cta: 'Join Waitlist',
    btnClass: 'sv-btn-green',
  },
  {
    name: 'Power',
    icon: '🚀',
    price: '$49',
    period: '/mo',
    desc: 'For power users',
    accent: false,
    features: [
      '15 agents',
      '2,000 messages / day',
      'All models + priority access',
      'Unlimited projects',
      'All channel integrations',
      'Custom roles & webhooks',
      'Priority support',
    ],
    cta: 'Join Waitlist',
    btnClass: '',
  },
]

const Pricing = () => {
  return (
    <div className="min-h-screen flex items-center py-24 px-6 bg-sv-panel">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="font-[var(--font-pixel)] text-[10px] text-sv-wood tracking-widest uppercase">&#9670; Shop &#9670;</span>
          </div>
          <h2 className="font-[var(--font-pixel)] text-lg md:text-xl text-sv-brown mb-4 leading-relaxed">
            Simple Pricing
          </h2>
          <p className="text-sv-text-light max-w-lg mx-auto">
            Start free. Scale when you need to. No hidden fees.
          </p>
        </div>

        {/* Tier cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tiers.map((tier, i) => (
            <div
              key={i}
              className={`relative sv-box p-6 hover:-translate-y-1 transition-transform duration-200 ${
                tier.accent ? '!border-sv-grass ring-2 ring-sv-grass/20' : ''
              }`}
            >
              {tier.badge && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-sv-grass border-2 border-[#356b2c] text-white text-[8px] font-[var(--font-pixel)] rounded whitespace-nowrap shadow-md">
                  {tier.badge}
                </span>
              )}

              <div className="text-center mb-4">
                <span className="text-3xl block mb-2">{tier.icon}</span>
                <h3 className="font-[var(--font-pixel)] text-xs text-sv-brown">{tier.name}</h3>
                <p className="text-xs text-sv-text-light mt-1">{tier.desc}</p>
              </div>

              <div className="text-center mb-6 pb-4 border-b-2 border-dashed border-sv-wood/20">
                <span className="text-4xl font-bold text-sv-brown">{tier.price}</span>
                <span className="text-sv-text-light">{tier.period}</span>
              </div>

              <ul className="space-y-3 mb-6">
                {tier.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-sv-text-light">
                    <span className="text-sv-green font-bold mt-0.5">&#10003;</span>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="#waitlist"
                className={`sv-btn block text-center w-full ${tier.btnClass}`}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Addon */}
        <div className="text-center mt-10">
          <div className="inline-block sv-box !border-2 px-6 py-3">
            <span className="text-sm text-sv-text-light">
              Need more messages? Add-on packs: <strong>500 msgs for $5</strong> &middot; <strong>2,000 msgs for $15</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pricing

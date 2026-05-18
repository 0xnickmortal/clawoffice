import { useState, useEffect, useRef } from 'react'
import anime from 'animejs'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import PixelIcon from '../components/PixelIcon'

// Pixel confetti — renders a burst of square chips from a given origin point.
// Uses anime.js to tween x/y/rotate/opacity on plain divs absolutely positioned in the container.
const launchConfetti = (originEl) => {
  if (!originEl) return
  const rect = originEl.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2

  const layer = document.createElement('div')
  layer.style.cssText = `
    position: fixed; left: 0; top: 0; right: 0; bottom: 0;
    pointer-events: none; z-index: 9999; overflow: hidden;
  `
  document.body.appendChild(layer)

  const colors = ['#f1c40f', '#e67e22', '#27ae60', '#3498db', '#c0392b', '#8e44ad']
  const N = 48
  const chips = []

  for (let i = 0; i < N; i++) {
    const chip = document.createElement('div')
    const size = 6 + Math.floor(Math.random() * 6) // 6–11 px
    chip.style.cssText = `
      position: absolute;
      width: ${size}px; height: ${size}px;
      background: ${colors[i % colors.length]};
      left: ${cx - size / 2}px; top: ${cy - size / 2}px;
      image-rendering: pixelated;
      box-shadow: 1px 1px 0 rgba(0,0,0,0.25);
    `
    layer.appendChild(chip)
    chips.push(chip)
  }

  anime({
    targets: chips,
    translateX: () => anime.random(-260, 260),
    translateY: () => [
      { value: anime.random(-220, -80), duration: 600, easing: 'easeOutQuad' },
      { value: anime.random(180, 320), duration: 900, easing: 'easeInQuad' },
    ],
    rotate: () => anime.random(-540, 540),
    opacity: [
      { value: 1, duration: 100 },
      { value: 1, duration: 1000 },
      { value: 0, duration: 400 },
    ],
    duration: 1500,
    easing: 'linear',
    delay: anime.stagger(8),
    complete: () => layer.remove(),
  })
}

const Waitlist = () => {
  const [email, setEmail] = useState('')
  const [useCase, setUseCase] = useState('')
  const [status, setStatus] = useState('idle')

  const cardRef = useRef(null)
  const successBoxRef = useRef(null)
  const formRef = useRef(null)
  const playedRef = useRef(false)

  // Stagger form fields on mount when visible
  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const items = card.querySelectorAll('.waitlist-anim')
    items.forEach((el) => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(16px)'
    })

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !playedRef.current) {
          playedRef.current = true
          anime({
            targets: items,
            opacity: [0, 1],
            translateY: [16, 0],
            duration: 600,
            delay: anime.stagger(70),
            easing: 'easeOutQuad',
          })
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(card)
    return () => observer.disconnect()
  }, [])

  // When entering success state, animate success card in + fire confetti
  useEffect(() => {
    if (status === 'success' && successBoxRef.current) {
      const items = successBoxRef.current.querySelectorAll('.success-anim')
      items.forEach((el) => {
        el.style.opacity = '0'
        el.style.transform = 'translateY(16px)'
      })
      anime({
        targets: items,
        opacity: [0, 1],
        translateY: [16, 0],
        duration: 600,
        delay: anime.stagger(120),
        easing: 'easeOutBack',
      })
      // Fire confetti from the center of the card
      setTimeout(() => launchConfetti(successBoxRef.current), 150)
    }
  }, [status])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')

    try {
      await addDoc(collection(db, 'waitlist'), {
        email,
        useCase: useCase || null,
        source: 'landing-page',
        createdAt: serverTimestamp(),
      })
      setStatus('success')
      setEmail('')
      setUseCase('')
    } catch (err) {
      console.error('Waitlist error:', err)
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen flex items-center py-16 sm:py-24 px-4 sm:px-6 bg-sv-panel-dark">
      <div className="max-w-xl mx-auto w-full">
        <div ref={cardRef} className="sv-box p-6 sm:p-8 md:p-10">
          {status === 'success' ? (
            <div ref={successBoxRef} className="text-center py-6">
              <div className="success-anim flex justify-center mb-4 text-sv-gold">
                <PixelIcon name="sparkle" size={56} />
              </div>
              <p className="success-anim font-[var(--font-pixel)] text-[10px] text-sv-green mb-2">
                You're in!
              </p>
              <p className="success-anim text-sm text-sv-text-light">
                We'll send you an invite when we launch.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center">
                <div className="waitlist-anim flex justify-center mb-4 text-sv-orange">
                  <PixelIcon name="mail" size={48} />
                </div>
                <h2 className="waitlist-anim font-[var(--font-pixel)] text-xs sm:text-base md:text-lg text-sv-brown mb-3 leading-relaxed">
                  Get Early Access
                </h2>
                <p className="waitlist-anim text-sm sm:text-base text-sv-text-light mb-6 sm:mb-8">
                  Be the first to build your AI office. We'll notify you when we launch.
                </p>
              </div>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                <input
                  className="waitlist-anim w-full px-4 py-3 bg-sv-cream border-3 border-sv-wood rounded text-sv-brown placeholder-sv-text-light/50 focus:border-sv-orange focus:outline-none transition-colors text-sm font-[var(--font-pixel)] text-[10px]"
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <textarea
                  className="waitlist-anim w-full px-4 py-3 bg-sv-cream border-3 border-sv-wood rounded text-sv-brown placeholder-sv-text-light/50 focus:border-sv-orange focus:outline-none transition-colors text-sm resize-none"
                  placeholder="What would you use AI agents for? (optional)"
                  value={useCase}
                  onChange={(e) => setUseCase(e.target.value)}
                  rows={3}
                />

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="waitlist-anim sv-btn sv-btn-green w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? 'Joining...' : 'Join the Waitlist'}
                </button>

                {status === 'error' && (
                  <p className="waitlist-anim text-sm text-sv-red text-center">
                    Something went wrong. Please try again.
                  </p>
                )}

                <p className="waitlist-anim text-[10px] text-sv-text-light/60 text-center">
                  No spam, ever. Unsubscribe anytime.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Waitlist

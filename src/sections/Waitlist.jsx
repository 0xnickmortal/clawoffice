import { useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

const Waitlist = () => {
  const [email, setEmail] = useState('')
  const [useCase, setUseCase] = useState('')
  const [status, setStatus] = useState('idle')

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
        <div className="sv-box p-6 sm:p-8 md:p-10">
          <div className="text-center">
            <span className="text-4xl sm:text-5xl block mb-4">📬</span>
            <h2 className="font-[var(--font-pixel)] text-xs sm:text-base md:text-lg text-sv-brown mb-3 leading-relaxed">
              Get Early Access
            </h2>
            <p className="text-sm sm:text-base text-sv-text-light mb-6 sm:mb-8">
              Be the first to build your AI office. We'll notify you when we launch.
            </p>
          </div>

          {status === 'success' ? (
            <div className="text-center py-6">
              <span className="text-5xl block mb-4">🎉</span>
              <p className="font-[var(--font-pixel)] text-[10px] text-sv-green mb-2">You're in!</p>
              <p className="text-sm text-sv-text-light">We'll send you an invite when we launch.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-sv-cream border-3 border-sv-wood rounded text-sv-brown placeholder-sv-text-light/50 focus:border-sv-orange focus:outline-none transition-colors text-sm font-[var(--font-pixel)] text-[10px]"
              />

              <textarea
                placeholder="What would you use AI agents for? (optional)"
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-sv-cream border-3 border-sv-wood rounded text-sv-brown placeholder-sv-text-light/50 focus:border-sv-orange focus:outline-none transition-colors text-sm resize-none"
              />

              <button
                type="submit"
                disabled={status === 'loading'}
                className="sv-btn sv-btn-green w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Joining...' : '★ Join the Waitlist ★'}
              </button>

              {status === 'error' && (
                <p className="text-sm text-sv-red text-center">Something went wrong. Please try again.</p>
              )}

              <p className="text-[10px] text-sv-text-light/60 text-center">No spam, ever. Unsubscribe anytime.</p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default Waitlist

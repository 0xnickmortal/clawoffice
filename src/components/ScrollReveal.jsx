import { useEffect, useRef } from 'react'
import anime from 'animejs'

/**
 * ScrollReveal — replaces the previous CSS-only fade-up.
 *
 * Drop-in compatible with the old API: <ScrollReveal>{children}</ScrollReveal>
 *
 * Extras:
 *   variant="fade"       (default) — single block fade + slide
 *   variant="stagger"    — child elements stagger in (use stagger="auto" to target
 *                          direct children, or pass a selector string)
 *   variant="pop"        — scale + opacity, with stepped easing (chunky/pixel feel)
 *   delay, duration      — override timing
 *   selector             — for stagger mode, the CSS selector for children
 *
 * The reveal is one-shot: once played, it stays revealed.
 */
const ScrollReveal = ({
  children,
  className = '',
  variant = 'fade',
  delay = 0,
  duration = 700,
  selector = ':scope > *',
  threshold = 0.18,
}) => {
  const ref = useRef(null)
  const playedRef = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Pre-hide
    if (variant === 'stagger') {
      el.querySelectorAll(selector).forEach((child) => {
        child.style.opacity = '0'
        child.style.transform = 'translateY(24px)'
      })
    } else {
      el.style.opacity = '0'
      el.style.transform = variant === 'pop'
        ? 'scale(0.94) translateY(20px)'
        : 'translateY(40px)'
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !playedRef.current) {
          playedRef.current = true

          if (variant === 'stagger') {
            anime({
              targets: el.querySelectorAll(selector),
              opacity: [0, 1],
              translateY: [24, 0],
              duration,
              delay: anime.stagger(80, { start: delay }),
              easing: 'easeOutBack',
            })
          } else if (variant === 'pop') {
            // Stepped easing for pixel feel
            anime({
              targets: el,
              opacity: [0, 1],
              scale: [0.94, 1],
              translateY: [20, 0],
              duration,
              delay,
              easing: 'steps(8)',
            })
          } else {
            anime({
              targets: el,
              opacity: [0, 1],
              translateY: [40, 0],
              duration,
              delay,
              easing: 'easeOutQuad',
            })
          }

          observer.disconnect()
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [variant, delay, duration, selector, threshold])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

export default ScrollReveal

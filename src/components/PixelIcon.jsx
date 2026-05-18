// Pixel-art SVG icons replacing emoji throughout the site.
// All icons share a 16x16 viewBox, built from <rect> blocks so they render
// crisply at any size. fill uses currentColor — control via Tailwind text-* utilities.

const ICONS = {
  // 🏢 → small office building (Nav, Footer, favicon)
  logo: (
    <>
      <rect x="2" y="3" width="12" height="11" />
      <rect x="2" y="2" width="12" height="1" fill="currentColor" opacity="0.6" />
      {/* windows (cut out with bg color via mask) */}
      <rect x="4" y="5" width="2" height="2" fill="var(--color-sv-gold, #f1c40f)" />
      <rect x="7" y="5" width="2" height="2" fill="var(--color-sv-gold, #f1c40f)" />
      <rect x="10" y="5" width="2" height="2" fill="var(--color-sv-gold, #f1c40f)" />
      <rect x="4" y="8" width="2" height="2" fill="var(--color-sv-gold, #f1c40f)" />
      <rect x="10" y="8" width="2" height="2" fill="var(--color-sv-gold, #f1c40f)" />
      {/* door */}
      <rect x="7" y="11" width="2" height="3" fill="var(--color-sv-brown, #5c3a1e)" />
    </>
  ),

  // 🤖 → two pixel agent heads side by side
  agents: (
    <>
      {/* left agent */}
      <rect x="1" y="3" width="6" height="5" />
      <rect x="2" y="4" width="1" height="1" fill="var(--color-sv-cream, #fef9ee)" />
      <rect x="5" y="4" width="1" height="1" fill="var(--color-sv-cream, #fef9ee)" />
      <rect x="2" y="9" width="6" height="5" />
      {/* right agent */}
      <rect x="9" y="3" width="6" height="5" />
      <rect x="10" y="4" width="1" height="1" fill="var(--color-sv-cream, #fef9ee)" />
      <rect x="13" y="4" width="1" height="1" fill="var(--color-sv-cream, #fef9ee)" />
      <rect x="10" y="9" width="6" height="5" />
    </>
  ),

  // 🧠 → pixel brain / connected nodes
  brain: (
    <>
      <rect x="2" y="3" width="3" height="3" />
      <rect x="11" y="3" width="3" height="3" />
      <rect x="6" y="6" width="4" height="4" />
      <rect x="2" y="10" width="3" height="3" />
      <rect x="11" y="10" width="3" height="3" />
      {/* connecting lines */}
      <rect x="5" y="4" width="1" height="1" />
      <rect x="10" y="4" width="1" height="1" />
      <rect x="5" y="11" width="1" height="1" />
      <rect x="10" y="11" width="1" height="1" />
      <rect x="7" y="2" width="2" height="1" />
      <rect x="7" y="13" width="2" height="1" />
    </>
  ),

  // 🎮 → pixel gamepad
  gamepad: (
    <>
      {/* body */}
      <rect x="1" y="6" width="14" height="6" />
      {/* dpad */}
      <rect x="3" y="7" width="3" height="1" fill="var(--color-sv-cream, #fef9ee)" />
      <rect x="4" y="8" width="1" height="3" fill="var(--color-sv-cream, #fef9ee)" />
      <rect x="3" y="10" width="3" height="1" fill="var(--color-sv-cream, #fef9ee)" />
      {/* buttons */}
      <rect x="10" y="7" width="2" height="2" fill="var(--color-sv-red, #c0392b)" />
      <rect x="12" y="9" width="2" height="2" fill="var(--color-sv-green, #27ae60)" />
    </>
  ),

  // 🔗 → pixel chain links
  link: (
    <>
      {/* left link */}
      <rect x="1" y="5" width="6" height="2" />
      <rect x="1" y="9" width="6" height="2" />
      <rect x="1" y="7" width="2" height="2" />
      <rect x="5" y="7" width="2" height="2" />
      {/* right link */}
      <rect x="9" y="5" width="6" height="2" />
      <rect x="9" y="9" width="6" height="2" />
      <rect x="9" y="7" width="2" height="2" />
      <rect x="13" y="7" width="2" height="2" />
      {/* bridge */}
      <rect x="7" y="7" width="2" height="2" />
    </>
  ),

  // 🤝 → two hands meeting in the middle
  handshake: (
    <>
      <rect x="1" y="6" width="6" height="4" />
      <rect x="2" y="5" width="4" height="1" />
      <rect x="2" y="10" width="4" height="1" />
      <rect x="9" y="6" width="6" height="4" />
      <rect x="10" y="5" width="4" height="1" />
      <rect x="10" y="10" width="4" height="1" />
      {/* meeting point */}
      <rect x="6" y="7" width="4" height="2" fill="var(--color-sv-gold, #f1c40f)" />
    </>
  ),

  // 📋 → pixel clipboard
  clipboard: (
    <>
      <rect x="3" y="2" width="10" height="13" />
      <rect x="5" y="1" width="6" height="2" fill="var(--color-sv-brown, #5c3a1e)" />
      <rect x="6" y="0" width="4" height="1" fill="var(--color-sv-brown, #5c3a1e)" />
      {/* lines on paper */}
      <rect x="5" y="5" width="6" height="1" fill="var(--color-sv-cream, #fef9ee)" />
      <rect x="5" y="7" width="6" height="1" fill="var(--color-sv-cream, #fef9ee)" />
      <rect x="5" y="9" width="4" height="1" fill="var(--color-sv-cream, #fef9ee)" />
      <rect x="5" y="11" width="6" height="1" fill="var(--color-sv-cream, #fef9ee)" />
    </>
  ),

  // 🖱️ → pixel mouse cursor
  mouse: (
    <>
      <rect x="3" y="2" width="2" height="2" />
      <rect x="4" y="3" width="2" height="2" />
      <rect x="5" y="4" width="2" height="2" />
      <rect x="6" y="5" width="2" height="2" />
      <rect x="7" y="6" width="2" height="2" />
      <rect x="8" y="7" width="2" height="2" />
      <rect x="3" y="3" width="1" height="9" />
      <rect x="4" y="5" width="1" height="7" />
      <rect x="5" y="6" width="1" height="6" />
      <rect x="6" y="8" width="1" height="4" />
      {/* tail */}
      <rect x="8" y="9" width="2" height="1" />
      <rect x="9" y="10" width="2" height="2" />
      <rect x="10" y="11" width="2" height="3" />
    </>
  ),

  // ⚡ → lightning bolt (chunky pixel)
  bolt: (
    <>
      <rect x="8" y="1" width="4" height="1" />
      <rect x="7" y="2" width="4" height="1" />
      <rect x="6" y="3" width="4" height="1" />
      <rect x="5" y="4" width="4" height="1" />
      <rect x="4" y="5" width="5" height="1" />
      <rect x="3" y="6" width="9" height="1" />
      <rect x="6" y="7" width="6" height="1" />
      <rect x="5" y="8" width="5" height="1" />
      <rect x="4" y="9" width="4" height="1" />
      <rect x="3" y="10" width="4" height="1" />
      <rect x="2" y="11" width="4" height="1" />
      <rect x="2" y="12" width="3" height="1" />
      <rect x="2" y="13" width="2" height="1" />
    </>
  ),

  // 🔄 → loop / refresh arrows
  loop: (
    <>
      {/* top horizontal */}
      <rect x="3" y="3" width="8" height="1" />
      <rect x="3" y="4" width="8" height="1" />
      {/* top-right arrow head */}
      <rect x="10" y="2" width="1" height="1" />
      <rect x="11" y="3" width="2" height="3" />
      <rect x="12" y="6" width="1" height="1" />
      <rect x="10" y="5" width="1" height="1" />
      {/* left side down */}
      <rect x="3" y="5" width="2" height="5" />
      {/* bottom horizontal */}
      <rect x="5" y="11" width="8" height="1" />
      <rect x="5" y="12" width="8" height="1" />
      {/* bottom-left arrow head */}
      <rect x="5" y="13" width="1" height="1" />
      <rect x="3" y="10" width="2" height="3" />
      <rect x="3" y="9" width="1" height="1" />
      <rect x="5" y="10" width="1" height="1" />
    </>
  ),

  // 📬 → pixel mailbox
  mail: (
    <>
      <rect x="1" y="5" width="14" height="9" />
      {/* envelope flap */}
      <rect x="1" y="5" width="14" height="1" />
      <rect x="2" y="6" width="12" height="1" />
      <rect x="3" y="7" width="10" height="1" />
      <rect x="4" y="8" width="8" height="1" />
      <rect x="5" y="9" width="6" height="1" />
      <rect x="6" y="10" width="4" height="1" />
      <rect x="7" y="11" width="2" height="1" />
      {/* flag */}
      <rect x="13" y="2" width="2" height="4" fill="var(--color-sv-red, #c0392b)" />
      <rect x="14" y="2" width="1" height="6" />
    </>
  ),

  // 🎉 → confetti / sparkle (also used standalone for celebrations)
  sparkle: (
    <>
      <rect x="7" y="2" width="2" height="2" />
      <rect x="6" y="3" width="4" height="2" />
      <rect x="2" y="7" width="2" height="2" />
      <rect x="12" y="7" width="2" height="2" />
      <rect x="3" y="6" width="2" height="2" />
      <rect x="11" y="6" width="2" height="2" />
      <rect x="3" y="8" width="2" height="2" />
      <rect x="11" y="8" width="2" height="2" />
      <rect x="6" y="11" width="4" height="2" />
      <rect x="7" y="12" width="2" height="2" />
      {/* center diamond */}
      <rect x="7" y="6" width="2" height="4" fill="var(--color-sv-gold, #f1c40f)" />
      <rect x="6" y="7" width="4" height="2" fill="var(--color-sv-gold, #f1c40f)" />
    </>
  ),
}

const PixelIcon = ({ name, size = 24, className = '', style = {} }) => {
  const icon = ICONS[name]
  if (!icon) {
    if (typeof console !== 'undefined') console.warn(`PixelIcon: unknown icon "${name}"`)
    return null
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      shapeRendering="crispEdges"
      className={className}
      style={{ display: 'inline-block', ...style }}
      aria-hidden="true"
    >
      {icon}
    </svg>
  )
}

export default PixelIcon
export { ICONS }

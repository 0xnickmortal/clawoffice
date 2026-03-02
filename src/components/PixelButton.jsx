const PixelButton = ({ children, onClick, href, variant = 'primary', className = '' }) => {
  const base = 'sv-btn inline-block text-center no-underline'

  const variants = {
    primary: '',
    green: 'sv-btn-green',
    secondary: '!bg-sv-panel !text-sv-brown !border-sv-wood',
  }

  const classes = `${base} ${variants[variant] || ''} ${className}`

  if (href) {
    return <a href={href} className={classes} onClick={onClick}>{children}</a>
  }
  return <button className={classes} onClick={onClick}>{children}</button>
}

export default PixelButton

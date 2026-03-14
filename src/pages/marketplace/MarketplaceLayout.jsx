/**
 * MarketplaceLayout.jsx - Shared layout for marketplace pages
 * Uses SV theme: sv-box, sv-btn, pixel font
 */

import { useState, useEffect } from 'react'
import Nav from '../../components/Nav'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002'

const MarketplaceLayout = ({ children }) => {
  const [balance, setBalance] = useState(0)
  const [user, setUser] = useState(null)

  const getAuthHeaders = () => {
    const token = localStorage.getItem('discord_token')
    return token ? { 'Authorization': `Bearer ${token}` } : {}
  }

  useEffect(() => {
    const stored = localStorage.getItem('discord_user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch { /* ignore */ }
    }

    const token = localStorage.getItem('discord_token')
    if (token) {
      fetch(`${API_BASE_URL}/api/wallet/balance`, { headers: getAuthHeaders() })
        .then(r => r.ok ? r.json() : null)
        .then(data => { if (data) setBalance(data.balance) })
        .catch(() => {})
    }
  }, [])

  const handleTopUp = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/wallet/topup`, {
        method: 'POST',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 1000 }),
      })
      if (res.ok) {
        const data = await res.json()
        setBalance(data.balance)
      }
    } catch { /* ignore */ }
  }

  const pathname = window.location.pathname

  const navLinks = [
    { path: '/marketplace', label: 'Browse' },
    { path: '/marketplace/create', label: 'Create' },
    { path: '/marketplace/my', label: 'My Listings' },
  ]

  const isActive = (linkPath) => {
    if (linkPath === '/marketplace') return pathname === '/marketplace'
    return pathname.startsWith(linkPath)
  }

  return (
    <div className="min-h-screen bg-sv-panel">
      {/* Marketplace Sub-Nav */}
      <nav className="bg-sv-brown border-b-4 border-sv-wood-dark sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Left: Logo + Links */}
          <div className="flex items-center gap-6">
            <a href="/" className="flex items-center gap-2">
              <span className="text-xl">🏢</span>
              <span className="font-[var(--font-pixel)] text-[10px] text-sv-gold drop-shadow-[1px_1px_0_rgba(0,0,0,0.6)]">
                Open Office
              </span>
            </a>
            <div className="hidden sm:flex items-center gap-1">
              {navLinks.map(link => (
                <a
                  key={link.path}
                  href={link.path}
                  className={`px-3 py-1.5 rounded text-xs transition-colors ${
                    isActive(link.path)
                      ? 'text-sv-gold bg-white/10'
                      : 'text-white/70 hover:text-sv-gold hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right: Wallet + User */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-sv-wood/30 px-3 py-1.5 rounded-full border border-sv-gold/20">
              <span className="text-sv-gold font-bold text-xs">$</span>
              <span className="text-sv-gold font-semibold text-xs">{balance.toLocaleString()}</span>
              <button
                className="bg-sv-gold text-sv-brown w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center hover:bg-sv-gold/80 transition"
                onClick={handleTopUp}
                title="Add 1000 credits"
              >+</button>
            </div>
            {user ? (
              <div className="flex items-center gap-2">
                {user.avatar && (
                  <img
                    className="w-7 h-7 rounded-full"
                    src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=32`}
                    alt=""
                  />
                )}
                <span className="text-white/60 text-xs hidden sm:inline">
                  {user.global_name || user.username}
                </span>
              </div>
            ) : (
              <span className="text-white/50 text-xs">Not logged in</span>
            )}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  )
}

export default MarketplaceLayout

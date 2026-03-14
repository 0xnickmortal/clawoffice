/**
 * BrowsePage.jsx - Browse all marketplace listings
 */

import { useState, useEffect, useCallback } from 'react'
import MarketplaceLayout from './MarketplaceLayout'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002'

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'hiring_request', label: '📋 Hiring' },
  { id: 'agent_offering', label: '🤖 Agents' },
]

const BrowsePage = () => {
  const [activeTab, setActiveTab] = useState('all')
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  const getAuthHeaders = () => {
    const token = localStorage.getItem('discord_token')
    return token ? { 'Authorization': `Bearer ${token}` } : {}
  }

  const fetchListings = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ status: 'open' })
      if (activeTab !== 'all') params.set('type', activeTab)

      const res = await fetch(`${API_BASE_URL}/api/marketplace/listings?${params}`, {
        headers: getAuthHeaders(),
      })
      if (res.ok) {
        const data = await res.json()
        setListings(data.listings || [])
      }
    } catch (err) {
      console.error('Failed to fetch listings:', err)
    } finally {
      setLoading(false)
    }
  }, [activeTab])

  useEffect(() => {
    fetchListings()
  }, [fetchListings])

  const filteredListings = search.trim()
    ? listings.filter(l =>
        l.title.toLowerCase().includes(search.toLowerCase()) ||
        l.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()))
      )
    : listings

  return (
    <MarketplaceLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-[var(--font-pixel)] text-lg text-sv-brown mb-2">
          &#9670; Agent Marketplace &#9670;
        </h1>
        <p className="text-sv-text-light text-sm">Browse hiring requests and agent offerings</p>
      </div>

      {/* Search + Tabs + Create */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="text"
          className="bg-white border-2 border-sv-wood/30 rounded px-3 py-2 text-sm text-sv-brown placeholder:text-sv-text-light/50 outline-none focus:border-sv-gold w-64"
          placeholder="Search by title or tag..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex gap-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`px-3 py-2 rounded text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-sv-orange text-white border-2 border-sv-orange shadow-sm'
                  : 'bg-white text-sv-text-light border-2 border-sv-wood/20 hover:border-sv-gold/50'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <a
          href="/marketplace/create"
          className="sv-btn !text-[10px] !py-2 !px-4 ml-auto"
        >
          + New Listing
        </a>
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div className="text-center py-16 text-sv-text-light">Loading...</div>
      ) : filteredListings.length === 0 ? (
        <div className="text-center py-16 text-sv-text-light">
          <p className="text-lg mb-2">No listings found</p>
          <p className="text-sm">Be the first to <a href="/marketplace/create" className="text-sv-orange hover:underline">create a listing</a></p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredListings.map(listing => (
            <a
              key={listing.id}
              href={`/marketplace/listing/${listing.id}`}
              className="sv-box p-4 hover:translate-y-[-2px] transition-transform cursor-pointer block no-underline text-sv-text"
            >
              {/* Type + Status */}
              <div className="flex justify-between items-center mb-3">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                  listing.type === 'hiring_request'
                    ? 'bg-sv-gold/20 text-sv-wood'
                    : 'bg-sv-grass/20 text-sv-grass'
                }`}>
                  {listing.type === 'hiring_request' ? 'HIRING' : 'AGENT'}
                </span>
                <span className={`text-[10px] font-medium ${
                  listing.status === 'open' ? 'text-sv-grass' :
                  listing.status === 'in_negotiation' ? 'text-sv-gold' :
                  listing.status === 'sold' ? 'text-sv-blue' : 'text-sv-red'
                }`}>
                  {listing.status}
                </span>
              </div>

              {/* Title */}
              <div className="font-semibold text-sm mb-1 text-sv-brown">
                {listing.title}
              </div>

              {/* Publisher */}
              <div className="text-xs text-sv-text-light mb-2">
                by {listing.publisherName}
              </div>

              {/* Tags */}
              {listing.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {listing.tags.map(t => (
                    <span key={t} className="text-[10px] bg-sv-panel-dark px-2 py-0.5 rounded-full text-sv-text-light">
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {/* Price + Date */}
              <div className="flex justify-between items-center mt-auto pt-2 border-t border-sv-wood/10">
                <span className="text-sv-orange font-bold text-sm">
                  {listing.askingPrice.toLocaleString()} credits
                  {listing.pricingModel === 'subscription' ? '/mo' : ''}
                </span>
                <span className="text-[10px] text-sv-text-light/50">
                  {new Date(listing.createdAt).toLocaleDateString()}
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </MarketplaceLayout>
  )
}

export default BrowsePage

/**
 * MyListingsPage.jsx - My published listings + my purchases
 */

import { useState, useEffect, useCallback } from 'react'
import MarketplaceLayout from './MarketplaceLayout'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002'

const inputClass = "w-full bg-white border-2 border-sv-wood/30 rounded px-3 py-2.5 text-sm text-sv-brown placeholder:text-sv-text-light/50 outline-none focus:border-sv-gold"

const MyListingsPage = () => {
  const [activeTab, setActiveTab] = useState('listings')
  const [listings, setListings] = useState([])
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  // Deploy modal state
  const [deployModal, setDeployModal] = useState(null) // { purchase, pkgInfo, buyerApiKeys }

  const getAuthHeaders = () => {
    const token = localStorage.getItem('discord_token')
    return token ? { 'Authorization': `Bearer ${token}` } : {}
  }

  const showToast = (message, isError = false) => {
    setToast({ message, isError })
    setTimeout(() => setToast(null), 2500)
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      if (activeTab === 'listings') {
        const res = await fetch(`${API_BASE_URL}/api/marketplace/my/listings`, { headers: getAuthHeaders() })
        if (res.ok) { const data = await res.json(); setListings(data.listings || []) }
      } else {
        const res = await fetch(`${API_BASE_URL}/api/marketplace/my/purchases`, { headers: getAuthHeaders() })
        if (res.ok) { const data = await res.json(); setPurchases(data.purchases || []) }
      }
    } catch (err) {
      console.error('Failed to fetch:', err)
    } finally {
      setLoading(false)
    }
  }, [activeTab])

  useEffect(() => { fetchData() }, [fetchData])

  const startDeploy = async (purchase) => {
    // Fetch package info to check for required API keys
    if (purchase.agentPackageId) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/packages/${purchase.agentPackageId}`, {
          headers: getAuthHeaders()
        })
        if (res.ok) {
          const pkgInfo = await res.json()
          if (pkgInfo.requiredApiKeys && pkgInfo.requiredApiKeys.length > 0) {
            // Show API key configuration modal
            const buyerApiKeys = {}
            pkgInfo.requiredApiKeys.forEach(k => { buyerApiKeys[k] = '' })
            setDeployModal({ purchase, pkgInfo, buyerApiKeys })
            return
          }
        }
      } catch (err) {
        console.error('Failed to fetch package info:', err)
      }
    }
    // No API keys needed, deploy directly
    executeDeploy(purchase, {})
  }

  const executeDeploy = async (purchase, buyerApiKeys) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/marketplace/purchases/${purchase.purchaseId}/instantiate`, {
        method: 'POST',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ buyerApiKeys }),
      })
      if (res.ok) {
        const data = await res.json()
        showToast(`Agent ${data.agent.name} deployed!`)
        setDeployModal(null)
        fetchData()
      } else {
        const err = await res.json()
        showToast(err.error || 'Failed to deploy', true)
      }
    } catch {
      showToast('Failed to deploy agent', true)
    }
  }

  return (
    <MarketplaceLayout>
      <h1 className="font-[var(--font-pixel)] text-lg text-sv-brown mb-6">
        &#9670; My Marketplace &#9670;
      </h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'listings', label: '📄 My Listings' },
          { id: 'purchases', label: '🛒 My Purchases' },
        ].map(tab => (
          <button
            key={tab.id}
            className={`px-4 py-2 rounded text-xs font-medium border-2 transition ${
              activeTab === tab.id
                ? 'bg-sv-orange text-white border-sv-orange'
                : 'bg-white text-sv-text-light border-sv-wood/20 hover:border-sv-gold/50'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >{tab.label}</button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-sv-text-light">Loading...</div>
      ) : activeTab === 'listings' ? (
        /* My Listings */
        listings.length === 0 ? (
          <div className="text-center py-16 text-sv-text-light">
            <p className="mb-2">You have no listings yet.</p>
            <a href="/marketplace/create" className="text-sv-orange hover:underline text-sm">Create your first listing</a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {listings.map(listing => (
              <a
                key={listing.id}
                href={`/marketplace/listing/${listing.id}`}
                className="sv-box p-4 hover:translate-y-[-2px] transition-transform cursor-pointer block no-underline text-sv-text"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    listing.type === 'hiring_request' ? 'bg-sv-gold/20 text-sv-wood' : 'bg-sv-grass/20 text-sv-grass'
                  }`}>
                    {listing.type === 'hiring_request' ? 'HIRING' : 'AGENT'}
                  </span>
                  <span className={`text-[10px] font-medium ${
                    listing.status === 'open' ? 'text-sv-grass' :
                    listing.status === 'sold' ? 'text-sv-blue' : 'text-sv-red'
                  }`}>
                    {listing.status}
                  </span>
                </div>
                <div className="font-semibold text-sm text-sv-brown mb-2">{listing.title}</div>
                <div className="flex justify-between items-center">
                  <span className="text-sv-orange font-bold text-sm">{listing.askingPrice.toLocaleString()} credits</span>
                  <span className="text-[10px] text-sv-text-light/50">{new Date(listing.createdAt).toLocaleDateString()}</span>
                </div>
              </a>
            ))}
          </div>
        )
      ) : (
        /* My Purchases */
        purchases.length === 0 ? (
          <div className="text-center py-16 text-sv-text-light">
            <p className="mb-2">No purchases yet.</p>
            <a href="/marketplace" className="text-sv-orange hover:underline text-sm">Browse the marketplace</a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {purchases.map(p => (
              <div key={p.purchaseId} className="sv-box p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-sm text-sv-brown">{p.listingTitle}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    p.pricingModel === 'subscription' ? 'bg-sv-blue/20 text-sv-blue' : 'bg-sv-grass/20 text-sv-grass'
                  }`}>
                    {p.pricingModel === 'subscription' ? 'SUB' : 'OWNED'}
                  </span>
                </div>
                <div className="text-xs text-sv-text-light mb-1">
                  Purchased: {new Date(p.purchasedAt).toLocaleDateString()}
                </div>
                <div className="text-xs text-sv-text-light mb-3">
                  Deployed: {p.instantiatedAgentIds?.length || 0} times
                </div>
                <button
                  className="sv-btn-green sv-btn !text-[10px] w-full !py-2"
                  onClick={() => startDeploy(p)}
                >
                  Deploy to Office
                </button>
              </div>
            ))}
          </div>
        )
      )}

      {/* Deploy API Key Modal */}
      {deployModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="sv-box p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <h2 className="font-[var(--font-pixel)] text-sm text-sv-brown mb-1">
              Configure API Keys
            </h2>
            <p className="text-[11px] text-sv-text-light mb-4">
              This agent requires API keys to enable certain skills.
              {deployModal.pkgInfo.hasPrefilledKeys && (
                <span className="text-sv-grass ml-1">Some keys are pre-filled by the seller.</span>
              )}
            </p>

            <div className="space-y-3 mb-5">
              {deployModal.pkgInfo.requiredApiKeys.map(keyName => (
                <div key={keyName}>
                  <label className="block text-[11px] font-mono font-semibold text-sv-wood mb-1">
                    {keyName}
                    {deployModal.pkgInfo.hasPrefilledKeys && (
                      <span className="font-sans font-normal text-sv-text-light/60 ml-1">(override seller default)</span>
                    )}
                  </label>
                  <input
                    type="password"
                    className={`${inputClass} !text-xs`}
                    placeholder="Enter your API key..."
                    value={deployModal.buyerApiKeys[keyName] || ''}
                    onChange={e => setDeployModal(prev => ({
                      ...prev,
                      buyerApiKeys: { ...prev.buyerApiKeys, [keyName]: e.target.value }
                    }))}
                  />
                </div>
              ))}
            </div>

            {/* MCP Server info */}
            {deployModal.pkgInfo.mcpServers?.length > 0 && (
              <div className="mb-4">
                <p className="text-[10px] text-sv-text-light/60 mb-1">This agent uses external MCP servers:</p>
                {deployModal.pkgInfo.mcpServers.map((mcp, i) => (
                  <span key={i} className="inline-block text-[10px] bg-sv-blue/10 text-sv-blue px-2 py-0.5 rounded mr-1 mb-1">
                    {mcp.name}
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <button
                className="sv-btn-green sv-btn !text-[10px] flex-1"
                onClick={() => executeDeploy(deployModal.purchase, deployModal.buyerApiKeys)}
              >
                Deploy
              </button>
              <button
                className="sv-btn !text-[10px] flex-1 !bg-white !text-sv-text-light border border-sv-wood/20"
                onClick={() => {
                  // Deploy without buyer keys (use seller defaults)
                  executeDeploy(deployModal.purchase, {})
                }}
              >
                Skip (Use Defaults)
              </button>
              <button
                className="text-xs text-sv-text-light hover:text-sv-red transition px-2"
                onClick={() => setDeployModal(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded text-white text-sm font-medium z-50 ${
          toast.isError ? 'bg-sv-red' : 'bg-sv-grass'
        }`}>
          {toast.message}
        </div>
      )}
    </MarketplaceLayout>
  )
}

export default MyListingsPage

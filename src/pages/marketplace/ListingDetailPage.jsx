/**
 * ListingDetailPage.jsx - View listing details + offer/negotiation
 */

import { useState, useEffect, useCallback } from 'react'
import MarketplaceLayout from './MarketplaceLayout'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002'

const inputClass = "w-full bg-white border-2 border-sv-wood/30 rounded px-3 py-2.5 text-sm text-sv-brown placeholder:text-sv-text-light/50 outline-none focus:border-sv-gold"

const ListingDetailPage = () => {
  const pathParts = window.location.pathname.split('/')
  const listingId = pathParts[pathParts.length - 1]

  const [listing, setListing] = useState(null)
  const [offerPrice, setOfferPrice] = useState('')
  const [offerMessage, setOfferMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState(null)

  const currentUserId = localStorage.getItem('discord_user_id') ||
    JSON.parse(localStorage.getItem('discord_user') || '{}').id

  const getAuthHeaders = () => {
    const token = localStorage.getItem('discord_token')
    return token ? { 'Authorization': `Bearer ${token}` } : {}
  }

  const showToast = (message, isError = false) => {
    setToast({ message, isError })
    setTimeout(() => setToast(null), 2500)
  }

  const fetchListing = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/marketplace/listings/${listingId}`, {
        headers: getAuthHeaders(),
      })
      if (res.ok) {
        const data = await res.json()
        setListing(data.listing)
      }
    } catch (err) {
      console.error('Failed to fetch listing:', err)
    }
  }, [listingId])

  useEffect(() => { fetchListing() }, [fetchListing])

  const handleMakeOffer = async () => {
    if (!offerPrice || Number(offerPrice) <= 0) {
      showToast('Please enter a valid price', true); return
    }
    setSubmitting(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/marketplace/listings/${listingId}/offers`, {
        method: 'POST',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: Number(offerPrice), message: offerMessage.trim() }),
      })
      if (res.ok) {
        showToast('Offer submitted!')
        setOfferPrice(''); setOfferMessage('')
        fetchListing()
      } else {
        const err = await res.json()
        showToast(err.error || 'Failed', true)
      }
    } catch { showToast('Failed to submit offer', true) }
    finally { setSubmitting(false) }
  }

  const handleOfferAction = async (offerId, action, counterPrice, counterMessage) => {
    setSubmitting(true)
    try {
      const body = { action }
      if (action === 'counter') {
        body.counterPrice = Number(counterPrice)
        body.counterMessage = counterMessage || ''
      }
      const res = await fetch(
        `${API_BASE_URL}/api/marketplace/listings/${listingId}/offers/${offerId}`,
        { method: 'PUT', headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
      )
      if (res.ok) {
        const labels = { accept: 'Offer accepted!', reject: 'Offer rejected', counter: 'Counter-offer sent!' }
        showToast(labels[action] || 'Done!')
        fetchListing()
      } else {
        const err = await res.json()
        showToast(err.error || 'Action failed', true)
      }
    } catch { showToast('Action failed', true) }
    finally { setSubmitting(false) }
  }

  if (!listing) {
    return (
      <MarketplaceLayout>
        <div className="text-center py-16 text-sv-text-light">Loading...</div>
      </MarketplaceLayout>
    )
  }

  const isOwner = listing.publisherId === currentUserId
  const isSold = listing.status === 'sold'
  const isClosed = listing.status === 'closed'

  return (
    <MarketplaceLayout>
      {/* Back */}
      <a href="/marketplace" className="text-sm text-sv-text-light hover:text-sv-orange transition inline-block mb-4">
        &larr; Back to Marketplace
      </a>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Info */}
        <div className="flex-[2] min-w-0">
          {/* Type + Status */}
          <div className="flex items-center gap-3 mb-3">
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
              listing.type === 'hiring_request' ? 'bg-sv-gold/20 text-sv-wood' : 'bg-sv-grass/20 text-sv-grass'
            }`}>
              {listing.type === 'hiring_request' ? 'HIRING' : 'AGENT'}
            </span>
            <span className={`text-xs font-medium ${
              listing.status === 'open' ? 'text-sv-grass' :
              listing.status === 'in_negotiation' ? 'text-sv-gold' :
              listing.status === 'sold' ? 'text-sv-blue' : 'text-sv-red'
            }`}>
              {listing.status}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-sv-brown mb-2">{listing.title}</h1>
          <p className="text-sm text-sv-text-light mb-5">
            by {listing.publisherName} &middot; {new Date(listing.createdAt).toLocaleDateString()}
          </p>

          {/* Price */}
          <div className="sv-box inline-block p-4 mb-5">
            <span className="text-xs text-sv-text-light">
              {listing.type === 'hiring_request' ? 'Budget' : 'Price'}
            </span>
            <div className="text-sv-orange text-xl font-bold">
              {listing.askingPrice.toLocaleString()} credits
              {listing.pricingModel === 'subscription' ? '/mo' : ''}
            </div>
          </div>

          {/* Description */}
          {listing.description && (
            <div className="text-sm text-sv-text leading-relaxed mb-5 whitespace-pre-wrap">
              {listing.description}
            </div>
          )}

          {/* Tags */}
          {listing.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-5">
              {listing.tags.map(t => (
                <span key={t} className="text-[10px] bg-sv-panel-dark px-2 py-0.5 rounded-full text-sv-text-light">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right: Offers */}
        <div className="flex-1 min-w-[280px]">
          {/* Make Offer */}
          {!isOwner && !isSold && !isClosed && (
            <div className="sv-box p-4 mb-5">
              <h3 className="font-semibold text-sm text-sv-brown mb-3">Make an Offer</h3>
              <div className="mb-3">
                <input
                  type="number"
                  className={inputClass}
                  placeholder="Your price (credits)"
                  value={offerPrice}
                  onChange={e => setOfferPrice(e.target.value)}
                  min="0"
                />
              </div>
              <div className="mb-3">
                <textarea
                  className={`${inputClass} resize-y`}
                  placeholder="Optional message..."
                  value={offerMessage}
                  onChange={e => setOfferMessage(e.target.value)}
                  rows={2}
                />
              </div>
              <button
                className="sv-btn-green sv-btn !text-[10px] w-full"
                onClick={handleMakeOffer}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Offer'}
              </button>
            </div>
          )}

          {/* Offers List */}
          <h3 className="font-semibold text-sm text-sv-brown mb-3">
            Offers ({listing.offers?.length || 0})
          </h3>

          {listing.offers?.length > 0 ? (
            <div className="flex flex-col gap-3">
              {listing.offers.map(offer => (
                <OfferCard
                  key={offer.offerId}
                  offer={offer}
                  isOwner={isOwner}
                  currentUserId={currentUserId}
                  isSold={isSold}
                  onAction={handleOfferAction}
                  submitting={submitting}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-sv-text-light">No offers yet</p>
          )}
        </div>
      </div>

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

const OfferCard = ({ offer, isOwner, currentUserId, isSold, onAction, submitting }) => {
  const [showCounter, setShowCounter] = useState(false)
  const [counterPrice, setCounterPrice] = useState('')
  const [counterMessage, setCounterMessage] = useState('')

  const isMyOffer = offer.fromUserId === currentUserId
  const isPending = offer.status === 'pending'

  return (
    <div className="sv-box p-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-sv-text-light">
          {offer.fromUserName}
          {offer.isCounter && (
            <span className="ml-1.5 text-[9px] bg-sv-blue/20 text-sv-blue px-1.5 py-0.5 rounded">counter</span>
          )}
        </span>
        <span className={`text-[10px] font-medium ${
          offer.status === 'pending' ? 'text-sv-gold' :
          offer.status === 'accepted' ? 'text-sv-grass' :
          offer.status === 'rejected' ? 'text-sv-red' : 'text-sv-blue'
        }`}>
          {offer.status}
        </span>
      </div>

      <div className="text-sv-orange font-bold text-sm">{offer.price.toLocaleString()} credits</div>
      {offer.message && <div className="text-xs text-sv-text-light mt-1">{offer.message}</div>}
      <div className="text-[10px] text-sv-text-light/50 mt-1">{new Date(offer.createdAt).toLocaleString()}</div>

      {/* Actions */}
      {isPending && !isSold && (
        <div className="flex gap-1.5 mt-2 flex-wrap">
          {isOwner && (
            <>
              <button className="px-2 py-1 rounded text-[10px] font-medium bg-sv-grass text-white hover:bg-sv-grass/80" onClick={() => onAction(offer.offerId, 'accept')} disabled={submitting}>Accept</button>
              <button className="px-2 py-1 rounded text-[10px] font-medium bg-sv-red text-white hover:bg-sv-red/80" onClick={() => onAction(offer.offerId, 'reject')} disabled={submitting}>Reject</button>
              <button className="px-2 py-1 rounded text-[10px] font-medium bg-sv-blue text-white hover:bg-sv-blue/80" onClick={() => setShowCounter(!showCounter)} disabled={submitting}>Counter</button>
            </>
          )}
          {isMyOffer && offer.isCounter && (
            <button className="px-2 py-1 rounded text-[10px] font-medium bg-sv-grass text-white" onClick={() => onAction(offer.offerId, 'accept')} disabled={submitting}>Accept</button>
          )}
        </div>
      )}

      {/* Counter form */}
      {showCounter && (
        <div className="flex gap-1.5 mt-2 flex-wrap">
          <input type="number" className="bg-white border border-sv-wood/30 rounded px-2 py-1 text-xs w-24 outline-none" placeholder="Price" value={counterPrice} onChange={e => setCounterPrice(e.target.value)} min="0" />
          <input type="text" className="bg-white border border-sv-wood/30 rounded px-2 py-1 text-xs flex-1 min-w-20 outline-none" placeholder="Message" value={counterMessage} onChange={e => setCounterMessage(e.target.value)} />
          <button
            className="px-2 py-1 rounded text-[10px] font-medium bg-sv-orange text-white"
            onClick={() => { onAction(offer.offerId, 'counter', counterPrice, counterMessage); setShowCounter(false) }}
            disabled={submitting || !counterPrice}
          >Send</button>
        </div>
      )}
    </div>
  )
}

export default ListingDetailPage

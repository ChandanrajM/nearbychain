"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

interface Shop {
  _id: string
  name: string
  category: string
  rating: number
  distance?: number
  address?: string
  phone?: string
  latitude?: number
  longitude?: number
}

export default function NearbyPage() {
  const [shops, setShops] = useState<Shop[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("distance") // distance, price, rating

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.log("Location error:", error)
          // Default location
          setUserLocation({ lat: 28.6139, lng: 77.2090 }) // Delhi
        }
      )
    }
  }, [])

  // Fetch shops and products
  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/api/shops").then(r => r.json()),
      fetch("http://localhost:5000/api/products").then(r => r.json()).catch(() => [])
    ])
      .then(([shopsData, productsData]) => {
        // Calculate distance for each shop
        const shopsWithDistance = shopsData.map((shop: Shop) => ({
          ...shop,
          distance: userLocation ? calculateDistance(
            userLocation.lat, 
            userLocation.lng, 
            shop.latitude || 28.6139, 
            shop.longitude || 77.2090
          ) : Math.floor(Math.random() * 5000)
        }))
        
        setShops(shopsWithDistance.sort((a: Shop, b: Shop) => (a.distance || 0) - (b.distance || 0)))
        setProducts(productsData)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [userLocation])

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3 // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180
    const φ2 = lat2 * Math.PI / 180
    const Δφ = (lat2 - lat1) * Math.PI / 180
    const Δλ = (lon2 - lon1) * Math.PI / 180

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

    return Math.round(R * c)
  }

  // Filter and sort
  const filteredItems = [...shops, ...products.map(p => ({...p, isProduct: true}))].filter(item => {
    if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) return false
    if (selectedCategory !== "all" && item.category !== selectedCategory) return false
    return true
  })

  if (loading) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="spinner"></div>
          <p>Finding nearby services...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      {/* Header */}
      <section className="nearby-header">
        <div className="nearby-location">
          <span className="location-icon">📍</span>
          <span className="location-text">
            {userLocation ? "Nearby your location" : "Detecting location..."}
          </span>
        </div>
        <h1 className="nearby-title">Discover Nearby</h1>
        <p className="nearby-subtitle">Shops and products within 5km of you</p>
      </section>

      {/* Search & Filters */}
      <section className="nearby-controls">
        <div className="nearby-search">
          <input
            type="text"
            placeholder="Search shops, products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="nearby-search-input"
          />
          <button className="nearby-search-btn">🔍</button>
        </div>
        
        <div className="nearby-filters">
          <div className="nearby-categories">
            {["all", "printing", "electronics", "food", "retail", "services"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`nearby-cat-btn ${selectedCategory === cat ? "active" : ""}`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
          
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="nearby-sort"
          >
            <option value="distance">Sort by: Distance</option>
            <option value="price">Sort by: Price</option>
            <option value="rating">Sort by: Rating</option>
          </select>
        </div>
      </section>

      {/* Quick Links */}
      <section className="nearby-quick-links">
        <Link href="/nearby/shops" className="quick-link-card">
          <span className="quick-link-icon">🏪</span>
          <span className="quick-link-text">View All Shops</span>
          <span className="quick-link-arrow">→</span>
        </Link>
      </section>

      {/* Results */}
      <section className="nearby-results">
        <div className="nearby-section-header">
          <h2>Nearby Shops</h2>
          <Link href="/nearby/shops" className="view-all-link">View all →</Link>
        </div>
        
        {shops.length === 0 ? (
          <div className="nearby-empty">
            <div className="nearby-empty-icon">📍</div>
            <h3>No shops found nearby</h3>
            <p>Try expanding your search area</p>
          </div>
        ) : (
          <div className="nearby-shops-grid">
            {shops.slice(0, 6).map((shop) => (
              <Link 
                href={`/nearby/shops`} 
                key={shop._id}
                className="nearby-shop-card"
              >
                <div className="nearby-shop-image">
                  <div className="nearby-shop-placeholder">
                    {shop.category === "printing" && "🖨️"}
                    {shop.category === "electronics" && "📱"}
                    {shop.category === "food" && "🍔"}
                    {shop.category === "retail" && "🛍️"}
                    {shop.category === "services" && "🔧"}
                    {!shop.category && "🏪"}
                  </div>
                </div>
                <div className="nearby-shop-info">
                  <h3 className="nearby-shop-name">{shop.name}</h3>
                  <div className="nearby-shop-meta">
                    <span className="nearby-shop-distance">
                      {(shop.distance || 0) < 1000 
                        ? `${shop.distance}m` 
                        : `${((shop.distance || 0) / 1000).toFixed(1)}km`} away
                    </span>
                    <span className="nearby-shop-rating">
                      <span className="star">★</span> {shop.rating || "4.5"}
                    </span>
                  </div>
                  <span className="nearby-shop-category">
                    {shop.category ? shop.category.charAt(0).toUpperCase() + shop.category.slice(1) : "Services"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

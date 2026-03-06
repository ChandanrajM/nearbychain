"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import ShopCard from "@/components/ShopCard"

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

export default function NearbyShopsPage() {
  const [shops, setShops] = useState<Shop[]>([])
  const [filteredShops, setFilteredShops] = useState<Shop[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)

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
          setUserLocation({ lat: 28.6139, lng: 77.2090 })
        }
      )
    }
  }, [])

  useEffect(() => {
    fetch("http://localhost:5000/api/shops")
      .then((res) => res.json())
      .then((data) => {
        // Calculate distance for each shop
        const shopsWithDistance = data.map((shop: Shop) => ({
          ...shop,
          distance: userLocation ? calculateDistance(
            userLocation.lat, 
            userLocation.lng, 
            shop.latitude || 28.6139, 
            shop.longitude || 77.2090
          ) : Math.floor(Math.random() * 5000)
        }))
        
        setShops(shopsWithDistance.sort((a: Shop, b: Shop) => (a.distance || 0) - (b.distance || 0)))
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [userLocation])

  // Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3
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

  useEffect(() => {
    let filtered = shops

    if (searchTerm) {
      filtered = filtered.filter((shop) =>
        shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.category?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((shop) => shop.category === selectedCategory)
    }

    setFilteredShops(filtered)
  }, [searchTerm, selectedCategory, shops])

  const categories = ["all", "printing", "electronics", "food", "retail", "services"]

  if (loading) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="spinner"></div>
          <p>Loading nearby shops...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/nearby">Nearby</Link>
        <span>/</span>
        <span>Shops</span>
      </nav>

      {/* Header */}
      <section className="shops-header">
        <div className="shops-header-content">
          <h1 className="shops-title">📍 Nearby Shops</h1>
          <p className="shops-subtitle">
            {userLocation 
              ? `Showing shops near your location` 
              : "Enable location for better results"}
          </p>
        </div>
      </section>

      {/* Map Preview */}
      <section className="map-preview">
        <div className="map-placeholder">
          <div className="map-pin" style={{ top: "30%", left: "20%" }}>
            <span>📍</span>
            <div className="map-pin-label">You</div>
          </div>
          {filteredShops.slice(0, 5).map((shop, index) => (
            <div 
              key={shop._id}
              className="map-pin shop-pin" 
              style={{ 
                top: `${20 + (index * 15)}%`, 
                left: `${30 + (index * 12)}%`,
                animationDelay: `${index * 0.2}s`
              }}
            >
              <span>🏪</span>
              <div className="map-pin-label">{shop.name.slice(0, 8)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Search and Filters */}
      <section className="shops-controls">
        <div className="shops-search">
          <input
            type="text"
            placeholder="Search shops by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="shops-search-input"
          />
          <button className="shops-search-btn">🔍</button>
        </div>
        <div className="shops-filters">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`shops-filter-btn ${selectedCategory === category ? "active" : ""}`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </section>

      {/* Results */}
      <section className="shops-results">
        <p className="shops-count">
          {filteredShops.length} {filteredShops.length === 1 ? "shop" : "shops"} found
          {userLocation && " within 5km"}
        </p>

        {filteredShops.length === 0 ? (
          <div className="shops-empty">
            <div className="shops-empty-icon">🔍</div>
            <h3>No shops found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="shops-list">
            {filteredShops.map((shop) => (
              <ShopCard key={shop._id} shop={shop} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

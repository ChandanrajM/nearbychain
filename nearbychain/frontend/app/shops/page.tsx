"use client"

import { useEffect, useState } from "react"
import ShopCard from "../../components/ShopCard"

export default function ShopsPage() {
  const [shops, setShops] = useState<any[]>([])
  const [filteredShops, setFilteredShops] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    fetch("http://localhost:5000/api/shops")
      .then((res) => res.json())
      .then((data) => {
        setShops(data)
        setFilteredShops(data)
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    let filtered = shops

    if (searchTerm) {
      filtered = filtered.filter(shop =>
        shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.category?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(shop => shop.category === selectedCategory)
    }

    setFilteredShops(filtered)
  }, [searchTerm, selectedCategory, shops])

  const categories = ["all", "printing", "electronics", "food", "retail", "services"]

  if (loading) {
    return (
      <div className="empty-state">
        <div className="spinner"></div>
        <p>Loading shops...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="section-header">
        <h1 className="section-title">Nearby Shops</h1>
        <p className="section-description">
          Discover trusted local service providers in your area
        </p>
      </div>

      {/* Search and Filters */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search shops by name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <div className="filter-buttons">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`filter-btn ${selectedCategory === category ? "active" : ""}`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>
        {filteredShops.length} {filteredShops.length === 1 ? "shop" : "shops"} found
      </p>

      {/* Shops Grid */}
      {filteredShops.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No shops found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid-3">
          {filteredShops.map((shop) => (
            <ShopCard key={shop._id} shop={shop} />
          ))}
        </div>
      )}
    </div>
  )
}
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface Shop {
  _id: string
  name: string
  owner_name: string
  category: string
  approved: boolean
  status: string
  created_at: string
  rating: number
  total_orders: number
}

export default function AdminShopsPage() {
  const [shops, setShops] = useState<Shop[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetch("http://localhost:5000/api/shops")
      .then(res => res.json())
      .then(data => {
        // Add mock data for demo
        const enhancedData = data.map((s: Shop, i: number) => ({
          ...s,
          status: s.approved ? (i % 3 === 0 ? "active" : "inactive") : "pending",
          rating: (3 + Math.random() * 2).toFixed(1),
          total_orders: Math.floor(Math.random() * 100)
        }))
        setShops(enhancedData)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const filteredShops = shops.filter(shop => {
    if (filter === "all") return true
    if (filter === "active") return shop.status === "active"
    if (filter === "pending") return !shop.approved
    if (filter === "blocked") return shop.status === "blocked"
    return true
  }).filter(shop => 
    shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.owner_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    total: shops.length,
    active: shops.filter(s => s.status === "active").length,
    pending: shops.filter(s => !s.approved).length,
    blocked: shops.filter(s => s.status === "blocked").length
  }

  if (loading) {
    return (
      <div className="dashboard-layout">
        <AdminSidebar />
        <main className="dashboard-main">
          <div className="empty-state">
            <div className="spinner"></div>
            <p>Loading shops...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Manage Shops</h1>
            <p className="dashboard-subtitle">View and manage all registered shops</p>
          </div>
        </header>

        {/* Stats */}
        <section className="dashboard-stats-row">
          <div className="stat-pill blue">
            <span className="stat-pill-value">{stats.total}</span>
            <span className="stat-pill-label">Total Shops</span>
          </div>
          <div className="stat-pill green">
            <span className="stat-pill-value">{stats.active}</span>
            <span className="stat-pill-label">Active</span>
          </div>
          <div className="stat-pill yellow">
            <span className="stat-pill-value">{stats.pending}</span>
            <span className="stat-pill-label">Pending</span>
          </div>
          <div className="stat-pill red">
            <span className="stat-pill-value">{stats.blocked}</span>
            <span className="stat-pill-label">Blocked</span>
          </div>
        </section>

        {/* Search & Filters */}
        <section className="filter-bar">
          <input
            type="text"
            placeholder="Search shops..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-sm"
          />
          <div className="filter-pills">
            {["all", "active", "pending", "blocked"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`filter-pill ${filter === f ? "active" : ""}`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </section>

        {/* Shops Table */}
        <section className="dashboard-section">
          <div className="table-container">
            <div className="table-header-bar">
              <span>All Shops</span>
              <span className="count">({filteredShops.length})</span>
            </div>
            
            {filteredShops.length === 0 ? (
              <div className="empty-state-card">
                <div className="empty-icon-large">🏪</div>
                <h3>No shops found</h3>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Shop</th>
                    <th>Owner</th>
                    <th>Category</th>
                    <th>Rating</th>
                    <th>Orders</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredShops.map((shop) => (
                    <tr key={shop._id}>
                      <td className="shop-cell">
                        <div className="shop-avatar">
                          {shop.category === "printing" && "🖨️"}
                          {shop.category === "electronics" && "📱"}
                          {shop.category === "food" && "🍔"}
                          {shop.category === "retail" && "🛍️"}
                          {shop.category === "services" && "🔧"}
                          {!shop.category && "🏪"}
                        </div>
                        <span className="shop-name">{shop.name}</span>
                      </td>
                      <td>{shop.owner_name || "N/A"}</td>
                      <td>{shop.category}</td>
                      <td>⭐ {shop.rating}</td>
                      <td>{shop.total_orders}</td>
                      <td>
                        <span className={`status-pill ${shop.status}`}>
                          {shop.status}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button className="action-icon" title="View">👁️</button>
                          {shop.approved ? (
                            <button className="action-icon" title="Block">🚫</button>
                          ) : (
                            <button className="action-icon" title="Approve">✓</button>
                          )}
                          <button className="action-icon" title="Delete">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

// Admin Sidebar
function AdminSidebar() {
  const pathname = usePathname()
  
  const menuItems = [
    { href: "/admin", label: "Dashboard", icon: "📊" },
    { href: "/admin/shops", label: "Shops", icon: "🏪" },
    { href: "/admin/approvals", label: "Approvals", icon: "✓" },
  ]

  return (
    <aside className="seller-sidebar admin-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">⚙️</div>
        <span className="sidebar-title">Admin Panel</span>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`sidebar-link ${pathname === item.href ? "active" : ""}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <Link href="/" className="sidebar-link">
          <span className="sidebar-icon">🏠</span>
          <span>Back to Home</span>
        </Link>
      </div>
    </aside>
  )
}

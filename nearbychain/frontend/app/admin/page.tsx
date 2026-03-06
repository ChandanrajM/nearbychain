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
  created_at: string
  latitude: number
  longitude: number
}

interface Order {
  _id: string
  status: string
  price: number
}

export default function AdminDashboard() {
  const [shops, setShops] = useState<Shop[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/api/shops").then(r => r.json()),
      fetch("http://localhost:5000/api/orders").then(r => r.json())
    ])
      .then(([shopsData, ordersData]) => {
        setShops(shopsData)
        setOrders(ordersData)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const stats = {
    totalShops: shops.length,
    pendingApprovals: shops.filter(s => !s.approved).length,
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, o) => sum + (o.price || 0), 0)
  }

  if (loading) {
    return (
      <div className="dashboard-layout">
        <AdminSidebar />
        <main className="dashboard-main">
          <div className="empty-state">
            <div className="spinner"></div>
            <p>Loading admin panel...</p>
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
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <div className="dashboard-actions">
            <button className="dashboard-btn-icon">🔔</button>
            <button className="dashboard-btn-icon">👤</button>
          </div>
        </header>

        {/* Stats */}
        <section className="dashboard-stats-grid">
          <div className="dashboard-stat-card blue">
            <div className="stat-icon">🏪</div>
            <div className="stat-content">
              <span className="stat-value">{stats.totalShops}</span>
              <span className="stat-label">Total Shops</span>
            </div>
          </div>
          <div className="dashboard-stat-card yellow">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <span className="stat-value">{stats.pendingApprovals}</span>
              <span className="stat-label">Pending Approvals</span>
            </div>
          </div>
          <div className="dashboard-stat-card green">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <span className="stat-value">{stats.totalOrders}</span>
              <span className="stat-label">Total Orders</span>
            </div>
          </div>
          <div className="dashboard-stat-card purple">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <span className="stat-value">₹{stats.totalRevenue}</span>
              <span className="stat-label">Total Revenue</span>
            </div>
          </div>
        </section>

        {/* Pending Approvals */}
        <section className="dashboard-section">
          <div className="section-header-row">
            <h2>Pending Approvals</h2>
            <Link href="/admin/approvals" className="view-all-link">
              View all →
            </Link>
          </div>
          
          {stats.pendingApprovals === 0 ? (
            <div className="empty-state-card">
              <div className="empty-icon-large">✓</div>
              <h3>All caught up!</h3>
              <p>No pending shop approvals</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Shop Name</th>
                    <th>Owner</th>
                    <th>Category</th>
                    <th>Applied</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {shops.filter(s => !s.approved).slice(0, 5).map((shop) => (
                    <tr key={shop._id}>
                      <td className="shop-name-cell">{shop.name}</td>
                      <td>{shop.owner_name || "N/A"}</td>
                      <td>{shop.category}</td>
                      <td>{new Date(shop.created_at).toLocaleDateString()}</td>
                      <td>
                        <div className="table-actions">
                          <button className="action-btn-sm accept">Approve</button>
                          <button className="action-btn-sm reject">Reject</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Recent Shops */}
        <section className="dashboard-section">
          <div className="section-header-row">
            <h2>Recent Shops</h2>
            <Link href="/admin/shops" className="view-all-link">
              Manage shops →
            </Link>
          </div>
          
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Shop Name</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {shops.slice(0, 5).map((shop) => (
                  <tr key={shop._id}>
                    <td className="shop-name-cell">{shop.name}</td>
                    <td>{shop.category}</td>
                    <td>
                      <span className={`status-pill ${shop.approved ? "active" : "pending"}`}>
                        {shop.approved ? "Active" : "Pending"}
                      </span>
                    </td>
                    <td>{new Date(shop.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className="table-actions">
                        <button className="action-icon" title="View">👁️</button>
                        <button className="action-icon" title="Edit">✏️</button>
                        <button className="action-icon" title="Block">🚫</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}

// Admin Sidebar Component
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

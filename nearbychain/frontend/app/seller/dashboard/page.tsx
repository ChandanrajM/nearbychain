"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface Order {
  _id: string
  service: string
  status: string
  price: number
  createdAt: string
}

export default function SellerDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState({
    totalOrders: 0,
    pending: 0,
    completed: 0,
    revenue: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("http://localhost:5000/api/orders")
      .then(res => res.json())
      .then(data => {
        setOrders(data.slice(0, 5)) // Show last 5 orders
        setStats({
          totalOrders: data.length,
          pending: data.filter((o: Order) => o.status === "pending").length,
          completed: data.filter((o: Order) => o.status === "completed").length,
          revenue: data.reduce((sum: number, o: Order) => sum + (o.price || 0), 0)
        })
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="dashboard-layout">
        <SellerSidebar />
        <main className="dashboard-main">
          <div className="empty-state">
            <div className="spinner"></div>
            <p>Loading dashboard...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="dashboard-layout">
      <SellerSidebar />
      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <div className="dashboard-actions">
            <button className="dashboard-btn-icon">🔔</button>
            <button className="dashboard-btn-icon">👤</button>
          </div>
        </header>

        {/* Stats */}
        <section className="dashboard-stats-grid">
          <div className="dashboard-stat-card blue">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <span className="stat-value">{stats.totalOrders}</span>
              <span className="stat-label">Total Orders</span>
            </div>
          </div>
          <div className="dashboard-stat-card yellow">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <span className="stat-value">{stats.pending}</span>
              <span className="stat-label">Pending</span>
            </div>
          </div>
          <div className="dashboard-stat-card green">
            <div className="stat-icon">✓</div>
            <div className="stat-content">
              <span className="stat-value">{stats.completed}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>
          <div className="dashboard-stat-card purple">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <span className="stat-value">₹{stats.revenue}</span>
              <span className="stat-label">Revenue</span>
            </div>
          </div>
        </section>

        {/* Recent Orders */}
        <section className="dashboard-section">
          <div className="section-header-row">
            <h2>Recent Orders</h2>
            <Link href="/seller/dashboard/orders" className="view-all-link">
              View all →
            </Link>
          </div>
          
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Service</th>
                  <th>Status</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="order-id">#{order._id?.slice(-6)}</td>
                    <td>{order.service}</td>
                    <td>
                      <StatusBadge status={order.status} />
                    </td>
                    <td>₹{order.price}</td>
                    <td>
                      <ActionButton status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="dashboard-section">
          <h2>Quick Actions</h2>
          <div className="quick-actions-grid">
            <Link href="/seller/dashboard/products" className="quick-action-card">
              <span className="quick-action-icon">📦</span>
              <span className="quick-action-text">Manage Products</span>
            </Link>
            <Link href="/seller/dashboard/orders" className="quick-action-card">
              <span className="quick-action-icon">📋</span>
              <span className="quick-action-text">View Orders</span>
            </Link>
            <Link href="/seller/dashboard/analytics" className="quick-action-card">
              <span className="quick-action-icon">📊</span>
              <span className="quick-action-text">Analytics</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}

// Seller Sidebar Component
function SellerSidebar() {
  const pathname = usePathname()
  
  const menuItems = [
    { href: "/seller/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/seller/dashboard/products", label: "Products", icon: "📦" },
    { href: "/seller/dashboard/orders", label: "Orders", icon: "📋" },
    { href: "/seller/dashboard/analytics", label: "Analytics", icon: "📈" },
  ]

  return (
    <aside className="seller-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">🏪</div>
        <span className="sidebar-title">Seller Panel</span>
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
        <button className="sidebar-link logout">
          <span className="sidebar-icon">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "#fbbf24",
    completed: "#22c55e",
    paid: "#3b82f6",
    cancelled: "#ef4444"
  }
  
  return (
    <span 
      className="status-badge"
      style={{ 
        background: `${colors[status] || colors.pending}20`,
        color: colors[status] || colors.pending 
      }}
    >
      {status}
    </span>
  )
}

// Action Button Component
function ActionButton({ status }: { status: string }) {
  const getAction = (s: string) => {
    switch(s.toLowerCase()) {
      case "pending": return "Accept"
      case "paid": return "Ready"
      case "completed": return "Done"
      default: return "View"
    }
  }
  
  return (
    <button className="action-btn-sm">
      {getAction(status)}
    </button>
  )
}

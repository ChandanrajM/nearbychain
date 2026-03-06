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
  customer?: string
}

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    fetch("http://localhost:5000/api/orders")
      .then(res => res.json())
      .then(data => {
        setOrders(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const filteredOrders = orders.filter(order => {
    if (filter === "all") return true
    return order.status === filter
  })

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    completed: orders.filter(o => o.status === "completed").length,
    revenue: orders.reduce((sum, o) => sum + (o.price || 0), 0)
  }

  if (loading) {
    return (
      <div className="dashboard-layout">
        <SellerSidebar />
        <main className="dashboard-main">
          <div className="empty-state">
            <div className="spinner"></div>
            <p>Loading orders...</p>
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
          <div>
            <h1 className="dashboard-title">Orders</h1>
            <p className="dashboard-subtitle">Manage and track customer orders</p>
          </div>
        </header>

        {/* Stats */}
        <section className="dashboard-stats-row">
          <div className="stat-pill blue">
            <span className="stat-pill-value">{stats.total}</span>
            <span className="stat-pill-label">Total Orders</span>
          </div>
          <div className="stat-pill yellow">
            <span className="stat-pill-value">{stats.pending}</span>
            <span className="stat-pill-label">Pending</span>
          </div>
          <div className="stat-pill green">
            <span className="stat-pill-value">{stats.completed}</span>
            <span className="stat-pill-label">Completed</span>
          </div>
          <div className="stat-pill purple">
            <span className="stat-pill-value">₹{stats.revenue}</span>
            <span className="stat-pill-label">Revenue</span>
          </div>
        </section>

        {/* Filters */}
        <section className="filter-bar">
          <div className="filter-pills">
            {["all", "pending", "completed", "cancelled"].map((f) => (
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

        {/* Orders Table */}
        <section className="dashboard-section">
          <div className="table-container">
            <div className="table-header-bar">
              <span>
                {filter === "all" ? "All Orders" : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Orders`}
              </span>
              <span className="count">({filteredOrders.length})</span>
            </div>
            
            {filteredOrders.length === 0 ? (
              <div className="empty-state-card">
                <div className="empty-icon-large">📋</div>
                <h3>No orders found</h3>
                <p>Orders will appear here when customers place them</p>
              </div>
            ) : (
              <table className="table orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Service</th>
                    <th>Status</th>
                    <th>Price</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order._id}>
                      <td className="order-id">#{order._id?.slice(-6)}</td>
                      <td>{order.service}</td>
                      <td>
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="price">₹{order.price}</td>
                      <td className="date">
                        {order.createdAt 
                          ? new Date(order.createdAt).toLocaleDateString() 
                          : "N/A"}
                      </td>
                      <td>
                        <ActionButton status={order.status} />
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
      </div>
    </aside>
  )
}

// Status Badge
function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; color: string }> = {
    pending: { bg: "#fef3c7", color: "#92400e" },
    completed: { bg: "#d1fae5", color: "#065f46" },
    paid: { bg: "#dbeafe", color: "#1e40af" },
    cancelled: { bg: "#fee2e2", color: "#991b1b" }
  }
  
  const style = colors[status] || colors.pending
  
  return (
    <span 
      className="status-badge"
      style={{ background: style.bg, color: style.color }}
    >
      {status}
    </span>
  )
}

// Action Button
function ActionButton({ status }: { status: string }) {
  const getAction = (s: string) => {
    switch(s.toLowerCase()) {
      case "pending": return { text: "Accept", class: "accept" }
      case "paid": return { text: "Ready", class: "ready" }
      case "completed": return { text: "Done", class: "done" }
      default: return { text: "View", class: "view" }
    }
  }
  
  const action = getAction(status)
  
  return (
    <button className={`action-btn-sm ${action.class}`}>
      {action.text}
    </button>
  )
}

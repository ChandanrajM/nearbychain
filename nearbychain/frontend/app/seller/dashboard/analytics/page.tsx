"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function SellerAnalyticsPage() {
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    conversionRate: 0,
    weeklyGrowth: 12,
    monthlyGrowth: 24
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching analytics
    setTimeout(() => {
      setAnalytics({
        totalRevenue: 12500,
        totalOrders: 48,
        averageOrderValue: 260,
        conversionRate: 3.2,
        weeklyGrowth: 12,
        monthlyGrowth: 24
      })
      setLoading(false)
    }, 500)
  }, [])

  if (loading) {
    return (
      <div className="dashboard-layout">
        <SellerSidebar />
        <main className="dashboard-main">
          <div className="empty-state">
            <div className="spinner"></div>
            <p>Loading analytics...</p>
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
            <h1 className="dashboard-title">Analytics</h1>
            <p className="dashboard-subtitle">Track your business performance</p>
          </div>
        </header>

        {/* Overview Cards */}
        <section className="analytics-grid">
          <div className="analytics-card primary">
            <div className="analytics-card-header">
              <span className="analytics-label">Total Revenue</span>
              <span className="analytics-growth positive">+{analytics.monthlyGrowth}%</span>
            </div>
            <div className="analytics-value">₹{analytics.totalRevenue.toLocaleString()}</div>
            <div className="analytics-comparison">vs last month</div>
          </div>

          <div className="analytics-card">
            <div className="analytics-card-header">
              <span className="analytics-label">Total Orders</span>
              <span className="analytics-growth positive">+{analytics.weeklyGrowth}%</span>
            </div>
            <div className="analytics-value">{analytics.totalOrders}</div>
            <div className="analytics-comparison">vs last week</div>
          </div>

          <div className="analytics-card">
            <div className="analytics-card-header">
              <span className="analytics-label">Avg Order Value</span>
            </div>
            <div className="analytics-value">₹{analytics.averageOrderValue}</div>
          </div>

          <div className="analytics-card">
            <div className="analytics-card-header">
              <span className="analytics-label">Conversion Rate</span>
            </div>
            <div className="analytics-value">{analytics.conversionRate}%</div>
          </div>
        </section>

        {/* Charts Section */}
        <section className="dashboard-section">
          <h2>Revenue Overview</h2>
          <div className="chart-container">
            <div className="chart-placeholder">
              <div className="chart-bars">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((height, i) => (
                  <div 
                    key={i} 
                    className="chart-bar"
                    style={{ height: `${height}%`, animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
              <div className="chart-labels">
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => (
                  <span key={m}>{m}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Top Products */}
        <section className="dashboard-section">
          <h2>Top Products</h2>
          <div className="top-products-list">
            {[
              { name: "A4 Printing", sales: 24, revenue: 1200 },
              { name: "Document Binding", sales: 18, revenue: 900 },
              { name: "Lamination", sales: 15, revenue: 750 },
              { name: "Photo Print", sales: 12, revenue: 600 },
            ].map((product, index) => (
              <div key={index} className="top-product-item">
                <div className="top-product-rank">#{index + 1}</div>
                <div className="top-product-info">
                  <span className="top-product-name">{product.name}</span>
                  <span className="top-product-sales">{product.sales} sales</span>
                </div>
                <div className="top-product-revenue">₹{product.revenue}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="dashboard-section">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {[
              { type: "order", text: "New order #1234 received", time: "2 min ago" },
              { type: "review", text: "New 5-star review", time: "15 min ago" },
              { type: "stock", text: "Low stock alert: A4 Paper", time: "1 hour ago" },
              { type: "order", text: "Order #1233 completed", time: "2 hours ago" },
            ].map((activity, index) => (
              <div key={index} className="activity-item">
                <div className={`activity-icon ${activity.type}`}>
                  {activity.type === "order" && "📦"}
                  {activity.type === "review" && "⭐"}
                  {activity.type === "stock" && "⚠️"}
                </div>
                <div className="activity-content">
                  <span className="activity-text">{activity.text}</span>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
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

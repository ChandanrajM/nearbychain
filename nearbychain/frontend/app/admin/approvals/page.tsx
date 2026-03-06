"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface ShopApplication {
  _id: string
  name: string
  owner_name: string
  email: string
  phone: string
  category: string
  address: string
  applied_date: string
  documents: string[]
}

export default function AdminApprovalsPage() {
  const [applications, setApplications] = useState<ShopApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    // Fetch pending applications
    fetch("http://localhost:5000/api/shops?approved=false")
      .then(res => res.json())
      .then(data => {
        // Add mock data for demo
        const mockData = data.length > 0 ? data : [
          {
            _id: "app1",
            name: "QuickPrint Solutions",
            owner_name: "Rahul Sharma",
            email: "rahul@quickprint.com",
            phone: "+91 98765 43210",
            category: "printing",
            address: "123 Main Street, Delhi",
            applied_date: "2024-01-15",
            documents: ["ID Proof", "Business License"]
          },
          {
            _id: "app2",
            name: "TechFix Electronics",
            owner_name: "Priya Patel",
            email: "priya@techfix.com",
            phone: "+91 98765 43211",
            category: "electronics",
            address: "456 Market Road, Mumbai",
            applied_date: "2024-01-14",
            documents: ["ID Proof", "GST Certificate"]
          },
          {
            _id: "app3",
            name: "Fresh Bites Cafe",
            owner_name: "Amit Kumar",
            email: "amit@freshbites.com",
            phone: "+91 98765 43212",
            category: "food",
            address: "789 Food Lane, Bangalore",
            applied_date: "2024-01-13",
            documents: ["ID Proof", "FSSAI License"]
          }
        ]
        setApplications(mockData)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const handleApprove = async (id: string) => {
    setProcessing(id)
    // Simulate API call
    setTimeout(() => {
      setApplications(prev => prev.filter(app => app._id !== id))
      setProcessing(null)
    }, 1000)
  }

  const handleReject = async (id: string) => {
    setProcessing(id)
    // Simulate API call
    setTimeout(() => {
      setApplications(prev => prev.filter(app => app._id !== id))
      setProcessing(null)
    }, 1000)
  }

  if (loading) {
    return (
      <div className="dashboard-layout">
        <AdminSidebar />
        <main className="dashboard-main">
          <div className="empty-state">
            <div className="spinner"></div>
            <p>Loading applications...</p>
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
            <h1 className="dashboard-title">Pending Approvals</h1>
            <p className="dashboard-subtitle">
              Review and approve new shop applications
            </p>
          </div>
          <div className="approval-stats">
            <span className="stat-badge">
              {applications.length} pending
            </span>
          </div>
        </header>

        {/* Applications List */}
        <section className="dashboard-section">
          {applications.length === 0 ? (
            <div className="empty-state-card">
              <div className="empty-icon-large">✓</div>
              <h3>All caught up!</h3>
              <p>No pending shop applications to review</p>
            </div>
          ) : (
            <div className="applications-list">
              {applications.map((app) => (
                <div key={app._id} className="application-card">
                  <div className="application-header">
                    <div className="application-shop">
                      <div className="shop-avatar-lg">
                        {app.category === "printing" && "🖨️"}
                        {app.category === "electronics" && "📱"}
                        {app.category === "food" && "🍔"}
                        {app.category === "retail" && "🛍️"}
                        {app.category === "services" && "🔧"}
                      </div>
                      <div className="shop-info">
                        <h3>{app.name}</h3>
                        <span className="category-badge">{app.category}</span>
                      </div>
                    </div>
                    <span className="application-date">
                      Applied {new Date(app.applied_date).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="application-body">
                    <div className="info-row">
                      <span className="info-label">Owner:</span>
                      <span className="info-value">{app.owner_name}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Email:</span>
                      <span className="info-value">{app.email}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Phone:</span>
                      <span className="info-value">{app.phone}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Address:</span>
                      <span className="info-value">{app.address}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Documents:</span>
                      <div className="documents-list">
                        {app.documents.map((doc, i) => (
                          <span key={i} className="document-tag">{doc}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="application-actions">
                    <button 
                      className="btn btn-secondary"
                      onClick={() => handleReject(app._id)}
                      disabled={processing === app._id}
                    >
                      {processing === app._id ? "Processing..." : "Reject"}
                    </button>
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleApprove(app._id)}
                      disabled={processing === app._id}
                    >
                      {processing === app._id ? "Processing..." : "Approve"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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

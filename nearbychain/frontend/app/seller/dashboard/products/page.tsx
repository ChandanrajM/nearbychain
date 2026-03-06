"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface Product {
  _id: string
  name: string
  price: number
  stock: number
  category: string
  status: string
}

export default function SellerProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data)
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
            <p>Loading products...</p>
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
            <h1 className="dashboard-title">Products</h1>
            <p className="dashboard-subtitle">Manage your product listings</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            + Add Product
          </button>
        </header>

        {/* Products Stats */}
        <section className="dashboard-stats-row">
          <div className="stat-pill">
            <span className="stat-pill-value">{products.length}</span>
            <span className="stat-pill-label">Total Products</span>
          </div>
          <div className="stat-pill">
            <span className="stat-pill-value">
              {products.filter(p => p.status === "active").length}
            </span>
            <span className="stat-pill-label">Active</span>
          </div>
          <div className="stat-pill">
            <span className="stat-pill-value">
              {products.filter(p => p.stock === 0).length}
            </span>
            <span className="stat-pill-label">Out of Stock</span>
          </div>
        </section>

        {/* Products Table */}
        <section className="dashboard-section">
          {products.length === 0 ? (
            <div className="empty-state-card">
              <div className="empty-icon-large">📦</div>
              <h3>No products yet</h3>
              <p>Add your first product to start selling</p>
              <button 
                className="btn btn-primary"
                onClick={() => setShowAddModal(true)}
              >
                Add Product
              </button>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <div className="product-cell">
                          <div className="product-thumb">
                            {product.category === "printing" && "🖨️"}
                            {product.category === "electronics" && "📱"}
                            {product.category === "food" && "🍔"}
                            {product.category === "retail" && "🛍️"}
                            {product.category === "services" && "🔧"}
                          </div>
                          <span className="product-name">{product.name}</span>
                        </div>
                      </td>
                      <td>{product.category}</td>
                      <td>₹{product.price}</td>
                      <td>
                        <span className={`stock-badge ${product.stock === 0 ? "out" : product.stock < 5 ? "low" : "in"}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td>
                        <span className={`status-pill ${product.status}`}>
                          {product.status}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button className="action-icon" title="Edit">✏️</button>
                          <button className="action-icon" title="Delete">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Product</h3>
              <button onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <form className="modal-body">
              <div className="form-group">
                <label>Product Name</label>
                <input type="text" placeholder="Enter product name" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input type="number" placeholder="0.00" />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input type="number" placeholder="0" />
                </div>
              </div>
              <div className="form-group">
                <label>Category</label>
                <select>
                  <option>Printing</option>
                  <option>Electronics</option>
                  <option>Food</option>
                  <option>Retail</option>
                  <option>Services</option>
                </select>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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

"use client"

import { useEffect, useState } from "react"

interface Order {
  _id?: string
  id?: string
  service: string
  status: string
  price: number
  createdAt?: string
}

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState("all")

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
    if (selectedFilter === "all") return true
    return order.status === selectedFilter
  })

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    completed: orders.filter(o => o.status === "completed").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
    totalRevenue: orders.reduce((sum, order) => sum + (order.price || 0), 0)
  }

  const getStatusClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed": return "status-badge completed"
      case "pending": return "status-badge pending"
      case "cancelled": return "status-badge cancelled"
      default: return "status-badge pending"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed": return "✓"
      case "pending": return "⏳"
      case "cancelled": return "✕"
      default: return "⏳"
    }
  }

  if (loading) {
    return (
      <div className="empty-state">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="section-header">
        <h1 className="section-title">Orders Dashboard</h1>
        <p className="section-description">
          Track and manage all your service orders in one place
        </p>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-card-icon blue">📋</div>
          <div className="stat-card-content">
            <div className="stat-card-value">{stats.total}</div>
            <div className="stat-card-label">Total Orders</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon yellow">⏳</div>
          <div className="stat-card-content">
            <div className="stat-card-value">{stats.pending}</div>
            <div className="stat-card-label">Pending</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon green">✓</div>
          <div className="stat-card-content">
            <div className="stat-card-value">{stats.completed}</div>
            <div className="stat-card-label">Completed</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon red">💰</div>
          <div className="stat-card-content">
            <div className="stat-card-value">${stats.totalRevenue}</div>
            <div className="stat-card-label">Revenue</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="search-bar">
        <div className="filter-buttons">
          {["all", "pending", "completed", "cancelled"].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`filter-btn ${selectedFilter === filter ? "active" : ""}`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="table-container">
        <div className="table-header">
          {selectedFilter === "all" ? "All Orders" : `${selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)} Orders`}
          <span style={{ color: "var(--text-muted)", marginLeft: "0.5rem" }}>({filteredOrders.length})</span>
        </div>
        
        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No orders found</h3>
            <p>{selectedFilter === "all" ? "No orders have been placed yet" : `No ${selectedFilter} orders found`}</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Service</th>
                <th>Status</th>
                <th>Price</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td style={{ fontFamily: "monospace" }}>#{order._id?.slice(-6) || order.id}</td>
                  <td>{order.service}</td>
                  <td>
                    <span className={getStatusClass(order.status)}>
                      {getStatusIcon(order.status)} {order.status}
                    </span>
                  </td>
                  <td>${order.price}</td>
                  <td style={{ color: "var(--text-muted)" }}>
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
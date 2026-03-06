"use client"

import { useState } from "react"
import Link from "next/link"

export default function SellerLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    // Simulate login - in production, this would call your auth API
    setTimeout(() => {
      setLoading(false)
      // For demo, just redirect
      window.location.href = "/seller/dashboard"
    }, 1000)
  }

  return (
    <div className="page-container">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">🏪</div>
            <h1 className="auth-title">Seller Login</h1>
            <p className="auth-subtitle">Access your seller dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seller@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button 
              type="submit" 
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <Link href="/seller/register">Register</Link></p>
            <Link href="/" className="back-link">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useWallet } from "@/hooks/useWallet";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"buyer" | "seller">("buyer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const {
    ethAddress,
    ethBalance,
    connectMetaMask,
    isMetaMaskConnecting,
    algoAddress,
    algoBalance,
    connectAlgorand,
    isAlgorandConnecting,
    isConnected,
    activeWallet,
  } = useWallet();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    // Simulate login - in production, this would call your auth API
    setTimeout(() => {
      setLoading(false);
      window.location.href = activeTab === "seller" ? "/seller/dashboard" : "/nearby";
    }, 1000);
  };

  return (
    <div className="page-container">
      <div className="auth-container">
        <div className="auth-card wallet-auth">
          <div className="auth-header">
            <div className="auth-icon">🔗</div>
            <h1 className="auth-title">Welcome to NearbyChain</h1>
            <p className="auth-subtitle">
              Connect your wallet or sign in with email
            </p>
          </div>

          {/* Role Tabs */}
          <div className="role-tabs">
            <button
              className={`role-tab ${activeTab === "buyer" ? "active" : ""}`}
              onClick={() => setActiveTab("buyer")}
            >
              🛒 Buyer
            </button>
            <button
              className={`role-tab ${activeTab === "seller" ? "active" : ""}`}
              onClick={() => setActiveTab("seller")}
            >
              🏪 Seller
            </button>
          </div>

          {/* Wallet Connection Section */}
          <div className="wallet-section">
            <h3 className="wallet-section-title">Connect Wallet</h3>
            
            {isConnected ? (
              <div className="wallet-connected">
                <div className="wallet-badge">
                  <span className="wallet-icon">
                    {activeWallet === "metamask" ? "🦊" : "🔷"}
                  </span>
                  <div className="wallet-info">
                    <span className="wallet-name">
                      {activeWallet === "metamask" ? "MetaMask" : "Algorand"}
                    </span>
                    <span className="wallet-address">
                      {activeWallet === "metamask" ? ethAddress : algoAddress}
                    </span>
                    <span className="wallet-balance">
                      Balance: {activeWallet === "metamask" ? ethBalance : algoBalance} {activeWallet === "metamask" ? "ETH" : "ALGO"}
                    </span>
                  </div>
                </div>
                <Link 
                  href={activeTab === "seller" ? "/seller/dashboard" : "/nearby"}
                  className="btn btn-primary btn-full"
                >
                  Continue as {activeTab === "seller" ? "Seller" : "Buyer"} →
                </Link>
              </div>
            ) : (
              <div className="wallet-options">
                <button
                  onClick={connectMetaMask}
                  disabled={isMetaMaskConnecting}
                  className="wallet-option-btn metamask"
                >
                  <span className="wallet-option-icon">🦊</span>
                  <div className="wallet-option-content">
                    <span className="wallet-option-name">MetaMask</span>
                    <span className="wallet-option-desc">Ethereum Wallet</span>
                  </div>
                  {isMetaMaskConnecting && <span className="spinner-sm" />}
                </button>

                <button
                  onClick={connectAlgorand}
                  disabled={isAlgorandConnecting}
                  className="wallet-option-btn algorand"
                >
                  <span className="wallet-option-icon">🔷</span>
                  <div className="wallet-option-content">
                    <span className="wallet-option-name">Algorand</span>
                    <span className="wallet-option-desc">Pera Wallet</span>
                  </div>
                  {isAlgorandConnecting && <span className="spinner-sm" />}
                </button>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="auth-divider">
            <span>or continue with</span>
          </div>

          {/* Email Login Form */}
          <form onSubmit={handleEmailLogin} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
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
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <Link href="/signup">Sign Up</Link></p>
            <Link href="/" className="back-link">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

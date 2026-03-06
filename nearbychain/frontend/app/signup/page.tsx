"use client";

import { useState } from "react";
import Link from "next/link";
import { useWallet } from "@/hooks/useWallet";

export default function SignupPage() {
  const [activeTab, setActiveTab] = useState<"buyer" | "seller">("buyer");
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    shopName: "",
    shopCategory: "",
    shopAddress: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    ethAddress,
    connectMetaMask,
    isMetaMaskConnecting,
    algoAddress,
    connectAlgorand,
    isAlgorandConnecting,
    isConnected,
    activeWallet,
  } = useWallet();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Simulate signup - in production, this would call your auth API
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
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">
              Join NearbyChain marketplace
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

          {/* Step Indicator */}
          <div className="step-indicator">
            <div className={`step ${step >= 1 ? "active" : ""}`}>
              <span className="step-number">1</span>
              <span className="step-label">Wallet</span>
            </div>
            <div className="step-line" />
            <div className={`step ${step >= 2 ? "active" : ""}`}>
              <span className="step-number">2</span>
              <span className="step-label">Profile</span>
            </div>
          </div>

          {step === 1 && (
            <div className="wallet-section">
              <h3 className="wallet-section-title">Connect Your Wallet</h3>
              <p className="wallet-section-desc">
                Connect a wallet to securely store your funds and make blockchain-verified transactions
              </p>

              {isConnected ? (
                <div className="wallet-connected">
                  <div className="wallet-badge">
                    <span className="wallet-icon">
                      {activeWallet === "metamask" ? "🦊" : "🔷"}
                    </span>
                    <div className="wallet-info">
                      <span className="wallet-name">
                        {activeWallet === "metamask" ? "MetaMask" : "Algorand"} Connected
                      </span>
                      <span className="wallet-address">
                        {activeWallet === "metamask" ? ethAddress : algoAddress}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setStep(2)}
                    className="btn btn-primary btn-full"
                  >
                    Continue →
                  </button>
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
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  required
                />
              </div>

              {activeTab === "seller" && (
                <>
                  <div className="form-group">
                    <label htmlFor="shopName">Shop Name</label>
                    <input
                      type="text"
                      id="shopName"
                      name="shopName"
                      value={formData.shopName}
                      onChange={handleChange}
                      placeholder="My Awesome Shop"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="shopCategory">Shop Category</label>
                    <select
                      id="shopCategory"
                      name="shopCategory"
                      value={formData.shopCategory}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="printing">Printing</option>
                      <option value="electronics">Electronics</option>
                      <option value="food">Food & Beverages</option>
                      <option value="retail">Retail</option>
                      <option value="services">Services</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="shopAddress">Shop Address</label>
                    <input
                      type="text"
                      id="shopAddress"
                      name="shopAddress"
                      value={formData.shopAddress}
                      onChange={handleChange}
                      placeholder="123 Main Street, City"
                      required
                    />
                  </div>
                </>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {error && <div className="auth-error">{error}</div>}

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn btn-secondary"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </div>
            </form>
          )}

          <div className="auth-footer">
            <p>Already have an account? <Link href="/login">Sign In</Link></p>
            <Link href="/" className="back-link">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

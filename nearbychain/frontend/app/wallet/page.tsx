"use client";

import Link from "next/link";
import { useWallet } from "@/hooks/useWallet";

export default function WalletDashboard() {
  const {
    ethAddress,
    ethBalance,
    connectMetaMask,
    disconnectMetaMask,
    isMetaMaskConnecting,
    algoAddress,
    algoBalance,
    connectAlgorand,
    disconnectAlgorand,
    isAlgorandConnecting,
    isConnected,
    activeWallet,
  } = useWallet();

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="page-container">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <span>Wallet</span>
      </nav>

      {/* Header */}
      <section className="section-header">
        <h1 className="section-title">My Wallet</h1>
        <p className="section-description">
          Manage your blockchain connections and view your balances
        </p>
      </section>

      {/* Active Wallet Card */}
      {isConnected && (
        <section className="wallet-dashboard-card active">
          <div className="wallet-dashboard-header">
            <div className="wallet-dashboard-icon large">
              {activeWallet === "metamask" ? "🦊" : "🔷"}
            </div>
            <div className="wallet-dashboard-info">
              <h2>{activeWallet === "metamask" ? "MetaMask" : "Algorand"} Wallet</h2>
              <span className="wallet-status connected">● Connected</span>
            </div>
          </div>
          
          <div className="wallet-dashboard-balance">
            <span className="balance-label">Available Balance</span>
            <span className="balance-value">
              {activeWallet === "metamask" ? ethBalance : algoBalance} {activeWallet === "metamask" ? "ETH" : "ALGO"}
            </span>
          </div>
          
          <div className="wallet-dashboard-address">
            <span className="address-label">Wallet Address</span>
            <div className="address-value">
              <code>{activeWallet === "metamask" ? ethAddress : algoAddress}</code>
              <button 
                className="copy-btn"
                onClick={() => navigator.clipboard.writeText(activeWallet === "metamask" ? ethAddress! : algoAddress!)}
                title="Copy address"
              >
                📋
              </button>
            </div>
          </div>
          
          <div className="wallet-dashboard-actions">
            <button 
              onClick={activeWallet === "metamask" ? disconnectMetaMask : disconnectAlgorand}
              className="btn btn-danger"
            >
              Disconnect Wallet
            </button>
            <Link href="/nearby" className="btn btn-primary">
              Explore Marketplace →
            </Link>
          </div>
        </section>
      )}

      {/* Available Wallets */}
      <section className="wallet-options-section">
        <h2>Available Wallets</h2>
        <div className="wallet-options-grid">
          {/* MetaMask */}
          <div className={`wallet-option-card ${ethAddress ? "connected" : ""}`}>
            <div className="wallet-option-header">
              <span className="wallet-option-icon large">🦊</span>
              <div className="wallet-option-title">
                <h3>MetaMask</h3>
                <span className="wallet-option-chain">Ethereum</span>
              </div>
            </div>
            
            {ethAddress ? (
              <div className="wallet-option-connected">
                <span className="connected-badge">✓ Connected</span>
                <span className="wallet-balance-sm">{ethBalance} ETH</span>
                <code className="wallet-address-sm">{shortenAddress(ethAddress)}</code>
              </div>
            ) : (
              <button
                onClick={connectMetaMask}
                disabled={isMetaMaskConnecting}
                className="btn btn-primary btn-full"
              >
                {isMetaMaskConnecting ? (
                  <><span className="spinner-sm" /> Connecting...</>
                ) : (
                  "Connect MetaMask"
                )}
              </button>
            )}
          </div>

          {/* Algorand */}
          <div className={`wallet-option-card ${algoAddress ? "connected" : ""}`}>
            <div className="wallet-option-header">
              <span className="wallet-option-icon large">🔷</span>
              <div className="wallet-option-title">
                <h3>Algorand</h3>
                <span className="wallet-option-chain">Algorand Chain</span>
              </div>
            </div>
            
            {algoAddress ? (
              <div className="wallet-option-connected">
                <span className="connected-badge">✓ Connected</span>
                <span className="wallet-balance-sm">{algoBalance} ALGO</span>
                <code className="wallet-address-sm">{shortenAddress(algoAddress)}</code>
              </div>
            ) : (
              <button
                onClick={connectAlgorand}
                disabled={isAlgorandConnecting}
                className="btn btn-primary btn-full"
              >
                {isAlgorandConnecting ? (
                  <><span className="spinner-sm" /> Connecting...</>
                ) : (
                  "Connect Algorand"
                )}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Recent Transactions */}
      <section className="dashboard-section">
        <h2>Recent Transactions</h2>
        {isConnected ? (
          <div className="transactions-list">
            <div className="transaction-item">
              <div className="transaction-icon">📦</div>
              <div className="transaction-info">
                <span className="transaction-title">Order #1234 - Print Documents</span>
                <span className="transaction-date">Jan 15, 2024 • 2:30 PM</span>
              </div>
              <div className="transaction-amount">
                <span className="amount">-0.05 ETH</span>
                <span className="status completed">Completed</span>
              </div>
            </div>
            <div className="transaction-item">
              <div className="transaction-icon">💰</div>
              <div className="transaction-info">
                <span className="transaction-title">Received Payment</span>
                <span className="transaction-date">Jan 14, 2024 • 10:15 AM</span>
              </div>
              <div className="transaction-amount">
                <span className="amount positive">+0.12 ETH</span>
                <span className="status completed">Completed</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-state-card">
            <div className="empty-icon-large">📋</div>
            <h3>No transactions yet</h3>
            <p>Connect your wallet to view transaction history</p>
          </div>
        )}
      </section>
    </div>
  );
}

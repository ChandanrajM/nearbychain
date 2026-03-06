"use client";

import { useState } from "react";
import Link from "next/link";
import { useWallet } from "@/hooks/useWallet";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isConnected, ethAddress, algoAddress, activeWallet } = useWallet();

  const shortenAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link href="/" className="nav-logo">
          <span className="logo-icon">🔗</span>
          <span className="logo-text">NearbyChain</span>
        </Link>

        <div className="nav-links desktop-only">
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/nearby" className="nav-link">Nearby</Link>
          <Link href="/nearby/shops" className="nav-link">Shops</Link>
          <Link href="/seller/dashboard" className="nav-link nav-link-seller">Seller</Link>
          <Link href="/admin" className="nav-link nav-link-admin">Admin</Link>
          
          {/* Wallet/Auth Section */}
          {isConnected ? (
            <Link href="/wallet" className="nav-link nav-link-wallet">
              <span className="wallet-nav-icon">
                {activeWallet === "metamask" ? "🦊" : "🔷"}
              </span>
              <span className="wallet-nav-address">
                {shortenAddress(activeWallet === "metamask" ? ethAddress : algoAddress)}
              </span>
            </Link>
          ) : (
            <Link href="/login" className="nav-link nav-link-login">
              Sign In
            </Link>
          )}
        </div>

        <button className="mobile-menu-btn mobile-only" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {isOpen && (
        <div className="mobile-menu mobile-only">
          <Link href="/" className="mobile-link" onClick={() => setIsOpen(false)}>Home</Link>
          <Link href="/nearby" className="mobile-link" onClick={() => setIsOpen(false)}>Nearby</Link>
          <Link href="/nearby/shops" className="mobile-link" onClick={() => setIsOpen(false)}>Shops</Link>
          <Link href="/seller/dashboard" className="mobile-link mobile-link-seller" onClick={() => setIsOpen(false)}>Seller Dashboard</Link>
          <Link href="/admin" className="mobile-link mobile-link-admin" onClick={() => setIsOpen(false)}>Admin</Link>
          
          {/* Mobile Wallet/Auth */}
          {isConnected ? (
            <Link href="/wallet" className="mobile-link mobile-link-wallet" onClick={() => setIsOpen(false)}>
              {activeWallet === "metamask" ? "🦊" : "🔷"} My Wallet
            </Link>
          ) : (
            <Link href="/login" className="mobile-link mobile-link-login" onClick={() => setIsOpen(false)}>
              Sign In / Sign Up
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
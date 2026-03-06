"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link href="/" className="nav-logo">
          <span className="logo-icon">🔗</span>
          <span className="logo-text">NearbyChain</span>
        </Link>

        <div className="nav-links desktop-only">
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/shops" className="nav-link">Shops</Link>
          <Link href="/dashboard" className="nav-link">Dashboard</Link>
        </div>

        <button className="mobile-menu-btn mobile-only" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {isOpen && (
        <div className="mobile-menu mobile-only">
          <Link href="/" className="mobile-link" onClick={() => setIsOpen(false)}>Home</Link>
          <Link href="/shops" className="mobile-link" onClick={() => setIsOpen(false)}>Shops</Link>
          <Link href="/dashboard" className="mobile-link" onClick={() => setIsOpen(false)}>Dashboard</Link>
        </div>
      )}
    </nav>
  );
}
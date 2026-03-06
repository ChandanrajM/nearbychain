import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <h1 className="hero-title">NearbyChain</h1>
        <p className="hero-subtitle">
          Local services powered by blockchain. Discover, connect, and transact with trusted service providers in your area.
        </p>
        <div className="hero-buttons">
          <Link href="/shops" className="btn btn-primary">
            Explore Shops
          </Link>
          <Link href="/dashboard" className="btn btn-secondary">
            View Dashboard
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div className="section-header">
          <h2 className="section-title">Why Choose NearbyChain?</h2>
          <p className="section-description">
            Experience the future of local service discovery with blockchain-powered transparency and security.
          </p>
        </div>
        
        <div className="grid-3">
          <div className="card feature-card">
            <div className="feature-icon blue">📍</div>
            <h3 className="feature-title">Local Discovery</h3>
            <p className="feature-description">
              Find trusted service providers in your neighborhood with ease. Filter by location, ratings, and services.
            </p>
          </div>

          <div className="card feature-card">
            <div className="feature-icon purple">🔒</div>
            <h3 className="feature-title">Blockchain Security</h3>
            <p className="feature-description">
              Every transaction is secured by blockchain technology, ensuring transparency and trust in all interactions.
            </p>
          </div>

          <div className="card feature-card">
            <div className="feature-icon green">⚡</div>
            <h3 className="feature-title">Quick Service</h3>
            <p className="feature-description">
              Request services instantly and track your orders in real-time. Get notified when your service is ready.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">500+</div>
            <div className="stat-label">Active Shops</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">10K+</div>
            <div className="stat-label">Services Completed</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">4.8★</div>
            <div className="stat-label">Average Rating</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2 className="cta-title">Ready to Get Started?</h2>
        <p className="cta-description">
          Join thousands of users who are already enjoying the benefits of decentralized local services.
        </p>
        <Link href="/shops" className="btn btn-primary">
          Start Exploring
        </Link>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2024 NearbyChain. Powered by blockchain technology.</p>
      </footer>
    </div>
  );
}
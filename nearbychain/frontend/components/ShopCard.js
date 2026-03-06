"use client";

import { useState } from "react";
import { handlePrintRequest } from "../utils/request";

export default function ShopCard({ shop }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleOrder = async () => {
    setLoading(true);
    const result = await handlePrintRequest({
      shopId: shop._id,
      service: "Print",
      pages: 10,
      price: 30,
    });
    setLoading(false);
    setMessage(result ? `Order Created! ID: ${result._id}` : "Failed to create order");
  };

  return (
    <div className="shop-card">
      {/* Shop Header */}
      <div className="shop-header">
        <div className="shop-icon">🏪</div>
        <div className="shop-rating">
          <span>⭐</span>
          <span>{shop.rating || "4.5"}</span>
        </div>
      </div>

      {/* Shop Body */}
      <div className="shop-body">
        <h3 className="shop-name">{shop.name}</h3>
        
        {shop.category && (
          <span className="shop-category">
            {shop.category.charAt(0).toUpperCase() + shop.category.slice(1)}
          </span>
        )}

        <div style={{ marginBottom: "1rem" }}>
          {shop.distance && (
            <p className="shop-info">
              📍 {shop.distance} km away
            </p>
          )}
          
          {shop.address && (
            <p className="shop-info">
              📮 {shop.address}
            </p>
          )}

          {shop.phone && (
            <p className="shop-info">
              📞 {shop.phone}
            </p>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleOrder}
          disabled={loading}
          className="btn btn-primary"
          style={{ width: "100%" }}
        >
          {loading ? "⏳ Processing..." : "🛒 Request Service"}
        </button>

        {message && (
          <div style={{ 
            marginTop: "0.75rem", 
            padding: "0.75rem", 
            borderRadius: "var(--radius)",
            backgroundColor: message.includes("Failed") ? "#fee2e2" : "#d1fae5",
            color: message.includes("Failed") ? "#991b1b" : "#065f46",
            fontSize: "0.875rem",
            fontWeight: "500"
          }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
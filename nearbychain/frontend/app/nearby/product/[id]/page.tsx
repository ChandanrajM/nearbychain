"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"

interface Product {
  _id: string
  name: string
  price: number
  description: string
  stock: number
  category: string
  image?: string
  shop_id: string
}

interface Shop {
  _id: string
  name: string
  rating: number
  distance?: number
  address?: string
  phone?: string
}

export default function ProductDetailPage() {
  const params = useParams()
  const id = params.id as string
  
  const [product, setProduct] = useState<Product | null>(null)
  const [shop, setShop] = useState<Shop | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [orderLoading, setOrderLoading] = useState(false)
  const [orderMessage, setOrderMessage] = useState("")

  useEffect(() => {
    // Fetch product details
    fetch(`http://localhost:5000/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data)
        // Fetch shop details
        if (data.shop_id) {
          return fetch(`http://localhost:5000/api/shops/${data.shop_id}`).then(r => r.json())
        }
        return null
      })
      .then(shopData => {
        if (shopData) setShop(shopData)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [id])

  const handleOrder = async () => {
    setOrderLoading(true)
    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: id,
          shop_id: product?.shop_id,
          quantity: quantity,
          total_price: (product?.price || 0) * quantity,
          status: "pending"
        })
      })
      const data = await res.json()
      setOrderMessage(`Order placed! ID: ${data._id || data.id}`)
    } catch (err) {
      setOrderMessage("Failed to place order")
    }
    setOrderLoading(false)
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="spinner"></div>
          <p>Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>Product not found</h3>
          <Link href="/nearby" className="btn btn-primary">Back to Nearby</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/nearby">Nearby</Link>
        <span>/</span>
        <span>{product.name}</span>
      </nav>

      {/* Product Detail */}
      <section className="product-detail">
        <div className="product-detail-grid">
          {/* Product Image */}
          <div className="product-image-section">
            <div className="product-image-large">
              <div className="product-placeholder-large">
                {product.category === "printing" && "🖨️"}
                {product.category === "electronics" && "📱"}
                {product.category === "food" && "🍔"}
                {product.category === "retail" && "🛍️"}
                {product.category === "services" && "🔧"}
                {!product.category && "📦"}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info-section">
            <span className="product-category-badge">{product.category}</span>
            <h1 className="product-detail-name">{product.name}</h1>
            
            {shop && (
              <div className="product-shop-info">
                <span className="shop-badge">🏪 {shop.name}</span>
                <span className="rating-badge">⭐ {shop.rating || "4.5"}</span>
                {shop.distance && (
                  <span className="distance-badge">
                    📍 {shop.distance < 1000 
                      ? `${shop.distance}m` 
                      : `${(shop.distance / 1000).toFixed(1)}km`} away
                  </span>
                )}
              </div>
            )}

            <p className="product-description">{product.description || "No description available"}</p>

            <div className="product-price-section">
              <span className="product-price-large">₹{product.price}</span>
              <span className="product-stock">
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="quantity-selector">
              <span>Quantity:</span>
              <div className="quantity-controls">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="product-actions">
              <button 
                className="btn btn-primary btn-lg"
                onClick={handleOrder}
                disabled={orderLoading || product.stock === 0}
              >
                {orderLoading ? "Processing..." : "🛒 Order Now"}
              </button>
              <Link href={`/nearby/shops`} className="btn btn-secondary btn-lg">
                View Shop
              </Link>
            </div>

            {orderMessage && (
              <div className={`order-message ${orderMessage.includes("Failed") ? "error" : "success"}`}>
                {orderMessage}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Shop Details */}
      {shop && (
        <section className="shop-detail-section">
          <h2>Shop Information</h2>
          <div className="shop-detail-card">
            <div className="shop-detail-header">
              <div className="shop-detail-icon">🏪</div>
              <div>
                <h3>{shop.name}</h3>
                <p>⭐ {shop.rating || "4.5"} rating</p>
              </div>
            </div>
            <div className="shop-detail-body">
              {shop.address && <p>📍 {shop.address}</p>}
              {shop.phone && <p>📞 {shop.phone}</p>}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

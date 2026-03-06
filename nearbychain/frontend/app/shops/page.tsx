"use client"

import { useEffect, useState } from "react"

export default function ShopsPage() {

  const [shops, setShops] = useState<any[]>([])

  useEffect(() => {
    fetch("http://localhost:5000/api/shops")
      .then((res) => res.json())
      .then((data) => setShops(data))
      .catch((err) => console.log(err))
  }, [])

  return (
    <div style={{ padding: "40px" }}>
      <h1>Nearby Shops</h1>

      {shops.length === 0 ? (
        <p>No shops found</p>
      ) : (
        shops.map((shop) => (
          <div
            key={shop._id}
            style={{
              border: "1px solid gray",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h3>{shop.name}</h3>
            <p>Rating: {shop.rating}</p>
          </div>
        ))
      )}
    </div>
  )
}
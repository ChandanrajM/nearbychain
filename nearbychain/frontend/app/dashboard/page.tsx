"use client"

import { useEffect, useState } from "react"

export default function Dashboard() {

  const [orders, setOrders] = useState([])

  useEffect(() => {
    fetch("http://localhost:5000/api/orders")
      .then(res => res.json())
      .then(data => setOrders(data))
  }, [])

  return (
    <div style={{padding:"40px"}}>
      <h1>Orders Dashboard</h1>

      {orders.map((order:any) => (
        <div key={order._id} style={{border:"1px solid gray", padding:"10px", margin:"10px"}}>
          <p>Service: {order.service}</p>
          <p>Status: {order.status}</p>
          <p>Price: {order.price}</p>
        </div>
      ))}

    </div>
  )
}
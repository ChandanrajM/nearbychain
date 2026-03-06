import { NextResponse } from "next/server"

// GET /api/orders - Get all orders
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const shopId = searchParams.get("shop_id")
    const status = searchParams.get("status")
    
    // Fetch from backend
    const res = await fetch("http://localhost:5000/api/orders")
    let orders = await res.json()
    
    // Apply filters
    if (shopId) {
      orders = orders.filter((o: any) => o.shop_id === shopId)
    }
    if (status) {
      orders = orders.filter((o: any) => o.status === status)
    }
    
    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    )
  }
}

// POST /api/orders - Create new order
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const res = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })
    
    const order = await res.json()
    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    )
  }
}

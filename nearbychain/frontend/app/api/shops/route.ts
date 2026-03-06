import { NextResponse } from "next/server"

// GET /api/shops - Get all shops
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const approved = searchParams.get("approved")
    
    // Fetch from backend
    const res = await fetch("http://localhost:5000/api/shops")
    let shops = await res.json()
    
    // Filter by approval status if specified
    if (approved !== null) {
      shops = shops.filter((s: any) => s.approved === (approved === "true"))
    }
    
    return NextResponse.json(shops)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch shops" },
      { status: 500 }
    )
  }
}

// POST /api/shops - Create new shop
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const res = await fetch("http://localhost:5000/api/shops", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })
    
    const shop = await res.json()
    return NextResponse.json(shop, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create shop" },
      { status: 500 }
    )
  }
}

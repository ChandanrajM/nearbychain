import { NextResponse } from "next/server"

// GET /api/products - Get all products
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const shopId = searchParams.get("shop_id")
    const category = searchParams.get("category")
    
    // Fetch from backend
    const res = await fetch("http://localhost:5000/api/products")
    let products = await res.json()
    
    // Apply filters
    if (shopId) {
      products = products.filter((p: any) => p.shop_id === shopId)
    }
    if (category) {
      products = products.filter((p: any) => p.category === category)
    }
    
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}

// POST /api/products - Create new product
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const res = await fetch("http://localhost:5000/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })
    
    const product = await res.json()
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    )
  }
}

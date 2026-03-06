# NearbyChain

NearbyChain is a **hyperlocal commerce platform** that connects users with nearby shops and products in real time.
The platform allows customers to discover products available around them while enabling shop owners to manage inventory, orders, and analytics through a dedicated seller dashboard.

## Overview

NearbyChain focuses on **location-based discovery of products and shops**.
Instead of browsing large e-commerce catalogs, users can find **items available in nearby stores**, reducing delivery time and supporting local businesses.

The platform consists of three main modules:

* **Customer Interface** – Discover nearby shops and products.
* **Seller Dashboard** – Manage products, orders, and shop data.
* **Admin Panel** – Approve shops and manage the ecosystem.

## Core Features

### Nearby Discovery

* Detects user location
* Displays shops within a configurable radius
* Lists products available in nearby stores

### Seller Dashboard

* Product management
* Order management
* Inventory tracking
* Basic analytics

### Admin Control

* Shop approval system
* Marketplace moderation
* Platform monitoring

## Platform Architecture

The project is built with a modern full-stack architecture:

* **Frontend:** Next.js (App Router)
* **Backend:** API routes
* **Database:** Location-enabled data structure for nearby search
* **Authentication:** Seller login system

## Project Structure

```
app/
 ├── page.tsx                # Landing page
 ├── nearby/                 # Nearby marketplace
 │    ├── page.tsx
 │    └── shops/page.tsx
 │
 ├── seller/                 # Seller portal
 │    └── dashboard/
 │         ├── page.tsx
 │         ├── products/page.tsx
 │         └── orders/page.tsx
 │
 ├── admin/                  # Admin controls
 │    ├── page.tsx
 │    └── approvals/page.tsx
 │
 └── api/                    # Backend APIs
```

## How It Works

1. User enables location access.
2. The system detects nearby shops.
3. Shops and products within range are displayed.
4. Users browse and place orders or visit the store.
5. Sellers manage inventory and orders from the dashboard.

## Goal

The goal of NearbyChain is to **bridge the gap between local shops and digital commerce**, making nearby products easily discoverable while empowering small businesses with digital tools.

## Future Improvements

* Real-time inventory updates
* Smart shop ranking based on distance and availability
* AI-based product recommendations
* Faster pickup and hyperlocal delivery options

---

Developed to explore **location-aware marketplace systems and hyperlocal commerce platforms**.

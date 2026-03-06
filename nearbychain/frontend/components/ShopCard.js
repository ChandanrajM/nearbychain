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
    <div className="bg-white p-6 shadow rounded flex flex-col justify-between h-full">
      <div>
        <h2 className="text-xl font-bold">{shop.name}</h2>
        {shop.distance && <p>Distance: {shop.distance} km</p>}
        <p>Rating ⭐ {shop.rating}</p>
      </div>
      <div className="mt-4">
        <button
          onClick={handleOrder}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Processing..." : "Request Service"}
        </button>
        {message && <p className="mt-2 text-green-600">{message}</p>}
      </div>
    </div>
  );
}
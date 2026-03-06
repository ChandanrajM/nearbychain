import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/orders");
        const data = await res.json();
        setOrders(data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="p-10">
        <h1 className="text-3xl font-bold mb-6">Shop Dashboard</h1>
        {loading ? <p>Loading orders...</p> :
          orders.length === 0 ? <p>No orders yet.</p> :
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded">
              <thead>
                <tr className="border-b bg-gray-100">
                  <th className="p-4 text-left">Order ID</th>
                  <th className="p-4 text-left">Shop ID</th>
                  <th className="p-4 text-left">Service</th>
                  <th className="p-4 text-left">Pages</th>
                  <th className="p-4 text-left">Price (₹)</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Created At</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="p-4">#{order._id.slice(-6)}</td>
                    <td className="p-4">{order.shopId}</td>
                    <td className="p-4">{order.service}</td>
                    <td className="p-4">{order.pages}</td>
                    <td className="p-4">{order.price}</td>
                    <td className="p-4 capitalize">{order.status}</td>
                    <td className="p-4">{new Date(order.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  );
}
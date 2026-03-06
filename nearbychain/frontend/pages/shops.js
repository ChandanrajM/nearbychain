import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ShopCard from "../components/ShopCard";
import { getDistanceFromLatLonInKm } from "../utils/distance";

export default function Shops() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => { console.error(err); setUserLocation(null); }
      );
    }
  }, []);

  useEffect(() => {
    if (!userLocation) return;

    const fetchShops = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/shops");
        const data = await res.json();
        const nearby = data
          .map(shop => ({
            ...shop,
            distance: getDistanceFromLatLonInKm(
              userLocation.lat, userLocation.lng,
              shop.lat, shop.lng
            ).toFixed(2)
          }))
          .filter(shop => shop.distance <= 1); // within 1 km
        setShops(nearby);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchShops();
  }, [userLocation]);

  return (
    <div>
      <Navbar />
      <div className="p-10">
        <h1 className="text-3xl font-bold mb-6">Nearby Shops</h1>
        {!userLocation ? (
          <p>Detecting your location...</p>
        ) : loading ? (
          <p>Loading nearby shops...</p>
        ) : shops.length === 0 ? (
          <p>No shops found within 1 km radius.</p>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            {shops.map(shop => <ShopCard key={shop._id} shop={shop} />)}
          </div>
        )}
      </div>
    </div>
  );
}
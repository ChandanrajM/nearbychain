export default function Navbar() {
  return (
    <nav className="bg-white shadow p-4 flex justify-between">
      <h1 className="font-bold text-xl">NearbyChain</h1>
      <div>
        <a href="/shops" className="mr-4">Shops</a>
        <a href="/dashboard">Dashboard</a>
      </div>
    </nav>
  );
}
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <section className="text-center mt-20">
        <h1 className="text-5xl font-bold">NearbyChain</h1>
        <p className="mt-6 text-gray-600">
          Find nearby shops & print with blockchain payments
        </p>
        <button
          className="mt-8 bg-black text-white px-6 py-3 rounded-lg"
          onClick={() => window.location.href = "/shops"}
        >
          Open App
        </button>
      </section>
    </div>
  );
}
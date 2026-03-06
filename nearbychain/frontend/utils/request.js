export const handlePrintRequest = async ({ shopId, service, pages, price }) => {
  try {
    const res = await fetch("http://localhost:5000/api/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shopId, service, pages, price, status: "pending" }),
    });
    return await res.json();
  } catch (error) {
    console.error("Error creating order:", error);
    return null;
  }
};
const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export const searchResources = async (data) => {
  const res = await fetch(`${BASE_URL}/api/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }

  return res.json();
};

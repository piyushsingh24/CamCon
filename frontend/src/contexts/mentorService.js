const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export const fetchMentors = async () => {
  try {
    const response = await fetch(`${API_URL}/api/mentors`, {
      method: "GET",
      credentials: "include", // in case you use cookies or authentication
    });

    if (!response.ok) {
      throw new Error("Failed to fetch mentors");
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Error fetching mentors:", error);
    return null;
  }
};


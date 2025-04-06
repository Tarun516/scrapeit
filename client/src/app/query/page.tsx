"use client";
import { useState } from "react";
import axios from "axios";

const AskLLM = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
const handleQuerySubmit = async () => {
  setLoading(true);
  setError("");
  setResponse("");

  const token = localStorage.getItem('token');
  if (!token) {
    alert("You need to log in first.");
    setLoading(false);
    return;
  }

  if (!query) {
    setError("Query is required.");
    setLoading(false);
    return;
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Token in Authorization header
      },
      body: JSON.stringify({ query }), // Replace `userId` with the actual user ID if available
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to fetch response.");
    }

      setResponse(data.response );
      console.log(`Response now is ${data.response }`)
  } catch (err) {
    console.error("Error fetching response:", err);
    setError("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
        Ask LLM
      </h1>
      <div className="w-full max-w-lg">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a question..."
          className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          onClick={handleQuerySubmit}
          disabled={!query || loading}
          className="mt-4 w-full py-2 px-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-lg hover:bg-orange-700 disabled:opacity-50"
        >
          {loading ? "Fetching Response..." : "Submit"}
        </button>
        {error && <p className="mt-4 text-red-500">{error}</p>}
    {response && (
  <div className="mt-6 p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
    <h2 className="text-xl font-semibold text-orange-600">Response:</h2>
    <pre className="mt-2 text-gray-800 whitespace-pre-wrap">{response}</pre>
  </div>
)}

      </div>
    </div>
  );
};

export default AskLLM;

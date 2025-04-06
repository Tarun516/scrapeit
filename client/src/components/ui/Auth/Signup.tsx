"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface SignupProps {
  onSuccess: () => void;
}

const Signup = ({onSuccess}:SignupProps) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      if (data.user_id) {
        setMessage("User registered successfully.");
        onSuccess()
        
      } else {
        setMessage(data.message || "Error occurred during registration.");
      }
    } catch (error) {
      console.log(error)
      setMessage("Failed to register. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <form onSubmit={handleSignup} className="max-w-lg w-full bg-gray-800 p-8 rounded-xl shadow-xl space-y-6">
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500 text-center">Sign Up</h2>
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
          className="w-full p-3 bg-gray-700 border-2 border-pink-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          className="w-full p-3 bg-gray-700 border-2 border-pink-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          className="w-full p-3 bg-gray-700 border-2 border-pink-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg">Sign Up</Button>
        {message && <p className="text-red-500 text-center">{message}</p>}
      </form>
    </div>
  );
};

export default Signup;

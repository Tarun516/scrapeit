"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
 

const Login = ( ) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
    const router=useRouter()

  useEffect(() => {
 
  }, [])
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log(`making request to ${process.env.NEXT_PUBLIC_API_URL}/auth/login `)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data)
      if (response.ok) {
        localStorage.setItem("token", data.token);
        setMessage("Login successful.");
        router.push("/dashboard")
        
         ;
      } else {
        setMessage(data.message || "Invalid credentials.");
      }
    } catch (error) {
      console.log(error)
      setMessage("Failed to log in. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <form onSubmit={handleLogin} className="max-w-lg w-full bg-gray-800 p-8 rounded-xl shadow-xl space-y-6">
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500 text-center">Login</h2>
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
        <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg">Login</Button>
        {message && <p className="text-red-500 text-center">{message}</p>}
      </form>
    </div>
  );
};

export default Login;

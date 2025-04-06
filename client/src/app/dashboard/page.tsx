"use client"
import Sidebar from "@/components/ui/sidebar";
import { Copy,   } from "lucide-react";
import { useState } from "react";

interface ScrapedData{
    scraped_data: string,
    summary:string
 }

const Dashboard = () => {
  const [url, setUrl] = useState("");
  const [userId] = useState("someUserId"); // Replace with actual user ID from the session or state
    const [scrapedData, setScrapedData] = useState<ScrapedData>({
        scraped_data: " ",
        summary: " "
    });
    const [error, setError] = useState(" ");
    const myStyle={ width: "700px",height:"596px" }

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
      const token = localStorage.getItem('token')
      if (!token) {
          alert("you need to login first")
      }
      if (!url  ) {
        console.log(url)
      setError("URL and User ID are required.");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/scrape`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,  // Send token in Authorization header

        },
        body: JSON.stringify({ url }),
      });

      const result = await response.json();
      if (response.ok) {
        setScrapedData(result);
        setError(""); // Clear any previous errors
      } else {
        setError(result.error || "An error occurred");
      }
    } catch (err) {
      setError("Failed to fetch data. Please try again later.");
    }
  };

  return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
          <Sidebar />
      <h1 className="text-3xl font-semibold text-center gradient-text">Dashboard</h1>
      
      <form onSubmit={handleScrape} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="url" className="font-medium text-lg  gradient-text">Enter URL:</label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="border border-gray-300 rounded-md px-4 py-2 mt-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2  text-white font-semibold rounded-md  gradient-text "
        >
          Scrape
        </button>
      </form>

      {error && <div className="text-red-600 font-medium text-center">{error}</div>}

          {scrapedData && (
              <div className="flex" style={ {width:"1500px"}}>
         <div className="p-4 bg-gray-100 rounded-md border border-black-300  w-96 h-8 mt-6 overflow-y-scroll" style={{height:"596px"}}>
                <div className="flex justify-between">
                  <div className="text-xl font-semibold mb-4  gradient-text"  >Scraped Data     </div>
                      <div className="p-2"><Copy /></div>
                     
                      </div>
                       <div>
                          {scrapedData.scraped_data}
                     </div>
                
                  </div>
                  <div className=" border border-black-300  p-4 mt-6 ml-2" style={{
                      width: "750px",
                      height:"600px"
                  }}>
                      <h2 className="text-xl font-semibold text-center  gradient-text">Summary</h2>
                     
                      <pre className="text-gray-800 whitespace-pre-wrap overflow--scroll border border-gray-300 p-4 rounded-md " style={{ height: "589px" }} >
            {scrapedData.summary}
          </pre>
                  </div>
      </div> 
                  
      )}
    </div>
  );
};

export default Dashboard;

"use client"
import { Plus, Folder } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
 
const Sidebar = () => {
    const [isHovered, setIsHovered] = useState(false);
    const router=useRouter()
    const takeToLLM =() => {
        router.push("/query")
    }

  return (
    <div
      className='fixed left-0 top-1/3 h-64 w-16 bg-gradient-to-br from-orange-600 to-red-600 rounded-full flex flex-col items-center justify-center py-4 ml-3 space-y-8 shadow-lg transition-all duration-300 hover:rounded-t-sm  hover:rounded-b-sm hover:w-48'
       
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="text-white text-2xl font-bold mb-4"><button onClick={takeToLLM}>🔥</button></div> {/* Logo or Symbol */}
      
      <button
        className="bg-orange-700 hover:bg-orange-800 p-3 rounded-full flex items-center justify-center space-x-2"
        aria-label="Add New Item"
      >
        <Plus className="text-white" size={20} />
        {isHovered && <span className="text-white">Add Scrape</span>}
      </button>
      
      <button
        className="bg-orange-700 hover:bg-orange-800 p-3 rounded-full flex items-center justify-center space-x-2"
        aria-label="Spaces"
      >
        <Folder className="text-white" size={20} />
        {isHovered && <span className="text-white">Memories</span>}
      </button>
    </div>
  );
};

export default Sidebar;

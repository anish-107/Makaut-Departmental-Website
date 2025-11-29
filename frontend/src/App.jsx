/**
 * @author Anish 
 * @description This is the the jsx file that is being displayed in main.jsx 
 * @date 29-11-2025
 * @returns a JSX page
 */

// Imports
import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

// Constants
const API_URL = import.meta.env.VITE_API_URL;

// Function
function App() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchAPI = async() => {
    const response = await axios.get(`${API_URL}/`)
    setMembers(response.data.members)
    };

    fetchAPI()
  }, []);

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Hello World !!!!
        </h1>

        <p className="text-gray-700">
          Tailwind is working! Customize this page as you like.
        </p>

        {members.map((member, index) => (
          <div key={index} className="w-full flex items-center gap-3 py-2 border-b last:border-b-0">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 font-medium">
              {member.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-gray-800">{member}</span>
          </div>
        ))}
        
      </div>
    </>
  )
}

export default App

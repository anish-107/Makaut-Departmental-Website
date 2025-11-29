/**
 * @author Anish 
 * @description This is the the jsx file that is being displayed in main.jsx 
 * @date 29-11-2025
 * @returns a JSX page
 */

import './App.css';
import { Button } from '@/components/ui/button';

function App() {
  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Hello World !!!!
        </h1>

        <p className="text-gray-700">
          Tailwind is working! Customize this page as you like.
        </p>

        <Button>Click me</Button>
        
      </div>
    </>
  )
}

export default App

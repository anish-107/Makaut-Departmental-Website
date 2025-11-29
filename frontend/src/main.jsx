/**
 * @author Anish 
 * @description This is the root jsx file that will be rendered
 * @date 29-11-2025
 * @returns a JSX page
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

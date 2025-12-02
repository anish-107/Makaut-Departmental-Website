/** main.jsx
 * @author Anish
 * @date 29-11-2025
 * @description this is the main layout file for the app
 * @returns a jsx page
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
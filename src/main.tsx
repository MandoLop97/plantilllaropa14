
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initPWA } from './pwa'

const rootElement = document.getElementById('root')!

initPWA()

createRoot(rootElement).render(<App />)

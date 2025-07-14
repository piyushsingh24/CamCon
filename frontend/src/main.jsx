import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { ParallaxProvider } from 'react-scroll-parallax';
import { ThemeProvider } from "./contexts/ThemeContext.jsx";



ReactDOM.createRoot(document.getElementById('root')).render(

  <React.StrictMode>
    <ThemeProvider>
      <ParallaxProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ParallaxProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
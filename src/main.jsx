import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { WishlistProvider } from './context/WishlistContext'
import { BibliotecaProvider } from './context/BibliotecaContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BibliotecaProvider>
        <WishlistProvider>
          <App />
        </WishlistProvider>
      </BibliotecaProvider>
    </AuthProvider>
  </StrictMode>,
)

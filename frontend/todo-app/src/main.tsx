import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import AuthWrapper from './components/AuthWrapper'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'

import { AppRoutes } from '@/AppRoutes'
import { LenisProvider } from '@/hooks/useLenis'

import './index.css'

const container = document.getElementById('root')!

const app = (
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <LenisProvider>
          <AppRoutes />
        </LenisProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
)

if (container.childElementCount > 0) {
  hydrateRoot(container, app)
} else {
  createRoot(container).render(app)
}

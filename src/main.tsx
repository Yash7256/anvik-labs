import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { App } from '@/App'
import { ServiceUiUxDesign } from '@/pages/ServiceUiUxDesign'
import { ServiceWebDevelopment } from '@/pages/ServiceWebDevelopment'
import { Approach } from '@/pages/Approach'
import { About } from '@/pages/About'

import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/services/ui-ux-design" element={<ServiceUiUxDesign />} />
        <Route path="/services/web-development" element={<ServiceWebDevelopment />} />
        <Route path="/approach" element={<Approach />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

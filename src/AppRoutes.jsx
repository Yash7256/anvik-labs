import { useEffect, useLayoutEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'

import { App } from '@/App'
import { Seo } from '@/components/seo/Seo'
import { getRouteMeta } from '@/seo/routeMeta'
import { About } from '@/pages/About'
import { Approach } from '@/pages/Approach'
import { UiUxDesign } from '@/pages/services/UiUxDesign'
import { WebDevelopment } from '@/pages/services/WebDevelopment'

const useIsoLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect

export function AppRoutes() {
  const location = useLocation()
  const meta = getRouteMeta(location.pathname)

  useIsoLayoutEffect(() => {
    document.documentElement.removeAttribute('data-intro')
  }, [])

  return (
    <>
      <div id="app-shell">
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/services/ui-ux-design" element={<UiUxDesign />} />
          <Route path="/services/web-development" element={<WebDevelopment />} />
          <Route path="/approach" element={<Approach />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
      <Seo key={location.pathname} {...meta} />
    </>
  )
}

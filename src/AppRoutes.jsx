import { Route, Routes, useLocation } from 'react-router-dom'

import { Seo } from '@/components/seo/Seo'
import { getRouteMeta } from '@/seo/routeMeta'
import { Home } from '@/pages/Home'

export function AppRoutes() {
  const location = useLocation()
  const meta = getRouteMeta(location.pathname)

  return (
    <>
      <div id="app-shell">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
      <Seo key={location.pathname} {...meta} />
    </>
  )
}

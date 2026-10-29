import { useEffect, useLayoutEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'

import { App } from '@/App'
import { Seo } from '@/components/seo/Seo'
import { getRouteMeta } from '@/seo/routeMeta'
import { Home } from '@/pages/Home'
import { AboutUs } from '@/pages/AboutUs'
import { Services } from '@/pages/Services'
import { Projects } from '@/pages/Projects'
import { ProjectDetail } from '@/pages/ProjectDetail'
import { Blog } from '@/pages/Blog'
import { BlogPost } from '@/pages/BlogPost'
import { Career } from '@/pages/Career'
import { Contacts } from '@/pages/Contacts'
import { Terms } from '@/pages/Terms'
import { Privacy } from '@/pages/Privacy'
import { NotFound } from '@/pages/NotFound'
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
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/ui-ux-design" element={<UiUxDesign />} />
          <Route path="/services/web-development" element={<WebDevelopment />} />
          <Route path="/approach" element={<Approach />} />
          <Route path="/gallery" element={<Projects />} />
          <Route path="/work" element={<Projects />} />
          <Route path="/work/:slug" element={<ProjectDetail />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/career" element={<Career />} />
          <Route path="/contact" element={<Contacts />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/terms-of-services" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Seo key={location.pathname} {...meta} />
    </>
  )
}

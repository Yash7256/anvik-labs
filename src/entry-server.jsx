import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { HelmetProvider } from 'react-helmet-async'
import { StaticRouter } from 'react-router-dom'

import { AppRoutes } from '@/AppRoutes'
import { LenisProvider } from '@/hooks/useLenis'

export function render(url) {
  return renderToString(
    <StrictMode>
      <HelmetProvider>
        <StaticRouter location={url}>
          <LenisProvider>
            <AppRoutes />
          </LenisProvider>
        </StaticRouter>
      </HelmetProvider>
    </StrictMode>,
  )
}

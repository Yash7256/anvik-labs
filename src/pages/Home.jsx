import { NdHero } from '@/components/nd/NdHero'
import { NdNavbar } from '@/components/nd/NdNavbar'

export function Home() {
  return (
    <div className="nd-page">
      <NdNavbar />
      <main id="main">
        <NdHero />
      </main>
    </div>
  )
}

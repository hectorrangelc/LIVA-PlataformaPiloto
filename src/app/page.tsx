import { FloatingNav }         from '@/components/landing/FloatingNav'
import { HeroSection }         from '@/components/landing/HeroSection'
import { AdoptionSteps }       from '@/components/landing/AdoptionSteps'
import { MarqueeStrip }        from '@/components/landing/MarqueeStrip'
import { AnimalesDestacados }  from '@/components/landing/AnimalesDestacados'
import { StatsSection }        from '@/components/landing/StatsSection'
import { DonacionesCTA }       from '@/components/landing/DonacionesCTA'
import { EventosSection }      from '@/components/landing/EventosSection'
import { Testimonials }        from '@/components/landing/Testimonials'
import { FooterLanding }       from '@/components/landing/FooterLanding'

export default function Home() {
  return (
    <>
      <FloatingNav />
      <HeroSection />
      <AdoptionSteps />
      <MarqueeStrip />
      <AnimalesDestacados />
      <StatsSection />
      <DonacionesCTA />
      <EventosSection />
      <Testimonials />
      <FooterLanding />
    </>
  )
}

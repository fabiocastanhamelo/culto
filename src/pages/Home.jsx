import { useState } from 'react'
import Hero from '../components/Hero'
import DonationCounter from '../components/DonationCounter'
import DonorsList from '../components/DonorsList'
import DonationModal from '../components/DonationModal'
import Footer from '../components/Footer'
import RetroGrid from '../components/ui/RetroGrid'

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="min-h-screen">
      <section className="relative min-h-screen flex flex-col lg:flex-row items-center justify-center overflow-hidden bg-slate-950">
        <RetroGrid />
        <Hero onDonateClick={() => setIsModalOpen(true)} />
        <DonationCounter />
        {/* Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent z-5" />
      </section>
      <DonorsList />
      <Footer onDonateClick={() => setIsModalOpen(true)} />
      
      <DonationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}

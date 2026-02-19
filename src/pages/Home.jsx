import { useState } from 'react'
import Hero from '../components/Hero'
import DonationCounter from '../components/DonationCounter'
import DonorsList from '../components/DonorsList'
import DonationModal from '../components/DonationModal'
import Footer from '../components/Footer'

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="min-h-screen">
      <Hero onDonateClick={() => setIsModalOpen(true)} />
      <DonationCounter />
      <DonorsList />
      <Footer onDonateClick={() => setIsModalOpen(true)} />
      
      <DonationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}

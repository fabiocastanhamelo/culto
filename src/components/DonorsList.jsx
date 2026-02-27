import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Marquee from './ui/Marquee'


export default function DonorsList() {
  const [recentDonors, setRecentDonors] = useState([])

  useEffect(() => {
    // Buscar doadores recentes
    fetchRecentDonors()

    // Configurar realtime subscription
    const channel = supabase
      .channel('donors-list-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: 'status=eq.approved'
        },
        () => {
          fetchRecentDonors()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchRecentDonors = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('donor_name, amount, created_at')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw error
      if (data) setRecentDonors(data)
    } catch (error) {
      console.error('Erro ao buscar doadores:', error)
    }
  }

  if (recentDonors.length === 0) {
    return null
  }

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent"
        >
          🌟 Últimas Contribuições
        </motion.h2>

        <div className="relative">
          {/* Gradientes laterais para efeito de fade */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-950 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-950 to-transparent z-10" />

          <Marquee>
            {recentDonors.map((donor, index) => (
              <DonorCard key={index} donor={donor} />
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  )
}

function DonorCard({ donor }) {
  return (
    <div className="flex items-center gap-3 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm px-6 py-4 rounded-2xl border border-slate-700/50 min-w-[280px]">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-2xl flex-shrink-0">
        💝
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white truncate">{donor.donor_name}</p>
        <p className="text-primary-400 font-bold">
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(donor.amount)}
        </p>
      </div>
    </div>
  )
}

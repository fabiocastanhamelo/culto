import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import NumberTicker from './ui/NumberTicker'
import { motion } from 'framer-motion'

export default function DonationCounter() {
  const [totalAmount, setTotalAmount] = useState(0)
  const [donorCount, setDonorCount] = useState(0)

  useEffect(() => {
    // Buscar total inicial
    fetchTotalDonations()

    // Configurar realtime subscription
    const channel = supabase
      .channel('donations-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'donors'
        },
        () => {
          fetchTotalDonations()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchTotalDonations = async () => {
    try {
      const { data, error } = await supabase
        .from('donors')
        .select('total_donated')

      if (error) throw error

      if (data) {
        const total = data.reduce((sum, donor) => sum + (donor.total_donated || 0), 0)
        setTotalAmount(total)
        setDonorCount(data.length)
      }
    } catch (error) {
      console.error('Erro ao buscar doações:', error)
    }
  }

  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center py-10 lg:py-0 px-4 relative z-10">
      <div className="w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-br from-primary-900/30 to-primary-950/30 backdrop-blur-xl rounded-3xl p-12 border border-primary-500/20 overflow-hidden"
        >
          {/* Efeito de brilho de fundo */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-600/20 rounded-full blur-[120px] -z-10" />

          <div className="text-center relative z-10">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-semibold text-gray-200 mb-8"
            >
              🎯 Total Arrecadado
            </motion.h2>

            <div className="mb-8">
              <NumberTicker
                value={totalAmount}
                className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-primary-400 via-primary-300 to-primary-500 bg-clip-text text-transparent"
              />
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-8 text-gray-300"
            >
              <div className="flex items-center gap-2">
                <span className="text-3xl">👥</span>
                <div className="text-left">
                  <div className="text-3xl font-bold text-primary-400">{donorCount}</div>
                  <div className="text-sm text-gray-400">Doadores</div>
                </div>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-8 text-gray-400 text-sm"
            >
              💫 As doações são atualizadas em tempo real
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

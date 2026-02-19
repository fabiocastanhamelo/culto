import RetroGrid from './ui/RetroGrid'
import ShimmerButton from './ui/ShimmerButton'
import { motion } from 'framer-motion'

export default function Hero({ onDonateClick }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <RetroGrid />
      
      <div className="container mx-auto px-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge de Evento */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block mb-6"
          >
            <span className="px-6 py-2 bg-primary-600/20 border border-primary-500/50 rounded-full text-primary-400 text-sm font-semibold backdrop-blur-sm">
              📅 20, 21 e 22 de Novembro de 2026
            </span>
          </motion.div>

          {/* Título Principal */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-primary-100 to-primary-300 bg-clip-text text-transparent leading-tight"
          >
            16º Culto de
            <br />
            Ação de Graças
          </motion.h1>

          {/* Subtítulo */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl md:text-2xl text-gray-300 mb-4"
          >
            Congregações Parque Savoy & Guarulhos
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto"
          >
            📍 São Paulo, SP • Junte-se a nós neste momento especial de gratidão e celebração
          </motion.p>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
          >
            <ShimmerButton onClick={onDonateClick} className="text-lg">
              <span>💝</span>
              Quero Contribuir
            </ShimmerButton>
          </motion.div>
        </motion.div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent z-5" />
    </section>
  )
}

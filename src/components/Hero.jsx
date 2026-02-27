import ShimmerButton from './ui/ShimmerButton'


export default function Hero({ onDonateClick }) {
  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center pt-24 pb-16 lg:py-0 z-10">
      <div className="container mx-auto px-4">
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
            className="text-4xl md:text-6xl lg:text-5xl xl:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-primary-100 to-primary-300 bg-clip-text text-transparent leading-tight"
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
            className="text-xl md:text-2xl lg:text-xl xl:text-2xl text-gray-300 mb-4"
          >
            Congregações Parque Savoy & Guarulhos
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-base lg:text-sm xl:text-lg text-gray-400 mb-12 max-w-2xl mx-auto"
          >
            📍  • Junte-se a nós neste momento especial de gratidão e celebração
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
    </div>
  )
}

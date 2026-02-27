import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Error() {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    window.scrollTo(0, 0)
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          navigate('/')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        {/* Error Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-8"
        >
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(239,68,68,0.4)]">
            <svg
              className="w-16 h-16 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Pagamento não Concluído
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Houve um problema ao processar seu pagamento.
          </p>
          
          <div className="bg-slate-800/50 rounded-2xl p-6 mb-6 border border-slate-700 backdrop-blur-sm">
            <p className="text-gray-400 text-sm mb-3">
              Não se preocupe, nenhum valor foi cobrado.
            </p>
            <p className="text-gray-400 text-sm">
              💡 Você pode tentar novamente quando quiser.
            </p>
          </div>

          {/* Countdown */}
          <div className="bg-primary-600/20 border border-primary-500/50 rounded-xl p-4 mb-6">
            <p className="text-primary-300 text-sm">
              Voltando para home em <span className="text-2xl font-bold text-primary-400">{countdown}s</span>
            </p>
          </div>

          <div className="flex flex-col gap-3 mb-6">
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-600 text-white font-bold rounded-xl transition-all hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]"
            >
              Tentar Novamente
            </button>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
            <p className="text-xs text-gray-500 mb-2">
              Possíveis causas:
            </p>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Pagamento cancelado</li>
              <li>• Saldo insuficiente</li>
              <li>• Erro na operadora do cartão</li>
              <li>• Dados incorretos</li>
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

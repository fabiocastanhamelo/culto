import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'


export default function Pending() {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(8)

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
        {/* Pending Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-8"
        >
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(234,179,8,0.4)]">
            <motion.svg
              className="w-16 h-16 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </motion.svg>
          </div>
        </motion.div>

        {/* Pending Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Pagamento em Análise ⏳
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Estamos processando seu pagamento.
          </p>

          <div className="bg-slate-800/50 rounded-2xl p-6 mb-6 border border-slate-700 backdrop-blur-sm">
            <p className="text-gray-400 text-sm mb-3">
              Seu pagamento está sendo analisado pelo Mercado Pago.
              Isso pode levar alguns minutos ou até 48 horas, dependendo do método escolhido.
            </p>
            <p className="text-gray-400 text-sm">
              📧 Você receberá uma confirmação por e-mail assim que for aprovado.
            </p>
          </div>

          {/* Countdown */}
          <div className="bg-primary-600/20 border border-primary-500/50 rounded-xl p-4 mb-6">
            <p className="text-primary-300 text-sm">
              Voltando para home em <span className="text-2xl font-bold text-primary-400">{countdown}s</span>
            </p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-600 text-white font-bold rounded-xl transition-all hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] mb-6"
          >
            Voltar para a Página Inicial
          </button>

          <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
            <p className="text-sm text-blue-400 mb-2 font-semibold">
              💡 O que fazer agora?
            </p>
            <ul className="text-xs text-gray-400 space-y-2 text-left">
              <li>• Aguarde a confirmação por e-mail</li>
              <li>• Verifique sua caixa de entrada e spam</li>
              <li>• Se aprovado, sua doação aparecerá automaticamente no site</li>
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

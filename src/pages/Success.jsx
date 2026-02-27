import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'


export default function Success() {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0)

    // Countdown
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
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-8"
        >
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.4)]">
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
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Doação Confirmada! 🎉
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Muito obrigado pela sua generosidade!
          </p>

          <div className="bg-slate-800/50 rounded-2xl p-6 mb-6 border border-slate-700 backdrop-blur-sm">
            <p className="text-gray-400 text-sm mb-3">
              Sua contribuição é fundamental para o sucesso do
              <strong className="text-primary-400"> 16º Culto de Ação de Graças</strong>.
            </p>
            <p className="text-gray-400 text-sm">
              💝 Que Deus abençoe você abundantemente!
            </p>
          </div>

          {/* Countdown */}
          <div className="bg-primary-600/20 border border-primary-500/50 rounded-xl p-4 mb-6">
            <p className="text-primary-300 text-sm">
              Redirecionando em <span className="text-2xl font-bold text-primary-400">{countdown}s</span>
            </p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-600 text-white font-bold rounded-xl transition-all hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]"
          >
            Voltar Agora
          </button>

          <p className="mt-6 text-sm text-gray-500">
            📧 Você receberá um comprovante por e-mail
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

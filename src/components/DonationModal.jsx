import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { AnimatePresence } from 'framer-motion'

export default function DonationModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    amount: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validações
      if (!formData.name || !formData.phone || !formData.amount) {
        throw new Error('Preencha todos os campos')
      }

      const amount = parseFloat(formData.amount.replace(',', '.'))
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Valor inválido')
      }

      // Limpar telefone (remover caracteres especiais)
      const cleanPhone = formData.phone.replace(/\D/g, '')

      // Validar formato de telefone brasileiro
      if (cleanPhone.length !== 10 && cleanPhone.length !== 11) {
        throw new Error('Digite um número de telefone válido')
      }

      // Validar DDD (códigos de área válidos no Brasil)
      const ddd = parseInt(cleanPhone.substring(0, 2))
      const validDDDs = [11, 12, 13, 14, 15, 16, 17, 18, 19, // SP
        21, 22, 24, // RJ
        27, 28, // ES
        31, 32, 33, 34, 35, 37, 38, // MG
        41, 42, 43, 44, 45, 46, // PR
        47, 48, 49, // SC
        51, 53, 54, 55, // RS
        61, // DF
        62, 64, // GO
        63, // TO
        65, 66, // MT
        67, // MS
        68, // AC
        69, // RO
        71, 73, 74, 75, 77, // BA
        79, // SE
        81, 87, // PE
        82, // AL
        83, // PB
        84, // RN
        85, 88, // CE
        86, 89, // PI
        91, 93, 94, // PA
        92, 97, // AM
        95, // RR
        96, // AP
        98, 99] // MA

      if (!validDDDs.includes(ddd)) {
        throw new Error('DDD inválido. Verifique o código de área.')
      }

      // Se for celular (11 dígitos), validar que começa com 9
      if (cleanPhone.length === 11) {
        const thirdDigit = cleanPhone.charAt(2)
        if (thirdDigit !== '9') {
          throw new Error('Celular deve começar com 9 após o DDD. Ex: (11) 9xxxx-xxxx')
        }
      }

      // Criar transação pendente no Supabase
      const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
        .insert([
          {
            status: 'pending',
            amount: amount,
            donor_name: formData.name,
            donor_phone: cleanPhone,
          }
        ])
        .select()
        .single()

      if (transactionError) throw transactionError

      // Chamar Edge Function para criar preferência de pagamento
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

      const response = await fetch(
        `${supabaseUrl}/functions/v1/criar-pagamento`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`
          },
          body: JSON.stringify({
            nome: formData.name,
            telefone: cleanPhone,
            valor: amount,
            transactionId: transaction.id
          })
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao criar pagamento')
      }

      const { init_point } = await response.json()

      // Redirecionar para o Mercado Pago
      window.location.href = init_point

    } catch (err) {
      setError(err.message || 'Erro ao processar doação')
      setLoading(false)
    }
  }

  const formatCurrency = (value) => {
    const numbers = value.replace(/\D/g, '')
    const amount = parseFloat(numbers) / 100
    return amount.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const handleAmountChange = (e) => {
    const formatted = formatCurrency(e.target.value)
    setFormData({ ...formData, amount: formatted })
  }

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '').substring(0, 11) // Limita a 11 dígitos

    // Sem dígitos
    if (numbers.length === 0) return ''

    // Apenas DDD (1-2 dígitos)
    if (numbers.length <= 2) return `(${numbers}`

    // DDD completo (3-6 dígitos) - ainda não sabe se é fixo ou celular
    if (numbers.length <= 6) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    }

    // 7-10 dígitos - formato de fixo
    if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6, 10)}`
    }

    // 11 dígitos - formato de celular
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
  }

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value)
    setFormData({ ...formData, phone: formatted })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl p-8 max-w-md w-full border border-slate-700 shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">💝</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Faça sua Contribuição
              </h3>
              <p className="text-gray-400 text-sm">
                Sua doação ajuda a realizar este evento especial
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                  placeholder="Seu nome"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Telefone (Celular ou Fixo)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                  placeholder="Digite seu telefone"
                  required
                />
                <div className="mt-1 flex flex-col sm:flex-row sm:gap-1 text-xs text-gray-500">
                  <span>📱 Celular: (11) 9xxxx-xxxx</span>
                  <span className="hidden sm:inline">•</span>
                  <span>☎️ Fixo: (11) xxxx-xxxx</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Valor da Doação
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                    R$
                  </span>
                  <input
                    type="text"
                    value={formData.amount}
                    onChange={handleAmountChange}
                    className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                    placeholder="0,00"
                    required
                  />
                </div>
              </div>

              {/* Sugestões de valores */}
              <div className="flex gap-2">
                {[20, 50, 100, 200].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFormData({ ...formData, amount: value.toFixed(2).replace('.', ',') })}
                    className="flex-1 px-3 py-2 bg-slate-800/50 hover:bg-primary-600/20 border border-slate-700 hover:border-primary-500 rounded-lg text-sm text-gray-300 hover:text-primary-400 transition-all"
                  >
                    R$ {value}
                  </button>
                ))}
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-600 text-white font-bold rounded-xl transition-all hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processando...' : 'Continuar para Pagamento'}
              </button>
            </form>

            <p className="mt-4 text-xs text-center text-gray-500">
              🔒 Pagamento seguro via Mercado Pago
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

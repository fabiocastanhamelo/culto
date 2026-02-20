import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { motion, AnimatePresence } from 'framer-motion'

export default function RSVPModal({ isOpen, onClose }) {
    const [formData, setFormData] = useState({ name: '', phone: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const formatPhone = (value) => {
        const numbers = value.replace(/\D/g, '').substring(0, 11)
        if (numbers.length === 0) return ''
        if (numbers.length <= 2) return `(${numbers}`
        if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
        if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6, 10)}`
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
    }

    const handlePhoneChange = (e) => {
        setFormData({ ...formData, phone: formatPhone(e.target.value) })
    }

    const handleClose = () => {
        setFormData({ name: '', phone: '' })
        setError('')
        setSuccess(false)
        onClose()
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            if (!formData.name.trim() || !formData.phone.trim()) {
                throw new Error('Preencha todos os campos')
            }

            const cleanPhone = formData.phone.replace(/\D/g, '')
            if (cleanPhone.length < 10) {
                throw new Error('Digite um número de telefone válido')
            }

            const { error: insertError } = await supabase
                .from('rsvp')
                .insert([{ name: formData.name.trim(), phone: cleanPhone }])

            if (insertError) throw insertError

            setSuccess(true)
        } catch (err) {
            setError(err.message || 'Erro ao confirmar presença')
        } finally {
            setLoading(false)
        }
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
                        onClick={handleClose}
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
                            onClick={handleClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {!success ? (
                            <>
                                {/* Header */}
                                <div className="text-center mb-6">
                                    <div className="text-5xl mb-3">🙋</div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Confirme sua Presença</h3>
                                    <p className="text-gray-400 text-sm">
                                        Informe seus dados para garantir seu lugar no evento
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
                                            placeholder="Seu nome completo"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Telefone
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={handlePhoneChange}
                                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                                            placeholder="(11) 98765-4321"
                                            required
                                        />
                                    </div>

                                    {error && (
                                        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-600 text-white font-bold rounded-xl transition-all hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Confirmando...' : '✅ Confirmar Presença'}
                                    </button>
                                </form>

                                <p className="mt-4 text-xs text-center text-gray-500">
                                    🔒 Seus dados serão usados apenas para organização do evento
                                </p>
                            </>
                        ) : (
                            /* Success State */
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-6"
                            >
                                <div className="text-6xl mb-4">🎉</div>
                                <h3 className="text-2xl font-bold text-white mb-3">Presença Confirmada!</h3>
                                <p className="text-gray-400 mb-2">
                                    Obrigado, <span className="text-primary-400 font-semibold">{formData.name}</span>!
                                </p>
                                <p className="text-gray-400 text-sm mb-6">
                                    Sua presença no 16º Culto de Ação de Graças foi registrada. Nos vemos lá! 🙏
                                </p>
                                <button
                                    onClick={handleClose}
                                    className="px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl transition-all hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]"
                                >
                                    Fechar
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

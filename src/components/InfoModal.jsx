import { motion, AnimatePresence } from 'framer-motion'

export default function InfoModal({ isOpen, onClose }) {
    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl p-8 max-w-2xl w-full border border-slate-700 shadow-2xl max-h-[90vh] overflow-y-auto"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="prose prose-invert max-w-none">
                        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 bg-gradient-to-r from-primary-400 to-primary-200 bg-clip-text text-transparent">
                            Informações Sobre o Evento
                        </h2>

                        <div className="bg-primary-900/20 border border-primary-500/20 rounded-xl p-4 mb-6">
                            <p className="text-primary-200 font-medium text-center m-0">
                                Shalom a todos!
                            </p>
                            <p className="text-gray-300 text-sm text-center mt-2 m-0">
                                Estamos nos aproximando do nosso evento e a alegria de estarmos juntos para esses três dias de comunhão é imensa.
                            </p>
                        </div>

                        <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                            <span>🍽️</span> 1. Alimentação e Cuidado
                        </h3>
                        <p className="text-gray-400 mb-6">
                            Preparamos um cardápio completo que inclui Café da Manhã, Almoço, Café da Tarde e Jantar para todos os dias (totalizando 12 refeições).
                        </p>

                        <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                            <span>💰</span> 2. Contribuição e Taxa Mínima
                        </h3>
                        <p className="text-gray-400 mb-4">
                            Sempre trabalhamos com o coração aberto para doações espontâneas, mas, para garantir que os custos fixos de locação do espaço e alimentação de 120 pessoas sejam cobertos sem déficit, estabelecemos uma Taxa de Inscrição Mínima Obrigatória:
                        </p>

                        <div className="bg-slate-800/50 rounded-lg p-4 mb-4 border border-slate-700">
                            <p className="text-white font-bold text-lg text-center m-0">
                                Valor por pessoa: <span className="text-primary-400">R$ 120,00</span>
                            </p>
                            <p className="text-gray-400 text-xs text-center mt-1 m-0">
                                (Referente aos 3 dias completos)
                            </p>
                            <p className="text-gray-300 text-sm text-center mt-3 border-t border-slate-700 pt-3 m-0">
                                O que este valor cobre? O pernoite no local e as 12 refeições preparadas na hora.
                            </p>
                        </div>

                        <p className="text-gray-400 text-sm italic mb-6">
                            <strong>Por que a taxa mínima?</strong> Dividindo o valor total, cada dia de evento (com hospedagem e 4 refeições) custará apenas R$ 40,00 por participante. Este é um valor de custo, negociado para que todos possam participar.
                        </p>

                        <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                            <span>💝</span> 3. Como contribuir a mais?
                        </h3>
                        <p className="text-gray-400 mb-6">
                            Se você sente no coração o desejo de ajudar além do mínimo, sua doação extra será muito bem-vinda! Ela será integralmente revertida para o fundo de hospitalidade.
                        </p>

                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                            <p className="text-red-200 font-bold m-0">
                                📅 Prazo para Confirmação e Pagamento: 30/12/2026
                            </p>
                        </div>

                        <p className="text-center text-gray-500 text-sm mt-8">
                            Contamos com a compreensão e o apoio de todos para que este evento seja um marco de benção e organização em nosso meio.
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

import { motion } from 'framer-motion'
import ShimmerButton from './ui/ShimmerButton'

export default function Header({ onInfoClick, onRSVPClick }) {
    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="fixed top-0 left-0 right-0 z-40 px-4 py-4 md:py-6"
        >
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 max-w-6xl">
                {/* Logo / Brand (Optional - keeping it simple or empty if no logo provided) */}
                <div className="hidden md:block">
                    {/* Placeholder for left side if needed, or just justify-end */}
                </div>

                <nav className="flex flex-col md:flex-row items-center gap-4 bg-slate-900/50 backdrop-blur-md px-6 py-3 rounded-full border border-slate-700/50 shadow-xl w-full md:w-auto">
                    <button
                        onClick={onInfoClick}
                        className="text-gray-300 hover:text-white text-sm font-medium transition-colors px-4 py-2 hover:bg-white/5 rounded-full whitespace-nowrap"
                    >
                        ℹ️ Informações Sobre o Evento
                    </button>

                    <div className="h-4 w-px bg-slate-700 hidden md:block" />

                    <ShimmerButton
                        onClick={onRSVPClick}
                        className="text-sm px-6 py-2 h-auto min-h-[40px]"
                    >
                        Confirme sua presença
                    </ShimmerButton>
                </nav>
            </div>
        </motion.header>
    )
}

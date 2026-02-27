
import ShimmerButton from './ui/ShimmerButton'

export default function Header({ onInfoClick, onRSVPClick }) {
    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="fixed top-0 left-0 right-0 z-40 px-3 py-3 md:py-6"
        >
            <div className="container mx-auto flex flex-row items-center justify-center gap-2 md:gap-4 max-w-6xl">
                <nav className="flex flex-row items-center gap-2 md:gap-4 bg-slate-900/50 backdrop-blur-md px-3 md:px-6 py-2 md:py-3 rounded-full border border-slate-700/50 shadow-xl">
                    <button
                        onClick={onInfoClick}
                        className="text-gray-300 hover:text-white text-xs md:text-sm font-medium transition-colors px-2 md:px-4 py-1.5 md:py-2 hover:bg-white/5 rounded-full whitespace-nowrap"
                    >
                        ℹ️ <span className="hidden sm:inline">Informações Sobre o Evento</span><span className="sm:hidden">Informações</span>
                    </button>

                    <div className="h-4 w-px bg-slate-700" />

                    <ShimmerButton
                        onClick={onRSVPClick}
                        className="text-xs md:text-sm px-3 md:px-6 py-1.5 md:py-2 h-auto min-h-[34px] md:min-h-[40px]"
                    >
                        <span className="hidden sm:inline">Confirme sua presença</span><span className="sm:hidden">Confirmar</span>
                    </ShimmerButton>
                </nav>
            </div>
        </motion.header>
    )
}

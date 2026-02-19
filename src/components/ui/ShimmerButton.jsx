export default function ShimmerButton({ children, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`
        group relative inline-flex items-center justify-center overflow-hidden
        rounded-full px-8 py-4 font-bold text-white
        transition-all duration-300 ease-in-out
        bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600
        bg-[length:200%_100%] hover:bg-right-bottom
        hover:shadow-[0_0_40px_8px_rgba(239,68,68,0.5)]
        hover:scale-105
        ${className}
      `}
      style={{
        animation: 'shimmer 3s linear infinite',
      }}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
    </button>
  )
}

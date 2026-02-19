export default function RetroGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(239, 68, 68, 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(239, 68, 68, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          transform: 'perspective(1000px) rotateX(60deg)',
          transformOrigin: 'center top',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950" />
    </div>
  )
}

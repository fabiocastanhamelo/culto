export default function Marquee({ children, reverse = false }) {
  return (
    <div className="relative flex overflow-hidden py-5">
      <div className={`flex ${reverse ? 'animate-marquee2' : 'animate-marquee'} gap-4`}>
        {children}
      </div>
      <div className={`flex ${reverse ? 'animate-marquee2' : 'animate-marquee'} gap-4 absolute top-0`} aria-hidden="true">
        {children}
      </div>
    </div>
  )
}

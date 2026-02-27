import { useEffect, useRef } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

export default function NumberTicker({ value, className = '' }) {
  const ref = useRef(null)
  const motionValue = useSpring(0, { 
    mass: 0.8, 
    stiffness: 75, 
    damping: 15 
  })
  const display = useTransform(motionValue, (latest) => 
    Math.round(latest).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  )

  useEffect(() => {
    motionValue.set(value)
  }, [motionValue, value])

  return (
    <motion.span ref={ref} className={className}>
      {display}
    </motion.span>
  )
}

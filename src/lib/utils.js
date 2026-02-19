import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utilitário para mesclar classes do Tailwind CSS
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Formata valor monetário para BRL
 */
export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

/**
 * Formata telefone brasileiro
 */
export function formatPhone(phone) {
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }
  
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  
  return phone
}

/**
 * Limpa telefone (remove caracteres especiais)
 */
export function cleanPhone(phone) {
  return phone.replace(/\D/g, '')
}

/**
 * Valida telefone brasileiro
 */
export function isValidPhone(phone) {
  const cleaned = cleanPhone(phone)
  return cleaned.length >= 10 && cleaned.length <= 11
}

/**
 * Valida valor monetário
 */
export function isValidAmount(amount) {
  const parsed = parseFloat(amount)
  return !isNaN(parsed) && parsed > 0
}

/**
 * Formata data relativa (ex: "há 5 minutos")
 */
export function formatRelativeTime(date) {
  const now = new Date()
  const past = new Date(date)
  const diffInSeconds = Math.floor((now - past) / 1000)
  
  if (diffInSeconds < 60) {
    return 'agora mesmo'
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `há ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `há ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`
  }
  
  const diffInDays = Math.floor(diffInHours / 24)
  return `há ${diffInDays} ${diffInDays === 1 ? 'dia' : 'dias'}`
}

/**
 * Debounce function
 */
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

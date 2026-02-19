import { createClient } from '@supabase/supabase-js'

// SUBSTITUA ESTAS VARIÁVEIS COM AS SUAS CREDENCIAIS DO SUPABASE
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xplsdoztojxmxvarrori.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwbHNkb3p0b2p4bXh2YXJyb3JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MTQ5MDYsImV4cCI6MjA4NjQ5MDkwNn0.a0fnLiPN3kEjFiC1OyF3HNN1DyadZWQgb6R4CBzliTk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

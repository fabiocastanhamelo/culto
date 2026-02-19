// @ts-ignore - Deno runtime imports
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
// @ts-ignore - ESM.sh CDN import
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const body = await req.json()
    
    // Mercado Pago envia notificações no formato { data: { id: "payment_id" } }
    if (!body.data || !body.data.id) {
      return new Response(JSON.stringify({ ok: true }), { status: 200 })
    }

    const paymentId = body.data.id
    // @ts-ignore - Deno global available in Edge Functions
    const mercadoPagoAccessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN')

    // Buscar informações do pagamento
    const paymentResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          'Authorization': `Bearer ${mercadoPagoAccessToken}`
        }
      }
    )

    if (!paymentResponse.ok) {
      throw new Error('Erro ao buscar pagamento')
    }

    const payment = await paymentResponse.json()

    // Processar apenas pagamentos aprovados
    if (payment.status === 'approved') {
      // @ts-ignore - Deno global available in Edge Functions
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!
      // @ts-ignore - Deno global available in Edge Functions
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      const supabase = createClient(supabaseUrl, supabaseKey)

      // Chamar função SQL para processar aprovação
      const { error } = await supabase.rpc('process_payment_approval', {
        p_transaction_id: payment.external_reference,
        p_mercado_pago_id: payment.id.toString()
      })

      if (error) {
        console.error('Erro ao processar aprovação:', error)
        throw error
      }
    }

    return new Response(
      JSON.stringify({ ok: true }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    console.error('Erro no webhook:', error)
    // Sempre retornar 200 para o MP não reenviar
    return new Response(
      JSON.stringify({ ok: true }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 200
      }
    )
  }
})

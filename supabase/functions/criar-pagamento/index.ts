// @ts-ignore - Deno runtime imports
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
// @ts-ignore - ESM.sh CDN import
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { nome, telefone, valor, transactionId } = await req.json()

    // Validações
    if (!nome || !telefone || !valor) {
      throw new Error('Dados incompletos')
    }

    // Criar preferência no Mercado Pago
    // @ts-ignore - Deno global available in Edge Functions
    const mercadoPagoAccessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN')
    
    // Obter origin de forma robusta
    let origin = req.headers.get('origin')
    if (!origin) {
      const referer = req.headers.get('referer')
      if (referer) {
        try {
          const url = new URL(referer)
          origin = `${url.protocol}//${url.host}`
        } catch {
          origin = 'http://localhost:5173'
        }
      } else {
        origin = 'http://localhost:5173'
      }
    }
    
    // Garantir que as URLs sejam válidas
    const backUrls = {
      success: `${origin}/`,
      failure: `${origin}/`,
      pending: `${origin}/`
    }
    
    const preference = {
      items: [
        {
          title: '16º Culto de Ação de Graças - Doação',
          description: `Doação de ${nome}`,
          quantity: 1,
          unit_price: parseFloat(valor),
          currency_id: 'BRL'
        }
      ],
      payer: {
        name: nome,
        phone: {
          number: telefone.replace(/\D/g, '')
        }
      },
      back_urls: backUrls,
      auto_return: 'approved',
      external_reference: transactionId,
      notification_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/webhook-pagamento`
    }

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mercadoPagoAccessToken}`
      },
      body: JSON.stringify(preference)
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Erro ao criar preferência: ${error}`)
    }

    const data = await response.json()

    return new Response(
      JSON.stringify({ 
        init_point: data.init_point,
        preference_id: data.id 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})

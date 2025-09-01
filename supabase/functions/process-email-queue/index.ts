import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get pending emails from queue
    const { data: emails, error: fetchError } = await supabase
      .from('email_queue')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(10)

    if (fetchError) {
      console.error('Error fetching emails:', fetchError)
      return new Response(JSON.stringify({ error: 'Failed to fetch emails' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!emails || emails.length === 0) {
      return new Response(JSON.stringify({ message: 'No pending emails to process' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const results = []

    // Process each email
    for (const email of emails) {
      try {
        // Send email using Resend API (you can replace with SendGrid, Mailgun, etc.)
        const resendApiKey = Deno.env.get('RESEND_API_KEY')
        
        if (resendApiKey) {
          const emailResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: email.from_email || 'SeventyTwo Hub <hello@hapogroup.co.za>',
              to: email.to_email,
              subject: email.subject,
              html: email.html_content,
              reply_to: email.reply_to
            }),
          })

          if (emailResponse.ok) {
            // Mark email as sent
            await supabase
              .from('email_queue')
              .update({ 
                status: 'sent', 
                processed_at: new Date().toISOString() 
              })
              .eq('id', email.id)

            results.push({ id: email.id, status: 'sent', to: email.to_email })
            console.log(`Email sent successfully to ${email.to_email}`)
          } else {
            const errorText = await emailResponse.text()
            console.error(`Failed to send email to ${email.to_email}:`, errorText)
            
            // Mark as failed
            await supabase
              .from('email_queue')
              .update({ 
                status: 'failed', 
                processed_at: new Date().toISOString() 
              })
              .eq('id', email.id)

            results.push({ id: email.id, status: 'failed', to: email.to_email, error: errorText })
          }
        } else {
          // No email service configured, keep as pending
          console.log(`No email service configured, keeping email ${email.id} as pending`)
          results.push({ id: email.id, status: 'pending', to: email.to_email, message: 'No email service configured' })
        }
      } catch (error) {
        console.error(`Error processing email ${email.id}:`, error)
        results.push({ id: email.id, status: 'error', to: email.to_email, error: error.message })
      }
    }

    return new Response(JSON.stringify({ 
      processed: results.length, 
      results 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

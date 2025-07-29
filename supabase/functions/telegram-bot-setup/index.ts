import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const telegramBotToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    if (!telegramBotToken) {
      throw new Error('TELEGRAM_BOT_TOKEN not configured');
    }

    const { action } = await req.json();

    switch (action) {
      case 'set_webhook': {
        const webhookUrl = `https://cywngfflmpdpuqaigsjc.functions.supabase.co/functions/v1/telegram-webhook`;
        
        console.log('Setting webhook to:', webhookUrl);

        const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/setWebhook`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: webhookUrl,
            allowed_updates: ['message', 'callback_query']
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(`Failed to set webhook: ${result.description}`);
        }

        console.log('Webhook set successfully:', result);

        return new Response(JSON.stringify({
          success: true,
          message: 'Webhook set successfully',
          webhookUrl,
          result
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'get_webhook_info': {
        const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/getWebhookInfo`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(`Failed to get webhook info: ${result.description}`);
        }

        return new Response(JSON.stringify({
          success: true,
          webhookInfo: result.result
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'delete_webhook': {
        const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/deleteWebhook`, {
          method: 'POST'
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(`Failed to delete webhook: ${result.description}`);
        }

        return new Response(JSON.stringify({
          success: true,
          message: 'Webhook deleted successfully',
          result
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'get_bot_info': {
        const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/getMe`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(`Failed to get bot info: ${result.description}`);
        }

        return new Response(JSON.stringify({
          success: true,
          botInfo: result.result
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        throw new Error('Invalid action. Use: set_webhook, get_webhook_info, delete_webhook, or get_bot_info');
    }

  } catch (error) {
    console.error('Error in telegram-bot-setup:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: (error as Error).message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
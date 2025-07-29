import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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

    const supabaseUrl = 'https://cywngfflmpdpuqaigsjc.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5d25nZmZsbXBkcHVxYWlnc2pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMjUyMTQsImV4cCI6MjA2NDcwMTIxNH0.-fFn7DEY-XDxf3LwNkSFJJuMTT1Mrd4Qbs7Hims-w_g';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { message, parseMode = 'HTML', userIds = [] } = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    console.log('Starting broadcast message:', message);

    // Aktif Telegram kullanıcılarını al
    let query = supabase
      .from('telegram_users')
      .select('telegram_chat_id, telegram_username')
      .eq('is_active', true);

    // Eğer belirli kullanıcılar belirtilmişse onları filtrele
    if (userIds.length > 0) {
      query = query.in('user_id', userIds);
    }

    const { data: telegramUsers, error } = await query;

    if (error) {
      console.error('Error fetching telegram users:', error);
      throw new Error('Failed to fetch telegram users');
    }

    if (!telegramUsers || telegramUsers.length === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'No active telegram users found',
        sentCount: 0,
        failedCount: 0
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Found ${telegramUsers.length} active telegram users`);

    const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
    let sentCount = 0;
    let failedCount = 0;
    const results = [];

    // Her kullanıcıya mesaj gönder
    for (const user of telegramUsers) {
      try {
        const response = await fetch(telegramUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: user.telegram_chat_id,
            text: message,
            parse_mode: parseMode,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          sentCount++;
          results.push({
            chatId: user.telegram_chat_id,
            username: user.telegram_username,
            success: true,
            messageId: result.result.message_id
          });
          console.log(`Message sent to ${user.telegram_username} (${user.telegram_chat_id})`);
        } else {
          failedCount++;
          results.push({
            chatId: user.telegram_chat_id,
            username: user.telegram_username,
            success: false,
            error: result.description
          });
          console.error(`Failed to send to ${user.telegram_username}: ${result.description}`);
        }

        // Rate limiting - Telegram allows 30 messages per second to different users
        await new Promise(resolve => setTimeout(resolve, 50));

      } catch (error) {
        failedCount++;
        results.push({
          chatId: user.telegram_chat_id,
          username: user.telegram_username,
          success: false,
          error: (error as Error).message
        });
        console.error(`Error sending to ${user.telegram_username}:`, error);
      }
    }

    console.log(`Broadcast completed: ${sentCount} sent, ${failedCount} failed`);

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Broadcast completed',
      sentCount,
      failedCount,
      totalUsers: telegramUsers.length,
      results
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in telegram-broadcast:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: (error as Error).message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
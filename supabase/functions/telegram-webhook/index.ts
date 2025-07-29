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
    const supabaseUrl = 'https://cywngfflmpdpuqaigsjc.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5d25nZmZsbXBkcHVxYWlnc2pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMjUyMTQsImV4cCI6MjA2NDcwMTIxNH0.-fFn7DEY-XDxf3LwNkSFJJuMTT1Mrd4Qbs7Hims-w_g';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body = await req.json();
    console.log('Telegram webhook received:', JSON.stringify(body, null, 2));

    // Telegram'dan gelen mesaj varsa işle
    if (body.message) {
      const message = body.message;
      const chatId = message.chat.id;
      const text = message.text || '';
      const username = message.from?.username || '';
      const firstName = message.from?.first_name || '';

      console.log(`Message from ${firstName} (@${username}): ${text}`);

      // Kullanıcıyı telegram_users tablosuna ekle veya güncelle
      const { data: existingUser } = await supabase
        .from('telegram_users')
        .select('*')
        .eq('telegram_chat_id', chatId)
        .single();

      if (!existingUser) {
        // Yeni kullanıcı ekle
        const { error } = await supabase
          .from('telegram_users')
          .insert({
            telegram_chat_id: chatId,
            telegram_username: username,
            user_id: '00000000-0000-0000-0000-000000000000', // Placeholder, gerçek user_id bağlantısı sonra yapılacak
            customer_id: '00000000-0000-0000-0000-000000000000', // Placeholder
            is_active: true
          });

        if (error) {
          console.error('Error inserting new telegram user:', error);
        } else {
          console.log('New telegram user added:', chatId);
        }
      }

      // Mesajı telegram_messages tablosuna kaydet (tablo henüz yok, sonra eklenecek)
      // TODO: telegram_messages tablosunu oluştur ve mesajları kaydet
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in telegram-webhook:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
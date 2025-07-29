import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://cywngfflmpdpuqaigsjc.supabase.co"
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5d25nZmZsbXBkcHVxYWlnc2pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMjUyMTQsImV4cCI6MjA2NDcwMTIxNH0.-fFn7DEY-XDxf3LwNkSFJJuMTT1Mrd4Qbs7Hims-w_g"

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)

async function testConnection() {
  try {
    console.log('Testing Supabase connection...')
    
    // Test basic connection
    const { data, error } = await supabase
      .from('customers')
      .select('count(*)')
      .limit(1)
    
    if (error) {
      console.error('Connection error:', error)
      return false
    }
    
    console.log('✅ Supabase connection successful!')
    console.log('Data:', data)
    return true
    
  } catch (err) {
    console.error('❌ Connection failed:', err)
    return false
  }
}

testConnection()
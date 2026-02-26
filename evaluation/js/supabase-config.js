// ============================================
// Supabase Configuration
// ============================================

// Replace these with your actual Supabase credentials
const SUPABASE_URL = 'https://efccnepjgfwizhctxtqj.supabase.co'; // Your Project URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmY2NuZXBqZ2Z3aXpoY3R4dHFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5MzAyMTUsImV4cCI6MjA4NzUwNjIxNX0._GVzp0Ub0CU8Lona_WcYTdLsc1bT3bPW8gDTyuObvA4'; // Your Anon Key

// Initialize Supabase client
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test connection
async function testSupabaseConnection() {
  try {
    const { data, error } = await supabaseClient
      .from('teams')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection error:', error);
      return false;
    }
    console.log('✓ Supabase connected successfully');
    return true;
  } catch (err) {
    console.error('Connection test failed:', err);
    return false;
  }
}

// Call on page load
document.addEventListener('DOMContentLoaded', testSupabaseConnection);

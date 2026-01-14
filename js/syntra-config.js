/**
 * Syntra Forms Configuration
 *
 * IMPORTANT: Replace these values with your own Supabase project credentials
 *
 * How to get your credentials:
 * 1. Go to https://supabase.com/dashboard
 * 2. Select your project
 * 3. Go to Settings > API
 * 4. Copy the Project URL and anon/public key
 */

window.SYNTRA_CONFIG = {
  // Your Supabase project URL
  // Example: https://abcdefghijklmnop.supabase.co
  supabaseUrl: 'https://0ec90b57d6e95fcbda19832f.supabase.co',

  // Your Supabase anon/public key (safe to use in client-side code)
  // Example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw'
};

console.log('[Syntra Config] Configuration loaded:', {
  url: window.SYNTRA_CONFIG.supabaseUrl,
  keyPrefix: window.SYNTRA_CONFIG.supabaseKey.substring(0, 20) + '...'
});

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
  supabaseUrl: 'https://smrfpquwwojfvnypjmkd.supabase.co',

  // Your Supabase anon/public key (safe to use in client-side code)
  // Example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtcmZwcXV3d29qZnZueXBqbWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxNTY1NzMsImV4cCI6MjA4MjczMjU3M30.FdMEZNGwgtptar2K4YQbC9l61yAArBCNi4b7jLBiBuo'
};

console.log('[Syntra Config] Configuration loaded:', {
  url: window.SYNTRA_CONFIG.supabaseUrl,
  keyPrefix: window.SYNTRA_CONFIG.supabaseKey.substring(0, 20) + '...'
});

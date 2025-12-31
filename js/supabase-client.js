/**
 * Syntra Refining - Supabase Client Configuration
 *
 * This module initializes and exports a configured Supabase client instance.
 * Used across all forms on the Syntra website for database operations.
 *
 * Usage:
 *   Include this script before syntra-forms.js:
 *   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
 *   <script src="/js/supabase-client.js"></script>
 *   <script src="/js/syntra-forms.js"></script>
 */

(function(window) {
  'use strict';

  const SUPABASE_URL = 'https://rhwsiuchfmtbpeljaaoj.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJod3NpdWNoZm10YnBlbGphYW9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxNDU1ODIsImV4cCI6MjA4MjcyMTU4Mn0.CI6hWI0AnREP-jY6g1GKL1MEpiE1MdlFH4QMKyF9WVY';

  if (!window.supabase) {
    console.error('Supabase SDK not loaded. Please include the Supabase JS SDK before this script.');
    console.error('Add this before supabase-client.js: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>');
    return;
  }

  window.syntraSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  console.log('✓ Syntra Supabase client initialized');

})(window);

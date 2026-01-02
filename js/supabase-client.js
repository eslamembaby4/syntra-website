/**
 * Syntra Refining - Supabase Client
 * Unified form submission handler for all forms across syntrarefining.com
 *
 * Configuration:
 * - URL: https://woailjjdiamgvahcxnrj.supabase.co
 * - Key: Publishable Key (sb_publishable_*)
 * - Edge Function: send-form-notification (JWT verify OFF)
 */

const SUPABASE_URL = 'https://woailjjdiamgvahcxnrj.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_-z87K81PBPmGNHHpyLlsWg_ii6jMHd1';

let supabaseClient = null;

function initSupabase() {
  if (!window.supabase) {
    console.error('[Syntra Forms] Supabase SDK not loaded. Include CDN script first.');
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
    console.log('[Syntra Forms] Supabase client initialized');
  }

  return supabaseClient;
}

async function submitFormToDatabase(formData) {
  const client = initSupabase();
  if (!client) {
    throw new Error('Supabase client not initialized');
  }

  const payload = {
    form_type: formData.form_type,
    first_name: formData.first_name,
    last_name: formData.last_name || null,
    email: formData.email,
    phone: formData.phone || null,
    organization: formData.organization,
    company: formData.organization,
    interest_type: formData.interest_type,
    message: formData.message || null,
    additional_data: formData.additional_data || {}
  };

  console.log('[Syntra Forms] Submitting payload:', payload);

  const { data, error } = await client
    .from('form_submissions')
    .insert([payload])
    .select('reference_id')
    .single();

  if (error) {
    console.error('[Syntra Forms] Database error:', error);
    throw new Error(error.message || 'Failed to submit form to database');
  }

  if (!data || !data.reference_id) {
    throw new Error('No reference ID returned from database');
  }

  const referenceId = data.reference_id;
  console.log('[Syntra Forms] Form submitted successfully. Reference ID:', referenceId);

  sendEmailNotification(formData.form_type, referenceId, formData);

  return { referenceId, data };
}

function sendEmailNotification(formType, referenceId, formData) {
  const client = initSupabase();
  if (!client) return;

  console.log('[Syntra Forms] Sending email notification...');

  client.functions
    .invoke('send-form-notification', {
      body: {
        formType,
        referenceId,
        formData
      }
    })
    .then(result => {
      if (result.error) {
        console.warn('[Syntra Forms] Email notification failed (non-blocking):', result.error);
      } else {
        console.log('[Syntra Forms] Email notification sent successfully');
      }
    })
    .catch(err => {
      console.warn('[Syntra Forms] Email notification error (non-blocking):', err);
    });
}

window.submitFormToDatabase = submitFormToDatabase;
window.initSupabase = initSupabase;
window.supabaseClient = initSupabase();

console.log('[Syntra Forms] supabase-client.js loaded');

// NOTE: Update these values with your own Supabase project credentials
// Get them from: Supabase Dashboard → Settings → API → Publishable API keys
// These values are SAFE to expose in client-side code (protected by RLS)

const SUPABASE_URL = 'https://woailjjdiamgvahcxnrj.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_-z87K81PBPmGNHHpyLlsWg_ii6jMHd1';

// Create Supabase client (v2)
const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

// Expose globally if needed
window.supabaseClient = supabase;
window.supabaseUrl = SUPABASE_URL;
window.supabaseAnonKey = SUPABASE_PUBLISHABLE_KEY;

/**
 * Submit form data to database
 */
async function submitFormToDatabase(formData) {
  try {
    const { data, error } = await supabase
      .from('form_submissions')
      .insert([formData])
      .select()
      .single();

    if (error) throw error;

    // Fire-and-forget email notification
    sendEmailNotification(data);

    return { success: true, data };
  } catch (error) {
    console.error('Error submitting form:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send email notification via Edge Function
 * (Email failure MUST NOT block form submission)
 */
async function sendEmailNotification(submissionData) {
  try {
    const apiUrl = `${SUPABASE_URL}/functions/v1/send-form-notification`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formType: submissionData.form_type,
        referenceId: submissionData.reference_id,
        formData: submissionData,
      }),
    });

    if (!response.ok) {
      console.warn(
        'Email notification failed:',
        await response.text()
      );
    }
  } catch (error) {
    console.warn(
      'Email notification error (non-blocking):',
      error
    );
  }
}

const SUPABASE_URL = 'https://rhwsiuchfmtbpeljaaoj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJod3NpdWNoZm10YnBlbGphYW9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxNDU1ODIsImV4cCI6MjA4MjcyMTU4Mn0.CI6hWI0AnREP-jY6g1GKL1MEpiE1MdlFH4QMKyF9WVY';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

window.supabaseClient = supabase;
window.supabaseUrl = SUPABASE_URL;
window.supabaseAnonKey = SUPABASE_ANON_KEY;

async function submitFormToDatabase(formData) {
  try {
    const { data, error } = await supabase
      .from('form_submissions')
      .insert([formData])
      .select();

    if (error) throw error;

    // Send email notification to appropriate department
    await sendEmailNotification(data[0]);

    return { success: true, data };
  } catch (error) {
    console.error('Error submitting form:', error);
    return { success: false, error: error.message };
  }
}

async function sendEmailNotification(submissionData) {
  try {
    const apiUrl = `${SUPABASE_URL}/functions/v1/send-form-notification`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formType: submissionData.form_type,
        referenceId: submissionData.reference_id,
        formData: submissionData,
      }),
    });

    if (!response.ok) {
      console.warn('Failed to send email notification:', await response.text());
    } else {
      const result = await response.json();
      console.log('Email notification sent to:', result.destinationEmail);
    }
  } catch (error) {
    console.warn('Error sending email notification:', error);
    // Don't throw - we don't want to fail the form submission if email fails
  }
}

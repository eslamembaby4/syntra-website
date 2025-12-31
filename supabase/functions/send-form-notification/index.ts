import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// Email routing configuration
const EMAIL_ROUTES: Record<string, string> = {
  partner_inquiry: "commercial@syntrarefining.com",
  investor_inquiry: "investors@syntrarefining.com",
  observer_access_request: "commercial@syntrarefining.com",
  supplier_registration: "commercial@syntrarefining.com",
  supplier_document: "commercial@syntrarefining.com",
  rfq_response: "commercial@syntrarefining.com",
  supplier_document_submission: "commercial@syntrarefining.com",
  supplier_rfq_response: "commercial@syntrarefining.com",
  tds_package_request: "commercial@syntrarefining.com",
  sds_inquiry: "hse@syntrarefining.com",
  career_application: "careers@syntrarefining.com",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { formType, referenceId, formData } = await req.json();

    // Get the destination email based on form type
    const toEmail = EMAIL_ROUTES[formType] || "info@syntrarefining.com";

    // Format email subject and body
    const subject = `New ${formType.replace(/_/g, ' ').toUpperCase()} - ${referenceId}`;
    
    let body = `New form submission received:\n\n`;
    body += `Reference ID: ${referenceId}\n`;
    body += `Form Type: ${formType}\n`;
    body += `Submitted: ${new Date().toISOString()}\n\n`;
    body += `--- DETAILS ---\n\n`;
    
    // Add form fields
    for (const [key, value] of Object.entries(formData)) {
      if (value && key !== 'form_type' && key !== 'additional_data') {
        const fieldName = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

        // Format value based on type
        if (typeof value === 'object') {
          body += `${fieldName}: ${JSON.stringify(value, null, 2)}\n`;
        } else {
          body += `${fieldName}: ${value}\n`;
        }
      }
    }

    // Add additional data fields separately with better formatting
    if (formData.additional_data) {
      body += `\n--- ADDITIONAL INFORMATION ---\n\n`;
      for (const [key, value] of Object.entries(formData.additional_data)) {
        if (value) {
          const fieldName = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          body += `${fieldName}: ${value}\n`;
        }
      }
    }

    body += `\n\n--- END ---\n\n`;
    body += `View in admin dashboard: ${req.headers.get('origin') || 'https://syntrarefining.com'}/admin.html\n`;

    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Email service not configured'
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Syntra Refining <onboarding@resend.dev>',
        to: toEmail,
        subject: subject,
        text: body,
      }),
    });

    const emailResult = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error('Failed to send email:', emailResult);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to send email notification',
          details: emailResult
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    console.log('Email sent successfully:', emailResult);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email sent successfully',
        destinationEmail: toEmail,
        emailId: emailResult.id
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error('Error processing notification:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
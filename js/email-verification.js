/* ============================================================================
   EMAIL VERIFICATION SYSTEM
   Send verification email and store unverified submissions
   ============================================================================ */

// Email service configuration (using Resend API)
const RESEND_API_KEY = 're_YOUR_RESEND_API_KEY_HERE'; // Get from https://resend.com
const RESEND_FROM_EMAIL = 'noreply@aksprasad.com'; // Change to your domain

// Send verification email via Resend
async function sendVerificationEmail(email, submissionId, formData) {
  try {
    const verificationLink = `${window.location.origin}/verify-email.html?id=${submissionId}&email=${encodeURIComponent(email)}`;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: RESEND_FROM_EMAIL,
        to: email,
        subject: 'Verify Your Project Submission - Aks Prasad',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #00d4ff;">Verify Your Email</h2>

            <p>Hi ${formData.name},</p>

            <p>Thank you for reaching out! Please verify your email address to confirm your project submission.</p>

            <p><strong>Project Type:</strong> ${formData.project_type}</p>
            <p><strong>Budget Range:</strong> ${formData.budget || 'Not specified'}</p>

            <p style="margin: 30px 0;">
              <a href="${verificationLink}" style="background-color: #00d4ff; color: #0a0e27; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Verify Email
              </a>
            </p>

            <p style="color: #7a7f93; font-size: 12px;">
              Or copy and paste this link in your browser:<br>
              <code>${verificationLink}</code>
            </p>

            <p style="color: #7a7f93; margin-top: 30px; border-top: 1px solid #2a2f47; padding-top: 20px;">
              This verification link will expire in 24 hours.
            </p>

            <p style="color: #7a7f93;">
              Best regards,<br>
              <strong>Aks Prasad</strong><br>
              Web Development Services
            </p>
          </div>
        `
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
}

// Store unverified submission
async function storeUnverifiedSubmission(formData) {
  try {
    const unverifiedData = {
      name: formData.name,
      email: formData.email,
      project_type: formData.project_type,
      budget: formData.budget || null,
      message: formData.message,
      verified: false,
      verification_token: generateToken(),
      created_at: new Date().toISOString()
    };

    if (!window.supabase) {
      throw new Error('Supabase client not initialized');
    }

    const response = await window.supabase.insert('contact_submissions', unverifiedData);
    return response[0]?.id || response.id;
  } catch (error) {
    console.error('Error storing unverified submission:', error);
    throw error;
  }
}

// Generate verification token
function generateToken() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Verify email and mark submission as verified
async function verifyEmailAndSaveSubmission(submissionId, email) {
  try {
    const response = await fetch(
      `${window.supabase.url}/rest/v1/contact_submissions?id=eq.${submissionId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': window.supabase.anonKey,
          'Authorization': `Bearer ${window.supabase.anonKey}`
        },
        body: JSON.stringify({
          verified: true,
          verified_at: new Date().toISOString()
        })
      }
    );

    if (!response.ok) {
      throw new Error('Failed to verify submission');
    }

    return await response.json();
  } catch (error) {
    console.error('Error verifying submission:', error);
    throw error;
  }
}

// Export functions
window.EmailVerification = {
  sendVerificationEmail,
  storeUnverifiedSubmission,
  verifyEmailAndSaveSubmission,
  generateToken
};

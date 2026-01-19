/**
 * Syntra Refining - Universal Form Handler
 * Auto-binds to all forms with [data-syntra-form] attribute
 *
 * STRICT VALIDATION - Required fields matching database NOT NULL constraints:
 * - form_type (from data-syntra-form attribute)
 * - first_name (required)
 * - email (required)
 * - organization (required)
 * - interest_type (required - from input OR data-interest attribute)
 *
 * Standardized form_type values:
 * - partner_inquiry
 * - investor_inquiry
 * - career_application
 * - supplier_inquiry
 * - supplier_document
 * - tds_request
 * - sds_inquiry
 * - newsletter
 */

(function() {
  'use strict';

  const VALID_FORM_TYPES = [
    'partner_inquiry',
    'investor_inquiry',
    'career_application',
    'supplier_inquiry',
    'supplier_document',
    'tds_request',
    'sds_inquiry',
    'newsletter'
  ];

  function initForms() {
    const forms = document.querySelectorAll('form[data-syntra-form]');

    if (forms.length === 0) {
      console.log('[Syntra Forms] No forms found with [data-syntra-form] attribute');
      return;
    }

    console.log(`[Syntra Forms] Initializing ${forms.length} form(s)...`);

    forms.forEach(form => {
      const formType = form.getAttribute('data-syntra-form');
      const defaultInterest = form.getAttribute('data-interest');

      if (!formType) {
        console.warn('[Syntra Forms] Form missing data-syntra-form value:', form);
        return;
      }

      if (!VALID_FORM_TYPES.includes(formType)) {
        console.warn(`[Syntra Forms] Invalid form_type "${formType}". Must be one of:`, VALID_FORM_TYPES);
      }

      form.addEventListener('submit', (e) => handleFormSubmit(e, form, formType, defaultInterest));
      console.log(`[Syntra Forms] ✓ Initialized: ${formType}`);
    });
  }

  async function handleFormSubmit(event, form, formType, defaultInterest) {
    event.preventDefault();

    if (form.dataset.submitting === 'true') {
      console.log('[Syntra Forms] ⏸️ Duplicate submission prevented');
      return;
    }

    console.log('[Syntra Forms] 📝 Form submission started for:', formType);

    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton ? submitButton.textContent : 'SUBMIT';
    const messageContainer = getOrCreateMessageContainer(form);

    try {
      clearMessages(messageContainer);

      if (!form.checkValidity()) {
        console.warn('[Syntra Forms] ⚠️ Form validation failed');
        form.reportValidity();
        return;
      }

      console.log('[Syntra Forms] ✓ Form validation passed');
      form.dataset.submitting = 'true';
      setLoadingState(submitButton, true);

      const formData = extractFormData(form, formType, defaultInterest);

      console.log('[Syntra Forms] 📋 Extracted form data:', formData);

      validateRequiredFields(formData);

      console.log('[Syntra Forms] ✓ Required fields validation passed');

      if (typeof window.submitFormToDatabase !== 'function') {
        throw new Error('Form submission function not available. Ensure supabase-client.js is loaded.');
      }

      console.log('[Syntra Forms] 🚀 Calling submitFormToDatabase...');

      const result = await window.submitFormToDatabase(formData, form);

      console.log('[Syntra Forms] ✅ Submission successful. Reference ID:', result.referenceId);

      showSuccess(form, messageContainer, result.referenceId, formType);

    } catch (error) {
      console.error('[Syntra Forms] ❌ Submission error:', error);
      console.error('[Syntra Forms] Error stack:', error.stack);
      form.dataset.submitting = 'false';
      setLoadingState(submitButton, false, originalButtonText);
      showError(messageContainer, error.message);
    }
  }

  function extractFormData(form, formType, defaultInterest) {
    const formDataObj = new FormData(form);

    const data = {
      form_type: formType || form.dataset.syntraForm || form.id || 'unknown',
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      organization: '',
      interest_type: '',
      message: '',
      additional_data: {}
    };

    const getFieldValue = (names) => {
      for (const name of names) {
        const input = form.querySelector(`[name="${name}"]`);
        if (input && input.value && input.value.trim()) {
          return input.value.trim();
        }
      }
      return '';
    };

    data.first_name = getFieldValue(['firstName', 'first_name', 'name']);
    data.last_name = getFieldValue(['lastName', 'last_name']);
    data.email = getFieldValue(['email']);
    data.phone = getFieldValue(['phone']);
    data.organization = getFieldValue(['organization', 'company', 'companyName', 'firm']);
    data.interest_type = getFieldValue(['interestType', 'interest_type', 'role', 'topic', 'primaryInterest']);
    data.message = getFieldValue(['message', 'notes', 'coverLetter', 'comments']);

    if (data.first_name && data.first_name.includes(' ') && !data.last_name) {
      const nameParts = data.first_name.split(' ');
      data.first_name = nameParts[0];
      data.last_name = nameParts.slice(1).join(' ');
    }

    if (!data.interest_type && defaultInterest) {
      data.interest_type = defaultInterest;
    }

    for (const [key, value] of formDataObj.entries()) {
      if (key === 'consent') {
        data.additional_data[key] = value === 'on' || value === 'true';
      } else if (key !== 'resume' && key !== 'firstName' && key !== 'first_name' &&
                 key !== 'lastName' && key !== 'last_name' && key !== 'email' &&
                 key !== 'phone' && key !== 'organization' && key !== 'company' &&
                 key !== 'message' && key !== 'interestType' && key !== 'interest_type') {
        if (value && value.trim()) {
          data.additional_data[key] = value.trim();
        }
      }
    }

    console.log('[Syntra Forms] formData', data);

    return data;
  }

  function validateRequiredFields(formData) {
    const errors = [];

    if (!formData.form_type) {
      errors.push('form_type is required');
    }

    if (!formData.first_name || formData.first_name.trim() === '') {
      errors.push('First name is required');
    }

    if (!formData.email || formData.email.trim() === '') {
      errors.push('Email is required');
    }

    if (!formData.organization || formData.organization.trim() === '') {
      errors.push('Organization is required');
    }

    if (!formData.interest_type || formData.interest_type.trim() === '') {
      errors.push('Interest type is required');
    }

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
  }

  function getOrCreateMessageContainer(form) {
    let container = form.querySelector('[data-form-msg]');

    if (!container) {
      container = document.createElement('div');
      container.setAttribute('data-form-msg', '');
      form.insertBefore(container, form.firstChild);
    }

    return container;
  }

  function clearMessages(container) {
    if (container) {
      container.innerHTML = '';
      container.className = '';
      container.style.display = 'none';
    }
  }

  function setLoadingState(button, isLoading, originalText = '') {
    if (!button) return;

    if (isLoading) {
      button.disabled = true;
      button.dataset.originalText = button.textContent;
      button.textContent = 'SUBMITTING...';
      button.style.opacity = '0.6';
      button.style.cursor = 'not-allowed';
    } else {
      button.disabled = false;
      button.textContent = originalText || button.dataset.originalText || 'SUBMIT';
      button.style.opacity = '1';
      button.style.cursor = 'pointer';
    }
  }

  function showSuccess(form, container, referenceId, formType) {
    console.log('[Syntra Forms] 🎉 showSuccess called with referenceId:', referenceId);
    console.log('[Syntra Forms] Form type:', formType);
    console.log('[Syntra Forms] Calling showThankYouModal...');

    try {
      showThankYouModal(referenceId);
    } catch (modalError) {
      console.error('[Syntra Forms] ❌ Error showing modal:', modalError);
      // Fallback: show alert if modal fails
      alert(`✅ Thank You!\n\nYour submission has been received.\n\nReference ID: ${referenceId}\n\nPlease save this reference number for your records.\n\nOur team will review your submission within 24-48 business hours.`);
    }

    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'SUBMITTED';
      submitButton.style.opacity = '0.5';
      console.log('[Syntra Forms] Submit button updated to SUBMITTED state');
    }

    console.log('[Syntra Forms] ✅ Success modal displayed with Reference ID:', referenceId);
  }

  function showThankYouModal(referenceId) {
    console.log('[Syntra Forms] 🎨 Creating simple success modal');
    console.log('[Syntra Forms] Reference ID:', referenceId);

    if (!referenceId) {
      console.error('[Syntra Forms] ❌ No reference ID provided!');
      alert('Form submitted successfully! However, no reference ID was generated.');
      return;
    }

    // Remove any existing modals
    const existingModals = document.querySelectorAll('.syntra-success-modal-overlay');
    existingModals.forEach(m => m.remove());

    // Create overlay using createElement (more reliable than innerHTML)
    const overlay = document.createElement('div');
    overlay.className = 'syntra-success-modal-overlay';
    Object.assign(overlay.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      zIndex: '999999',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      boxSizing: 'border-box'
    });

    // Create modal container
    const modalBox = document.createElement('div');
    Object.assign(modalBox.style, {
      background: 'white',
      borderRadius: '16px',
      maxWidth: '600px',
      width: '100%',
      maxHeight: '90vh',
      overflowY: 'auto',
      boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      position: 'relative',
      padding: '40px 30px',
      textAlign: 'center'
    });

    // Build content using DOM elements
    modalBox.innerHTML = `
      <button class="close-x" style="position: absolute; top: 15px; right: 15px; width: 35px; height: 35px; border: none; background: #1f2937; color: white; border-radius: 50%; cursor: pointer; font-size: 24px; line-height: 1;">×</button>

      <div style="margin: 0 auto 25px; width: 80px; height: 80px; background: linear-gradient(135deg, #22c55e, #10b981); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
        <svg style="width: 45px; height: 45px; color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>

      <h2 style="font-size: 32px; font-weight: bold; color: #111827; margin: 0 0 15px; text-transform: uppercase; letter-spacing: 1px;">THANK YOU</h2>

      <p style="font-size: 16px; color: #4b5563; margin: 0 0 30px; line-height: 1.6;">Your submission has been received successfully.</p>

      <div style="background: linear-gradient(135deg, #f0fdf4, #dcfce7); border: 2px solid #22c55e; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
        <div style="background: #16a34a; color: white; padding: 5px 15px; border-radius: 20px; font-size: 11px; font-weight: bold; text-transform: uppercase; display: inline-block; margin-bottom: 15px;">REFERENCE NUMBER</div>

        <div style="background: white; padding: 20px; border-radius: 8px; border: 2px solid #86efac; margin-bottom: 15px;">
          <p style="font-size: 28px; font-weight: bold; color: #166534; font-family: monospace; margin: 0; word-break: break-all;" class="ref-id-text">${referenceId}</p>
        </div>

        <button class="copy-btn" style="width: 100%; background: #22c55e; color: white; border: none; padding: 15px; border-radius: 8px; font-size: 15px; font-weight: bold; cursor: pointer;">
          📋 COPY REFERENCE ID
        </button>

        <p style="font-size: 12px; color: #166534; margin: 15px 0 0; font-weight: 500;">Please keep this reference for your records.</p>
      </div>

      <div style="background: #f9fafb; border-radius: 12px; padding: 20px; text-align: left; margin-bottom: 20px;">
        <div style="display: flex; gap: 15px; align-items: start;">
          <div style="flex-shrink: 0; width: 40px; height: 40px; background: #22c55e; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <svg style="width: 20px; height: 20px; color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div style="flex: 1;">
            <h4 style="font-size: 16px; font-weight: bold; color: #111827; margin: 0 0 10px;">What Happens Next?</h4>
            <ul style="margin: 0; padding: 0; list-style: none; font-size: 14px; color: #4b5563; line-height: 1.8;">
              <li style="margin-bottom: 8px;">• Our team will review your submission within 24-48 business hours</li>
              <li style="margin-bottom: 8px;">• You'll receive a response via email with next steps</li>
              <li>• Use your reference ID for any follow-up communications</li>
            </ul>
          </div>
        </div>
      </div>

      <button class="close-btn" style="width: 100%; background: #1f2937; color: white; border: none; padding: 15px; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; text-transform: uppercase; letter-spacing: 1px;">CLOSE</button>
    `;

    overlay.appendChild(modalBox);
    document.body.appendChild(overlay);

    console.log('[Syntra Forms] ✅ Modal added to DOM');

    // Set up close handlers
    const closeX = modalBox.querySelector('.close-x');
    const closeBtn = modalBox.querySelector('.close-btn');
    const copyBtn = modalBox.querySelector('.copy-btn');

    const closeModal = () => {
      console.log('[Syntra Forms] Closing modal');
      overlay.remove();
    };

    closeX.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    // ESC key handler
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);

    // Copy button handler
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(referenceId);
        copyBtn.textContent = '✓ COPIED!';
        copyBtn.style.background = '#16a34a';
        setTimeout(() => {
          copyBtn.textContent = '📋 COPY REFERENCE ID';
          copyBtn.style.background = '#22c55e';
        }, 2000);
        console.log('[Syntra Forms] ✅ Copied:', referenceId);
      } catch (err) {
        console.error('[Syntra Forms] Copy failed:', err);
        alert(`Your Reference ID:\n\n${referenceId}\n\nPlease copy this manually.`);
      }
    });

    console.log('[Syntra Forms] ✅ Modal fully initialized');
  }

  window.showThankYouModal = showThankYouModal;

  function showError(container, errorMessage) {
    if (!container) return;

    const isValidationError = errorMessage.includes('required') ||
                              errorMessage.includes('validation') ||
                              errorMessage.includes('invalid');

    const userFriendlyMessage = isValidationError
      ? errorMessage
      : 'Something went wrong while submitting the form.';

    container.className = 'bg-red-50 border-2 border-red-500 rounded-lg p-6 mb-6 shadow-lg';
    container.style.display = 'block';
    container.innerHTML = `
      <div class="flex items-start gap-4">
        <div class="flex-shrink-0 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div class="flex-1">
          <p class="text-red-900 font-bold text-lg mb-2 uppercase tracking-wide">Submission Failed</p>
          <p class="text-red-700 text-base mb-3 leading-relaxed">${userFriendlyMessage}</p>
          <p class="text-red-600 text-sm font-medium">
            ${isValidationError
              ? 'Please check all required fields and try again.'
              : 'Please try again or contact us at <a href="mailto:info@syntrarefining.com" class="underline hover:text-red-800">info@syntrarefining.com</a> if the issue persists.'}
          </p>
        </div>
      </div>
    `;

    container.scrollIntoView({ behavior: 'smooth', block: 'center' });

    setTimeout(() => {
      clearMessages(container);
    }, 15000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForms);
  } else {
    initForms();
  }

  console.log('[Syntra Forms] syntra-forms.js loaded');

})();

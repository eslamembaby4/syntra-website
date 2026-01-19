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

    showThankYouModal(referenceId);

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
    console.log('[Syntra Forms] 🎨 showThankYouModal started');
    console.log('[Syntra Forms] Reference ID to display:', referenceId);

    const uniqueId = `ref-${Date.now()}`;
    const modalId = `syntra-modal-${uniqueId}`;

    console.log('[Syntra Forms] Modal ID:', modalId);

    const existingModal = document.getElementById(modalId);
    if (existingModal) {
      console.log('[Syntra Forms] Removing existing modal');
      existingModal.remove();
    }

    console.log('[Syntra Forms] Creating modal HTML...');

    const modalHTML = `
      <div id="${modalId}" class="syntra-modal-overlay" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.75); z-index: 9999; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.3s ease-out; padding: 20px; overflow-y: auto;">
        <style>
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.8);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes pulseGlow {
            0%, 100% {
              box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
            }
            50% {
              box-shadow: 0 0 40px rgba(34, 197, 94, 0.6);
            }
          }

          .syntra-modal-content {
            animation: scaleIn 0.4s ease-out;
            max-height: 90vh;
            overflow-y: auto;
          }

          .success-icon {
            animation: scaleIn 0.5s ease-out 0.2s backwards;
          }

          .success-title {
            animation: slideInUp 0.6s ease-out 0.3s backwards;
          }

          .success-message {
            animation: slideInUp 0.6s ease-out 0.4s backwards;
          }

          .reference-card {
            animation: scaleIn 0.6s ease-out 0.5s backwards, pulseGlow 3s ease-in-out infinite;
          }

          .copy-button {
            transition: all 0.3s ease;
          }

          .copy-button:hover {
            transform: scale(1.05);
            background: #16a34a;
          }

          .copy-button:active {
            transform: scale(0.95);
          }

          .close-modal-btn {
            transition: all 0.2s ease;
          }

          .close-modal-btn:hover {
            transform: scale(1.05);
            background: #0f172a;
          }
        </style>

        <div class="syntra-modal-content bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative">
          <!-- Close Button -->
          <button
            onclick="document.getElementById('${modalId}').remove()"
            class="close-modal-btn absolute top-4 right-4 w-10 h-10 bg-gray-800 hover:bg-gray-900 text-white rounded-full flex items-center justify-center shadow-lg z-10"
            type="button"
            aria-label="Close"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          <!-- Modal Content -->
          <div class="p-8 md:p-12">
            <!-- Success Icon -->
            <div class="success-icon inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6 shadow-lg relative mx-auto">
              <svg class="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
              </svg>
              <div class="absolute inset-0 rounded-full animate-ping opacity-30 bg-green-400"></div>
            </div>

            <!-- Title -->
            <h3 class="success-title text-4xl font-bold text-gray-900 mb-4 text-center uppercase tracking-wider">
              Thank You
            </h3>

            <!-- Message -->
            <p class="success-message text-gray-700 text-lg mb-8 text-center leading-relaxed">
              Your submission has been received successfully.
            </p>

            <!-- Reference ID Card -->
            <div class="reference-card bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-400 rounded-xl p-6 shadow-xl relative mb-6">
              <div class="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                Reference Number
              </div>

              <p class="text-xs text-green-700 font-semibold uppercase mb-3 tracking-widest text-center mt-2">
                Your Reference ID
              </p>

              <div class="relative">
                <p id="${uniqueId}" class="text-3xl md:text-4xl font-bold text-green-900 font-mono tracking-wider mb-4 text-center select-all bg-white px-6 py-4 rounded-lg border-2 border-green-300 shadow-inner">
                  ${referenceId}
                </p>

                <button
                  onclick="window.copyReferenceId('${uniqueId}', '${referenceId}')"
                  class="copy-button w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md flex items-center justify-center gap-2"
                  type="button"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                  Copy Reference
                </button>

                <div id="tooltip-${uniqueId}" class="hidden absolute -top-12 left-1/2 transform -translate-x-1/2 bg-green-800 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-semibold whitespace-nowrap">
                  ✓ Copied!
                </div>
              </div>

              <p class="text-xs text-green-700 mt-4 text-center font-medium">
                Please keep this reference for your records.
              </p>
            </div>

            <!-- What Happens Next -->
            <div class="bg-gray-50 rounded-xl p-6 mb-6">
              <div class="flex items-start gap-4">
                <div class="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div class="flex-1">
                  <h4 class="text-lg font-bold text-gray-900 mb-2">What Happens Next?</h4>
                  <ul class="text-sm text-gray-700 space-y-2">
                    <li class="flex items-start gap-2">
                      <span class="text-green-500 font-bold text-lg leading-none">•</span>
                      <span>Our team will review your submission within 24-48 business hours</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="text-green-500 font-bold text-lg leading-none">•</span>
                      <span>You'll receive a response via email with next steps</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="text-green-500 font-bold text-lg leading-none">•</span>
                      <span>Use your reference ID for any follow-up communications</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Close Button -->
            <button
              onclick="document.getElementById('${modalId}').remove()"
              class="close-modal-btn w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-4 px-6 rounded-lg shadow-lg text-lg uppercase tracking-wider"
              type="button"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    `;

    console.log('[Syntra Forms] Inserting modal into DOM...');
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    console.log('[Syntra Forms] Setting up copy functionality...');
    setupCopyFunctionality();

    const modal = document.getElementById(modalId);
    if (modal) {
      console.log('[Syntra Forms] ✅ Modal element found in DOM');
      console.log('[Syntra Forms] Modal display style:', modal.style.display);
      console.log('[Syntra Forms] Modal z-index:', modal.style.zIndex);

      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          console.log('[Syntra Forms] Background clicked, closing modal');
          modal.remove();
        }
      });
    } else {
      console.error('[Syntra Forms] ❌ Modal element NOT found in DOM after insertion!');
    }

    console.log('[Syntra Forms] ✅ Thank you modal displayed with Reference ID:', referenceId);
  }

  window.showThankYouModal = showThankYouModal;

  function setupCopyFunctionality() {
    if (window.copyReferenceId) return;

    window.copyReferenceId = function(elementId, referenceId) {
      const element = document.getElementById(elementId);
      const tooltip = document.getElementById(`tooltip-${elementId}`);

      navigator.clipboard.writeText(referenceId).then(() => {
        if (tooltip) {
          tooltip.classList.remove('hidden');

          setTimeout(() => {
            tooltip.classList.add('hidden');
          }, 2000);
        }

        console.log('[Syntra Forms] 📋 Reference ID copied to clipboard:', referenceId);
      }).catch(err => {
        console.error('[Syntra Forms] Failed to copy:', err);

        const textArea = document.createElement('textarea');
        textArea.value = referenceId;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();

        try {
          document.execCommand('copy');
          if (tooltip) {
            tooltip.classList.remove('hidden');
            setTimeout(() => tooltip.classList.add('hidden'), 2000);
          }
          console.log('[Syntra Forms] 📋 Reference ID copied (fallback method)');
        } catch (fallbackErr) {
          console.error('[Syntra Forms] Fallback copy failed:', fallbackErr);
        }

        document.body.removeChild(textArea);
      });
    };
  }

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

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

    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton ? submitButton.textContent : 'SUBMIT';
    const messageContainer = getOrCreateMessageContainer(form);

    try {
      clearMessages(messageContainer);

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      setLoadingState(submitButton, true);

      const formData = extractFormData(form, formType, defaultInterest);

      validateRequiredFields(formData);

      console.log('[Syntra Forms] Submitting form:', formType);
      console.log('[Syntra Forms] Payload:', formData);

      if (typeof window.submitFormToDatabase !== 'function') {
        throw new Error('Form submission function not available. Ensure supabase-client.js is loaded.');
      }

      const result = await window.submitFormToDatabase(formData, form);

      console.log('[Syntra Forms] Submission successful. Reference ID:', result.referenceId);

      showSuccess(form, messageContainer, result.referenceId, formType);

    } catch (error) {
      console.error('[Syntra Forms] Submission error:', error);
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
    const successHTML = `
      <div class="bg-green-50 border-2 border-green-500 rounded-lg p-8 text-center mb-6">
        <div class="text-green-600 text-6xl mb-4">✓</div>
        <h3 class="text-2xl font-bold text-green-800 mb-3 uppercase tracking-wider">SUBMISSION SUCCESSFUL</h3>
        <p class="text-green-700 mb-4">Thank you for contacting Syntra Refining. We'll be in touch shortly.</p>
        <div class="bg-white border border-green-200 rounded p-3 inline-block">
          <p class="text-xs text-green-600 font-mono uppercase mb-1">Reference ID</p>
          <p class="text-lg font-bold text-green-800 font-mono">${referenceId}</p>
        </div>
      </div>
    `;

    if (container) {
      container.innerHTML = successHTML;
      container.style.display = 'block';
      container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      Array.from(form.children).forEach(child => {
        if (!child.hasAttribute('data-form-msg')) {
          child.style.display = 'none';
        }
      });
    } else {
      form.innerHTML = successHTML;
    }
  }

  function showError(container, errorMessage) {
    if (!container) return;

    container.className = 'bg-red-50 border-2 border-red-500 rounded-lg p-4 mb-6';
    container.style.display = 'block';
    container.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="text-red-500 text-2xl">⚠</div>
        <div class="flex-1">
          <p class="text-red-700 font-semibold mb-1">SUBMISSION ERROR</p>
          <p class="text-red-600 text-sm">${errorMessage}</p>
          <p class="text-red-500 text-xs mt-2">Please check all required fields and try again.</p>
        </div>
      </div>
    `;

    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    setTimeout(() => {
      clearMessages(container);
    }, 10000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForms);
  } else {
    initForms();
  }

  console.log('[Syntra Forms] syntra-forms.js loaded');

})();

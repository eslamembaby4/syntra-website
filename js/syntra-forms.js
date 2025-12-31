/**
 * Syntra Refining - Unified Form Submission Handler
 *
 * This module provides a universal form submission system for all forms
 * across the Syntra Refining website. It handles:
 * - Form validation
 * - Loading states
 * - Database submission (Supabase)
 * - File uploads (for career applications)
 * - Email notifications (via Edge Function)
 * - Success/error messaging
 *
 * Dependencies:
 * - Supabase JS SDK (loaded via CDN)
 * - supabase-client.js (provides window.syntraSupabase)
 *
 * Usage:
 *   SyntraForms.init('formId', {
 *     formType: 'partner_inquiry',
 *     interestType: 'Commercial Partnership',
 *     onSuccess: (data) => { ... },
 *     onError: (error) => { ... }
 *   });
 */

(function(window) {
  'use strict';

  const SyntraForms = {

    /**
     * Initialize form handler
     * @param {string} formId - The form element ID
     * @param {object} options - Configuration options
     */
    init: function(formId, options = {}) {
      const form = document.getElementById(formId);
      if (!form) {
        console.error(`Form not found: ${formId}`);
        return;
      }

      const config = {
        formType: options.formType || 'contact_inquiry',
        interestType: options.interestType || null,
        hasFileUpload: options.hasFileUpload || false,
        fileInputId: options.fileInputId || 'resume',
        messageContainerId: options.messageContainerId || 'formMessage',
        onSuccess: options.onSuccess || null,
        onError: options.onError || null,
        successMessage: options.successMessage || null,
        customFieldMapping: options.customFieldMapping || {},
      };

      form.addEventListener('submit', (e) => this.handleSubmit(e, form, config));

      console.log(`✓ Form initialized: ${formId} (type: ${config.formType})`);
    },

    /**
     * Handle form submission
     */
    handleSubmit: async function(event, form, config) {
      event.preventDefault();

      const submitButton = form.querySelector('button[type="submit"]');
      const originalButtonText = submitButton ? submitButton.textContent : '';

      try {
        // 1. Validate form
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }

        // 2. Set loading state
        this.setLoadingState(submitButton, true);

        // 3. Extract form data
        const formData = this.extractFormData(form, config);

        // 4. Handle file upload (for career applications)
        if (config.hasFileUpload) {
          const fileUploadResult = await this.handleFileUpload(form, config);
          if (fileUploadResult.error) {
            throw new Error(fileUploadResult.error);
          }
          formData.additional_data.resume_url = fileUploadResult.url;
          formData.additional_data.resume_path = fileUploadResult.path;
          formData.additional_data.resume_filename = fileUploadResult.filename;
        }

        // 5. Submit to database
        const submissionResult = await this.submitToDatabase(formData);
        if (submissionResult.error) {
          throw new Error(submissionResult.error);
        }

        const referenceId = submissionResult.reference_id;

        // 6. Send email notification (non-blocking)
        this.sendEmailNotification(config.formType, referenceId, formData).catch(err => {
          console.warn('Email notification failed (non-critical):', err);
        });

        // 7. Show success message
        this.showSuccess(form, config, referenceId);

        // 8. Call custom success callback
        if (config.onSuccess) {
          config.onSuccess({ referenceId, formData });
        }

      } catch (error) {
        console.error('Form submission error:', error);

        // Reset loading state
        this.setLoadingState(submitButton, false, originalButtonText);

        // Show error message
        this.showError(form, config, error.message);

        // Call custom error callback
        if (config.onError) {
          config.onError(error);
        }
      }
    },

    /**
     * Extract form data into submission object
     */
    extractFormData: function(form, config) {
      const formDataObj = new FormData(form);
      const data = {
        form_type: config.formType,
        interest_type: config.interestType,
        additional_data: {},
      };

      // Map form fields to database columns
      const fieldMap = {
        firstName: 'first_name',
        first_name: 'first_name',
        name: 'first_name', // For forms with single name field
        lastName: 'last_name',
        last_name: 'last_name',
        email: 'email',
        phone: 'phone',
        organization: 'organization',
        company: 'organization',
        companyName: 'organization',
        message: 'message',
        notes: 'message',
        coverLetter: 'message',
        ...config.customFieldMapping,
      };

      // Process each form field
      for (const [key, value] of formDataObj.entries()) {
        if (value && key !== 'resume') { // Skip file inputs
          const mappedKey = fieldMap[key];

          if (mappedKey) {
            // Map to core column
            data[mappedKey] = value;
          } else {
            // Store in additional_data
            data.additional_data[key] = value;
          }
        }
      }

      // Handle single name field (split into first/last)
      if (data.first_name && data.first_name.includes(' ') && !data.last_name) {
        const nameParts = data.first_name.split(' ');
        data.first_name = nameParts[0];
        data.last_name = nameParts.slice(1).join(' ');
      }

      // Set interest_type from form if available
      if (formDataObj.get('interestType')) {
        data.interest_type = formDataObj.get('interestType');
      } else if (formDataObj.get('role')) {
        data.interest_type = formDataObj.get('role');
      } else if (formDataObj.get('investmentInterest')) {
        data.interest_type = formDataObj.get('investmentInterest');
      }

      return data;
    },

    /**
     * Handle file upload to Supabase Storage
     */
    handleFileUpload: async function(form, config) {
      const fileInput = document.getElementById(config.fileInputId);

      if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        return { error: 'No file selected' };
      }

      const file = fileInput.files[0];

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        return { error: 'File size exceeds 5MB limit' };
      }

      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        return { error: 'Invalid file type. Only PDF, DOC, and DOCX files are allowed.' };
      }

      try {
        // Generate unique filename
        const timestamp = Date.now();
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase();
        const filePath = `resumes/${timestamp}-${sanitizedName}`;

        // Upload to Supabase Storage
        const { data, error } = await window.syntraSupabase.storage
          .from('career-applications')
          .upload(filePath, file);

        if (error) {
          return { error: `File upload failed: ${error.message}` };
        }

        // Get public URL
        const { data: urlData } = window.syntraSupabase.storage
          .from('career-applications')
          .getPublicUrl(filePath);

        return {
          path: filePath,
          url: urlData.publicUrl,
          filename: file.name,
        };
      } catch (error) {
        return { error: `Upload error: ${error.message}` };
      }
    },

    /**
     * Submit form data to Supabase database
     */
    submitToDatabase: async function(formData) {
      try {
        const { data, error } = await window.syntraSupabase
          .from('form_submissions')
          .insert([formData])
          .select('reference_id')
          .maybeSingle();

        if (error) {
          return { error: error.message };
        }

        if (!data || !data.reference_id) {
          return { error: 'No reference ID returned from database' };
        }

        return { reference_id: data.reference_id };
      } catch (error) {
        return { error: error.message };
      }
    },

    /**
     * Send email notification via Edge Function
     */
    sendEmailNotification: async function(formType, referenceId, formData) {
      try {
        const { data, error } = await window.syntraSupabase.functions.invoke('send-form-notification', {
          body: {
            formType: formType,
            referenceId: referenceId,
            formData: formData,
          },
        });

        if (error) {
          console.warn('Email notification error:', error);
        }

        return data;
      } catch (error) {
        console.warn('Email notification exception:', error);
      }
    },

    /**
     * Set loading state on submit button
     */
    setLoadingState: function(button, isLoading, originalText = '') {
      if (!button) return;

      if (isLoading) {
        button.disabled = true;
        button.dataset.originalText = button.textContent;
        button.textContent = 'SUBMITTING...';
      } else {
        button.disabled = false;
        button.textContent = originalText || button.dataset.originalText || 'SUBMIT';
      }
    },

    /**
     * Show success message
     */
    showSuccess: function(form, config, referenceId) {
      const successHTML = config.successMessage || `
        <div class="bg-green-50 border-2 border-green-500 rounded-lg p-8 text-center">
          <div class="text-green-600 text-6xl mb-4">✓</div>
          <h3 class="text-2xl font-bold text-green-800 mb-3">Submission Successful!</h3>
          <p class="text-green-700 mb-4">Thank you for your submission. We'll be in touch shortly.</p>
          <p class="text-sm text-green-600 font-mono">Reference ID: <strong>${referenceId}</strong></p>
        </div>
      `;

      form.innerHTML = successHTML;
    },

    /**
     * Show error message
     */
    showError: function(form, config, errorMessage) {
      let messageContainer = document.getElementById(config.messageContainerId);

      if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.id = config.messageContainerId;
        form.insertBefore(messageContainer, form.firstChild);
      }

      messageContainer.className = 'bg-red-50 border-2 border-red-500 rounded-lg p-4 mb-4';
      messageContainer.innerHTML = `
        <p class="text-red-700 font-semibold">Error: ${errorMessage}</p>
        <p class="text-red-600 text-sm mt-2">Please try again or contact us directly.</p>
      `;

      // Auto-hide after 8 seconds
      setTimeout(() => {
        if (messageContainer && messageContainer.parentNode) {
          messageContainer.remove();
        }
      }, 8000);
    },

  };

  // Export to window
  window.SyntraForms = SyntraForms;

  console.log('✓ Syntra Forms module loaded');

})(window);

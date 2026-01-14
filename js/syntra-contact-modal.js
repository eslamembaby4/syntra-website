// SYNTRA CONTACT MODAL SYSTEM - SIMPLIFIED AND BULLETPROOF
(function() {
  'use strict';

  console.log('[Syntra Modal] Script loaded and executing...');

  let modalCreated = false;

  // Create modal immediately
  function createModal() {
    if (modalCreated) {
      console.log('[Syntra Modal] Modal already created');
      return;
    }

    console.log('[Syntra Modal] Creating modal...');

    const modalHTML = `
      <div id="contactModal" style="display: none; position: fixed; inset: 0; z-index: 9999; align-items: center; justify-content: center; padding: 1rem;">
        <div class="modal-backdrop" style="position: absolute; inset: 0; background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(8px);"></div>
        <div style="position: relative; width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; background: white; border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);">

          <!-- Close Button -->
          <button class="modal-close-btn" type="button" style="position: absolute; top: 1rem; right: 1rem; padding: 0.5rem 1rem; background: transparent; border: 1px solid #E2E8F0; color: #64748B; cursor: pointer; z-index: 10; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; border-radius: 4px; transition: all 0.2s;">
            CLOSE
          </button>

          <!-- Header -->
          <div style="padding: 3rem 2.5rem 1.5rem; text-align: center;">
            <div style="display: flex; justify-content: center; align-items: center; margin: 0 auto 1.5rem;">
              <div style="width: 44px; height: 44px; border: 3px solid #FFD700; transform: rotate(45deg); display: flex; justify-content: center; align-items: center; animation: syntraModalSpin 10s linear infinite;">
                <div style="width: 18px; height: 18px; background: #0891B2; transform: rotate(-45deg);"></div>
              </div>
              <style>
                @keyframes syntraModalSpin { from { transform: rotate(45deg); } to { transform: rotate(405deg); } }
              </style>
            </div>
            <h2 style="font-family: 'Oswald', sans-serif; font-size: 1.875rem; font-weight: 700; text-transform: uppercase; color: #0F172A; margin-bottom: 0.5rem;">Get in Touch</h2>
            <p style="color: #64748B; font-size: 0.875rem;">Syntra Refining is currently onboarding strategic partners for the 2027 production cycle.</p>
          </div>

          <!-- Form -->
          <form id="modalPartnerForm" data-syntra-form="partner_inquiry" style="padding: 0 2.5rem 2rem;">
            <div data-form-msg></div>

            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.25rem;">
              <div>
                <label style="display: block; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #0F172A; margin-bottom: 0.5rem;">First Name</label>
                <input type="text" name="first_name" required style="width: 100%; padding: 0.875rem 1rem; background: #F8FAFC; border: 2px solid #E2E8F0; border-radius: 8px; font-size: 14px;" placeholder="Jane">
              </div>
              <div>
                <label style="display: block; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #0F172A; margin-bottom: 0.5rem;">Last Name</label>
                <input type="text" name="last_name" required style="width: 100%; padding: 0.875rem 1rem; background: #F8FAFC; border: 2px solid #E2E8F0; border-radius: 8px; font-size: 14px;" placeholder="Doe">
              </div>
            </div>

            <div style="margin-bottom: 1.25rem;">
              <label style="display: block; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #0F172A; margin-bottom: 0.5rem;">Organization</label>
              <input type="text" name="organization" required style="width: 100%; padding: 0.875rem 1rem; background: #F8FAFC; border: 2px solid #E2E8F0; border-radius: 8px; font-size: 14px;" placeholder="Company Name">
            </div>

            <div style="margin-bottom: 1.25rem;">
              <label style="display: block; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #0F172A; margin-bottom: 0.5rem;">Email</label>
              <input type="email" name="email" required style="width: 100%; padding: 0.875rem 1rem; background: #F8FAFC; border: 2px solid #E2E8F0; border-radius: 8px; font-size: 14px;" placeholder="you@company.com">
            </div>

            <div style="margin-bottom: 1.25rem;">
              <label style="display: block; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #0F172A; margin-bottom: 0.5rem;">Interest Type</label>
              <select name="interest_type" required style="width: 100%; padding: 0.875rem 1rem; background: #F8FAFC; border: 2px solid #E2E8F0; border-radius: 8px; font-size: 14px;">
                <option value="">Select Interest...</option>
                <option value="Observer Status">Observer Status</option>
                <option value="Investor Relations">Investor Relations</option>
                <option value="Supplier / Vendor">Supplier / Vendor</option>
                <option value="Feedstock Supply">Feedstock Supply</option>
                <option value="Product Offtake">Product Offtake</option>
                <option value="Strategic Partnership">Strategic Partnership</option>
                <option value="Technical Data Request">Technical Data Request</option>
                <option value="Spec Sheet Submission">Spec Sheet Submission</option>
                <option value="Tolling Services">Tolling Services</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div style="margin-bottom: 1.25rem;">
              <label style="display: block; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #0F172A; margin-bottom: 0.5rem;">Message</label>
              <textarea rows="3" name="message" required style="width: 100%; padding: 0.875rem 1rem; background: #F8FAFC; border: 2px solid #E2E8F0; border-radius: 8px; font-size: 14px; resize: vertical;" placeholder="Brief details about your inquiry..."></textarea>
            </div>

            <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
              <button type="submit" style="flex: 1; padding: 1rem 1.5rem; background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); color: white; border: none; border-radius: 8px; font-family: 'Oswald', sans-serif; font-size: 14px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; cursor: pointer;">
                Submit Inquiry
              </button>
              <button type="button" class="modal-cancel-btn" style="padding: 1rem 1.5rem; background: transparent; color: #64748B; border: 2px solid #E2E8F0; border-radius: 8px; font-family: 'Oswald', sans-serif; font-size: 14px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; cursor: pointer;">
                Cancel
              </button>
            </div>
          </form>

          <!-- Footer -->
          <div style="padding: 1.5rem 2.5rem 2rem; background: linear-gradient(180deg, transparent 0%, #F8FAFC 100%); border-top: 1px solid #E2E8F0; display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div style="width: 32px; height: 32px; background: white; border: 1px solid #E2E8F0; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #D97706;">
                <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <div>
                <p style="font-weight: 600; font-size: 0.75rem; color: #334155;">Halifax, NS</p>
                <p style="font-size: 0.625rem; color: #64748B;">Canada</p>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div style="width: 32px; height: 32px; background: white; border: 1px solid #E2E8F0; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #D97706;">
                <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div>
                <p style="font-weight: 600; font-size: 0.75rem; color: #334155;">Commercial</p>
                <p style="font-size: 0.625rem; color: #64748B;">commercial@syntrarefining.com</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    modalCreated = true;
    console.log('[Syntra Modal] Modal created and added to DOM');

    // Use event delegation on the modal element
    const modal = document.getElementById('contactModal');
    if (modal) {
      modal.addEventListener('click', function(e) {
        // Check if close button was clicked
        if (e.target.closest('.modal-close-btn')) {
          e.preventDefault();
          e.stopPropagation();
          console.log('[Syntra Modal] Close button clicked');
          window.closeContactModal();
          return;
        }

        // Check if cancel button was clicked
        if (e.target.closest('.modal-cancel-btn')) {
          e.preventDefault();
          e.stopPropagation();
          console.log('[Syntra Modal] Cancel button clicked');
          window.closeContactModal();
          return;
        }

        // Check if backdrop was clicked
        if (e.target.classList.contains('modal-backdrop')) {
          e.preventDefault();
          e.stopPropagation();
          console.log('[Syntra Modal] Backdrop clicked');
          window.closeContactModal();
          return;
        }
      }, true);

      // Add hover effects using event delegation
      modal.addEventListener('mouseenter', function(e) {
        if (e.target.classList.contains('modal-close-btn')) {
          e.target.style.background = '#0F172A';
          e.target.style.color = 'white';
          e.target.style.borderColor = '#0F172A';
        }
        if (e.target.classList.contains('modal-cancel-btn')) {
          e.target.style.background = '#F1F5F9';
          e.target.style.borderColor = '#CBD5E1';
        }
      }, true);

      modal.addEventListener('mouseleave', function(e) {
        if (e.target.classList.contains('modal-close-btn')) {
          e.target.style.background = 'transparent';
          e.target.style.color = '#64748B';
          e.target.style.borderColor = '#E2E8F0';
        }
        if (e.target.classList.contains('modal-cancel-btn')) {
          e.target.style.background = 'transparent';
          e.target.style.borderColor = '#E2E8F0';
        }
      }, true);

      console.log('[Syntra Modal] Event delegation handlers attached');
    }
  }

  // Open modal
  window.openContactModal = function(interestType) {
    console.log('[Syntra Modal] Opening modal with interest:', interestType);

    if (!modalCreated) {
      createModal();
    }

    const modal = document.getElementById('contactModal');
    if (modal) {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';

      // Pre-fill interest type if provided
      if (interestType) {
        const select = modal.querySelector('select[name="interest_type"]');
        if (select) {
          select.value = interestType;
        }
      }

      console.log('[Syntra Modal] Modal opened');
    } else {
      console.error('[Syntra Modal] Modal element not found!');
    }
  };

  // Close modal
  window.closeContactModal = function() {
    console.log('[Syntra Modal] Closing modal');
    const modal = document.getElementById('contactModal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  };

  // Initialize - attach click handlers to all contact links
  function init() {
    console.log('[Syntra Modal] Initializing...');

    // Create modal immediately
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createModal);
    } else {
      createModal();
    }

    // Attach handlers using event delegation
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a[href*="#partner-ecosystem-access"], a[href*="contact-modal"]');
      if (link) {
        e.preventDefault();
        e.stopPropagation();
        console.log('[Syntra Modal] Link clicked:', link.href);

        // Determine interest type from context
        const text = link.textContent.trim().toUpperCase();
        let interestType = 'Strategic Partnership';

        if (text.includes('TECHNICAL DATA')) interestType = 'Technical Data Request';
        else if (text.includes('SPEC SHEET')) interestType = 'Spec Sheet Submission';
        else if (text.includes('TOLLING')) interestType = 'Tolling Services';
        else if (text.includes('OFFER')) interestType = 'Product Offtake';
        else if (text.includes('OBSERVER') || text.includes('ACCESS')) interestType = 'Observer Status';

        window.openContactModal(interestType);
      }
    }, true);

    // ESC key to close
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        window.closeContactModal();
      }
    });

    console.log('[Syntra Modal] Initialization complete');
  }

  // Auto-initialize
  init();

  console.log('[Syntra Modal] Script execution complete');
})();

// SYNTRA CONTACT MODAL SYSTEM
// Dynamic contact form modal with animations

(function() {
  'use strict';

  // Create modal HTML
  function createModal() {
    console.log('[Syntra Modal] Creating modal HTML...');

    // Check if modal already exists
    if (document.getElementById('contactModal')) {
      console.log('[Syntra Modal] Modal already exists');
      return;
    }

    const modalHTML = `
      <div id="contactModal" class="contact-modal-overlay">
        <div class="contact-modal-backdrop" onclick="SyntraContactModal.close()"></div>
        <div class="contact-modal-container">
          <div class="contact-modal-content">
            <!-- Close Button -->
            <button class="contact-modal-close" onclick="SyntraContactModal.close()" aria-label="Close">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>

            <!-- Modal Header -->
            <div class="contact-modal-header">
              <div class="contact-modal-icon">
                <div class="logo-outer w-16 h-16 border-[4px] border-syntra-accent transform rotate-45 flex items-center justify-center">
                  <div class="logo-inner w-7 h-7 bg-syntra-accent transform -rotate-45"></div>
                </div>
              </div>
              <h2 class="font-head text-3xl font-bold uppercase text-syntra-text mb-2">Get in Touch</h2>
              <p class="text-slate-600 text-sm">Syntra Refining is currently onboarding strategic partners for the 2027 production cycle.</p>
              <div class="contact-modal-badge">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path>
                </svg>
                <span class="text-[10px] font-mono tracking-wider">SECURE SSL</span>
              </div>
            </div>

            <!-- Form -->
            <form id="modalPartnerForm" data-syntra-form="partner_inquiry" class="contact-modal-form">
              <div data-form-msg></div>

              <div class="grid md:grid-cols-2 gap-4">
                <div class="form-group">
                  <label class="form-label">First Name</label>
                  <input type="text" name="first_name" class="form-input" placeholder="Jane" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Last Name</label>
                  <input type="text" name="last_name" class="form-input" placeholder="Doe" required>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Organization</label>
                <input type="text" name="organization" class="form-input" placeholder="Company Name" required>
              </div>

              <div class="form-group">
                <label class="form-label">Email</label>
                <input type="email" name="email" class="form-input" placeholder="you@company.com" required>
              </div>

              <div class="form-group">
                <label class="form-label">Interest Type</label>
                <select name="interest_type" class="form-input" required>
                  <option value="">Select Interest...</option>
                  <option value="Observer Status">Observer Status</option>
                  <option value="Investor Relations">Investor Relations</option>
                  <option value="Supplier / Vendor">Supplier / Vendor</option>
                  <option value="Feedstock Supply">Feedstock Supply</option>
                  <option value="Product Offtake">Product Offtake</option>
                  <option value="Strategic Partnership">Strategic Partnership</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Message</label>
                <textarea rows="3" name="message" class="form-input" placeholder="Brief details about your inquiry..." required></textarea>
              </div>

              <button type="submit" class="form-submit">
                <span class="submit-text">Submit Inquiry</span>
                <svg class="submit-icon w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </button>
            </form>

            <!-- Contact Info -->
            <div class="contact-modal-footer">
              <div class="contact-info-item">
                <div class="contact-info-icon">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <div>
                  <p class="font-semibold text-xs text-slate-700">Halifax, NS</p>
                  <p class="text-[10px] text-slate-500">Canada</p>
                </div>
              </div>
              <div class="contact-info-item">
                <div class="contact-info-icon">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div>
                  <p class="font-semibold text-xs text-slate-700">Commercial</p>
                  <p class="text-[10px] text-slate-500">commercial@syntrarefining.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Insert modal into body
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    const modalElement = modalContainer.firstElementChild;

    if (modalElement) {
      document.body.appendChild(modalElement);
      console.log('[Syntra Modal] Modal element added to DOM');
    } else {
      console.error('[Syntra Modal] Failed to create modal element');
      return;
    }

    // Add styles
    addStyles();
    console.log('[Syntra Modal] Styles added');

    // Setup escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.getElementById('contactModal')?.classList.contains('active')) {
        SyntraContactModal.close();
      }
    });

    console.log('[Syntra Modal] Modal creation complete');
  }

  function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .contact-modal-overlay {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
      }

      .contact-modal-overlay.active {
        opacity: 1;
        visibility: visible;
      }

      .contact-modal-backdrop {
        position: absolute;
        inset: 0;
        background: rgba(15, 23, 42, 0.8);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
      }

      .contact-modal-container {
        position: relative;
        width: 100%;
        max-width: 600px;
        max-height: 90vh;
        overflow-y: auto;
        transform: scale(0.95) translateY(20px);
        transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      .contact-modal-overlay.active .contact-modal-container {
        transform: scale(1) translateY(0);
      }

      .contact-modal-content {
        background: white;
        border-radius: 16px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        position: relative;
        border: 1px solid #E2E8F0;
      }

      .contact-modal-close {
        position: absolute;
        top: 1.5rem;
        right: 1.5rem;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #F1F5F9;
        border-radius: 50%;
        border: none;
        color: #64748B;
        cursor: pointer;
        transition: all 0.2s ease;
        z-index: 10;
      }

      .contact-modal-close:hover {
        background: #0F172A;
        color: white;
        transform: rotate(90deg);
      }

      .contact-modal-header {
        padding: 3rem 2.5rem 1.5rem;
        text-align: center;
        position: relative;
      }

      .contact-modal-icon {
        width: 72px;
        height: 72px;
        margin: 0 auto 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      }

      .logo-outer {
        transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.3s;
      }

      .logo-inner {
        transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      .contact-modal-icon:hover .logo-outer {
        transform: rotate(0deg);
        border-color: #D97706;
      }

      .contact-modal-icon:hover .logo-inner {
        transform: rotate(0deg);
      }

      .contact-modal-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
        padding: 0.375rem 0.75rem;
        background: #F0FDF4;
        border: 1px solid #BBF7D0;
        border-radius: 999px;
        color: #15803D;
        margin-top: 1rem;
      }

      .contact-modal-form {
        padding: 0 2.5rem 2rem;
      }

      .form-group {
        margin-bottom: 1.25rem;
      }

      .form-label {
        display: block;
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: #0F172A;
        margin-bottom: 0.5rem;
      }

      .form-input {
        width: 100%;
        padding: 0.875rem 1rem;
        background: #F8FAFC;
        border: 2px solid #E2E8F0;
        border-radius: 8px;
        font-size: 14px;
        color: #0F172A;
        transition: all 0.2s ease;
      }

      .form-input:focus {
        outline: none;
        border-color: #FFD700;
        background: white;
        box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
      }

      .form-input::placeholder {
        color: #94A3B8;
      }

      .form-submit {
        width: 100%;
        padding: 1rem 1.5rem;
        background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
        color: white;
        border: none;
        border-radius: 8px;
        font-family: 'Oswald', sans-serif;
        font-size: 14px;
        font-weight: 700;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        transition: all 0.3s ease;
        margin-top: 1.5rem;
      }

      .form-submit:hover {
        background: linear-gradient(135deg, #000000 0%, #0F172A 100%);
        transform: translateY(-2px);
        box-shadow: 0 8px 16px rgba(15, 23, 42, 0.3);
      }

      .form-submit:active {
        transform: translateY(0);
      }

      .submit-icon {
        transition: transform 0.3s ease;
      }

      .form-submit:hover .submit-icon {
        transform: translateX(4px);
      }

      .contact-modal-footer {
        padding: 1.5rem 2.5rem 2rem;
        background: linear-gradient(180deg, transparent 0%, #F8FAFC 100%);
        border-top: 1px solid #E2E8F0;
        display: flex;
        gap: 2rem;
        justify-content: center;
        flex-wrap: wrap;
      }

      .contact-info-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .contact-info-icon {
        width: 32px;
        height: 32px;
        background: white;
        border: 1px solid #E2E8F0;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #D97706;
      }

      @media (max-width: 768px) {
        .contact-modal-container {
          max-height: 95vh;
        }

        .contact-modal-header {
          padding: 2.5rem 1.5rem 1.5rem;
        }

        .contact-modal-form {
          padding: 0 1.5rem 1.5rem;
        }

        .contact-modal-footer {
          padding: 1.5rem;
          flex-direction: column;
          gap: 1rem;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Public API
  window.SyntraContactModal = {
    open: function() {
      console.log('[Syntra Modal] Opening modal...');
      const modal = document.getElementById('contactModal');
      if (!modal) {
        console.log('[Syntra Modal] Modal not found, creating...');
        createModal();
      }
      setTimeout(() => {
        const modalElement = document.getElementById('contactModal');
        if (modalElement) {
          modalElement.classList.add('active');
          document.body.style.overflow = 'hidden';
          console.log('[Syntra Modal] Modal opened successfully');
        } else {
          console.error('[Syntra Modal] Failed to find modal element');
        }
      }, 10);
    },

    close: function() {
      console.log('[Syntra Modal] Closing modal...');
      const modal = document.getElementById('contactModal');
      modal?.classList.remove('active');
      document.body.style.overflow = '';
    },

    init: function() {
      console.log('[Syntra Modal] Initializing contact modal system...');

      // Update all contact links to open modal - using capture phase to intercept early
      document.addEventListener('click', (e) => {
        // Check if the click target or any parent is a contact link
        const link = e.target.closest('a[href*="#partner-ecosystem-access"], a[href*="contact-modal"], a[href="#partner-ecosystem-access"]');
        if (link) {
          console.log('[Syntra Modal] Contact link clicked:', link.href);
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          SyntraContactModal.open();
          return false;
        }
      }, true); // Use capture phase

      // Also add a regular listener as fallback
      document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href*="#partner-ecosystem-access"], a[href*="contact-modal"]');
        if (link) {
          e.preventDefault();
          e.stopPropagation();
          SyntraContactModal.open();
        }
      });

      // Create modal on page load
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          console.log('[Syntra Modal] DOM loaded, creating modal');
          createModal();
        });
      } else {
        console.log('[Syntra Modal] DOM already loaded, creating modal');
        createModal();
      }

      console.log('[Syntra Modal] Initialization complete');
    }
  };

  // Auto-initialize
  console.log('[Syntra Modal] Auto-initializing...');
  SyntraContactModal.init();
})();

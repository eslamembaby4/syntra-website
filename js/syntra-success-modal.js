console.log('[Syntra Success Modal] Loading...');

window.showThankYouModal = function(referenceId) {
  console.log('[Syntra Success Modal] ========================================');
  console.log('[Syntra Success Modal] 🎯 showThankYouModal CALLED');
  console.log('[Syntra Success Modal] Reference ID:', referenceId);
  console.log('[Syntra Success Modal] ========================================');

  const existingModal = document.getElementById('successModal');
  if (existingModal) {
    existingModal.remove();
  }

  const modalHTML = `
    <div id="successModal" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999999;
      padding: 20px;
    ">
      <div style="
        background: white;
        padding: 40px;
        border-radius: 8px;
        max-width: 500px;
        width: 100%;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      ">
        <div style="text-align: center;">
          <div style="
            width: 60px;
            height: 60px;
            background: #10B981;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
          ">
            <svg style="width: 32px; height: 32px; color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>

          <h2 style="
            font-family: 'Oswald', sans-serif;
            font-size: 28px;
            font-weight: 700;
            color: #0F172A;
            margin: 0 0 12px 0;
            text-transform: uppercase;
          ">Thank You!</h2>

          <p style="
            font-family: 'Inter', sans-serif;
            font-size: 16px;
            color: #64748B;
            margin: 0 0 24px 0;
            line-height: 1.6;
          ">Your submission has been received successfully.</p>

          <div style="
            background: #F8FAFC;
            border: 2px solid #E2E8F0;
            border-radius: 4px;
            padding: 20px;
            margin-bottom: 24px;
          ">
            <p style="
              font-family: 'JetBrains Mono', monospace;
              font-size: 11px;
              font-weight: 700;
              letter-spacing: 0.18em;
              text-transform: uppercase;
              color: #64748B;
              margin: 0 0 8px 0;
            ">Reference ID</p>
            <p style="
              font-family: 'JetBrains Mono', monospace;
              font-size: 18px;
              font-weight: 700;
              color: #0F172A;
              margin: 0;
              letter-spacing: 0.05em;
            ">${referenceId}</p>
          </div>

          <p style="
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            color: #64748B;
            margin: 0 0 24px 0;
            line-height: 1.6;
          ">Please save this reference number. Our team will review your submission within 24-48 business hours.</p>

          <button onclick="closeSuccessModal()" style="
            width: 100%;
            padding: 14px 24px;
            background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
            color: white;
            border: none;
            border-radius: 4px;
            font-family: 'Oswald', sans-serif;
            font-size: 14px;
            font-weight: 700;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            cursor: pointer;
            transition: transform 0.2s;
          " onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
            Close
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);
  document.body.style.overflow = 'hidden';

  console.log('[Syntra Success Modal] ✅ Modal HTML inserted into DOM');
};

window.closeSuccessModal = function() {
  console.log('[Syntra Success Modal] Closing modal...');
  const modal = document.getElementById('successModal');
  if (modal) {
    modal.remove();
    document.body.style.overflow = '';
    console.log('[Syntra Success Modal] Modal closed');
  }
};

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    window.closeSuccessModal();
  }
});

console.log('[Syntra Success Modal] ✅ Script loaded successfully');

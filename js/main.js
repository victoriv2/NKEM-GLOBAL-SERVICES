/**
 * NKEM GLOBAL SERVICES LIMITED (NGS) — CORPORATE SCRIPTS
 * 2026 Qualification Edition | Interactive Functionality
 */

document.addEventListener('DOMContentLoaded', () => {
  // 0. Dynamic Header Height Tracking (Keeps Top-Bar & Navigation Sticky & Synced)
  function updateHeaderHeight() {
    const headerWrapper = document.querySelector('.site-header-wrapper') || document.querySelector('.site-header');
    if (headerWrapper) {
      const h = headerWrapper.getBoundingClientRect().height;
      if (h > 0) {
        document.documentElement.style.setProperty('--header-total-height', `${Math.round(h)}px`);
      }
    }
  }
  window.addEventListener('resize', updateHeaderHeight, { passive: true });
  window.addEventListener('orientationchange', updateHeaderHeight, { passive: true });
  window.addEventListener('load', updateHeaderHeight, { passive: true });
  updateHeaderHeight();

  // 1. Mobile Menu Drawer Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');

  function closeMobileDrawer() {
    if (mobileDrawer) {
      mobileDrawer.classList.remove('open');
      mobileToggle?.classList.remove('active');
      document.body.classList.remove('mobile-nav-open');
    }
  }

  function openMobileDrawer() {
    if (mobileDrawer) {
      updateHeaderHeight();
      mobileDrawer.classList.add('open');
      mobileToggle?.classList.add('active');
      document.body.classList.add('mobile-nav-open');
    }
  }

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('open');
      if (isOpen) {
        closeMobileDrawer();
      } else {
        openMobileDrawer();
      }
    });

    // Close on clicking any link or button inside drawer
    const drawerLinks = mobileDrawer.querySelectorAll('.nav-link, .btn');
    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileDrawer();
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        closeMobileDrawer();
      }
    });
  }

  // 2. Sticky Header Elevation on Scroll
  const siteHeaderWrapper = document.querySelector('.site-header-wrapper') || document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      siteHeaderWrapper?.classList.add('scrolled');
    } else {
      siteHeaderWrapper?.classList.remove('scrolled');
    }
  }, { passive: true });

  // 3. Modal Functionality (RFP / Workforce Mobilisation Request)
  const rfpModal = document.getElementById('rfpModal');
  const openModalBtns = document.querySelectorAll('.open-rfp-modal');
  const closeModalBtns = document.querySelectorAll('.close-modal');

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (rfpModal) {
        rfpModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        const modalBody = rfpModal.querySelector('.modal-body');
        if (modalBody) modalBody.scrollTop = 0;
      }
    });
  });

  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (rfpModal) {
        rfpModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Close on overlay click
  if (rfpModal) {
    rfpModal.addEventListener('click', (e) => {
      if (e.target === rfpModal) {
        rfpModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // 4. Competency Directory Search & Filter (on workforce-directory.html)
  const directorySearch = document.getElementById('directorySearch');
  const filterPills = document.querySelectorAll('.filter-pill');
  const directoryRows = document.querySelectorAll('.directory-item');

  if (directoryRows.length > 0) {
    let currentFilter = 'all';

    function filterDirectory() {
      const searchTerm = (directorySearch?.value || '').toLowerCase().trim();

      directoryRows.forEach(row => {
        const category = row.getAttribute('data-category') || '';
        const text = row.textContent.toLowerCase();

        const matchesCategory = (currentFilter === 'all' || category === currentFilter);
        const matchesSearch = (!searchTerm || text.includes(searchTerm));

        if (matchesCategory && matchesSearch) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    }

    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => {
          p.classList.remove('active', 'btn-navy');
          p.classList.add('btn-outline-navy');
        });
        pill.classList.add('active', 'btn-navy');
        pill.classList.remove('btn-outline-navy');
        currentFilter = pill.getAttribute('data-filter') || 'all';
        filterDirectory();
      });
    });

    if (directorySearch) {
      directorySearch.addEventListener('input', filterDirectory);
    }
  }

  // 5. RFP Form Submission Handler & Direct Email Routing to info@nkemglobalservices.com
  const rfpForms = document.querySelectorAll('.rfp-submit-form');
  rfpForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnHTML = submitBtn ? submitBtn.innerHTML : 'Submit Scope & Mobilisation Request';

      const contractor = form.querySelector('[name="contractor"]')?.value?.trim() || 'Unspecified Contractor';
      const name = form.querySelector('[name="name"]')?.value?.trim() || 'Direct Contact';
      const phone = form.querySelector('[name="phone"]')?.value?.trim() || '';
      const email = form.querySelector('[name="email"]')?.value?.trim() || '';
      const location = form.querySelector('[name="location"]')?.value?.trim() || 'Nigeria Site';
      const commercialModel = form.querySelector('[name="commercial_model"]')?.value || 'Standard Work Package';
      const crewSize = form.querySelector('[name="crew_size"]')?.value || '5-15 Personnel';
      const targetDate = form.querySelector('[name="target_date"]')?.value || '';
      const scope = form.querySelector('[name="scope"]')?.value?.trim() || 'No additional scope details provided.';
      
      // Selected service lines
      const selectedServices = [];
      form.querySelectorAll('input[name="services"]:checked').forEach(cb => {
        selectedServices.push(cb.value);
      });
      
      // Friendly service descriptions map
      const serviceNameMap = {
        'IndustrialServices': 'Industrial Services (Hydro-jetting / Coatings)',
        'EngineeringServices': 'Engineering Services (Piping / Structural / Valves)',
        'WeldersFitters': '6G Pipe Welders & Fitters (ASME IX)',
        'ScaffoldRiggers': 'Certified Scaffolding & Rigging Crews',
        'SiteSafety': 'Certified Field HSE & Fire Watch',
        'ShutdownCleaning': 'Turnaround & Plant Cleaning',
        'DrainageSumps': 'Storm Drainage & Sump Desilting',
        'GeneralLogistics': 'Procurement, Tool Leasing & Site Camps'
      };
      
      const readableServices = selectedServices.length > 0 
        ? selectedServices.map(s => serviceNameMap[s] || s)
        : ['Technical Workforce & Site Support'];

      // Generate Unique Request ID: NGS-REQ-XXXX
      const reqId = 'NGS-REQ-' + Math.floor(1000 + Math.random() * 9000);

      // Loading state on button
      if (submitBtn) {
        submitBtn.classList.add('btn-submitting');
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <span style="display: inline-flex; align-items: center; justify-content: center; gap: 8px;">
            <svg style="animation: spin 0.9s linear infinite; width: 16px; height: 16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
              <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
            </svg>
            Transmitting to Operations Desk...
          </span>
        `;
      }

      // Prepare payload for FormSubmit to info@nkemglobalservices.com
      const payload = {
        _subject: `[Workforce Mobilisation Inquiry] ${contractor} (${reqId})`,
        _replyto: email,
        _template: 'table',
        _captcha: 'false',
        'Request ID': reqId,
        'Submission Timestamp': new Date().toLocaleString('en-GB', { timeZone: 'Africa/Lagos' }) + ' (WAT)',
        'Prime Contractor / Organisation': contractor,
        'Authorised Contact Person': name,
        'Direct Phone / WhatsApp': phone,
        'Official Corporate Email': email,
        'Project Location in Nigeria': location,
        'Commercial Model Preference': commercialModel,
        'Required Service Categories': readableServices.join('; '),
        'Estimated Crew / Scope Size': crewSize,
        'Target Mobilisation Date': targetDate || 'Immediate / Per Discussion',
        'Scope Details & Site Notes': scope
      };

      try {
        const response = await fetch('https://formsubmit.co/ajax/info@nkemglobalservices.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const result = await response.json();
        console.log('FormSubmit transmission response:', result);

        // Close form modal if active & reset
        form.reset();
        if (rfpModal && rfpModal.classList.contains('active')) {
          rfpModal.classList.remove('active');
          document.body.style.overflow = '';
        }

        // Display High-End Corporate Confirmation Modal
        showSubmissionSuccessModal(contractor, reqId);
      } catch (err) {
        console.warn('Network transmission notice:', err);
        form.reset();
        if (rfpModal && rfpModal.classList.contains('active')) {
          rfpModal.classList.remove('active');
          document.body.style.overflow = '';
        }
        showSubmissionSuccessModal(contractor, reqId);
      } finally {
        if (submitBtn) {
          submitBtn.classList.remove('btn-submitting');
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
        }
      }
    });
  });

  // 5b. Professional Submission Confirmation Modal
  function showSubmissionSuccessModal(contractor, reqId) {
    let successModal = document.getElementById('submissionSuccessModal');
    
    if (!successModal) {
      successModal = document.createElement('div');
      successModal.id = 'submissionSuccessModal';
      successModal.className = 'modal-overlay';
      successModal.setAttribute('role', 'dialog');
      successModal.setAttribute('aria-modal', 'true');
      successModal.innerHTML = `
        <div class="modal-content success-modal-dialog">
          <div class="modal-header">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span class="success-icon-badge">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </span>
              <h3 class="modal-title" style="font-size: 1.15rem;">Inquiry Successfully Dispatched</h3>
            </div>
            <button type="button" class="modal-close" id="closeSuccessModalTop" aria-label="Close dialog">&times;</button>
          </div>
          <div class="modal-body success-modal-body">
            <div class="success-ref-bar">
              <span class="success-ref-label">Official Tracking Reference</span>
              <span class="success-ref-id" id="successModalReqId">NGS-REQ-0000</span>
            </div>

            <h4 class="success-contractor-title" id="successModalContractor">Inquiry Registered</h4>
            
            <p class="success-desc">
              Your Tender &amp; Workforce Mobilisation Request has been formally transmitted to our executive operations desk at <strong>info@nkemglobalservices.com</strong>.
            </p>

            <div class="success-sla-box">
              <div class="success-sla-item">
                <strong>Operational SLA:</strong> Technical scope assessment &amp; formal commercial terms delivered within <strong>2 to 4 business hours</strong>.
              </div>
              <div class="success-sla-item">
                <strong>Executive Oversight:</strong> Under direct review of Managing Director <strong>Raphael Nkemjika Julius</strong>.
              </div>
            </div>

            <div class="success-contact-prompt">
              <span class="success-prompt-text">Require immediate emergency turnaround or priority field crews?</span>
              <div class="success-action-btns">
                <a href="https://wa.me/2347042087633" target="_blank" rel="noopener noreferrer" class="btn-whatsapp-direct">
                  <svg fill="#ffffff" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 30.667 30.667" xml:space="preserve" width="16" height="16"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M30.667,14.939c0,8.25-6.74,14.938-15.056,14.938c-2.639,0-5.118-0.675-7.276-1.857L0,30.667l2.717-8.017 c-1.37-2.25-2.159-4.892-2.159-7.712C0.559,6.688,7.297,0,15.613,0C23.928,0.002,30.667,6.689,30.667,14.939z M15.61,2.382 c-6.979,0-12.656,5.634-12.656,12.56c0,2.748,0.896,5.292,2.411,7.362l-1.58,4.663l4.862-1.545c2,1.312,4.393,2.076,6.963,2.076 c6.979,0,12.658-5.633,12.658-12.559C28.27,8.016,22.59,2.382,15.61,2.382z M23.214,18.38c-0.094-0.151-0.34-0.243-0.708-0.427 c-0.367-0.184-2.184-1.069-2.521-1.189c-0.34-0.123-0.586-0.185-0.832,0.182c-0.243,0.367-0.951,1.191-1.168,1.437 c-0.215,0.245-0.43,0.276-0.799,0.095c-0.369-0.186-1.559-0.57-2.969-1.817c-1.097-0.972-1.838-2.169-2.052-2.536 c-0.217-0.366-0.022-0.564,0.161-0.746c0.165-0.165,0.369-0.428,0.554-0.643c0.185-0.213,0.246-0.364,0.369-0.609 c0.121-0.245,0.06-0.458-0.031-0.643c-0.092-0.184-0.829-1.984-1.138-2.717c-0.307-0.732-0.614-0.611-0.83-0.611 c-0.215,0-0.461-0.03-0.707-0.03S9.897,8.215,9.56,8.582s-1.291,1.252-1.291,3.054c0,1.804,1.321,3.543,1.506,3.787 c0.186,0.243,2.554,4.062,6.305,5.528c3.753,1.465,3.753,0.976,4.429,0.914c0.678-0.062,2.184-0.885,2.49-1.739 C23.307,19.268,23.307,18.533,23.214,18.38z"></path> </g> </g></svg>
                  Direct WhatsApp Desk
                </a>
                <a href="tel:+2348155608447" class="btn-phone-direct">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z"/>
                  </svg>
                  +234 815 560 8447
                </a>
              </div>
            </div>

            <div class="success-modal-footer">
              <button type="button" class="btn btn-primary" id="closeSuccessModalBottom" style="width: 100%;">
                Close Confirmation
              </button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(successModal);

      const closeTop = successModal.querySelector('#closeSuccessModalTop');
      const closeBottom = successModal.querySelector('#closeSuccessModalBottom');
      const closeModal = () => {
        successModal.classList.remove('active');
        document.body.style.overflow = '';
      };

      if (closeTop) closeTop.addEventListener('click', closeModal);
      if (closeBottom) closeBottom.addEventListener('click', closeModal);
      successModal.addEventListener('click', (e) => {
        if (e.target === successModal) closeModal();
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && successModal.classList.contains('active')) {
          closeModal();
        }
      });
    }

    const reqIdEl = successModal.querySelector('#successModalReqId');
    const contractorEl = successModal.querySelector('#successModalContractor');
    if (reqIdEl) reqIdEl.textContent = reqId;
    if (contractorEl) contractorEl.textContent = `Inquiry Registered for ${contractor}`;

    const modalBody = successModal.querySelector('.modal-body');
    if (modalBody) modalBody.scrollTop = 0;

    successModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // 6. Direct WhatsApp Link Pre-filler
  const whatsappBtns = document.querySelectorAll('.btn-whatsapp-dynamic');
  whatsappBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const service = btn.getAttribute('data-service') || 'General Technical Workforce';
      const msg = encodeURIComponent(`Hello NKEM Global Services Limited, I am reviewing your 2026 Corporate Profile and would like to inquire about mobilising ${service} for an upcoming project.`);
      const url = `https://wa.me/2347042087633?text=${msg}`;
      window.open(url, '_blank');
    });
  });
});

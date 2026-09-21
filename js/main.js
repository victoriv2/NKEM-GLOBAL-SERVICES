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

        // Confirmation dialog
        alert(`Thank you, ${contractor}!\n\nYour Workforce Mobilisation Inquiry (${reqId}) has been successfully transmitted to info@nkemglobalservices.com.\n\nManaging Director Raphael Nkemjika Julius and our Operations Desk will review your project scope and revert within 2 to 4 business hours.\n\nDirect Operations Hotline: +234 815 560 8447 / WhatsApp: +234 704 208 7633`);

        form.reset();
        if (rfpModal && rfpModal.classList.contains('active')) {
          rfpModal.classList.remove('active');
          document.body.style.overflow = '';
        }
      } catch (err) {
        console.warn('Network transmission error, falling back to direct notification:', err);
        alert(`Thank you, ${contractor}!\n\nYour inquiry reference is ${reqId}.\n\nIf you require immediate expedited deployment, please connect directly with our Operations Desk via WhatsApp (+234 704 208 7633) or Call (+234 815 560 8447).`);
        form.reset();
        if (rfpModal && rfpModal.classList.contains('active')) {
          rfpModal.classList.remove('active');
          document.body.style.overflow = '';
        }
      } finally {
        if (submitBtn) {
          submitBtn.classList.remove('btn-submitting');
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
        }
      }
    });
  });

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

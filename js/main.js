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

  // 5. RFP Form Submission Handler & Executive Lead Persistence
  const rfpForms = document.querySelectorAll('.rfp-submit-form');
  rfpForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
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
      
      const newSubmission = {
        id: reqId,
        date: new Date().toISOString(),
        contractor: contractor,
        name: name,
        phone: phone,
        email: email,
        location: location,
        commercialModel: commercialModel,
        services: readableServices,
        rawServices: selectedServices,
        crewSize: crewSize,
        targetDate: targetDate,
        scope: scope,
        status: 'New', // Options: New, In Review, Mobilised, Archived
        notes: ''
      };

      // Persist to localStorage backup
      try {
        let submissions = [];
        const stored = localStorage.getItem('ngs_submissions');
        if (stored) {
          submissions = JSON.parse(stored);
        }
        if (!Array.isArray(submissions)) submissions = [];
        submissions.unshift(newSubmission);
        localStorage.setItem('ngs_submissions', JSON.stringify(submissions));
      } catch (err) {
        console.error('Failed to store submission locally:', err);
      }

      // Sync to JSONBin.io Cloud Bin
      const JSONBIN_ID = '6ab02c2bffd5d160531d085b';
      const JSONBIN_KEY = '$2a$10$nnSfeJQZY9FjkKghjfzlPuWFrIe/JV46TLSQbnho77T3kkmx/mMvK';

      fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}/latest`, {
        method: 'GET',
        headers: {
          'X-Master-Key': JSONBIN_KEY
        }
      })
      .then(res => res.json())
      .then(data => {
        let currentSubs = (data && data.record && Array.isArray(data.record.submissions)) ? data.record.submissions : [];
        currentSubs.unshift(newSubmission);
        return fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': JSONBIN_KEY
          },
          body: JSON.stringify({ submissions: currentSubs })
        });
      })
      .then(() => {
        console.log('Submission successfully synchronized with operations cloud.');
      })
      .catch(cloudErr => {
        console.warn('Cloud synchronization will retry on next check:', cloudErr);
      });

      // Confirmation Alert
      alert(`Thank you, ${contractor}!\n\nYour Workforce Mobilisation Inquiry (${reqId}) has been successfully registered.\n\nManaging Director Raphael Nkemjika Julius and our Operations Desk will review your project scope and provide a formal response within 2 to 4 business hours.\n\nImmediate Operations Hotline: +234 815 560 8447 / WhatsApp: +234 704 208 7633`);

      form.reset();
      if (rfpModal && rfpModal.classList.contains('active')) {
        rfpModal.classList.remove('active');
        document.body.style.overflow = '';
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

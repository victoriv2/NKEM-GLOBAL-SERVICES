/**
 * NKEM GLOBAL SERVICES LIMITED (NGS) — CORPORATE SCRIPTS
 * 2026 Qualification Edition | Interactive Functionality
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Drawer Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');

  function closeMobileDrawer() {
    if (mobileDrawer) {
      mobileDrawer.classList.remove('open');
      mobileToggle?.classList.remove('active');
      document.body.classList.remove('mobile-nav-open');
      document.body.style.overflow = '';
    }
  }

  function openMobileDrawer() {
    if (mobileDrawer) {
      mobileDrawer.classList.add('open');
      mobileToggle?.classList.add('active');
      document.body.classList.add('mobile-nav-open');
      document.body.style.overflow = 'hidden';
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
  const siteHeader = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }
  });

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

  // 5. RFP Form Submission Handler
  const rfpForms = document.querySelectorAll('.rfp-submit-form');
  rfpForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const contractorName = form.querySelector('[name="contractor"]')?.value || 'Contractor';
      const projectLocation = form.querySelector('[name="location"]')?.value || 'Nigeria Site';
      const phone = form.querySelector('[name="phone"]')?.value || '';
      
      alert(`Thank you, ${contractorName}! Your mobilisation inquiry for ${projectLocation} has been registered.\n\nOur Operations Executive (Raphael Nkemjika Julius) will review your project scope and respond within 2 to 4 business hours.\n\nFor immediate deployment, feel free to reach our desk directly at +234 815 560 8447.`);
      
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

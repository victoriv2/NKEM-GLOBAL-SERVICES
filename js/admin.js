/**
 * NKEM Global Services Limited (RC: 9855308)
 * Executive Operations Portal & RFP Tender Lead Tracker
 */

document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'ngs_submissions';
  const AUTH_KEY = 'ngs_admin_auth';
  const MASTER_PIN = '9855'; // First 4 digits of RC: 9855308

  // DOM Elements
  const pinOverlay = document.getElementById('pinOverlay');
  const pinCard = document.getElementById('pinCard');
  const pinForm = document.getElementById('pinForm');
  const pinInput = document.getElementById('pinInput');
  const lockBtn = document.getElementById('lockBtn');
  const searchInput = document.getElementById('searchInput');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const tableBody = document.getElementById('submissionsTableBody');
  const exportCsvBtn = document.getElementById('exportCsvBtn');
  const resetDemoBtn = document.getElementById('resetDemoBtn');
  const addManualBtn = document.getElementById('addManualBtn');
  const manualModal = document.getElementById('manualModal');
  const manualInquiryForm = document.getElementById('manualInquiryForm');
  const detailModal = document.getElementById('detailModal');
  const saveNotesBtn = document.getElementById('saveNotesBtn');
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');

  let currentFilter = 'all';
  let currentSearch = '';
  let activeModalReqId = null;

  // 1. PIN Security Authentication
  function checkAuth() {
    const isAuth = sessionStorage.getItem(AUTH_KEY);
    if (isAuth === 'true') {
      pinOverlay.style.display = 'none';
    } else {
      pinOverlay.style.display = 'flex';
      setTimeout(() => pinInput && pinInput.focus(), 100);
    }
  }

  if (pinForm) {
    pinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const enteredPin = (pinInput?.value || '').trim();
      if (enteredPin === MASTER_PIN) {
        sessionStorage.setItem(AUTH_KEY, 'true');
        pinOverlay.style.opacity = '0';
        pinOverlay.style.transition = 'opacity 0.25s ease';
        setTimeout(() => {
          pinOverlay.style.display = 'none';
          showToast('Welcome back, Director. Session authenticated.');
        }, 250);
      } else {
        if (pinCard) {
          pinCard.classList.add('shake');
          setTimeout(() => pinCard.classList.remove('shake'), 500);
        }
        if (pinInput) {
          pinInput.value = '';
          pinInput.focus();
        }
        showToast('Invalid Director PIN. Please verify credentials.');
      }
    });
  }

  if (lockBtn) {
    lockBtn.addEventListener('click', () => {
      sessionStorage.removeItem(AUTH_KEY);
      pinInput.value = '';
      pinOverlay.style.opacity = '1';
      pinOverlay.style.display = 'flex';
      pinInput.focus();
      showToast('Session locked.');
    });
  }

  // 2. Data Store & Realistic Demo Seeding
  const defaultDemoLeads = [
    {
      id: 'NGS-REQ-8492',
      date: '2026-09-19T14:22:10.000Z',
      contractor: 'Saipem Contracting Nigeria Limited',
      name: 'Engr. Emeka Okonkwo (Lead Subcontracts)',
      phone: '+2348032194488',
      email: 'emeka.okonkwo@saipem.com',
      location: 'Onne Port Federal Lighter Terminal, Rivers State',
      commercialModel: 'Unit-Rate Delivery',
      services: [
        '6G Pipe Welders & Fitters (ASME IX)',
        'Certified Scaffolding & Rigging Crews',
        'Certified Field HSE & Fire Watch'
      ],
      rawServices: ['WeldersFitters', 'ScaffoldRiggers', 'SiteSafety'],
      crewSize: '15-50 Personnel',
      targetDate: '2026-10-15',
      scope: 'Immediate mobilisation required for high-pressure pipe spool fabrication, ASME IX coded carbon and stainless steel welding, and scaffolding erection at Onne base. All welders must possess verified welder qualification records (WQR). Day/night shift rotations planned.',
      status: 'In Review',
      notes: 'Reviewed project scope with Operations Desk. Transmitted qualified welder qualification dossiers and initial rate schedule on 19/09.'
    },
    {
      id: 'NGS-REQ-7104',
      date: '2026-09-18T09:45:00.000Z',
      contractor: 'Daewoo E&C Nigeria Limited',
      name: 'Mr. Chinedu Eze (Turnaround Procurement)',
      phone: '+2348065541120',
      email: 'c.eze@daewooenc.com',
      location: 'Bonny Island (NLNG Complex), Rivers State',
      commercialModel: 'Time & Materials',
      services: [
        'Industrial Services (Hydro-jetting / Coatings)',
        'Turnaround & Plant Cleaning',
        'Certified Field HSE & Fire Watch'
      ],
      rawServices: ['IndustrialServices', 'ShutdownCleaning', 'SiteSafety'],
      crewSize: '50-100 Personnel',
      targetDate: '2026-11-01',
      scope: 'NLNG Train 7 support work package. Ultra-high pressure hydro-blasting (up to 40,000 PSI) and protective industrial coating for storage tank skirts and heat exchangers. All crew members require valid offshore medical certificates and swamp safety inductions.',
      status: 'New',
      notes: 'Initial tender notice received through web portal. Pending detailed BOQ from Daewoo commercial team.'
    },
    {
      id: 'NGS-REQ-6320',
      date: '2026-09-14T11:15:30.000Z',
      contractor: 'Delta Marine & Offshore Logistics',
      name: 'Capt. Tunde Adeleke (Marine Base Director)',
      phone: '+2348023319900',
      email: 'tunde@deltamarine-ng.com',
      location: 'Escravos Swamp Operations, Delta State',
      commercialModel: 'Lump-Sum Work Package',
      services: [
        'Engineering Services (Piping / Structural / Valves)',
        'Storm Drainage & Sump Desilting'
      ],
      rawServices: ['EngineeringServices', 'DrainageSumps'],
      crewSize: '15-50 Personnel',
      targetDate: '2026-09-26',
      scope: 'Emergency manifold valve changeout, heavy flange bolt-torqueing, and comprehensive industrial sump desilting before regulatory environmental inspection.',
      status: 'Mobilised',
      notes: 'Contract awarded and mobilization sign-off completed. 14 technicians and safety supervisor deployed under Lead Field Manager.'
    }
  ];

  function getSubmissions() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultDemoLeads));
        return defaultDemoLeads;
      }
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultDemoLeads));
        return defaultDemoLeads;
      }
      return parsed;
    } catch (e) {
      console.error('Error reading localStorage:', e);
      return defaultDemoLeads;
    }
  }

  function saveSubmissions(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      updateView();
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }

  // 3. UI Updates: KPIs and Table Rendering
  function updateKPIs(submissions) {
    const total = submissions.length;
    const countNew = submissions.filter(s => s.status === 'New').length;
    const countReview = submissions.filter(s => s.status === 'In Review').length;
    const countMobilised = submissions.filter(s => s.status === 'Mobilised').length;
    const countArchived = submissions.filter(s => s.status === 'Archived').length;

    // Top Cards
    document.getElementById('kpiTotal').textContent = total;
    document.getElementById('kpiNew').textContent = countNew;
    document.getElementById('kpiReview').textContent = countReview;
    document.getElementById('kpiMobilised').textContent = countMobilised;

    // Filter Buttons
    document.getElementById('countAll').textContent = total;
    document.getElementById('countNew').textContent = countNew;
    document.getElementById('countReview').textContent = countReview;
    document.getElementById('countMobilised').textContent = countMobilised;
    document.getElementById('countArchived').textContent = countArchived;
  }

  function formatDate(isoStr) {
    if (!isoStr) return '--';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoStr;
    }
  }

  function getStatusClass(status) {
    switch (status) {
      case 'New': return 'new';
      case 'In Review': return 'review';
      case 'Mobilised': return 'mobilised';
      case 'Archived': return 'archived';
      default: return 'new';
    }
  }

  function cleanPhoneNumber(phone) {
    if (!phone) return '';
    let cleaned = phone.replace(/[^\d+]/g, '');
    if (cleaned.startsWith('0') && cleaned.length === 11) {
      cleaned = '234' + cleaned.substring(1);
    } else if (cleaned.startsWith('+')) {
      cleaned = cleaned.substring(1);
    }
    return cleaned;
  }

  function renderTable(submissions) {
    tableBody.innerHTML = '';

    // Apply Filter & Search
    const filtered = submissions.filter(item => {
      const matchesFilter = (currentFilter === 'all' || item.status === currentFilter);
      
      const searchHaystack = [
        item.id,
        item.contractor,
        item.name,
        item.phone,
        item.email,
        item.location,
        item.scope,
        (item.services || []).join(' ')
      ].join(' ').toLowerCase();

      const matchesSearch = !currentSearch || searchHaystack.includes(currentSearch);
      return matchesFilter && matchesSearch;
    });

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 3rem 1rem; color: var(--admin-text-muted);">
            <div style="font-size: 1.1rem; font-weight: 700; color: #cbd5e1; margin-bottom: 0.5rem;">No Tender Submissions Found</div>
            <p style="margin: 0; font-size: 0.85rem;">Try clearing your search query or selecting a different status filter.</p>
          </td>
        </tr>
      `;
      return;
    }

    filtered.forEach(sub => {
      const tr = document.createElement('tr');
      const cleanPhone = cleanPhoneNumber(sub.phone);
      const whatsappMsg = encodeURIComponent(`Hello ${sub.name}, this is Raphael Nkemjika Julius (MD, NKEM Global Services Limited). We received your workforce mobilisation request (${sub.id}) for ${sub.contractor} at ${sub.location}. Let us discuss the deployment schedule.`);
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappMsg}`;

      // Format Services (display first 2 tags, then +N if more)
      const servicesList = sub.services || [];
      let servicesHtml = '';
      if (servicesList.length > 0) {
        servicesList.slice(0, 2).forEach(srv => {
          servicesHtml += `<span class="service-tag">${srv}</span> `;
        });
        if (servicesList.length > 2) {
          servicesHtml += `<span class="service-tag" style="background: rgba(148, 163, 184, 0.1); color: #cbd5e1;">+${servicesList.length - 2} more</span>`;
        }
      } else {
        servicesHtml = '<span style="color: var(--admin-text-muted); font-size: 0.75rem;">Unspecified Service</span>';
      }

      tr.innerHTML = `
        <td>
          <div style="font-weight: 800; color: #fff; font-size: 0.9rem;">${sub.id}</div>
          <div style="font-size: 0.72rem; color: var(--admin-text-muted); margin-top: 0.2rem;">${formatDate(sub.date)}</div>
        </td>
        <td>
          <div style="font-weight: 700; color: #fff; font-size: 0.925rem;">${sub.contractor || 'Direct Client'}</div>
          <div style="font-size: 0.75rem; color: #cbd5e1; display: flex; align-items: center; gap: 0.25rem; margin-top: 0.2rem;">
            <svg class="svg-icon" viewBox="0 0 24 24" width="12" height="12" fill="var(--admin-gold)"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>
            <span>${sub.location || 'Nigeria'}</span>
          </div>
        </td>
        <td>
          <div style="font-weight: 600; color: #fff;">${sub.name || 'Site Representative'}</div>
          <div style="display: flex; gap: 0.35rem; margin-top: 0.35rem;">
            ${sub.phone ? `
              <a href="${whatsappUrl}" target="_blank" class="btn-action whatsapp" title="Chat on WhatsApp (${sub.phone})">
                <svg class="svg-icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/></svg>
              </a>
              <a href="tel:${sub.phone}" class="btn-action phone" title="Call Direct (${sub.phone})">
                <svg class="svg-icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z"/></svg>
              </a>
            ` : ''}
            ${sub.email ? `
              <a href="mailto:${sub.email}?subject=Re:%20NKEM%20Global%20Services%20Mobilisation%20Inquiry%20${sub.id}" class="btn-action" title="Send Corporate Email (${sub.email})">
                <svg class="svg-icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              </a>
            ` : ''}
          </div>
        </td>
        <td>
          <span style="font-size: 0.85rem; color: #cbd5e1;">${sub.location || '--'}</span>
        </td>
        <td style="max-width: 240px;">
          ${servicesHtml}
        </td>
        <td>
          <div style="font-weight: 600; color: #fff; font-size: 0.825rem;">${sub.crewSize || 'Unspecified'}</div>
          <div style="font-size: 0.72rem; color: var(--admin-text-muted); margin-top: 0.2rem;">
            Target: <span style="color: #cbd5e1;">${sub.targetDate || 'Immediate'}</span>
          </div>
        </td>
        <td>
          <select class="status-select-inline" data-id="${sub.id}" style="background: var(--admin-bg); color: #fff; border: 1px solid var(--admin-border); border-radius: 4px; padding: 0.25rem 0.45rem; font-size: 0.75rem; font-weight: 700;">
            <option value="New" ${sub.status === 'New' ? 'selected' : ''}>New</option>
            <option value="In Review" ${sub.status === 'In Review' ? 'selected' : ''}>In Review</option>
            <option value="Mobilised" ${sub.status === 'Mobilised' ? 'selected' : ''}>Mobilised</option>
            <option value="Archived" ${sub.status === 'Archived' ? 'selected' : ''}>Archived</option>
          </select>
        </td>
        <td style="text-align: right; white-space: nowrap;">
          <button class="btn-action view-detail-btn" data-id="${sub.id}" title="View Full Scope & Notes">
            <svg class="svg-icon" viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
          </button>
          <button class="btn-action delete delete-sub-btn" data-id="${sub.id}" title="Delete Record">
            <svg class="svg-icon" viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </td>
      `;

      tableBody.appendChild(tr);
    });

    // Wire inline status change listeners
    document.querySelectorAll('.status-select-inline').forEach(select => {
      select.addEventListener('change', (e) => {
        const reqId = e.target.getAttribute('data-id');
        const newStatus = e.target.value;
        updateSubmissionStatus(reqId, newStatus);
      });
    });

    // Wire view detail button listeners
    document.querySelectorAll('.view-detail-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const reqId = btn.getAttribute('data-id');
        openDetailModal(reqId);
      });
    });

    // Wire delete button listeners
    document.querySelectorAll('.delete-sub-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const reqId = btn.getAttribute('data-id');
        deleteSubmission(reqId);
      });
    });
  }

  function updateView() {
    const subs = getSubmissions();
    updateKPIs(subs);
    renderTable(subs);
  }

  function updateSubmissionStatus(reqId, newStatus) {
    const subs = getSubmissions();
    const target = subs.find(s => s.id === reqId);
    if (target) {
      target.status = newStatus;
      saveSubmissions(subs);
      showToast(`Record ${reqId} status updated to: ${newStatus}`);
    }
  }

  function deleteSubmission(reqId) {
    if (confirm(`Are you sure you want to permanently delete lead record ${reqId}?`)) {
      let subs = getSubmissions();
      subs = subs.filter(s => s.id !== reqId);
      saveSubmissions(subs);
      showToast(`Record ${reqId} deleted.`);
    }
  }

  // 4. Detail Modal Logic
  function openDetailModal(reqId) {
    const subs = getSubmissions();
    const sub = subs.find(s => s.id === reqId);
    if (!sub) return;

    activeModalReqId = reqId;

    document.getElementById('modalReqId').textContent = sub.id;
    document.getElementById('modalTimestamp').textContent = `Registered on: ${formatDate(sub.date)}`;
    
    const badge = document.getElementById('modalStatusBadge');
    badge.textContent = sub.status;
    badge.className = `badge-status ${getStatusClass(sub.status)}`;

    document.getElementById('modalContractor').textContent = sub.contractor || '--';
    document.getElementById('modalContact').textContent = sub.name || '--';
    document.getElementById('modalPhone').textContent = sub.phone || '--';
    document.getElementById('modalEmail').textContent = sub.email || '--';
    document.getElementById('modalLocation').textContent = sub.location || '--';
    document.getElementById('modalCommercial').textContent = sub.commercialModel || 'Standard Package';
    document.getElementById('modalCrewSize').textContent = sub.crewSize || 'Unspecified';
    document.getElementById('modalTargetDate').textContent = sub.targetDate || 'Immediate';

    // Services tags
    const servicesContainer = document.getElementById('modalServices');
    servicesContainer.innerHTML = '';
    (sub.services || []).forEach(srv => {
      const tag = document.createElement('span');
      tag.className = 'service-tag';
      tag.textContent = srv;
      servicesContainer.appendChild(tag);
    });

    document.getElementById('modalScope').textContent = sub.scope || 'No technical scope specifications entered.';
    document.getElementById('modalStatusSelect').value = sub.status || 'New';
    document.getElementById('modalNotes').value = sub.notes || '';

    // Action links
    const cleanPhone = cleanPhoneNumber(sub.phone);
    const whatsappMsg = encodeURIComponent(`Hello ${sub.name}, this is Raphael Nkemjika Julius (Managing Director, NKEM Global Services Limited). We have reviewed your workforce mobilisation inquiry (${sub.id}) for ${sub.contractor} at ${sub.location}. Let us finalize terms.`);
    
    document.getElementById('modalWhatsAppBtn').href = `https://wa.me/${cleanPhone}?text=${whatsappMsg}`;
    document.getElementById('modalCallBtn').href = `tel:${sub.phone}`;
    document.getElementById('modalEmailBtn').href = `mailto:${sub.email}?subject=NKEM%20Global%20Services%20Mobilisation%20Inquiry%20${sub.id}`;

    detailModal.classList.add('active');
  }

  window.closeDetailModal = function() {
    if (detailModal) {
      detailModal.classList.remove('active');
      activeModalReqId = null;
    }
  };

  if (saveNotesBtn) {
    saveNotesBtn.addEventListener('click', () => {
      if (!activeModalReqId) return;
      const subs = getSubmissions();
      const target = subs.find(s => s.id === activeModalReqId);
      if (target) {
        target.status = document.getElementById('modalStatusSelect').value;
        target.notes = document.getElementById('modalNotes').value.trim();
        saveSubmissions(subs);
        
        // Update modal badge
        const badge = document.getElementById('modalStatusBadge');
        badge.textContent = target.status;
        badge.className = `badge-status ${getStatusClass(target.status)}`;

        showToast(`Notes and status saved for ${activeModalReqId}`);
      }
    });
  }

  // 5. Manual Lead Creation Modal
  if (addManualBtn) {
    addManualBtn.addEventListener('click', () => {
      if (manualModal) manualModal.classList.add('active');
    });
  }

  window.closeManualModal = function() {
    if (manualModal) {
      manualModal.classList.remove('active');
      if (manualInquiryForm) manualInquiryForm.reset();
    }
  };

  if (manualInquiryForm) {
    manualInquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const contractor = manualInquiryForm.querySelector('[name="m_contractor"]')?.value?.trim() || '';
      const name = manualInquiryForm.querySelector('[name="m_name"]')?.value?.trim() || '';
      const phone = manualInquiryForm.querySelector('[name="m_phone"]')?.value?.trim() || '';
      const email = manualInquiryForm.querySelector('[name="m_email"]')?.value?.trim() || '';
      const location = manualInquiryForm.querySelector('[name="m_location"]')?.value?.trim() || '';
      const crewSize = manualInquiryForm.querySelector('[name="m_crew_size"]')?.value || '5-15 Personnel';
      const targetDate = manualInquiryForm.querySelector('[name="m_target_date"]')?.value || '';
      const scope = manualInquiryForm.querySelector('[name="m_scope"]')?.value?.trim() || '';

      const services = [];
      manualInquiryForm.querySelectorAll('input[name="m_services"]:checked').forEach(cb => {
        services.push(cb.value);
      });

      const reqId = 'NGS-REQ-' + Math.floor(1000 + Math.random() * 9000);

      const newLead = {
        id: reqId,
        date: new Date().toISOString(),
        contractor: contractor,
        name: name,
        phone: phone,
        email: email,
        location: location,
        commercialModel: 'Direct Negotiation',
        services: services.length > 0 ? services : ['Direct Technical Workforce'],
        rawServices: services,
        crewSize: crewSize,
        targetDate: targetDate,
        scope: scope,
        status: 'New',
        notes: 'Manually logged via Executive Admin Portal.'
      };

      const subs = getSubmissions();
      subs.unshift(newLead);
      saveSubmissions(subs);

      closeManualModal();
      showToast(`Inquiry ${reqId} successfully logged!`);
    });
  }

  // 6. Search & Filters
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.toLowerCase().trim();
      renderTable(getSubmissions());
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter') || 'all';
      renderTable(getSubmissions());
    });
  });

  // 7. CSV Export (Excel Compatible with UTF-8 BOM)
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', () => {
      const subs = getSubmissions();
      if (subs.length === 0) {
        showToast('No submissions available to export.');
        return;
      }

      const headers = [
        'Request ID',
        'Submission Date',
        'Prime Contractor / Client',
        'Contact Person',
        'Phone / WhatsApp',
        'Email',
        'Project Location',
        'Commercial Model',
        'Requested Service Disciplines',
        'Crew Size',
        'Target Mobilisation Date',
        'Status',
        'Scope Details',
        'Internal Operational Notes'
      ];

      const rows = subs.map(s => [
        s.id,
        s.date,
        s.contractor,
        s.name,
        s.phone,
        s.email,
        s.location,
        s.commercialModel,
        (s.services || []).join('; '),
        s.crewSize,
        s.targetDate,
        s.status,
        (s.scope || '').replace(/\r?\n/g, ' '),
        (s.notes || '').replace(/\r?\n/g, ' ')
      ]);

      const csvContent = '\uFEFF' + [
        headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','),
        ...rows.map(row => row.map(cell => `"${(cell || '').toString().replace(/"/g, '""')}"`).join(','))
      ].join('\r\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      const today = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `NKEM_Global_Services_Tenders_${today}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('Exported tenders to CSV (Excel compatible).');
    });
  }

  // 8. Reset Demo Data
  if (resetDemoBtn) {
    resetDemoBtn.addEventListener('click', () => {
      if (confirm('Restore sample realistic EPC contractor submissions? Existing entries will be refreshed.')) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultDemoLeads));
        updateView();
        showToast('Sample EPC tender leads restored.');
      }
    });
  }

  // 9. Toast Helper
  function showToast(message) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // Modal outside-click dismiss
  window.addEventListener('click', (e) => {
    if (e.target === detailModal) closeDetailModal();
    if (e.target === manualModal) closeManualModal();
  });

  // Initialize
  checkAuth();
  updateView();
});

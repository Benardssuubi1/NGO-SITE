// Bridgepoint Relief — shared front-end behaviour. Vanilla JS, no deps.
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      mobileMenu.style.maxHeight = isOpen ? mobileMenu.scrollHeight + 'px' : '0px';
    });
  }

  /* ---------- Dispatch ledger ticker (signature element) ---------- */
  const DISPATCH_ENTRIES = [
    { text: 'Borehole commissioned', loc: 'Nsanje, Malawi' },
    { text: '412 school kits delivered', loc: 'Cox\u2019s Bazar, Bangladesh' },
    { text: 'Mobile clinic completed 3rd rotation', loc: 'Bidibidi, Uganda' },
    { text: 'Flood shelter reinforced', loc: 'Sylhet, Bangladesh' },
    { text: 'Nutrition program enrolled 88 children', loc: 'Turkana, Kenya' },
    { text: 'Water filtration unit installed', loc: 'Chimanimani, Zimbabwe' },
    { text: 'Teacher training cohort graduated', loc: 'Herat, Afghanistan' },
    { text: 'Emergency relief kits dispatched', loc: 'Gaziantep, T\u00fcrkiye' },
    { text: 'Vaccination outreach reached 640 people', loc: 'Kasese, Uganda' },
    { text: 'Solar micro-grid switched on', loc: 'Mzuzu, Malawi' }
  ];
  const track = document.getElementById('dispatch-track');
  if (track) {
    const mins = [];
    for (let i = 0; i < 40; i++) mins.push(2 + Math.floor(Math.random() * 58));
    const buildItem = (entry, i) => `
      <div class="dispatch-item" role="listitem">
        <span class="dot" aria-hidden="true"></span>
        <span>${entry.text}</span>
        <span class="coord-tag loc" style="background:transparent;border:none;padding:0;color:#FDBA74;">${entry.loc}</span>
        <span class="time">${mins[i % mins.length]}m ago</span>
      </div>`;
    // duplicate the list once so the CSS -50% loop is seamless
    const doubled = [...DISPATCH_ENTRIES, ...DISPATCH_ENTRIES];
    track.innerHTML = doubled.map(buildItem).join('');
  }

  /* ---------- Animated impact counters ---------- */
  const counters = document.querySelectorAll('[data-counter]');
  const runCounter = (el) => {
    const target = parseInt(el.getAttribute('data-counter'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (counters.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { runCounter(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.4 });
    counters.forEach(c => io.observe(c));
  }

  /* ---------- Program filter tabs (programs.html) ---------- */
  const filterBtns = document.querySelectorAll('[data-filter]');
  const filterCards = document.querySelectorAll('[data-category]');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.setAttribute('aria-pressed', 'false'));
        btn.setAttribute('aria-pressed', 'true');
        const cat = btn.getAttribute('data-filter');
        filterCards.forEach(card => {
          const show = cat === 'all' || card.getAttribute('data-category') === cat;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ---------- Blog filter (blog.html) ---------- */
  const blogBtns = document.querySelectorAll('[data-blog-filter]');
  const blogCards = document.querySelectorAll('[data-blog-category]');
  if (blogBtns.length) {
    blogBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        blogBtns.forEach(b => b.setAttribute('aria-pressed', 'false'));
        btn.setAttribute('aria-pressed', 'true');
        const cat = btn.getAttribute('data-blog-filter');
        blogCards.forEach(card => {
          const show = cat === 'all' || card.getAttribute('data-blog-category') === cat;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ---------- Donate page ---------- */
  const amountBtns = document.querySelectorAll('.amount-btn');
  const customAmount = document.getElementById('custom-amount');
  const freqBtns = document.querySelectorAll('[data-freq]');
  const currencySelect = document.getElementById('currency-select');
  const feeCheckbox = document.getElementById('cover-fee');
  const summaryAmount = document.getElementById('summary-amount');
  const summaryFee = document.getElementById('summary-fee');
  const summaryTotal = document.getElementById('summary-total');
  const summaryFreq = document.getElementById('summary-freq');
  const donateForm = document.getElementById('donate-form');

  const CURRENCY_SYMBOLS = { USD: '$', EUR: '\u20ac', GBP: '\u00a3', KES: 'KSh', UGX: 'USh' };
  let state = { amount: 50, freq: 'one-time', currency: 'USD', coverFee: false };

  function updateSummary() {
    const sym = CURRENCY_SYMBOLS[state.currency] || '$';
    const base = state.amount || 0;
    const fee = state.coverFee ? +(base * 0.038).toFixed(2) : 0;
    const total = +(base + fee).toFixed(2);
    if (summaryAmount) summaryAmount.textContent = `${sym}${base.toLocaleString()}`;
    if (summaryFee) summaryFee.textContent = `${sym}${fee.toFixed(2)}`;
    if (summaryTotal) summaryTotal.textContent = `${sym}${total.toLocaleString()}`;
    if (summaryFreq) summaryFreq.textContent = state.freq === 'monthly' ? 'per month' : 'one-time';
  }

  if (amountBtns.length) {
    amountBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        amountBtns.forEach(b => b.setAttribute('aria-pressed', 'false'));
        btn.setAttribute('aria-pressed', 'true');
        if (customAmount) customAmount.value = '';
        state.amount = parseFloat(btn.getAttribute('data-amount'));
        updateSummary();
      });
    });
  }
  if (customAmount) {
    customAmount.addEventListener('input', () => {
      amountBtns.forEach(b => b.setAttribute('aria-pressed', 'false'));
      state.amount = parseFloat(customAmount.value) || 0;
      updateSummary();
    });
  }
  if (freqBtns.length) {
    freqBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        freqBtns.forEach(b => b.setAttribute('aria-pressed', 'false'));
        btn.setAttribute('aria-pressed', 'true');
        state.freq = btn.getAttribute('data-freq');
        updateSummary();
      });
    });
  }
  if (currencySelect) {
    currencySelect.addEventListener('change', () => {
      state.currency = currencySelect.value;
      updateSummary();
    });
  }
  if (feeCheckbox) {
    feeCheckbox.addEventListener('change', () => {
      state.coverFee = feeCheckbox.checked;
      updateSummary();
    });
  }
  if (donateForm) {
    updateSummary();
    donateForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (state.amount <= 0) {
        const err = document.getElementById('amount-error');
        if (err) err.classList.remove('hidden');
        return;
      }
      window.location.href = 'donate-success.html';
    });
  }

  /* ---------- Generic contact form validation ---------- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      contactForm.querySelectorAll('[required]').forEach(field => {
        const errorEl = document.getElementById(field.id + '-error');
        if (!field.value.trim()) {
          valid = false;
          if (errorEl) errorEl.classList.remove('hidden');
          field.setAttribute('aria-invalid', 'true');
        } else {
          if (errorEl) errorEl.classList.add('hidden');
          field.removeAttribute('aria-invalid');
        }
      });
      const confirmBox = document.getElementById('form-confirm');
      if (valid && confirmBox) {
        confirmBox.classList.remove('hidden');
        contactForm.reset();
        confirmBox.setAttribute('tabindex', '-1');
        confirmBox.focus();
      }
    });
  }

  /* ---------- CMS panel (admin dashboard) ---------- */
  const cmsForm = document.getElementById('cms-form');
  if (cmsForm) {
    cmsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const toast = document.getElementById('cms-toast');
      if (toast) {
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 3000);
      }
      cmsForm.reset();
    });
  }

  /* ---------- Admin sidebar mobile toggle ---------- */
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('admin-sidebar');
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
  }

  /* ---------- Simple modal (refund action, leadership bios) ---------- */
  document.querySelectorAll('[data-modal-open]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const modal = document.getElementById(trigger.getAttribute('data-modal-open'));
      if (!modal) return;
      modal.classList.remove('hidden');
      const closeBtn = modal.querySelector('[data-modal-close]');
      if (closeBtn) closeBtn.focus();
    });
  });
  document.querySelectorAll('[data-modal-close]').forEach(btn => {
    btn.addEventListener('click', () => btn.closest('.modal-backdrop').classList.add('hidden'));
  });
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) backdrop.classList.add('hidden'); });
    backdrop.addEventListener('keydown', (e) => { if (e.key === 'Escape') backdrop.classList.add('hidden'); });
  });

  /* ---------- Allocation pie chart (transparency.html) — pure SVG, no deps ---------- */
  const pieEl = document.getElementById('allocation-pie');
  if (pieEl) {
    const data = [
      { label: 'Direct Programs', value: 85, color: '#0F172A' },
      { label: 'Administration', value: 10, color: '#EA580C' },
      { label: 'Fundraising', value: 5, color: '#059669' }
    ];
    const r = 80, cx = 100, cy = 100;
    let cumulative = 0;
    const toXY = (pct) => {
      const angle = (pct / 100) * 2 * Math.PI - Math.PI / 2;
      return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
    };
    let paths = '';
    data.forEach(d => {
      const start = toXY(cumulative);
      cumulative += d.value;
      const end = toXY(cumulative);
      const large = d.value > 50 ? 1 : 0;
      paths += `<path d="M${cx},${cy} L${start[0].toFixed(2)},${start[1].toFixed(2)} A${r},${r} 0 ${large} 1 ${end[0].toFixed(2)},${end[1].toFixed(2)} Z" fill="${d.color}" stroke="#F8FAFC" stroke-width="2"><title>${d.label}: ${d.value}%</title></path>`;
    });
    pieEl.innerHTML = `<svg viewBox="0 0 200 200" role="img" aria-label="Fund allocation: 85% direct programs, 10% administration, 5% fundraising">${paths}<circle cx="100" cy="100" r="46" fill="#F8FAFC"/></svg>`;
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
});

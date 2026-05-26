'use strict';

/* ============================================================================
   Uchkun Shodmonov — Portfolio
   Modern Minimal · Light + Dark
============================================================================ */

/* -------------------- STATE -------------------- */
let currentLanguage = localStorage.getItem('language') || 'en';
let currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
let translations = {};

const SOCIAL_ICONS = {
  'logo-github': '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57v-2c-3.34.72-4.04-1.61-4.04-1.61-.55-1.4-1.34-1.77-1.34-1.77-1.08-.74.09-.73.09-.73 1.2.08 1.83 1.24 1.83 1.24 1.07 1.83 2.8 1.3 3.48 1 .11-.78.42-1.3.76-1.6-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.81 5.63-5.48 5.92.42.36.81 1.1.81 2.22v3.29c0 .31.21.69.83.57A12 12 0 0 0 12 .3"/></svg>',
  'logo-linkedin': '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.86-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zm1.78 13.02H3.56V9h3.55v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/></svg>',
  'send': '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/></svg>',
  'mail-outline': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
};

/* -------------------- I18N -------------------- */
async function loadTranslations(lang) {
  try {
    const response = await fetch(`./assets/data/translations/${lang}.json`);
    translations = await response.json();
    return translations;
  } catch (e) {
    console.error('Translation load failed:', e);
    if (lang !== 'en') return loadTranslations('en');
    return {};
  }
}

function getNested(obj, path) {
  return path.split('.').reduce((cur, key) => cur?.[key], obj);
}

function getLocalized(value) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value[currentLanguage] || value.en || '';
  }
  return value;
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const t = getNested(translations, key);
    if (t) el.textContent = t;
  });
}

async function changeLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('language', lang);
  document.documentElement.setAttribute('lang', lang);

  await loadTranslations(lang);
  applyTranslations();

  document.querySelectorAll('[data-current-lang]').forEach(el => el.textContent = lang.toUpperCase());
  document.querySelectorAll('.language-option').forEach(opt => {
    opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
  });

  await loadProfileData();
  await loadResumeData();
}

function initLanguageSwitcher() {
  const dropdown = document.querySelector('[data-language-dropdown]');
  const currentBtn = document.querySelector('[data-language-current]');
  if (!dropdown || !currentBtn) return;

  currentBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('active');
    currentBtn.setAttribute('aria-expanded', dropdown.classList.contains('active'));
  });

  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) dropdown.classList.remove('active');
  });

  document.querySelectorAll('.language-option').forEach(option => {
    option.addEventListener('click', () => {
      const lang = option.getAttribute('data-lang');
      dropdown.classList.remove('active');
      changeLanguage(lang);
    });
  });
}

/* -------------------- THEME -------------------- */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#0a0a0a' : '#ffffff');
}

function initTheme() {
  applyTheme(currentTheme);

  const toggleBtn = document.querySelector('[data-theme-toggle]');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', currentTheme);
    applyTheme(currentTheme);
  });
}

/* -------------------- HEADER / NAV -------------------- */
function initHeader() {
  const header = document.querySelector('[data-header]');
  const mobileToggle = document.querySelector('[data-mobile-menu-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  // Scrolled border state
  const onScroll = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 8);
    // Progress
    const progress = document.querySelector('[data-scroll-progress]');
    if (progress) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      progress.style.width = pct + '%';
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      mobileNav.classList.toggle('active');
    });
    mobileNav.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        mobileNav.classList.remove('active');
      });
    });
  }

  // Active section highlight via IntersectionObserver
  const navLinks = document.querySelectorAll('[data-nav-link]');
  const sections = document.querySelectorAll('[data-section]');
  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    const setActive = (id) => {
      navLinks.forEach(l => {
        const target = l.getAttribute('href')?.replace('#', '');
        l.classList.toggle('active', target === id);
      });
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-50% 0px -50% 0px', threshold: 0 });
    sections.forEach(s => observer.observe(s));
  }
}

/* -------------------- REVEAL ANIMATIONS -------------------- */
function initReveal() {
  const elements = document.querySelectorAll('[data-reveal]');
  if (!elements.length || !('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('in-view'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  elements.forEach(el => observer.observe(el));
}

function observeReveal(nodes) {
  if (!('IntersectionObserver' in window)) {
    nodes.forEach(n => n.classList.add('in-view'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  nodes.forEach(n => observer.observe(n));
}

/* -------------------- DATA LOADERS -------------------- */
async function loadProfileData() {
  try {
    const response = await fetch('./assets/data/profile.json');
    const data = await response.json();

    const name = getLocalized(data.personal.name);
    const title = getLocalized(data.personal.title);
    const location = getLocalized(data.contact.location);
    const intro = getLocalized(data.about.introduction);
    const highlights = getLocalized(data.about.highlights);

    // Hero
    setText('hero-name', name);
    setText('hero-tagline', intro);
    setText('hero-location', location);
    setText('hero-role', title);

    // About lead
    setText('about-intro', intro);

    // About card
    setText('profile-name', name);
    setText('profile-title', title);
    const avatar = document.getElementById('profile-avatar');
    if (avatar) {
      avatar.src = data.personal.avatar;
      avatar.alt = name;
    }

    // About highlights
    const highlightsList = document.getElementById('about-highlights');
    if (highlightsList && Array.isArray(highlights)) {
      highlightsList.innerHTML = highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('');
    }

    // Services
    const servicesList = document.getElementById('services-list');
    if (servicesList) {
      servicesList.innerHTML = '';
      data.services.forEach(service => {
        const li = document.createElement('li');
        li.className = 'service-item';
        const sTitle = getLocalized(service.title);
        const sDesc = getLocalized(service.description);
        li.innerHTML = `
          <div class="service-icon-box">
            <img src="${service.icon}" alt="" width="24" height="24">
          </div>
          <div class="service-content-box">
            <h4 class="service-item-title">${escapeHtml(sTitle)}</h4>
            <p class="service-item-text">${escapeHtml(sDesc)}</p>
          </div>
        `;
        servicesList.appendChild(li);
      });
    }

    // Hero socials
    const heroSocials = document.getElementById('hero-socials');
    if (heroSocials) {
      heroSocials.innerHTML = data.social.map(s => `
        <a href="${s.url}" class="hero-social" aria-label="${s.platform}" target="_blank" rel="noopener noreferrer">
          ${SOCIAL_ICONS[s.icon] || ''}
        </a>
      `).join('');
    }

    // Contact section
    const contactEmail = document.getElementById('contact-email');
    const contactEmailValue = document.getElementById('contact-email-value');
    if (contactEmail && contactEmailValue) {
      contactEmail.href = `mailto:${data.contact.email}`;
      contactEmailValue.textContent = data.contact.email;
    }

    const contactGrid = document.getElementById('contact-grid');
    if (contactGrid) {
      const labels = translations.sidebar?.contactTitles || { email: 'Email', phone: 'Phone', location: 'Location' };
      contactGrid.innerHTML = `
        <div class="contact-info-item">
          <p class="contact-info-label">${escapeHtml(labels.phone)}</p>
          <a href="tel:${data.contact.phone}" class="contact-info-value">${escapeHtml(data.contact.phoneDisplay)}</a>
        </div>
        <div class="contact-info-item">
          <p class="contact-info-label">${escapeHtml(labels.location)}</p>
          <p class="contact-info-value">${escapeHtml(location)}</p>
        </div>
      `;
    }

    const contactSocials = document.getElementById('contact-socials');
    if (contactSocials) {
      contactSocials.innerHTML = data.social.map(s => `
        <a href="${s.url}" class="contact-social" aria-label="${s.platform}" target="_blank" rel="noopener noreferrer">
          ${SOCIAL_ICONS[s.icon] || ''}
        </a>
      `).join('');
    }

  } catch (e) {
    console.error('Profile load failed:', e);
  }
}

async function loadResumeData() {
  try {
    const response = await fetch('./assets/data/resume.json');
    const data = await response.json();

    // Experience
    const expList = document.getElementById('experience-list');
    if (expList) {
      expList.innerHTML = '';
      data.experiences.forEach(exp => {
        const li = document.createElement('li');
        li.className = 'timeline-item reveal';
        const position = getLocalized(exp.position);
        const description = getLocalized(exp.description);
        li.innerHTML = `
          <div class="timeline-period">${escapeHtml(exp.period)}</div>
          <div class="timeline-content">
            <h4 class="timeline-title">${escapeHtml(exp.company)}</h4>
            ${position ? `<p class="timeline-role">${escapeHtml(position)}</p>` : ''}
            ${description ? `<p class="timeline-description">${escapeHtml(description)}</p>` : ''}
          </div>
        `;
        expList.appendChild(li);
      });
      observeReveal(expList.querySelectorAll('.reveal'));
    }

    // Education
    const eduList = document.getElementById('education-list');
    if (eduList) {
      eduList.innerHTML = '';
      data.education.forEach(edu => {
        const li = document.createElement('li');
        li.className = 'timeline-item reveal';
        const institution = getLocalized(edu.institution);
        const degree = getLocalized(edu.degree);
        li.innerHTML = `
          <div class="timeline-period">${escapeHtml(edu.period)}</div>
          <div class="timeline-content">
            <h4 class="timeline-title">${escapeHtml(institution)}</h4>
            ${degree ? `<p class="timeline-role">${escapeHtml(degree)}</p>` : ''}
          </div>
        `;
        eduList.appendChild(li);
      });
      observeReveal(eduList.querySelectorAll('.reveal'));
    }

    // Skills
    const skillsList = document.getElementById('skills-list');
    if (skillsList) {
      skillsList.innerHTML = '';
      data.skills.forEach(skill => {
        const li = document.createElement('li');
        li.className = 'skill-item';
        li.innerHTML = `
          <div class="skill-header">
            <span class="skill-name">${escapeHtml(skill.name)}</span>
            <span class="skill-percentage">${skill.percentage}%</span>
          </div>
          <div class="skill-bar">
            <div class="skill-fill" data-skill-fill="${skill.percentage}"></div>
          </div>
        `;
        skillsList.appendChild(li);
      });
      animateSkillBars();
    }

  } catch (e) {
    console.error('Resume load failed:', e);
  }
}

function animateSkillBars() {
  const fills = document.querySelectorAll('[data-skill-fill]');
  if (!('IntersectionObserver' in window)) {
    fills.forEach(f => { f.style.width = f.getAttribute('data-skill-fill') + '%'; });
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const pct = entry.target.getAttribute('data-skill-fill');
        entry.target.style.width = pct + '%';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  fills.forEach(f => observer.observe(f));
}

async function loadProjects() {
  try {
    const response = await fetch('./assets/data/projects.json');
    const projects = await response.json();
    const list = document.getElementById('project-list');
    if (!list) return;

    list.innerHTML = '';

    projects.forEach((project, idx) => {
      const platformText = (project.iosUrl && project.androidUrl) ? 'iOS · Android' :
                           (project.iosUrl ? 'iOS' : 'Android');

      const li = document.createElement('li');
      li.className = 'project-item reveal';
      if (project.iosUrl) li.setAttribute('data-ios-url', project.iosUrl);
      if (project.androidUrl) li.setAttribute('data-android-url', project.androidUrl);

      li.innerHTML = `
        <a href="#" class="project-link" aria-label="${escapeHtml(project.title)}">
          <figure class="project-img">
            <div class="project-item-icon-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
            </div>
            <img src="${project.image}" alt="${escapeHtml(project.title)}" loading="lazy">
          </figure>
          <div class="project-content">
            <h3 class="project-title">${escapeHtml(project.title)}</h3>
            <p class="project-category">${platformText}</p>
          </div>
        </a>
      `;
      list.appendChild(li);
    });

    observeReveal(list.querySelectorAll('.reveal'));
    initPlatformModal();

  } catch (e) {
    console.error('Projects load failed:', e);
    const list = document.getElementById('project-list');
    if (list) {
      const msg = translations.errors?.loadProjects || 'Failed to load projects.';
      list.innerHTML = `<li class="error-message">${msg}</li>`;
    }
  }
}

/* -------------------- PLATFORM MODAL -------------------- */
function initPlatformModal() {
  const container = document.querySelector('[data-platform-modal-container]');
  const overlay = document.querySelector('[data-platform-overlay]');
  const closeBtn = document.querySelector('[data-platform-modal-close-btn]');
  const iosBtn = document.querySelector('[data-ios-btn]');
  const androidBtn = document.querySelector('[data-android-btn]');
  const projectLinks = document.querySelectorAll('.project-link');

  if (!container) return;

  const toggle = () => {
    container.classList.toggle('active');
    document.body.style.overflow = container.classList.contains('active') ? 'hidden' : '';
  };

  projectLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const item = link.closest('.project-item');
      const ios = item?.dataset.iosUrl;
      const android = item?.dataset.androidUrl;

      if (ios && android) {
        iosBtn.href = ios;
        androidBtn.href = android;
        toggle();
      } else if (ios) {
        window.open(ios, '_blank');
      } else if (android) {
        window.open(android, '_blank');
      }
    });
  });

  closeBtn?.addEventListener('click', toggle);
  overlay?.addEventListener('click', toggle);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && container.classList.contains('active')) toggle();
  });

  iosBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    window.open(iosBtn.href, '_blank');
    toggle();
  });
  androidBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    window.open(androidBtn.href, '_blank');
    toggle();
  });
}

/* -------------------- HELPERS -------------------- */
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* -------------------- INIT -------------------- */
document.addEventListener('DOMContentLoaded', async () => {
  // Theme first to avoid flash
  initTheme();

  // Footer year
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Translations
  await loadTranslations(currentLanguage);
  document.documentElement.setAttribute('lang', currentLanguage);

  document.querySelectorAll('[data-current-lang]').forEach(el => el.textContent = currentLanguage.toUpperCase());
  document.querySelectorAll('.language-option').forEach(opt => {
    opt.classList.toggle('active', opt.getAttribute('data-lang') === currentLanguage);
  });

  applyTranslations();

  // Init UI
  initLanguageSwitcher();
  initHeader();
  initReveal();

  // Load data
  await Promise.all([
    loadProfileData(),
    loadProjects(),
    loadResumeData(),
  ]);
});

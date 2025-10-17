'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// Language Management
let currentLanguage = localStorage.getItem("language") || "en";
let translations = {};

// Load translation file
async function loadTranslations(lang) {
  try {
    const response = await fetch(`./assets/data/translations/${lang}.json`);
    translations = await response.json();
    return translations;
  } catch (error) {
    console.error(`Error loading translations for ${lang}:`, error);
    // Fallback to English if language file fails to load
    if (lang !== 'en') {
      return await loadTranslations('en');
    }
    return {};
  }
}

// Apply translations to all elements with data-i18n attribute
function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = getNestedTranslation(translations, key);
    if (translation) {
      element.textContent = translation;
    }
  });
}

// Get nested translation value (e.g., "nav.about" -> translations.nav.about)
function getNestedTranslation(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

// Get value in current language (for multilingual content)
function getLocalizedValue(value) {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return value[currentLanguage] || value['en'] || '';
  }
  return value;
}

// Change language
async function changeLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem("language", lang);
  
  // Load translations
  await loadTranslations(lang);
  
  // Apply translations to static elements
  applyTranslations();
  
  // Update language buttons
  document.querySelectorAll('.language-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-lang') === lang) {
      btn.classList.add('active');
    }
  });
  
  // Reload dynamic content with new language
  await loadProfileData();
  await loadResumeData();
  
  // Update sidebar button text
  updateSidebarButtonText();
}

// Update sidebar show/hide contacts button text
function updateSidebarButtonText() {
  const sidebarBtn = document.querySelector("[data-sidebar-btn] span");
  const sidebar = document.querySelector("[data-sidebar]");
  
  if (sidebarBtn) {
    if (sidebar.classList.contains("active")) {
      sidebarBtn.setAttribute('data-i18n', 'sidebar.hideContacts');
    } else {
      sidebarBtn.setAttribute('data-i18n', 'sidebar.showContacts');
    }
    applyTranslations();
  }
}

// Initialize language switcher
function initLanguageSwitcher() {
  const languageButtons = document.querySelectorAll('.language-btn');
  
  languageButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      changeLanguage(lang);
    });
  });
}

// Theme toggle functionality
const themeToggleBtn = document.querySelector("[data-theme-toggle]");
const sunIcon = document.querySelector(".sun-icon");
const moonIcon = document.querySelector(".moon-icon");

// Check for saved theme preference or default to dark mode
const currentTheme = localStorage.getItem("theme") || "dark";

// Apply theme on page load
if (currentTheme === "light") {
  document.body.classList.add("light-mode");
  sunIcon.style.display = "none";
  moonIcon.style.display = "block";
}

// Theme toggle function
const toggleTheme = function() {
  document.body.classList.toggle("light-mode");
  
  // Toggle icons
  if (document.body.classList.contains("light-mode")) {
    sunIcon.style.display = "none";
    moonIcon.style.display = "block";
    localStorage.setItem("theme", "light");
  } else {
    sunIcon.style.display = "block";
    moonIcon.style.display = "none";
    localStorage.setItem("theme", "dark");
  }
}

// Add event listener to theme toggle button
themeToggleBtn.addEventListener("click", toggleTheme);



// Load and render projects from JSON
async function loadProjects() {
  try {
    const response = await fetch('./assets/data/projects.json');
    const projects = await response.json();
    
    const projectList = document.getElementById('project-list');
    
    // Clear loading message
    projectList.innerHTML = '';
    
    projects.forEach(project => {
      const category = (project.iosUrl && project.androidUrl) ? 'all' : 
                       (project.iosUrl ? 'ios' : 'android');
      
      const platformText = (project.iosUrl && project.androidUrl) ? 'iOS | Android' :
                          (project.iosUrl ? 'iOS' : 'Android');
      
      const li = document.createElement('li');
      li.className = 'project-item';
      li.setAttribute('data-filter-item', '');
      li.setAttribute('data-category', category);
      
      if (project.iosUrl) {
        li.setAttribute('data-ios-url', project.iosUrl);
      }
      if (project.androidUrl) {
        li.setAttribute('data-android-url', project.androidUrl);
      }
      
      li.innerHTML = `
        <a href="#" class="project-link">
          <figure class="project-img">
            <div class="project-item-icon-box">
              <ion-icon name="eye-outline"></ion-icon>
            </div>
            <img src="${project.image}" alt="${project.title}" loading="lazy">
          </figure>
          <h3 class="project-title">${project.title}</h3>
          <p class="project-category">${platformText}</p>
        </a>
      `;
      
      projectList.appendChild(li);
    });
    
    // Initialize platform modal after projects are loaded
    initPlatformModal();
    
  } catch (error) {
    console.error('Error loading projects:', error);
    const projectList = document.getElementById('project-list');
    const errorMsg = translations.errors?.loadProjects || 'Failed to load projects. Please refresh the page.';
    projectList.innerHTML = `<li class="error-message">${errorMsg}</li>`;
  }
}

// Load and render resume data (experiences, education, skills) from JSON
async function loadResumeData() {
  try {
    const response = await fetch('./assets/data/resume.json');
    const resumeData = await response.json();
    
    // Load Experiences (use localized content)
    const experienceList = document.getElementById('experience-list');
    experienceList.innerHTML = '';
    
    resumeData.experiences.forEach(experience => {
      const li = document.createElement('li');
      li.className = 'timeline-item';
      
      const position = getLocalizedValue(experience.position);
      const description = getLocalizedValue(experience.description);
      const positionText = position ? ` | ${position}` : '';
      
      li.innerHTML = `
        <h4 class="h4 timeline-item-title">${experience.company}</h4>
        <span>${experience.period}${positionText}</span>
        <p class="timeline-text">${description}</p>
      `;
      
      experienceList.appendChild(li);
    });
    
    // Load Education (use localized content)
    const educationList = document.getElementById('education-list');
    educationList.innerHTML = '';
    
    resumeData.education.forEach(edu => {
      const li = document.createElement('li');
      li.className = 'timeline-item';
      
      const institution = getLocalizedValue(edu.institution);
      const degree = getLocalizedValue(edu.degree);
      
      li.innerHTML = `
        <h4 class="h4 timeline-item-title">${institution}</h4>
        <span>${edu.period}</span>
        <p class="timeline-text">${degree}</p>
      `;
      
      educationList.appendChild(li);
    });
    
    // Load Skills
    const skillsList = document.getElementById('skills-list');
    skillsList.innerHTML = '';
    
    resumeData.skills.forEach(skill => {
      const li = document.createElement('li');
      li.className = 'skills-item';
      
      li.innerHTML = `
        <div class="title-wrapper">
          <h5 class="h5">${skill.name}</h5>
          <data value="${skill.percentage}">${skill.percentage}%</data>
        </div>
        <div class="skill-progress-bg">
          <div class="skill-progress-fill" style="width: ${skill.percentage}%;"></div>
        </div>
      `;
      
      skillsList.appendChild(li);
    });
    
  } catch (error) {
    console.error('Error loading resume data:', error);
    
    // Show error messages in each section
    const experienceList = document.getElementById('experience-list');
    const educationList = document.getElementById('education-list');
    const skillsList = document.getElementById('skills-list');
    
    if (experienceList) {
      experienceList.innerHTML = '<li class="error-message">Failed to load experiences.</li>';
    }
    if (educationList) {
      educationList.innerHTML = '<li class="error-message">Failed to load education.</li>';
    }
    if (skillsList) {
      skillsList.innerHTML = '<li class="error-message">Failed to load skills.</li>';
    }
  }
}

// Load and render profile data (personal info, contacts, about, services) from JSON
async function loadProfileData() {
  try {
    const response = await fetch('./assets/data/profile.json');
    const profileData = await response.json();
    
    // Load Personal Info (use localized content)
    const profileName = document.getElementById('profile-name');
    const profileTitle = document.getElementById('profile-title');
    const profileAvatar = document.getElementById('profile-avatar');
    
    const name = getLocalizedValue(profileData.personal.name);
    const title = getLocalizedValue(profileData.personal.title);
    
    if (profileName) {
      profileName.textContent = name;
      profileName.title = name;
    }
    if (profileTitle) {
      profileTitle.textContent = title;
    }
    if (profileAvatar) {
      profileAvatar.src = profileData.personal.avatar;
      profileAvatar.alt = name;
    }
    
    // Load Contact Information
    const contactsList = document.getElementById('contacts-list');
    if (contactsList) {
      contactsList.innerHTML = '';
      
      // Email
      const emailLi = document.createElement('li');
      emailLi.className = 'contact-item';
      emailLi.innerHTML = `
        <div class="icon-box">
          <ion-icon name="mail-outline"></ion-icon>
        </div>
        <div class="contact-info">
          <p class="contact-title">Email</p>
          <a href="mailto:${profileData.contact.email}" class="contact-link">${profileData.contact.email}</a>
        </div>
      `;
      contactsList.appendChild(emailLi);
      
      // Phone
      const phoneLi = document.createElement('li');
      phoneLi.className = 'contact-item';
      phoneLi.innerHTML = `
        <div class="icon-box">
          <ion-icon name="phone-portrait-outline"></ion-icon>
        </div>
        <div class="contact-info">
          <p class="contact-title">Phone</p>
          <a href="tel:${profileData.contact.phone}" class="contact-link">${profileData.contact.phoneDisplay}</a>
        </div>
      `;
      contactsList.appendChild(phoneLi);
      
      // Location
      const locationLi = document.createElement('li');
      locationLi.className = 'contact-item';
      const location = getLocalizedValue(profileData.contact.location);
      locationLi.innerHTML = `
        <div class="icon-box">
          <ion-icon name="location-outline"></ion-icon>
        </div>
        <div class="contact-info">
          <p class="contact-title">Location</p>
          <address>${location}</address>
        </div>
      `;
      contactsList.appendChild(locationLi);
    }
    
    // Load Social Links
    const socialList = document.getElementById('social-list');
    if (socialList) {
      socialList.innerHTML = '';
      
      profileData.social.forEach(social => {
        const li = document.createElement('li');
        li.className = 'social-item';
        li.innerHTML = `
          <a href="${social.url}" class="social-link" target="_blank" rel="noopener noreferrer">
            <ion-icon name="${social.icon}"></ion-icon>
          </a>
        `;
        socialList.appendChild(li);
      });
    }
    
    // Load About Section (use localized content from profile.json)
    const aboutSection = document.getElementById('about-section');
    if (aboutSection) {
      const introduction = getLocalizedValue(profileData.about.introduction);
      const highlights = getLocalizedValue(profileData.about.highlights);
      
      aboutSection.innerHTML = `
        <p>${introduction}</p>
        <ul>
          ${highlights.map(highlight => `<li>${highlight}</li>`).join('')}
        </ul>
      `;
    }
    
    // Load Services (use localized content from profile.json)
    const servicesList = document.getElementById('services-list');
    if (servicesList) {
      servicesList.innerHTML = '';
      
      profileData.services.forEach(service => {
        const li = document.createElement('li');
        li.className = 'service-item';
        const title = getLocalizedValue(service.title);
        const description = getLocalizedValue(service.description);
        
        li.innerHTML = `
          <div class="service-icon-box">
            <img src="${service.icon}" alt="${title} icon" width="40">
          </div>
          <div class="service-content-box">
            <h4 class="h4 service-item-title">${title}</h4>
            <p class="service-item-text">${description}</p>
          </div>
        `;
        servicesList.appendChild(li);
      });
    }
    
    // Apply contact titles translations
    if (translations.sidebar) {
      const contactTitles = document.querySelectorAll('.contact-title');
      if (contactTitles.length >= 3) {
        contactTitles[0].textContent = translations.sidebar.contactTitles.email;
        contactTitles[1].textContent = translations.sidebar.contactTitles.phone;
        contactTitles[2].textContent = translations.sidebar.contactTitles.location;
      }
    }
    
  } catch (error) {
    console.error('Error loading profile data:', error);
    
    // Show error messages
    const profileName = document.getElementById('profile-name');
    const aboutSection = document.getElementById('about-section');
    
    if (profileName) {
      profileName.textContent = 'Error loading profile';
    }
    if (aboutSection) {
      aboutSection.innerHTML = '<p class="error-message">Failed to load profile information.</p>';
    }
  }
}

// Call all load functions when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize language first
  await loadTranslations(currentLanguage);
  
  // Set active language button
  document.querySelectorAll('.language-btn').forEach(btn => {
    if (btn.getAttribute('data-lang') === currentLanguage) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  // Initialize language switcher
  initLanguageSwitcher();
  
  // Apply initial translations
  applyTranslations();
  
  // Load all data
  await loadProfileData();
  await loadProjects();
  await loadResumeData();
});



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { 
  elementToggleFunc(sidebar);
  // Update button text after toggle
  setTimeout(() => {
    updateSidebarButtonText();
  }, 10);
});



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// Filter functionality removed - all projects are now always visible



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}



// Platform selector modal functionality
function initPlatformModal() {
  const platformModalContainer = document.querySelector("[data-platform-modal-container]");
  const platformOverlay = document.querySelector("[data-platform-overlay]");
  const platformModalCloseBtn = document.querySelector("[data-platform-modal-close-btn]");
  const iosBtn = document.querySelector("[data-ios-btn]");
  const androidBtn = document.querySelector("[data-android-btn]");
  const projectLinks = document.querySelectorAll(".project-link");

  // toggle platform modal
  const platformModalFunc = function () {
    platformModalContainer.classList.toggle("active");
    platformOverlay.classList.toggle("active");
  }

  // add click event to all project links
  for (let i = 0; i < projectLinks.length; i++) {
    projectLinks[i].addEventListener("click", function (e) {
      e.preventDefault();
      
      const projectItem = this.closest('.project-item');
      const iosUrl = projectItem.dataset.iosUrl;
      const androidUrl = projectItem.dataset.androidUrl;
      
      // If both URLs exist, show modal
      if (iosUrl && androidUrl) {
        iosBtn.href = iosUrl;
        androidBtn.href = androidUrl;
        platformModalFunc();
      } else if (iosUrl) {
        // Only iOS available
        window.open(iosUrl, '_blank');
      } else if (androidUrl) {
        // Only Android available
        window.open(androidUrl, '_blank');
      }
    });
  }

  // Close modal events
  platformModalCloseBtn.addEventListener("click", platformModalFunc);
  platformOverlay.addEventListener("click", platformModalFunc);

  // Open links in new tab when platform button is clicked
  iosBtn.addEventListener("click", function(e) {
    e.preventDefault();
    window.open(this.href, '_blank');
    platformModalFunc();
  });

  androidBtn.addEventListener("click", function(e) {
    e.preventDefault();
    window.open(this.href, '_blank');
    platformModalFunc();
  });
}
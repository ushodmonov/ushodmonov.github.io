'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



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
    projectList.innerHTML = '<li class="error-message">Failed to load projects. Please refresh the page.</li>';
  }
}

// Call loadProjects when DOM is ready
document.addEventListener('DOMContentLoaded', loadProjects);



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



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
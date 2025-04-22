// research-scripts.js

// ============ Section Highlighter ============
class SectionHighlighter {
  constructor() {
    this.sections = document.querySelectorAll('.research-section');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.scrollThrottleDelay = 100;
    this.scrollThrottleTimeout = null;
    this.lastActiveSection = null;
    this.handleScroll = this.handleScroll.bind(this);
    this.init();
  }

  init() {
    if (!this.sections.length || !this.navLinks.length) return;

    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          window.scrollTo({
            top: targetSection.offsetTop - 100,
            behavior: 'smooth'
          });
          setTimeout(() => this.highlightActiveSection(), 400);
        }
      });
    });

    window.addEventListener('scroll', this.handleScroll, { passive: true });
    this.highlightActiveSection();
  }

  handleScroll() {
    if (!this.scrollThrottleTimeout) {
      this.scrollThrottleTimeout = setTimeout(() => {
        this.highlightActiveSection();
        this.scrollThrottleTimeout = null;
      }, this.scrollThrottleDelay);
    }
  }

  highlightActiveSection() {
    let currentSectionId = null;
    this.sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 150 && rect.bottom >= 150) {
        currentSectionId = section.id;
      }
    });

    if (currentSectionId && currentSectionId !== this.lastActiveSection) {
      this.lastActiveSection = currentSectionId;
      this.navLinks.forEach(link => {
        const href = link.getAttribute('href').replace('#', '');
        const isActive = href === currentSectionId;
        link.classList.toggle('active', isActive);
        link.setAttribute('aria-current', isActive ? 'page' : 'false');
      });
    }
  }

  destroy() {
    window.removeEventListener('scroll', this.handleScroll);
    if (this.scrollThrottleTimeout) {
      clearTimeout(this.scrollThrottleTimeout);
    }
    this.navLinks.forEach(link => {
      link.removeEventListener('click', this.handleNavClick);
    });
  }
}

// ============ Slider Controller ============
class SliderManager {
  constructor() {
    this.sliders = [];
    this.init();
  }

  init() {
    document.querySelectorAll('.slider-container').forEach(slider => {
      const wrapper = slider.querySelector('.slider-wrapper');
      const slides = slider.querySelectorAll('.slider-slide');
      const prevBtn = slider.querySelector('.prev-btn');
      const nextBtn = slider.querySelector('.next-btn');
      const dotsContainer = slider.querySelector('.slider-dots');
      
      // Only initialize if more than one slide
      if (slides.length > 1) {
        let currentIndex = 0;
        
        // Create dots
        slides.forEach((_, index) => {
          const dot = document.createElement('button');
          dot.classList.add('slider-dot');
          if (index === 0) dot.classList.add('active');
          dot.addEventListener('click', () => {
            currentIndex = index;
            this.updateSlider(wrapper, slides, dotsContainer, currentIndex);
          });
          dotsContainer.appendChild(dot);
        });

        // Initialize navigation
        prevBtn?.addEventListener('click', () => {
          currentIndex = (currentIndex - 1 + slides.length) % slides.length;
          this.updateSlider(wrapper, slides, dotsContainer, currentIndex);
        });

        nextBtn?.addEventListener('click', () => {
          currentIndex = (currentIndex + 1) % slides.length;
          this.updateSlider(wrapper, slides, dotsContainer, currentIndex);
        });

        // Initial update
        this.updateSlider(wrapper, slides, dotsContainer, currentIndex);
        
        // Store slider instance
        this.sliders.push({
          wrapper,
          slides,
          dotsContainer,
          currentIndex
        });
      } else {
        // Hide navigation controls for single slide
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        if (dotsContainer) dotsContainer.style.display = 'none';
      }
    });
  }

  updateSlider(wrapper, slides, dotsContainer, currentIndex) {
    // Update slide position
    wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // Update dots
    if (dotsContainer) {
      dotsContainer.querySelectorAll('.slider-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }
  }
}

// ============ App Bootstrapping ============
class App {
  constructor() {
    this.sectionHighlighter = null;
    this.sliderManager = null;
    this.init();
  }

  init() {
    this.sectionHighlighter = new SectionHighlighter();
    this.sliderManager = new SliderManager();
    window.addEventListener('beforeunload', () => this.cleanup());
  }

  cleanup() {
    this.sectionHighlighter?.destroy();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  try {
    new App();
  } catch (err) {
    console.error('App initialization error:', err);
  }
});


document.querySelectorAll(".nav-link:not(.external-link)").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href");
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      this.scrollToSection(targetSection);
    }
  });
});



    // سیستم پارتیکل تعاملی
    class ParticleSystem {
      constructor() {
        this.particles = [];
        this.mouseX = -1000;
        this.mouseY = -1000;
        this.mouseInView = false;
        this.particleContainer = document.getElementById("particles");
        this.init();
      }

      init() {
        // ایجاد ذرات
        const particleCount = Math.floor(
          (window.innerWidth * window.innerHeight) / 5000
        );
        for (let i = 0; i < particleCount; i++) {
          this.createParticle();
        }

        // ردیابی ماوس
        document.addEventListener("mousemove", (e) => {
          this.mouseX = e.clientX;
          this.mouseY = e.clientY;
        });

        document.addEventListener("mouseenter", () => {
          this.mouseInView = true;
        });

        document.addEventListener("mouseleave", () => {
          this.mouseInView = false;
        });

        // شروع انیمیشن
        this.animate();
      }

      createParticle() {
        const particle = document.createElement("div");
        particle.className = "particle";

        // موقعیت اولیه تصادفی
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;

        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;

        // اندازه و شفافیت تصادفی
        const size = Math.random() * 3 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.opacity = Math.random() * 0.4 + 0.1;

        // ذخیره خصوصیات ذره
        particle._x = x;
        particle._y = y;
        particle._vx = Math.random() * 2 - 1;
        particle._vy = Math.random() * 2 - 1;
        particle._size = size;

        this.particleContainer.appendChild(particle);
        this.particles.push(particle);
      }

      animate() {
        // آپدیت موقعیت ذرات
        this.particles.forEach((particle) => {
          // حرکت پایه
          particle._x += particle._vx * 0.5;
          particle._y += particle._vy * 0.5;

          // تعامل با ماوس
          if (this.mouseInView) {
            const dx = particle._x - this.mouseX;
            const dy = particle._y - this.mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // منطقه جاذبه
            if (distance < 200) {
              // منطقه دفع (نزدیک به ماوس)
              if (distance < 80) {
                const force = (80 - distance) * 0.02;
                particle._x += (dx / distance) * force;
                particle._y += (dy / distance) * force;
              }
              // منطقه جذب (دور از ماوس)
              else {
                const force = (1 - distance / 200) * 0.5;
                particle._x -= (dx / distance) * force;
                particle._y -= (dy / distance) * force;
              }
            }
          }

          // محدودیت مرزهای صفحه
          if (particle._x < 0 || particle._x > window.innerWidth) {
            particle._vx *= -1;
          }
          if (particle._y < 0 || particle._y > window.innerHeight) {
            particle._vy *= -1;
          }

          // اعمال موقعیت جدید
          particle.style.left = `${particle._x}px`;
          particle.style.top = `${particle._y}px`;
        });

        requestAnimationFrame(() => this.animate());
      }
    }

    // کاستوم کرسر
    class CustomCursor {
      constructor() {
        this.cursor = document.getElementById("customCursor");
        this.init();
      }

      init() {
        document.addEventListener("mousemove", (e) => {
          this.cursor.style.left = `${e.clientX}px`;
          this.cursor.style.top = `${e.clientY}px`;
        });

        document.addEventListener("mousedown", () => {
          this.cursor.classList.add("active");
        });

        document.addEventListener("mouseup", () => {
          this.cursor.classList.remove("active");
        });

        document.querySelectorAll("a, button, .nav-link").forEach((el) => {
          el.addEventListener("mouseenter", () => {
            this.cursor.classList.add("active");
          });

          el.addEventListener("mouseleave", () => {
            this.cursor.classList.remove("active");
          });
        });
      }
    }







    class ScrollSystem {
      constructor() {
        this.sections = document.querySelectorAll("section");
        this.navLinks = document.querySelectorAll(".nav-link");
        this.scrollIndicator = document.getElementById("scrollIndicator");
        this.tooltips = document.querySelectorAll('.tooltip-content');
        this.isScrolling = false;
        this.init();
      }
    
      init() {
        // اسکرول با کلیک روی منو
        document.querySelectorAll(".nav-link:not(.external-link)").forEach((link) => {
          link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("href");
            const targetSection = document.querySelector(targetId);
    
            if (targetSection) {
              this.scrollToSection(targetSection);
            }
          });
        });


        
    
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add("active");
              // فعال کردن tooltip مربوطه
              const tooltipId = entry.target.dataset.tooltipId;
              if (tooltipId) {
                document.getElementById(tooltipId).classList.add('active');
              }
            } else {
              entry.target.classList.remove("active");
              // غیرفعال کردن tooltip مربوطه
              const tooltipId = entry.target.dataset.tooltipId;
              if (tooltipId) {
                document.getElementById(tooltipId).classList.remove('active');
              }
            }
          });
        }, {threshold: 0.1});
    
        this.sections.forEach(section => {
          observer.observe(section);
        });
    
        // به روز رسانی وضعیت منو
        window.addEventListener("scroll", () => {
          if (!this.isScrolling) {
            this.updateActiveNav();
            this.updateScrollIndicator();
          }
        });
    
        this.updateActiveNav();
        this.updateScrollIndicator();
      }
    
      getCurrentSection() {
        let closestSection = this.sections[0];
        let minDistance = Infinity;
        const viewportCenter = window.scrollY + window.innerHeight / 2;
    
        this.sections.forEach((section) => {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.clientHeight;
          const sectionCenter = sectionTop + sectionHeight / 2;
          const distance = Math.abs(viewportCenter - sectionCenter);
    
          if (distance < minDistance) {
            minDistance = distance;
            closestSection = section;
          }
        });
    
        return closestSection;
      }
    
      scrollToSection(section) {
        this.isScrolling = true;
        window.scrollTo({
          top: section.offsetTop,
          behavior: "smooth"
        });
    
        setTimeout(() => {
          this.isScrolling = false;
          this.updateActiveNav();
          this.updateScrollIndicator();
        }, 1000);
      }
    
      updateActiveNav() {
        const currentSection = this.getCurrentSection();
        const currentSectionId = `#${currentSection.id}`;
    
        this.navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === currentSectionId) {
            link.classList.add("active");
          }
        });
      }
    
      updateScrollIndicator() {
        const currentSection = this.getCurrentSection();
        const sectionIndex = Array.from(this.sections).indexOf(currentSection);
        const progress = sectionIndex / (this.sections.length - 1);
    
        const indicatorHeight = window.innerHeight * 0.6;
        const indicatorTop = window.innerHeight * 0.2 + window.innerHeight * 0.6 * progress;
    
        this.scrollIndicator.style.height = `${indicatorHeight}px`;
        this.scrollIndicator.style.top = `${indicatorTop}px`;
    
        if (currentSection === this.sections[this.sections.length - 1]) {
          this.scrollIndicator.classList.add("inactive");
          this.scrollIndicator.classList.remove("active");
        } else {
          this.scrollIndicator.classList.add("active");
          this.scrollIndicator.classList.remove("inactive");
        }
      }
    }




    document.addEventListener('DOMContentLoaded', function () {
      const glassPanel = document.querySelector('.glass-tooltip-panel');
      let activeWrapper = null;

      // ایجاد یک پل نامرئی بین عنصر و پنل
      const hoverBridge = document.createElement('div');
      hoverBridge.className = 'hover-bridge';
      document.body.appendChild(hoverBridge);

      document.querySelectorAll('.experience-title-wrapper').forEach(wrapper => {
        const tooltipId = wrapper.getAttribute('data-tooltip-id');
        const tooltipContent = document.getElementById(tooltipId);

        wrapper.addEventListener('mouseenter', () => {
          activeWrapper = wrapper;
          glassPanel.innerHTML = tooltipContent.innerHTML;
          glassPanel.classList.add('active');

          // موقعیت‌یابی پل
          const wrapperRect = wrapper.getBoundingClientRect();
          const panelRect = glassPanel.getBoundingClientRect();

          hoverBridge.style.cssText = `
        position: fixed;
        top: ${wrapperRect.bottom}px;
        right: ${window.innerWidth - panelRect.left}px;
        height: ${wrapperRect.top - panelRect.bottom}px;
        width: ${wrapperRect.right - wrapperRect.left}px;
        z-index: 998;
        background: transparent;
      `;
        });

        wrapper.addEventListener('mouseleave', (e) => {
          if (!e.relatedTarget ||
            !(e.relatedTarget === glassPanel || e.relatedTarget === hoverBridge)) {
            glassPanel.classList.remove('active');
          }
        });
      });

      glassPanel.addEventListener('mouseleave', (e) => {
        if (!e.relatedTarget ||
          !(e.relatedTarget === activeWrapper || e.relatedTarget === hoverBridge)) {
          glassPanel.classList.remove('active');
        }
      });
    });






    // راه‌اندازی سیستم‌ها هنگام لود صفحه
    document.addEventListener("DOMContentLoaded", () => {
      new ParticleSystem();
      new CustomCursor();
      new ScrollSystem();

      // فعال کردن انیمیشن مهارت‌ها هنگام اسکرول
      const skillsSection = document.getElementById("skills");
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("animated");
            }
          });
        },
        { threshold: 0.1 }
      );
      
      observer.observe(skillsSection);
    });
    
    
    
    

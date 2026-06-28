// Portfolio Application
class PortfolioApp {
    constructor() {
        this.currentSection = 'profile';
        this.activeExperience = null;
        this.activeProject = null;
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupExperienceSelection();
        this.setupProjectSelection();
        this.setupScrollIndicator();
        this.setupPDFViewer();
        this.setupSmoothScrolling();
        this.setupTooltips();
        this.setupSkillSpacing();
    }

    // Navigation Setup
    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-button[data-section]');
        
        navButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const sectionId = e.currentTarget.dataset.section;
                this.switchSection(sectionId);
            });
        });
    }

    switchSection(sectionId) {
        if (!sectionId || !document.getElementById(sectionId)) return;

        // Update active nav button
        document.querySelectorAll('.nav-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionId}"]`)?.classList.add('active');

        // Update active section
        document.querySelectorAll('.portfolio-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');

        this.currentSection = sectionId;
        
        // Reset active states when switching sections
        this.resetActiveStates();
    }

    resetActiveStates() {
        if (this.activeExperience) {
            this.activeExperience.classList.remove('active');
            this.activeExperience = null;
        }
        if (this.activeProject) {
            this.activeProject.classList.remove('active');
            this.activeProject = null;
        }
        
        // Reset detail panels
        const experienceDetail = document.getElementById('experienceDetail');
        const projectDetail = document.getElementById('projectDetail');
        
        if (experienceDetail) {
            experienceDetail.querySelector('.detail-placeholder').style.display = 'block';
            const detailsContent = experienceDetail.querySelector('.role-details-content');
            if (detailsContent) detailsContent.classList.remove('active');
        }
        
        if (projectDetail) {
            projectDetail.querySelector('.detail-placeholder').style.display = 'block';
            const detailsContent = projectDetail.querySelector('.project-details-content');
            if (detailsContent) detailsContent.classList.remove('active');
        }
    }

    // Experience Section
    setupExperienceSelection() {
        const experienceItems = document.querySelectorAll('.experience-item');
        const experienceDetail = document.getElementById('experienceDetail');
        
        if (!experienceItems.length || !experienceDetail) return;

        experienceItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all items
                experienceItems.forEach(i => i.classList.remove('active'));
                
                // Add active class to clicked item
                item.classList.add('active');
                this.activeExperience = item;
                
                // Show details in right panel
                this.showExperienceDetails(item.dataset.role);
            });
        });
    }

    showExperienceDetails(roleId) {
        const experienceDetail = document.getElementById('experienceDetail');
        const detailPlaceholder = experienceDetail.querySelector('.detail-placeholder');
        const roleData = this.getRoleData(roleId);
        
        if (!roleData) return;

        detailPlaceholder.style.display = 'none';
        
        let detailsContent = experienceDetail.querySelector('.role-details-content');
        if (!detailsContent) {
            detailsContent = document.createElement('div');
            detailsContent.className = 'role-details-content';
            experienceDetail.appendChild(detailsContent);
        }
        
        detailsContent.innerHTML = `
            <h3 class="role-detail-title">${roleData.title}</h3>
            <ul class="role-detail-list">
                ${roleData.details.map(detail => `<li>${detail}</li>`).join('')}
            </ul>
        `;
        
        detailsContent.classList.add('active');
    }

    getRoleData(roleId) {
        const roleData = {
            'nexonest': {
                title: 'Founder & Computational Designer - NexoNest',
                details: [
                    'Developed a suite of Grasshopper Plugins for Rhino to assist designers in sustainable design',
                    'Created tools that enable designers to optimize their designs for energy efficiency and environmental performance',
                    'Bridged the gap between academic research and practical application in architectural design',
                    'Conducted comprehensive training programs and workshops on computational design methodologies',
                    'Developed and delivered specialized courses focusing on sustainability in computational design',
                    'Established an annual Sustainable Development webinar series to share knowledge and best practices'
                ]
            },
            'morphotect': {
                title: 'Python Developer - Morphotect',
                details: [
                    'Created Agent-Based Models (ABMs) to simulate human-environment interactions within a Social Digital Twin framework',
                    'Utilized Python for model development with complex behavioral algorithms to simulate realistic interactions',
                    'Focused on improving decision-making processes and understanding human-environment relationships',
                    'Designed automation system for BIM data extraction from Revit and importing geometry into Unity',
                    'Significantly reduced manual data entry time, enabling faster visual representation of architectural designs',
                    'Facilitated real-time data synchronization between BIM models and Unity environments',
                    'Developed comprehensive Data Analysis Framework using Python to process simulation data',
                    'Provided stakeholders with actionable insights for design optimization and decision-making'
                ]
            },
            'iust': {
                title: 'Research Assistant & Teaching Assistant - Iran University of Science and Technology',
                details: [
                    'Conducted research on Energy Efficiency, Daylighting, and Prefabrication using computational design methodologies',
                    'Designed and executed detailed research plans leveraging Rhino, Grasshopper, and Python',
                    'Developed Python-based codes and prototypes for generative design and design optimization',
                    'Published findings in research papers advancing knowledge in computational design and sustainable architecture',
                    'Assisted in teaching Design Studio 1, mentoring students in conceptualizing architectural projects',
                    'Delivered lectures and workshops on Computational Sustainability and basic sustainability principles',
                    'Taught Generative Form-Finding techniques emphasizing early-stage design with computational tools',
                    'Guided students in applying computational methods to real-world architectural challenges'
                ]
            },
            'robotics': {
                title: 'Robotics and Embedded Systems Developer - Iran University of Science and Technology',
                details: [
                    'Led development of prinTerra: A Mobile Cartesian 3D Printing Robot for modular habitats in arid environments',
                    'Designed toolpath generation algorithm based on sinusoidal slicing for structural strength optimization',
                    'Integrated real-time quality monitoring with smart sensors and CCTV for minimal human intervention',
                    'Collaborated on mechanical design, motion control testing, and material behavior calibration',
                    'Managed content development for interactive research documentation and performance analysis',
                    'Designed kinetic façade prototypes using servo motors and Arduino for adaptive solar shading',
                    'Implemented environmentally responsive lighting systems with light sensors and PWM-based control',
                    'Tested integration between digital parametric models and physical computing workflows'
                ]
            },
            'bootcamp': {
                title: 'Agent-Based Modeling Bootcamp - IUST & Morphotect Collaboration',
                details: [
                    'Spearheaded planning and execution of the Agent-Based Modeling Bootcamp for architecture and urban design',
                    'Designed curriculum introducing agent-based modeling concepts and Python programming applications',
                    'Taught participants to develop and implement agent-based models for architectural and urban projects',
                    'Managed all aspects including logistics, participant engagement, and stakeholder collaboration',
                    'Trained 42 participants in problem definition, code implementation, and result interpretation',
                    'Supervised 6 mentors to support participants throughout the bootcamp experience',
                    'Focused on practical applications in architecture and urban design workflows',
                    'Enabled participants to create animations and visualizations for their projects'
                ]
            },
            'architect': {
                title: 'Architectural Designer',
                details: [
                    'Conducted detailed feasibility studies analyzing zoning regulations, site conditions, and economic factors',
                    'Developed multiple conceptual alternatives with comprehensive cost estimates and phasing strategies',
                    'Created schematic design packages including space programs, massing studies, and circulation diagrams',
                    'Facilitated client workshops and brainstorming sessions to define project goals and design parameters',
                    'Presented design concepts to municipal authorities for preliminary approvals and regulatory compliance',
                    'Managed design teams of 3-5 architects through all project phases from concept to construction documents',
                    'Conducted weekly design reviews and coordination meetings to ensure project milestones were met',
                    'Implemented BIM workflows and quality control procedures for design documentation and coordination',
                    'Mentored junior staff in design development, detailing techniques, and presentation skills',
                    'Coordinated with external consultants including landscape architects, engineers, and lighting designers'
                ]
            }
        };

        return roleData[roleId];
    }

    // Projects Section
    setupProjectSelection() {
        const projectItems = document.querySelectorAll('.project-item');
        const projectDetail = document.getElementById('projectDetail');
        
        if (!projectItems.length || !projectDetail) return;

        projectItems.forEach(item => {
            item.addEventListener('click', (e) => {
                // Don't trigger if clicking the read more link
                if (e.target.classList.contains('project-link') || e.target.closest('.project-link')) {
                    return;
                }
                
                e.preventDefault();
                
                // Remove active class from all items
                projectItems.forEach(i => i.classList.remove('active'));
                
                // Add active class to clicked item
                item.classList.add('active');
                this.activeProject = item;
                
                // Show details in right panel
                this.showProjectDetails(item.dataset.project);
            });
        });
    }

    showProjectDetails(projectId) {
        const projectDetail = document.getElementById('projectDetail');
        const detailPlaceholder = projectDetail.querySelector('.detail-placeholder');
        const projectData = this.getProjectData(projectId);
        
        if (!projectData) return;

        detailPlaceholder.style.display = 'none';
        
        let detailsContent = projectDetail.querySelector('.project-details-content');
        if (!detailsContent) {
            detailsContent = document.createElement('div');
            detailsContent.className = 'project-details-content';
            projectDetail.appendChild(detailsContent);
        }
        
        detailsContent.innerHTML = `
            <h3 class="project-detail-title">${projectData.title}</h3>
            <p class="project-detail-description">${projectData.description}</p>
            <div class="project-features">
                <h4>Key Features:</h4>
                <ul class="project-feature-list">
                    ${projectData.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
            <a href="${projectData.link}" class="project-link" target="_blank">Read More</a>
        `;
        
        detailsContent.classList.add('active');
    }

    getProjectData(projectId) {
        const projectData = {
            'tectotrack': {
                title: 'TectoTrack - Social Digital Twin Platform',
                description: 'An advanced platform that simulates human behavior patterns and analyzes social interactions in built environments using AI-powered agent-based modeling.',
                features: [
                    '3 distinct human behavior profiles for realistic simulations',
                    'Predictive crowd dynamics analytics',
                    'Optimization for public spaces and retail layouts',
                    'Real-time wayfinding system analysis',
                    'AI-powered behavioral modeling',
                    'Comprehensive social interaction analysis'
                ],
                link: '../projects/professional/tectotrack/tectotrack.html'
            },
            'abm-bootcamp': {
                title: 'ABMs in Architecture and Urban Design',
                description: 'A comprehensive bootcamp exploring digital twins and agent-based models to simulate human behavior in urban spaces.',
                features: [
                    'Hands-on training with Rhino, Grasshopper, and Python',
                    'Real-world design challenges including pedestrian flow',
                    'Emergency evacuation simulations',
                    'Spatial perception analysis',
                    'AI-driven solutions for urban environments',
                    'Practical applications in architecture and planning'
                ],
                link: '../events/bootcamp/agent-based-modeling-2024.html'
            },
            'printerra': {
                title: 'prinTerra - Robotic 3D Printing Architecture',
                description: 'Research project in robotic 3D printing using local earth materials with AI-driven fabrication and sustainable construction methods.',
                features: [
                    'Local earth material utilization',
                    'AI-driven fabrication processes',
                    'Modular design approach',
                    'Sustainable construction methods',
                    'Robotic printing precision',
                    'Environmental compatibility'
                ],
                link: '../projects/academic/printerra.html'
            },
            'octomass': {
                title: 'OctoMass Plugin - Climate-Responsive Design',
                description: 'A generative Rhino/Grasshopper plugin for climate-responsive computational form-finding integrated with Ladybug Tools.',
                features: [
                    'Climate-responsive form-finding',
                    'Ladybug Tools integration',
                    'Algorithmic exploration of building massing',
                    'Early-stage design optimization',
                    'Performance-based design generation',
                    'Sustainable architecture focus'
                ],
                link: '../plugins/octomass/octomass.html'
            }
        };

        return projectData[projectId];
    }

    // PDF Viewer
    setupPDFViewer() {
        const prevButton = document.querySelector('.pdf-nav.prev');
        const nextButton = document.querySelector('.pdf-nav.next');
        const pageInfo = document.querySelector('.pdf-page-info');
        
        if (!prevButton || !nextButton || !pageInfo) return;

        let currentPage = 1;
        const totalPages = 12;

        const updatePDFView = () => {
            pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        };

        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                updatePDFView();
            }
        });

        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                updatePDFView();
            }
        });

        updatePDFView();
    }

    // Scroll Indicator
    setupScrollIndicator() {
        const scrollHandle = document.querySelector('.scroll-handle');
        const scrollable = document.querySelector('.content-scrollable');
        
        if (!scrollHandle || !scrollable) return;

        const updateScrollIndicator = () => {
            const scrollPercentage = (scrollable.scrollTop / (scrollable.scrollHeight - scrollable.clientHeight)) * 100;
            const handlePosition = (scrollHandle.parentElement.clientHeight - scrollHandle.clientHeight) * (scrollPercentage / 100);
            scrollHandle.style.top = `${handlePosition}px`;
        };

        scrollable.addEventListener('scroll', updateScrollIndicator);
        window.addEventListener('resize', updateScrollIndicator);
        
        updateScrollIndicator();
    }

    // Smooth Scrolling
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Tooltips
    setupTooltips() {
        const hobbyItems = document.querySelectorAll('.hobby-item');
        
        hobbyItems.forEach(item => {
            const tooltipText = item.getAttribute('data-tooltip');
            if (tooltipText) {
                item.addEventListener('mouseenter', (e) => {
                    this.showTooltip(e.target, tooltipText);
                });
                item.addEventListener('mouseleave', () => {
                    this.hideTooltip();
                });
            }
        });
    }

    showTooltip(element, text) {
        let tooltip = document.querySelector('.glass-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.className = 'glass-tooltip';
            document.body.appendChild(tooltip);
        }
        
        tooltip.textContent = text;
        tooltip.style.display = 'block';
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = (rect.left + rect.width / 2 - 100) + 'px';
        tooltip.style.top = (rect.bottom + 10) + 'px';
    }

    hideTooltip() {
        const tooltip = document.querySelector('.glass-tooltip');
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    }

    // Skill Spacing
    setupSkillSpacing() {
        const skillCategories = document.querySelectorAll('.skill-category');
        
        skillCategories.forEach(category => {
            category.style.marginBottom = 'var(--sp-4)';
            category.style.paddingBottom = 'var(--sp-3)';
            
            // Add border between categories
            if (category !== skillCategories[skillCategories.length - 1]) {
                category.style.borderBottom = '2px dashed var(--c-accent-weak)';
            }
        });
    }
}

// Initialize the portfolio app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// Handle reduced motion preference
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--transition', 'none');
}

// Handle window resize events
window.addEventListener('resize', () => {
    // Recalculate scroll indicator position
    const scrollHandle = document.querySelector('.scroll-handle');
    const scrollable = document.querySelector('.content-scrollable');
    
    if (scrollHandle && scrollable) {
        const scrollPercentage = (scrollable.scrollTop / (scrollable.scrollHeight - scrollable.clientHeight)) * 100;
        const handlePosition = (scrollHandle.parentElement.clientHeight - scrollHandle.clientHeight) * (scrollPercentage / 100);
        scrollHandle.style.top = `${handlePosition}px`;
    }
});





// --- Hash-aware section nav for Portfolio (add at the end of portfolio.js)
(function () {
  const scroller = document.querySelector('.content-scrollable');
  const buttons  = Array.from(document.querySelectorAll('.nav-button[data-section]'));
  const sections = Array.from(document.querySelectorAll('.portfolio-section'));

  function getSection(id) {
    return sections.find(s => s.id === id);
  }

  function setActiveButton(id) {
    buttons.forEach(b => b.classList.toggle('active', b.dataset.section === id));
  }

  function showSection(id, { push = true, smooth = true } = {}) {
    const target = getSection(id) || sections[0];
    if (!target) return;

    // فعال/غیرفعال
    sections.forEach(s => s.classList.toggle('active', s === target));
    setActiveButton(target.id);

    // اسکرول داخل .content-scrollable (scrollIntoView نزدیک‌ترین والد اسکرولی را انتخاب می‌کند)
    target.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant', block: 'start' });

    // به‌روزرسانی URL hash
    if (push) {
      const h = `#${target.id}`;
      if (location.hash !== h) history.pushState({ section: target.id }, '', h);
    }
  }

  // کلیک روی دکمه‌های سایدبار
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.nav-button[data-section]');
    if (!btn) return;
    e.preventDefault();
    showSection(btn.dataset.section, { push: true, smooth: true });
  });

  // پشتیبانی از Back/Forward
  window.addEventListener('hashchange', () => {
    const id = (location.hash || '').slice(1);
    if (id) showSection(id, { push: false, smooth: true });
  });

  // بارگذاری اولیه (deep link مثل #projects را رعایت کن)
  document.addEventListener('DOMContentLoaded', () => {
    const initial = (location.hash || '').slice(1) || (buttons[0] && buttons[0].dataset.section);
    showSection(initial, { push: false, smooth: false });
  });

  // کنترل اسکرول مرورگر (چون اسکرول اصلی داخل کانتینر است)
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
})();

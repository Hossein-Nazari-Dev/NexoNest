// Build left menu from section titles AFTER the renderer injects sections.

function setupSidebarToggle() {
  const sidebar = document.querySelector('.project-sidebar');
  const toggle = sidebar?.querySelector('.sidebar-toggle');
  const nav = sidebar?.querySelector('.sidebar-nav');
  if (!sidebar || !toggle || !nav) return;

  const setOpen = (isOpen) => {
    sidebar.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.querySelector('.sidebar-toggle-label').textContent = isOpen ? 'Close' : 'Menu';
  };

  sidebar.classList.add('nav-ready');
  setOpen(false);

  toggle.addEventListener('click', () => {
    setOpen(!sidebar.classList.contains('is-open'));
  });

  nav.addEventListener('click', (event) => {
    if (event.target.closest('a') && window.matchMedia('(max-width: 1060px)').matches) {
      setOpen(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && sidebar.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (!window.matchMedia('(max-width: 1060px)').matches) setOpen(false);
  });
}

function buildSidebarNav() {
  const sidebar = document.getElementById('sidebarNav');
  const sections = document.querySelectorAll('.content-section');
  if (!sidebar || !sections.length) return;

  const navItems = Array.from(sections).map((sec, idx) => {
    const titleEl = sec.querySelector('.section-title');
    if (!titleEl) return '';
    const id = `section-${idx + 1}`;
    sec.id = id;
    const label = sec.dataset.navTitle || titleEl.textContent;
    return `
      <div class="nav-item">
        <a href="#${id}" class="nav-link" data-section="${id}">
          <span class="nav-index">${String(idx + 1).padStart(2, '0')}</span>
          <span>${label}</span>
        </a>
      </div>`;
  }).join('');

  sidebar.innerHTML = navItems;
  setupSmoothScroll();
  observeSections();
}



function setupSmoothScroll() {
  const primary = document.querySelector('.sidebar-primary');
  if (!primary) return;

  const links = primary.querySelectorAll('.nav-link');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      // allow open-in-new-tab/ctrl/cmd click & non-left clicks
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;

      const href = link.getAttribute('href') || '';
      const dataSection = link.getAttribute('data-section');
      const sectionId = (dataSection || (href.startsWith('#') ? href.slice(1) : '')).trim();

      // if no in-page section target, let browser handle it normally
      if (!sectionId) return;

      const target = document.getElementById(sectionId);
      if (!target) return;

      // in-page smooth scroll
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // update URL hash without page jump
      try { history.replaceState(null, '', `#${sectionId}`); } catch (_) {}

      // active state only within primary menu
      primary.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
}





function observeSections() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(ent => {
      if (ent.isIntersecting) {
        const id = ent.target.id;
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.toggle('active', link.getAttribute('data-section') === id);
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-100px 0px -50% 0px' });

  document.querySelectorAll('.content-section').forEach(s => observer.observe(s));
}

// Rebuild when DOM ready (if SSR/HTML blocks exist) AND when project renders dynamically.
document.addEventListener('DOMContentLoaded', () => {
  setupSidebarToggle();
  buildSidebarNav();
});
document.addEventListener('project:rendered', buildSidebarNav);

function setupProjectProgress() {
  const update = () => {
    const root = document.documentElement;
    const scrollable = root.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    root.style.setProperty('--project-scroll', progress);
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

document.addEventListener('DOMContentLoaded', setupProjectProgress);

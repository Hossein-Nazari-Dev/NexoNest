// nav.js — Navigation click delegation, project popup, data init, circle animation
(function () {
  /* ------------------------------------------------------------------------
   * Load project data
   * ---------------------------------------------------------------------- */
  async function ensureProjectsData() {
    if (window.projectsData?.projects?.length) return window.projectsData;

    return window.loadProjectsData();
  }

  /* ------------------------------------------------------------------------
   * Utilities
   * ---------------------------------------------------------------------- */
  const resolveURL = (url) => new URL(url, document.baseURI).href;
  const norm = (v) => String(v || '').trim().toLowerCase().replace(/\s+/g, '-');

  function subParentId(subIdOrLabel) {
    const subs = window.projectsData?.subcategories || [];
    const n = norm(subIdOrLabel);
    const m = subs.find(s => norm(s.id) === n || norm(s.label) === n);
    return m?.parent || null;
  }

  function findProjectByEl(el) {
    const id = el?.getAttribute('data-id');
    if (!id) return null;
    const list = window.projectsData?.projects || [];
    return list.find(p => p.id === id) || null;
  }

  function isPopupOpen() {
    return document.getElementById('popup-overlay')?.classList.contains('active');
  }

  function clickIsInsideUI(target) {
    return !!target.closest(
      '[data-category], [data-subcategory], .project-icon, .project-card, .popup-card, #popup-overlay'
    );
  }

  function animateCircleAndNavigate(circleEl, targetUrl) {
    if (!circleEl || !targetUrl) return;

    // Give immediate visual feedback without delaying the navigation.
    window.showNavigationFeedback?.();
    circleEl.classList.add('is-expanding');
    window.setTimeout(() => {
      window.location.href = targetUrl;
    }, 90);
  }

  /* ------------------------------------------------------------------------
   * Main Click Handler
   * ---------------------------------------------------------------------- */
  function setupNavClicks() {
    document.addEventListener('click', (e) => {
      const t = e.target;

      // Circle click with animation
      const circleEl = t.closest('.circle');
      if (circleEl) {
        e.preventDefault();
        const targetUrl = circleEl.getAttribute('href');
        animateCircleAndNavigate(circleEl, targetUrl);
        return;
      }

      // Inside popup — ignore
      if (t.closest('#popup-overlay') || t.closest('.popup-card')) return;

      // Home links
      const homeEl =
        t.closest('[data-home]') ||
        t.closest('.nav-home') ||
        t.closest('a[href$="index.html"], a[href*="/index.html"]');
      if (homeEl) {
        e.preventDefault();
        const hrefAttr = homeEl.getAttribute('href');
        const dest = hrefAttr ? resolveURL(hrefAttr) : resolveURL('index.html');
        window.location.assign(dest);
        return;
      }

      // Category
      const catEl = t.closest('[data-category]');
      if (catEl) {
        e.preventDefault();
        const val = catEl.getAttribute('data-category');
        window.setActiveCategory?.(val);
        window.setActiveSubcategory?.(null);
        return;
      }

      // Subcategory
      const subEl = t.closest('[data-subcategory]');
      if (subEl) {
        e.preventDefault();
        const subVal = subEl.getAttribute('data-subcategory');
        const parentId = subParentId(subVal) || window.state?.activeCategory || 'all';
        window.setActiveCategory?.(parentId);
        window.setActiveSubcategory?.(subVal);
        return;
      }

      // Project card / icon
      const card = t.closest('.project-card, .project-icon');
      if (card) {
        const project = findProjectByEl(card);
        if (project && typeof window.openPopup === 'function') {
          e.preventDefault();
          window.openPopup(project, card);
        }
        return;
      }

      // Empty-space click is a second, direct way to return to the full index.
      if (
        !isPopupOpen() &&
        !clickIsInsideUI(t) &&
        !t.closest('a, button, input, select, textarea, [role="button"]')
      ) {
        window.clearFilters?.();
      }
    });
  }

  /* ------------------------------------------------------------------------
   * Initialization
   * ---------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', async () => {
    await ensureProjectsData();
    setupNavClicks();

    if (typeof window.filterProjects === 'function') {
      window.filterProjects();
    }

    const allEl = document.querySelector('[data-category="all"]');
    if (allEl) allEl.classList.add('active');
  });
})();

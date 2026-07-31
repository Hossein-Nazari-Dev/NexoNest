// filter.js — category/subcategory filtering (label/id tolerant)

(function () {
  // ---------------------------
  // Normalization + mapping
  // ---------------------------
  const norm = v => String(v || '').trim().toLowerCase().replace(/\s+/g, '-');

  // Fix common singular/plural mismatches in your JSON/markup
  const CATEGORY_SYNONYMS = {
    product: 'products',
    publication: 'publications',
  };

  let mapsReady = false;
  let catLabelToId, subLabelToId;

  function ensureMaps() {
    if (mapsReady) return;
    const cats = Array.isArray(window.projectsData?.categories) ? window.projectsData.categories : [];
    const subs = Array.isArray(window.projectsData?.subcategories) ? window.projectsData.subcategories : [];

    catLabelToId = new Map(cats.map(c => [norm(c.label || c.id), c.id]));
    subLabelToId = new Map(subs.map(s => [norm(s.label || s.id), s.id]));
    mapsReady = true;
  }

  function toCatId(v) {
    ensureMaps();
    let n = norm(v);
    if (!n || n === 'all') return 'all';
    // Try synonyms, then label->id map, then raw normalized id
    n = CATEGORY_SYNONYMS[n] || n;
    return catLabelToId.get(n) || n;
  }

  function toSubId(v) {
    ensureMaps();
    const n = norm(v);
    if (!n) return '';
    return subLabelToId.get(n) || n;
  }

  const asIds = (arr, resolver) => (Array.isArray(arr) ? arr : []).map(resolver);

  // ---------------------------
  // Core predicate
  // ---------------------------
  function isProjectActive(project) {
    if (!project) return false;

    const activeCat = toCatId(window.state?.activeCategory);
    const activeSub = toSubId(window.state?.activeSubcategory);

    const projCats = asIds(project.categories, toCatId);
    const projSubs = asIds(project.subcategories, toSubId);

    // Nothing selected: show all
    if ((activeCat === 'all' || !activeCat) && !activeSub) return true;

    // Subcategory selected: filter by subcategory ONLY
    if (activeSub) {
      return projSubs.includes(activeSub);
    }

    // Else filter by category only
    return projCats.includes(activeCat);
  }

  // ---------------------------
  // Public: apply filters
  // ---------------------------
  window.filterProjects = function filterProjects() {
    const projects = window.projectsData?.projects || [];
    const icons = document.querySelectorAll('.project-icon');
    const activeCat = toCatId(window.state?.activeCategory);
    const activeSub = toSubId(window.state?.activeSubcategory);
    const hasFilter = activeCat !== 'all' || !!activeSub;
    let activeCount = 0;

    icons.forEach(icon => {
      const projectId = icon.getAttribute('data-id');
      const project = projects.find(p => p.id === projectId);

      if (isProjectActive(project)) {
        activeCount += 1;
        icon.classList.toggle('active', hasFilter);
        icon.classList.remove('dimmed');
        icon.removeAttribute('aria-disabled');
        icon.tabIndex = 0;
      } else {
        icon.classList.remove('active');
        icon.classList.add('dimmed');
        icon.setAttribute('aria-disabled', 'true');
        icon.tabIndex = -1;
      }
    });

    const summary = document.getElementById('filter-summary');
    const reset = document.querySelector('.filter-reset');
    const cats = window.projectsData?.categories || [];
    const subs = window.projectsData?.subcategories || [];
    const context = activeSub
      ? subs.find(item => item.id === activeSub)?.label
      : cats.find(item => item.id === activeCat)?.label;

    if (summary) {
      const noun = activeCount === 1 ? 'project' : 'projects';
      summary.textContent = context
        ? `${activeCount} ${noun} in ${context}`
        : `${activeCount} ${noun} in the index`;
    }
    if (reset) reset.hidden = activeCat === 'all' && !activeSub;
  };

  // Expose helpers to other modules if needed
  window._filterHelpers = { toCatId, toSubId, norm };
})();

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

    icons.forEach(icon => {
      const projectId = icon.getAttribute('data-id');
      const project = projects.find(p => p.id === projectId);

      if (isProjectActive(project)) {
        icon.classList.add('active');
        icon.classList.remove('dimmed');
      } else {
        icon.classList.remove('active');
        icon.classList.add('dimmed');
      }
    });
  };

  // Expose helpers to other modules if needed
  window._filterHelpers = { toCatId, toSubId, norm };
})();

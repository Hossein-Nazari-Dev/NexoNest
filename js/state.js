// state.js — central state + nav highlighting

(function () {
  const { toCatId, toSubId } = window._filterHelpers || {
    toCatId: v => v,
    toSubId: v => v
  };

  // Central state
  window.state = {
    activeCategory: 'all',
    activeSubcategory: null,
    activeProject: null
  };

  // --- State updates
  function setActiveCategory(category) {
    window.state.activeCategory = category;
    // do NOT clear subcategory here; nav.js will clear when user clicks a category explicitly
    updateUI();
  }

  function setActiveSubcategory(subcategory) {
    window.state.activeSubcategory = subcategory;
    updateUI();
  }

  function setActiveProject(project) {
    window.state.activeProject = project;
  }

  function clearFilters() {
    window.state.activeCategory = 'all';
    window.state.activeSubcategory = null;
    updateUI();
  }

  // --- UI updates
  function updateUI() {
    if (typeof window.filterProjects === 'function') {
      window.filterProjects();
    }
    updateActiveNavStates();
  }

  // Highlight both the active category and active subcategory
  function updateActiveNavStates() {
    const catId = toCatId(window.state.activeCategory);
    const subId = toSubId(window.state.activeSubcategory);

    // Categories
    document.querySelectorAll('[data-category]').forEach(el => {
      const thisId = toCatId(el.getAttribute('data-category'));
      el.classList.toggle('active', (catId !== 'all' && thisId === catId) || (catId === 'all' && thisId === 'all'));
    });

    // Ensure "all" is active when no category selected
    if (catId === 'all') {
      const allEl = document.querySelector('[data-category="all"]');
      allEl && allEl.classList.add('active');
    }

    // Subcategories
    document.querySelectorAll('[data-subcategory]').forEach(el => {
      const thisId = toSubId(el.getAttribute('data-subcategory'));
      el.classList.toggle('active', !!subId && thisId === subId);
    });
  }

  // Export
  window.setActiveCategory = setActiveCategory;
  window.setActiveSubcategory = setActiveSubcategory;
  window.setActiveProject = setActiveProject;
  window.clearFilters = clearFilters;
})();

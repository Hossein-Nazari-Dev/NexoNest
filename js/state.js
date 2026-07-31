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
    renderSubfilters();
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
      const isActive = (catId !== 'all' && thisId === catId) || (catId === 'all' && thisId === 'all');
      el.classList.toggle('active', isActive);
      el.setAttribute('aria-pressed', String(isActive));
    });

    // Ensure "all" is active when no category selected
    if (catId === 'all') {
      const allEl = document.querySelector('[data-category="all"]');
      allEl && allEl.classList.add('active');
    }

    // Subcategories
    document.querySelectorAll('[data-subcategory]').forEach(el => {
      const thisId = toSubId(el.getAttribute('data-subcategory'));
      const isActive = !!subId && thisId === subId;
      el.classList.toggle('active', isActive);
      el.setAttribute('aria-pressed', String(isActive));
    });
  }

  function renderSubfilters() {
    const bar = document.getElementById('subfilter-bar');
    if (!bar) return;

    const catId = toCatId(window.state.activeCategory);
    const subId = toSubId(window.state.activeSubcategory);
    const projects = window.projectsData?.projects || [];
    const items = (window.projectsData?.subcategories || [])
      .filter(item =>
        item.parent === catId &&
        projects.some(project => project.subcategories?.includes(item.id))
      );

    bar.replaceChildren();
    bar.hidden = items.length === 0;

    items.forEach(item => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'subfilter-chip';
      button.dataset.subcategory = item.id;
      button.textContent = item.label;
      const isActive = item.id === subId;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
      bar.appendChild(button);
    });
  }

  // Export
  window.setActiveCategory = setActiveCategory;
  window.setActiveSubcategory = setActiveSubcategory;
  window.setActiveProject = setActiveProject;
  window.clearFilters = clearFilters;
})();

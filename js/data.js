// Shared catalogue loader: validate before publishing and cache only usable requests.
(function () {
  let projectsPromise;
  let requestVersion = 0;

  const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);
  const isText = value => typeof value === 'string' && value.trim().length > 0;

  function requireValid(condition, message) {
    if (!condition) throw new Error(`Invalid project catalogue: ${message}`);
  }

  function validateURL(value, field) {
    requireValid(isText(value), `${field} must be a URL`);
    const url = new URL(value, document.baseURI);
    requireValid(['http:', 'https:'].includes(url.protocol), `${field} must use HTTP or HTTPS`);
  }

  function validateEntries(entries, name) {
    requireValid(Array.isArray(entries), `${name} must be an array`);
    const ids = new Set();
    entries.forEach(item => {
      requireValid(isRecord(item) && isText(item.id), `${name} entries need an ID`);
      requireValid(!ids.has(item.id), `duplicate ${name} ID ${item.id}`);
      ids.add(item.id);
    });
    return ids;
  }

  function validateData(data) {
    requireValid(isRecord(data), 'expected an object');
    const categories = validateEntries(data.categories, 'categories');
    const subcategories = validateEntries(data.subcategories, 'subcategories');
    validateEntries(data.projects, 'projects');
    requireValid(!categories.has('all'), 'all is reserved for the unfiltered view');
    data.categories.forEach(item => requireValid(isText(item.label), 'category labels are required'));
    data.subcategories.forEach(item => {
      requireValid(isText(item.label) && categories.has(item.parent), 'subcategory labels and parent categories are required');
    });
    const parents = new Map(data.subcategories.map(item => [item.id, item.parent]));
    data.projects.forEach(project => {
      if (project.product !== undefined) {
        requireValid(typeof window.NexoNestProductStatus?.validate === 'function', 'product metadata validator is unavailable');
        window.NexoNestProductStatus.validate(project);
      }
      requireValid(isText(project.title) && typeof project.excerpt === 'string', 'project titles and excerpts are required');
      validateURL(project.url, 'project URL');
      ['icon', 'image'].forEach(field => {
        if (project[field]) validateURL(project[field], field);
        else requireValid(project[field] === undefined || typeof project[field] === 'string', `${field} must be a string`);
      });
      [['categories', categories], ['subcategories', subcategories]].forEach(([field, ids]) => {
        requireValid(Array.isArray(project[field]) && project[field].every(id => ids.has(id)), `unknown or malformed project ${field}`);
        requireValid(new Set(project[field]).size === project[field].length, `duplicate project ${field}`);
      });
      requireValid(project.subcategories.every(id => project.categories.includes(parents.get(id))), 'project subcategories must belong to its categories');
    });
    return data;
  }

  window.loadProjectsData = function loadProjectsData({ force = false } = {}) {
    if (!force && projectsPromise) return projectsPromise;
    const version = ++requestVersion;
    projectsPromise = fetch(new URL('data/projects-brief.json', document.baseURI), { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) throw new Error(`Unable to load project data (${response.status})`);
        return response.json();
      })
      .then(validateData)
      .then((data) => {
        if (version === requestVersion) window.projectsData = data;
        return data;
      })
      .catch((error) => {
        if (version === requestVersion) projectsPromise = undefined;
        throw error;
      });

    return projectsPromise;
  };
})();

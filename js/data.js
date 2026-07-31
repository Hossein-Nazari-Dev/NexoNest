// Shared project-data loader. Every page reuses one request and one source of truth.
(function () {
  let projectsPromise;

  window.loadProjectsData = function loadProjectsData() {
    if (projectsPromise) return projectsPromise;

    projectsPromise = fetch(new URL('data/projects-brief.json', document.baseURI), { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) throw new Error(`Unable to load project data (${response.status})`);
        return response.json();
      })
      .then((data) => {
        window.projectsData = data;
        return data;
      })
      .catch((error) => {
        console.error('Project data could not be loaded:', error);
        window.projectsData = { categories: [], subcategories: [], projects: [] };
        return window.projectsData;
      });

    return projectsPromise;
  };
})();

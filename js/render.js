// Dynamic content rendering
document.addEventListener('DOMContentLoaded', () => {
    window.loadProjectsData().then(renderProjects);
});

function renderProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;

    const projects = window.projectsData?.projects || [];
    
    projectsGrid.innerHTML = '';
    
    // A fixed visual shuffle keeps the composition playful without moving
    // projects between visits.
    const layoutOrder = [
        'p_octoland',
        'p_alignment',
        'p_design_suite',
        'p_curvadapt',
        'p_tectotrack',
        'p_octocity',
        'p_abm_bootcamp',
        'p_octomass',
        'p_sustainable_development',
        'p_printerra',
        'p_geofactory'
    ];
    const orderIndex = new Map(layoutOrder.map((id, index) => [id, index]));
    const sortedProjects = [...projects].sort((a, b) => {
        const aIndex = orderIndex.get(a.id) ?? Number.MAX_SAFE_INTEGER;
        const bIndex = orderIndex.get(b.id) ?? Number.MAX_SAFE_INTEGER;
        return aIndex - bIndex || a.title.localeCompare(b.title);
    });
    
    sortedProjects.forEach(project => {
        const iconEl = document.createElement('button');
        iconEl.type = 'button';
        iconEl.className = 'project-icon';
        iconEl.setAttribute('data-id', project.id);
        iconEl.setAttribute('aria-label', `Read the ${project.title} project brief`);
        iconEl.title = project.title;

        const symbolEl = document.createElement('span');
        symbolEl.className = 'project-symbol';
        
        // Use placeholder if no icon available
        if (project.icon && project.icon !== "/icons/placeholder.png") {
            const img = document.createElement('img');
            img.src = new URL(project.icon, document.baseURI).href;
            img.alt = project.title;
            
            // Add error handling for broken images
            img.onerror = function() {
                // If image fails to load, use text fallback
                this.style.display = 'none';
                const textIcon = document.createElement('div');
                textIcon.className = 'text-icon';
                textIcon.textContent = project.title.substring(0, 2).toUpperCase();
                symbolEl.appendChild(textIcon);
            };
            
            symbolEl.appendChild(img);
        } else {
            // Create a text-based icon as fallback
            const textIcon = document.createElement('div');
            textIcon.className = 'text-icon';
            textIcon.textContent = project.title.substring(0, 2).toUpperCase();
            symbolEl.appendChild(textIcon);
        }

        const nameEl = document.createElement('span');
        nameEl.className = 'project-name';
        nameEl.textContent = project.title;

        iconEl.append(symbolEl, nameEl);
        
        projectsGrid.appendChild(iconEl);
    });

    filterProjects(); 
}

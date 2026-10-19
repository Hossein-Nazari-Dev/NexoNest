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
        'p_computational_thinking_workshop_1',
        'p_octomass',
        'p_code_junkyard',
        'p_code_junkyard_session_00',
        'p_sustainable_development',
        'p_printerra',
        'p_geofactory',
        'p_nexorhino'
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

        iconEl.append(symbolEl);
        
        projectsGrid.appendChild(iconEl);
    });

    const futureMessages = [
        'Maybe our next collaboration?',
        'A good idea could land here.',
        'Reserved for something unexpected.',
        'Plot twist: this one could be yours.',
        'Currently accepting brilliant detours.',
        'Your impossible brief goes here.'
    ];

    futureMessages.forEach(message => {
        const placeholder = document.createElement('span');
        placeholder.className = 'project-placeholder';
        placeholder.setAttribute('role', 'note');
        placeholder.setAttribute('aria-label', message);
        placeholder.setAttribute('tabindex', '0');
        placeholder.dataset.message = message;
        placeholder.textContent = '+';
        projectsGrid.appendChild(placeholder);
    });
    
    // Sparse, stable compositions include both real projects and future slots.
    // Extra projects continue in ordinary grid flow beyond the planned cells.
    const compositions = [
        ['wide', 12, [2, 5, 9, 13, 14, 17, 19, 22, 25, 28, 29, 31, 34, 36, 38, 39, 42, 44, 4, 16, 24, 33, 40, 47]],
        ['medium', 6, [1, 4, 6, 8, 9, 12, 13, 16, 18, 20, 21, 24, 25, 28, 29, 32, 34, 36, 3, 10, 17, 23, 27, 35]],
        ['small', 4, [1, 3, 6, 8, 9, 10, 12, 15, 17, 19, 20, 22, 24, 25, 27, 29, 30, 32, 4, 7, 14, 18, 23, 28]]
    ];
    [...projectsGrid.children].forEach((tile, index) => {
        compositions.forEach(([name, columns, slots]) => {
            const slot = slots[index];
            if (!slot) return;
            tile.style.setProperty(`--${name}-column`, ((slot - 1) % columns) + 1);
            tile.style.setProperty(`--${name}-row`, Math.floor((slot - 1) / columns) + 1);
        });
    });

    filterProjects(); 
}

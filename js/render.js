// This controller alone owns catalogue loading, recovery and interactive readiness.
(function () {
    document.addEventListener('DOMContentLoaded', () => {
        const section = document.querySelector('[data-catalog-state]');
        if (!section) return;
        const message = document.getElementById('catalog-message');
        const retry = document.getElementById('catalog-retry');
        const directory = document.getElementById('project-directory');
        const grid = document.getElementById('projects-grid');
        let loading = false;
        let viewVersion = 0;

        function setStatus(status, text) {
            section.dataset.catalogState = status;
            section.setAttribute('aria-busy', String(status === 'loading'));
            message.textContent = text;
            retry.hidden = status !== 'error';
            retry.disabled = status === 'loading';
            directory.hidden = status === 'ready';
            grid.hidden = status !== 'ready';
            document.querySelectorAll('[data-category], [data-subcategory]').forEach(button => {
                button.disabled = status !== 'ready';
            });
        }

        async function loadCatalogue(force = false) {
            if (loading) return;
            loading = true;
            const version = ++viewVersion;
            setStatus('loading', 'Loading the interactive index. You can browse projects directly below.');
            try {
                const data = await window.loadProjectsData({ force });
                if (version !== viewVersion || data !== window.projectsData) return;
                renderProjects(data);
                // Rebuild subfilters and pressed states from the same validated data.
                window.setActiveCategory(window.state.activeCategory);
                setStatus(data.projects.length ? 'ready' : 'empty', data.projects.length ? '' : 'The project catalogue is currently empty. Browse the direct links below.');
            } catch (error) {
                if (version !== viewVersion) return;
                console.error('Project data could not be loaded:', error);
                grid.replaceChildren();
                setStatus('error', 'The interactive index could not be loaded. Try again or use the project links below.');
            } finally {
                if (version === viewVersion) loading = false;
            }
        }

        retry.addEventListener('click', () => loadCatalogue(true));
        loadCatalogue();
    });
})();

function renderProjects(data) {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;

    const projects = data.projects;
    
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
        const productSummary = window.NexoNestProductStatus?.summary(project);
        iconEl.setAttribute('aria-label', `Read the ${project.title} project brief${productSummary ? `. ${productSummary}` : ''}`);
        iconEl.title = productSummary ? `${project.title} — ${productSummary}` : project.title;

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

    // Decorative future slots never stand in for an empty or unavailable catalogue.
    (projects.length ? futureMessages : []).forEach(message => {
        const placeholder = document.createElement('span');
        placeholder.className = 'project-placeholder';
        placeholder.setAttribute('aria-hidden', 'true');
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

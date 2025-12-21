// Dynamic content rendering
document.addEventListener('DOMContentLoaded', function() {
    // Load projects data
    fetch('../data/projects-brief.json')
        .then(response => response.json())
        .then(data => {
            window.projectsData = data;
            renderProjects();
        })
        .catch(error => {
            console.error('Error loading projects data:', error);
            // Create fallback data if the fetch fails
            window.projectsData = {
                categories: [],
                subcategories: [],
                projects: []
            };
            renderProjects();
        });
});

function renderProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    const projects = window.projectsData.projects;
    
    projectsGrid.innerHTML = '';
    
    // Sort projects for consistent layout
    const sortedProjects = [...projects].sort((a, b) => a.title.localeCompare(b.title));
    
    sortedProjects.forEach(project => {
        const iconEl = document.createElement('div');
        iconEl.className = 'project-icon';
        iconEl.setAttribute('data-id', project.id);
        
        // Use placeholder if no icon available
        if (project.icon && project.icon !== "/icons/placeholder.png") {
            const img = document.createElement('img');
            img.src = project.icon;
            img.alt = project.title;
            
            // Add error handling for broken images
            img.onerror = function() {
                // If image fails to load, use text fallback
                this.style.display = 'none';
                const textIcon = document.createElement('div');
                textIcon.className = 'text-icon';
                textIcon.textContent = project.title.substring(0, 2).toUpperCase();
                iconEl.appendChild(textIcon);
            };
            
            iconEl.appendChild(img);
        } else {
            // Create a text-based icon as fallback
            const textIcon = document.createElement('div');
            textIcon.className = 'text-icon';
            textIcon.textContent = project.title.substring(0, 2).toUpperCase();
            iconEl.appendChild(textIcon);
        }
        
        iconEl.addEventListener('click', () => {
            if (isProjectActive(project)) {
                openPopup(project);
            }
        });
        
        projectsGrid.appendChild(iconEl);
    });
    
    filterProjects(); 
}
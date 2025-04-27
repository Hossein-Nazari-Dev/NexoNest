// تابع اصلی فیلتر نویگیشن - نسخه اصلاح شده
export function setupNavigationFilter() {
  // 1. انتخاب عناصر
  const homeLink = document.querySelector('.nav-item a[href="https://www.NexoNest.com"]');
  const allProjects = document.querySelectorAll('.grid-item');
  const mainNavLinks = document.querySelectorAll('.main-nav > .nav-item > a');
  const allSubmenuLinks = document.querySelectorAll('.main-nav .submenu a'); // تغییر این خط
  const gridContainer = document.querySelector('.grid-content');

  // 2. نگاشت نام منوها به دسته‌بندی‌ها
  const menuToCategoryMap = {
    // Projects
    'Projects': { main: 'projects' },
    'Architectural Design': { main: 'projects', sub: 'architecturalDesign' },
    'Computational Design': { main: 'projects', sub: 'computationalDesign' },
    'Sustainable Design': { main: 'projects', sub: 'sustainableDesign' },
    'Robotic and IoT': { main: 'projects', sub: 'robotic' },
    

    // Educations
    'Educations': { main: 'educations' },
    'Computational Design': { main: 'educations', sub: 'computationalDesign' },
    'Coding': { main: 'educations', sub: 'coding' },
    'Computational Geometry': { main: 'educations', sub: 'computationalGeometry' },
    'Sustainability': { main: 'educations', sub: 'sustainability' },
    
    // products
    'Products': { main: 'products' },
    'Octo Mass': { main: 'products', sub: 'octomass' },
    'Octo Land': { main: 'products', sub: 'octoland' },
    'Octo City': { main: 'products', sub: 'octocity' },
    'Octo Gen': { main: 'products', sub: 'octogen' },
    'TectoTrack': { main: 'products', sub: 'tectotrack' },
    
    // Events
    'Events': { main: 'events' },
    'Course': { main: 'events', sub: 'course' },
    'Workshop': { main: 'events', sub: 'workshop' },
    'Bootcamp': { main: 'events', sub: 'bootcamp' },
    
    // Publications
    'Publications': { main: 'publications' }
  };

  // 3. تابع اعمال فیلتر (اصلاح شده)
  function applyFilter(categoryInfo) {
    allProjects.forEach(project => {
      const mainCatMatch = project.getAttribute('main-category') === categoryInfo.main;
      const subCatMatch = !categoryInfo.sub || project.getAttribute('category') === categoryInfo.sub;
      
      const shouldShow = mainCatMatch && subCatMatch;
      
      project.style.opacity = shouldShow ? '1' : '0.3';
      project.style.filter = shouldShow ? 'none' : 'grayscale(80%)';
      project.style.pointerEvents = shouldShow ? 'auto' : 'none';
      project.style.transition = 'all 0.3s ease';
    });
    
    gridContainer.style.animation = 'none';
    setTimeout(() => gridContainer.style.animation = 'fadeIn 0.5s ease', 10);
  }

  // 4. تابع ریست فیلترها
  function resetFilters() {
    allProjects.forEach(project => {
      project.style.opacity = '1';
      project.style.filter = 'none';
      project.style.pointerEvents = 'auto';
    });
    
    document.querySelectorAll('.nav-item > a.active, .submenu a.active').forEach(item => {
      item.classList.remove('active');
    });
  }

  // 5. رویدادهای کلیک
  // الف) Home
  if (homeLink) {
    homeLink.addEventListener('click', function(e) {
      e.preventDefault();
      resetFilters();
      this.classList.add('active');
    });
  }

  // ب) منوهای اصلی
  mainNavLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      if (this.getAttribute('href') === '#') {
        e.preventDefault();
        const menuText = this.textContent.trim();
        const categoryInfo = menuToCategoryMap[menuText];
        
        if (categoryInfo) {
          resetFilters();
          this.classList.add('active');
          applyFilter(categoryInfo);
        }
      }
    });
  });

  // ج) سابمنوها
  allSubmenuLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const menuText = this.textContent.trim();
      const categoryInfo = menuToCategoryMap[menuText];
      
      if (categoryInfo) {
        resetFilters();
        this.classList.add('active');
        applyFilter(categoryInfo);
      }
    });
  });

  // د) کلیک خارج از منو
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.navbar') && !e.target.closest('.grid-item')) {
      resetFilters();
    }
  });

  resetFilters();
}
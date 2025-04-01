





// toggle languege
document.addEventListener('DOMContentLoaded', () => {
  const langToggle = document.getElementById('langToggle');
  const contentEn = document.getElementById('content-en');
  const contentFa = document.getElementById('content-fa');

  let isEnglish = true;

  langToggle.addEventListener('click', () => {
    if (isEnglish) {
      contentEn.style.display = 'none';
      contentFa.style.display = 'block';
      langToggle.textContent = 'Switch to English';
      isEnglish = false;
    } else {
      contentEn.style.display = 'block';
      contentFa.style.display = 'none';
      langToggle.textContent = 'Switch to Farsi';
      isEnglish = true;
    }
  });
});









//particles
document.addEventListener('DOMContentLoaded', function() {
  // تنظیمات سیستم
  const config = {
    particleCount: 40,
    maxParticles: 150,
    connectionDistance: 120,
    minParticleSize: 2,
    maxParticleSize: 5,
    baseSpeed: 0.6,
    innerRadius: 100, // شعاع دایره اولیه
    growthInterval: 3500,
    minLineWidth: 1,
    maxLineWidth: 3,
    lineOpacity: 0.2,
    updateConnectionsEvery: 2,
    repulsionDistance: 30,
    startAngle: 0, // زاویه شروع (رادیان)
    endAngle: Math.PI * 2 // زاویه پایان (رادیان)
  };

  // پالت رنگ‌ها
  const colorPalette = [
    '#E0E0E0', // خاکستری روشن
    '#BDBDBD', // خاکستری متوسط
    '#9E9E9E', // خاکستری تیره
    '#757575', // خاکستری خیلی تیره
    '#616161', // خاکستری ذغالی
    '#424242', // خاکستری دودی
    '#212121', // خاکستری خیلی دودی
    '#F5F5F5', // سفید مایل به خاکستری
    '#EEEEEE', // سفید مایل به خاکستری روشن
    '#E0F2F7', // آبی ملایم
    '#C8E6C9', // سبز ملایم
    '#D1C4E9', // بنفش ملایم
    '#FFECB3', // زرد ملایم
    '#FFCCBC', // نارنجی ملایم
    '#D7CCC8', // قهوه‌ای ملایم
    '#CFD8DC', // آبی خاکستری ملایم
    '#B0BEC5'  // خاکستری آبی ملایم
];

  // عناصر DOM
  const svg = document.querySelector('.particles-bg svg');
  if (!svg) {
    console.error('SVG element with class "particles-bg" not found!');
    return;
  }

  const particles = [];
  let connections = [];
  let animationId;
  let growthTimer;
  let frameCount = 0;

  // تابع‌های کمکی
  const helpers = {
    random: {
      color: () => colorPalette[Math.floor(Math.random() * colorPalette.length)],
      size: () => config.minParticleSize + Math.random() * (config.maxParticleSize - config.minParticleSize),
      speed: () => -config.baseSpeed + Math.random() * config.baseSpeed * 2,
      opacity: () => 0.5 + Math.random() * 0.5,
      direction: () => Math.random() * Math.PI * 2 // جهت حرکت تصادفی
    },
    distance: (p1, p2) => {
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
  };

  // ایجاد ذره جدید
  function createParticle(x, y, initialSpeed = false) {
    if (particles.length >= config.maxParticles) return null;

    const particle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    
    // اگر initialSpeed=true باشد، سرعت به سمت بیرون از مرکز خواهد بود
    const angleToCenter = Math.atan2(y - window.innerHeight/2, x - window.innerWidth/2);
    const speed = helpers.random.speed();
    
    const particleObj = {
      element: particle,
      x, y,
      speedX: initialSpeed ? Math.cos(angleToCenter) * speed : helpers.random.speed(),
      speedY: initialSpeed ? Math.sin(angleToCenter) * speed : helpers.random.speed(),
      color: helpers.random.color(),
      opacity: helpers.random.opacity(),
      size: helpers.random.size()
    };

    particle.setAttribute('r', particleObj.size);
    particle.setAttribute('cx', x);
    particle.setAttribute('cy', y);
    particle.setAttribute('fill', particleObj.color);
    particle.setAttribute('opacity', particleObj.opacity);
    particle.setAttribute('class', 'particle');

    svg.appendChild(particle);
    particles.push(particleObj);
    
    return particleObj;
  }

  // ایجاد اتصال بین دو ذره
  function createConnection(p1, p2) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    const lineWidth = config.minLineWidth + Math.random() * (config.maxLineWidth - config.minLineWidth);
    const opacity = (p1.opacity + p2.opacity) / 2 * config.lineOpacity;
    
    line.setAttribute('x1', p1.x);
    line.setAttribute('y1', p1.y);
    line.setAttribute('x2', p2.x);
    line.setAttribute('y2', p2.y);
    line.setAttribute('stroke', p1.color);
    line.setAttribute('stroke-opacity', opacity);
    line.setAttribute('stroke-width', lineWidth);
    line.setAttribute('class', 'connection-line');
    
    svg.appendChild(line);
    return line;
  }

  // به‌روزرسانی اتصالات
  function updateConnections() {
    // پاک‌سازی اتصالات قبلی
    connections.forEach(conn => svg.removeChild(conn));
    connections = [];
    
    // ایجاد اتصالات جدید
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        if (helpers.distance(particles[i], particles[j]) < config.connectionDistance) {
          connections.push(createConnection(particles[i], particles[j]));
        }
      }
    }
  }

  // حرکت ذرات
  function moveParticles() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // اعمال نیروی دافعه بین ذرات
    particles.forEach((p1, i) => {
      let forceX = 0, forceY = 0;
      
      particles.forEach((p2, j) => {
        if (i !== j) {
          const dist = helpers.distance(p1, p2);
          if (dist < config.repulsionDistance) {
            const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
            const force = (config.repulsionDistance - dist) / config.repulsionDistance;
            forceX -= Math.cos(angle) * force * 0.1;
            forceY -= Math.sin(angle) * force * 0.1;
          }
        }
      });
      
      p1.speedX += forceX;
      p1.speedY += forceY;
      
      // محدود کردن سرعت
      const maxSpeed = config.baseSpeed * 1.5;
      const speed = Math.sqrt(p1.speedX * p1.speedX + p1.speedY * p1.speedY);
      if (speed > maxSpeed) {
        p1.speedX = (p1.speedX / speed) * maxSpeed;
        p1.speedY = (p1.speedY / speed) * maxSpeed;
      }
    });
    
    // به‌روزرسانی موقعیت ذرات
    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      
      // برخورد با دیوارها
      if (p.x < 0 || p.x > width) {
        p.speedX *= -0.8;
        p.x = Math.max(0, Math.min(width, p.x));
      }
      if (p.y < 0 || p.y > height) {
        p.speedY *= -0.8;
        p.y = Math.max(0, Math.min(height, p.y));
      }
      
      p.element.setAttribute('cx', p.x);
      p.element.setAttribute('cy', p.y);
    });
    
    // به‌روزرسانی اتصالات
    if (++frameCount % config.updateConnectionsEvery === 0) {
      updateConnections();
    }
    
    animationId = requestAnimationFrame(moveParticles);
  }

  // رشد سیستم با اضافه کردن ذرات جدید از لبه‌ها
  function growSystem() {
    if (particles.length >= config.maxParticles) {
      clearInterval(growthTimer);
      return;
    }
    
    const edge = Math.floor(Math.random() * 4);
    let x, y;
    
    switch(edge) {
      case 0: x = Math.random() * window.innerWidth; y = -10; break;
      case 1: x = window.innerWidth + 10; y = Math.random() * window.innerHeight; break;
      case 2: x = Math.random() * window.innerWidth; y = window.innerHeight + 10; break;
      case 3: x = -10; y = Math.random() * window.innerHeight; break;
    }
    
    createParticle(x, y);
  }

  // تغییر سایز صفحه
  function handleResize() {
    cancelAnimationFrame(animationId);
    
    svg.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);
    svg.setAttribute('width', window.innerWidth);
    svg.setAttribute('height', window.innerHeight);
    
    // بازسازی سیستم
    svg.innerHTML = '';
    particles.length = 0;
    connections.length = 0;
    
    // ایجاد ذرات اولیه روی دایره
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    for (let i = 0; i < config.particleCount; i++) {
      // محاسبه زاویه برای قرارگیری یکنواخت روی دایره
      const angle = config.startAngle + (i / config.particleCount) * (config.endAngle - config.startAngle);
      
      const x = centerX + Math.cos(angle) * config.innerRadius;
      const y = centerY + Math.sin(angle) * config.innerRadius;
      
      // پارامتر true برای سرعت اولیه به سمت بیرون
      createParticle(x, y, true);
    }
    
    updateConnections();
    moveParticles();
  }



  // راه‌اندازی اولیه
  function init() {
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    handleResize();
    growthTimer = setInterval(growSystem, config.growthInterval);
    window.addEventListener('resize', handleResize);
  }

  init();

  // تمیزکاری
  return {
    destroy: function() {
      cancelAnimationFrame(animationId);
      clearInterval(growthTimer);
      window.removeEventListener('resize', handleResize);
      svg.innerHTML = '';
    },
    getConfig: () => config,
    setConfig: (newConfig) => Object.assign(config, newConfig)
  };
});










//submenue handler
document.addEventListener('DOMContentLoaded', function() {
  const navItems = document.querySelectorAll('.nav-item');

  navItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.classList.add('show-submenu');
    });

    item.addEventListener('mouseleave', function() {
      this.classList.remove('show-submenu');
    });
  });
});








// تابع اصلی فیلتر نویگیشن
function setupNavigationFilter() {
  // 1. انتخاب عناصر
  const homeLink = document.querySelector('.nav-item a[href="https://www.NexoNest.com"]');
  const allProjects = document.querySelectorAll('.grid-item');
  const mainNavLinks = document.querySelectorAll('.main-nav > .nav-item > a');
  const allSubmenuLinks = document.querySelectorAll('.submenu-item a');
  const gridContainer = document.querySelector('.grid-content');

  // 2. نگاشت نام منوها به دسته‌بندی‌ها
  const menuToCategoryMap = {
    // Projects
    'Projects': { main: 'projects' },
    'Competition': { main: 'projects', sub: 'Competition' },
    'Academic': { main: 'projects', sub: 'Academic' },
    'Professional': { main: 'projects', sub: 'Professional' },
    
    // Educations
    'Educations': { main: 'educations' },
    'Computational Geometry': { main: 'educations', sub: 'computational-geometry' },
    'Rhino': { main: 'educations', sub: 'rhino' },
    'Grasshopper3d': { main: 'educations', sub: 'grasshopper3d' },
    'Python for designers': { main: 'educations', sub: 'python' },
    'C# for designers': { main: 'educations', sub: 'csharp' },
    
    // Plugins
    'Plugins': { main: 'plugins' },
    'Octo Mass': { main: 'plugins', sub: 'octomass' },
    'Octo Land': { main: 'plugins', sub: 'octoland' },
    'Octo City': { main: 'plugins', sub: 'octocity' },
    'Octo Gen': { main: 'plugins', sub: 'octogen' },
    
    // Events
    'Events': { main: 'events' },
    'Course': { main: 'events', sub: 'course' },
    'Workshop': { main: 'events', sub: 'workshop' },
    'Bootcamp': { main: 'events', sub: 'bootcamp' },
    
    // Publications
    'Publications': { main: 'publications' }
  };

  // 3. تابع اعمال فیلتر
  function applyFilter(filterType, filterValue) {
    allProjects.forEach(project => {
      const shouldShow = project.getAttribute(filterType) === filterValue;
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
    
    document.querySelectorAll('.nav-item > a.active, .submenu-item > a.active').forEach(item => {
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
          
          if (categoryInfo.main && !categoryInfo.sub) {
            applyFilter('main-category', categoryInfo.main);
          }
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
      
      if (categoryInfo && categoryInfo.sub) {
        resetFilters();
        this.classList.add('active');
        applyFilter('category', categoryInfo.sub);
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



// تابع بارگذاری کامپوننت با callback
async function loadComponent(path, containerId, callback) {
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const html = await response.text();
    const container = document.getElementById(containerId);
    
    if (container) {
      container.innerHTML = html;
      console.log(`Component ${path} loaded successfully`);
      if (callback) callback();
    } else {
      console.error(`Container ${containerId} not found`);
    }
  } catch (error) {
    console.error(`Error loading ${path}:`, error);
    document.getElementById(containerId).innerHTML = `
      <div class="error-message">
        Component failed to load. Please refresh the page.
      </div>
    `;
  }
}

// بارگذاری تمام کامپوننت‌ها
document.addEventListener('DOMContentLoaded', () => {
  loadComponent('components/header.html', 'header-container');
  loadComponent('components/navbar.html', 'navigation-bar', setupNavigationFilter);
  loadComponent('components/main-content.html', 'main-content' , setupNavigationFilter);
  loadComponent('components/popup.html', 'popup-manager', setupPopup);
});














function setupPopup() {
  // عناصر DOM
  const projectItems = document.querySelectorAll('.grid-item');
  const popup = document.getElementById('project-popup');
  const closeBtn = document.querySelector('.close-popup');
  const popupContent = document.querySelector('.popup-content');
  
  // عناصر پاپ‌آپ
  const popupTitle = document.getElementById('popup-title');
  const popupCategory = document.getElementById('popup-category');
  const popupDescription = document.getElementById('popup-description');
  const popupLink = document.getElementById('popup-link');

  // تابع مدیریت کلیک روی آیتم‌های پروژه
  function setupProjectClickHandlers(projectsData) {
    projectItems.forEach(item => {
      item.addEventListener('click', function() {
        const projectId = this.getAttribute('data-project').trim();
        const project = projectsData[projectId];
        
        if (!project) {
          console.error(`Project data not found for: ${projectId}`);
          return;
        }
        
        // پر کردن اطلاعات پاپ‌آپ
        popupTitle.textContent = project.title;
        popupCategory.textContent = project.category;
        popupDescription.textContent = project.description;
        popupLink.href = project.link;
        
        // به‌روزرسانی محتوای دکمه
        const viewButton = popupLink.querySelector('button, span');
        if (viewButton) {
          viewButton.textContent = project.linkText || 'View Project';
        }
        
        positionPopup(this);
        showPopup();
      });
    });
  }

  // تابع تعیین موقعیت پاپ‌آپ
  function positionPopup(clickedItem) {
    const itemRect = clickedItem.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const itemCenter = itemRect.left + (itemRect.width / 2);
    
    popupContent.style.cssText = `
      position: fixed;
      top: 50%;
      transform: translateY(-50%);
      ${itemCenter < viewportWidth / 2 ? 'left: 30px; right: auto;' : 'right: 30px; left: auto;'}
    `;
  }

  // تابع نمایش پاپ‌آپ
  function showPopup() {
    popup.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
      popup.classList.add('active');
    }, 10);
  }

  // تابع بستن پاپ‌آپ
  function closePopup() {
    popup.classList.remove('active');
    
    setTimeout(() => {
      popup.style.display = 'none';
      popupContent.style.cssText = '';
    }, 300);
    
    document.body.style.overflow = 'auto';
  }

  // مدیریت رویدادها
  function setupEventListeners() {
    if (closeBtn) {
      closeBtn.addEventListener('click', closePopup);
    }
    if (popup) {
      popup.addEventListener('click', function(e) {
        if (e.target === this) closePopup();
      });
    }
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closePopup();
    });
  }

  // بارگذاری داده‌های پروژه
  function loadProjectData() {
    fetch('popupData/projects_data.json')
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        setupProjectClickHandlers(data);
      })
      .catch(error => {
        console.error('Error loading project data:', error);
        setupProjectClickHandlers(getFallbackData());
      });
  }

  // داده‌های پیش‌فرض
  function getFallbackData() {
    return {
      'octomass': {
        title: 'OctoMass Plugin',
        category: 'Plugin',
        description: 'A revolutionary plugin for parametric design',
        link: 'projects/octomass.html',
        linkText: 'View Plugin'
      },
      'octoland': {
        title: 'OctoLand Plugin',
        category: 'Plugin',
        description: 'Advanced landscape design tool',
        link: 'projects/octoland.html',
        linkText: 'View Plugin'
      }
    };
  }

  // مقداردهی اولیه
  function init() {
    if (!popup) {
      console.error('Popup element not found!');
      return;
    }
    
    setupEventListeners();
    loadProjectData();
  }

  init();
}


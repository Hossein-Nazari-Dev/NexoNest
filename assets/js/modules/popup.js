/**
 * ماژول مدیریت پاپ‌آپ پروژه‌ها
 * نسخه بهبود یافته با مدیریت خطا، انیمیشن‌های روان‌تر و کد تمیزتر
 */

export function setupPopup() {
  // 1. انتخاب عناصر DOM با مدیریت خطا
  const elements = {
    popup: document.getElementById('project-popup'),
    closeBtn: document.querySelector('.close-popup'),
    popupContent: document.querySelector('.popup-content'),
    popupTitle: document.getElementById('popup-title'),
    popupCategory: document.getElementById('popup-category'),
    popupDescription: document.getElementById('popup-description'),
    popupLink: document.getElementById('popup-link'),
    projectItems: document.querySelectorAll('.grid-item')
  };

  // بررسی وجود عناصر ضروری
  if (!elements.popup || !elements.popupContent) {
    console.error('Elements required for popup are missing!');
    return;
  }

  // 2. تنظیمات اولیه پاپ‌آپ
  const config = {
    animationDuration: 300, // مدت زمان انیمیشن به میلی‌ثانیه
    popupOffset: 30, // فاصله پاپ‌آپ از کناره‌های صفحه
    defaultLinkText: 'View Project'
  };

  // 3. توابع اصلی

  /**
   * نمایش پاپ‌آپ با انیمیشن
   */
  const showPopup = () => {
    elements.popup.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // فعال کردن انیمیشن بعد از رندر اولیه
    requestAnimationFrame(() => {
      elements.popup.classList.add('active');
    });
  };

  /**
   * بستن پاپ‌آپ با انیمیشن
   */
  const closePopup = () => {
    elements.popup.classList.remove('active');
    
    setTimeout(() => {
      elements.popup.style.display = 'none';
      resetPopupPosition();
      document.body.style.overflow = 'auto';
    }, config.animationDuration);
  };

  /**
   * تنظیم موقعیت پاپ‌آپ نسبت به آیتم کلیک شده
   */
  const positionPopup = (clickedItem) => {
    const itemRect = clickedItem.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const itemCenter = itemRect.left + (itemRect.width / 2);
    
    elements.popupContent.style.cssText = `
      position: fixed;
      top: 50%;
      transform: translateY(-50%);
      ${itemCenter < viewportWidth / 2 ? 
        `left: ${config.popupOffset}px; right: auto;` : 
        `right: ${config.popupOffset}px; left: auto;`
      }
    `;
  };

  /**
   * بازنشانی موقعیت پاپ‌آپ
   */
  const resetPopupPosition = () => {
    elements.popupContent.style.cssText = '';
  };

  /**
   * تنظیم رویدادهای کلیک برای آیتم‌های پروژه
   */
  const setupProjectClickHandlers = (projectsData) => {
    elements.projectItems.forEach(item => {
      item.addEventListener('click', function() {
        const projectId = this.getAttribute('data-project')?.trim();
        
        if (!projectId) {
          console.warn('Project item has no data-project attribute');
          return;
        }

        const project = projectsData[projectId];
        
        if (!project) {
          console.error(`Project data not found for: ${projectId}`);
          return;
        }
        
        // پر کردن اطلاعات پاپ‌آپ
        elements.popupTitle.textContent = project.title || '';
        elements.popupCategory.textContent = project.category || '';
        elements.popupDescription.textContent = project.description || '';
        
        if (elements.popupLink) {
          elements.popupLink.href = project.link || '#';
          const viewButton = elements.popupLink.querySelector('button, span');
          if (viewButton) {
            viewButton.textContent = project.linkText || config.defaultLinkText;
          }
        }
        
        positionPopup(this);
        showPopup();
      });
    });
  };

  /**
   * تنظیم رویدادهای تعاملی پاپ‌آپ
   */
  const setupEventListeners = () => {
    // بستن با کلیک روی دکمه بستن
    if (elements.closeBtn) {
      elements.closeBtn.addEventListener('click', closePopup);
    }
    
    // بستن با کلیک روی پس‌زمینه
    elements.popup.addEventListener('click', (e) => {
      if (e.target === elements.popup) closePopup();
    });
    
    // بستن با کلید Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && elements.popup.style.display === 'flex') {
        closePopup();
      }
    });
  };

  /**
   * بارگیری داده‌های پروژه
   */
  const loadProjectData = async () => {
    try {
      const response = await fetch('popupData/projects_data.json');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setupProjectClickHandlers(data);
    } catch (error) {
      console.error('Error loading project data:', error);
      setupProjectClickHandlers(getFallbackData());
    }
  };

  /**
   * داده‌های پیش‌فرض برای حالت fallback
   */
  const getFallbackData = () => ({
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
  });

  // 4. مقداردهی اولیه
  const init = () => {
    // مخفی کردن پاپ‌آپ در ابتدا
    elements.popup.style.display = 'none';
    elements.popup.classList.remove('active');
    
    setupEventListeners();
    loadProjectData();
  };

  // شروع اجرا
  init();
}
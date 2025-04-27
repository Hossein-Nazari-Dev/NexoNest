// Import تمام ماژول‌های مورد نیاز
import { initLanguageToggle } from './modules/language-toggle.js';
import { loadComponent } from './modules/load-components.js';
import { setupNavigationFilter } from './modules/navigation-filter.js';
import { initParticles } from './modules/particles.js';
import { setupPopup } from './modules/popup.js';
import { initSubmenu } from './modules/submenu-handler.js';




async function initializeApp() {
  console.log('1. App initialization started'); // لاگ شماره 1
  try {
    console.log('2. Starting component loading'); // لاگ شماره 2

    // بارگذاری کامپوننت‌ها با مسیرهای صحیح
    await Promise.all([
      loadComponent('../../components/header.html', 'header-container'),
      loadComponent('../../components/popup.html', 'popup-manager'),
      loadComponent('../../components/main-content.html', 'main-content')
    ]);
    // مقداردهی اولیه ماژول‌ها
    initLanguageToggle();
    setupNavigationFilter();
    initParticles();
    setupPopup();
    initSubmenu();
    initHamburgerMenu(); // فراخوانی تابع جدید


    console.log('App initialized successfully');
  } catch (error) {
    console.error('Initialization error:', error);
  }
}


initializeApp();

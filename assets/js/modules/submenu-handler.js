export function initSubmenu() {
  const navItems = document.querySelectorAll('.nav-item');

  navItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.classList.add('show-submenu');
    });

    item.addEventListener('mouseleave', () => {
      item.classList.remove('show-submenu');
    });
  });
}
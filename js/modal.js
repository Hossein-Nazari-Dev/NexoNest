// modal.js — popup with no autofocus and a non-focusable, non-selectable close "×"
document.addEventListener('DOMContentLoaded', () => {
  const popupOverlay    = document.getElementById('popup-overlay');
  const popupClose      = document.getElementById('popup-close');
  const popupTitle      = document.getElementById('popup-title');
  const popupExcerpt    = document.getElementById('popup-excerpt');
  const popupImage      = document.getElementById('popup-image');
  const popupCategories = document.getElementById('popup-categories');
  const popupButton     = document.getElementById('popup-button');

  let currentProject = null;

  // ----- helpers -------------------------------------------------------------
  const resolveURL   = (url) => new URL(url, document.baseURI).href;
  const lockScroll   = () => document.body.classList.add('no-scroll');
  const unlockScroll = () => document.body.classList.remove('no-scroll');

  // Make close "×" totally non-focusable and non-selectable
  if (popupClose) {
    popupClose.setAttribute('tabindex', '-1');     // remove from tab order
    popupClose.setAttribute('aria-hidden', 'true'); // purely visual control
    popupClose.style.userSelect = 'none';          // avoid text selection
    popupClose.addEventListener('focus', () => popupClose.blur());
    popupClose.addEventListener('mousedown', (e) => e.preventDefault()); // no selection ring
  }

  // Map category/subcategory ids -> labels
  function idsToLabels(catIds = [], subIds = []) {
    const cats = Array.isArray(window.projectsData?.categories)
      ? window.projectsData.categories : [];
    const subs = Array.isArray(window.projectsData?.subcategories)
      ? window.projectsData.subcategories : [];

    const catMap = new Map(cats.map(c => [c.id, c.label || c.id]));
    const subMap = new Map(subs.map(s => [s.id, s.label || s.id]));

    const catLabels = catIds.map(id => catMap.get(id) || id);
    const subLabels = subIds.map(id => subMap.get(id) || id);

    return { catLabels, subLabels };
  }

  // ----- open ---------------------------------------------------------------
  window.openPopup = function(project) {
    if (!popupOverlay) return;

    currentProject = project || {};

    // Title / excerpt
    popupTitle.textContent   = currentProject.title   || 'Untitled';
    popupExcerpt.textContent = currentProject.excerpt || '';

    // Categories + subcategories as labels
    const { catLabels, subLabels } = idsToLabels(
      currentProject.categories,
      currentProject.subcategories
    );

    const parts = [];
    if (catLabels.length) parts.push(catLabels.join(', '));
    if (subLabels.length) parts.push(subLabels.join(', '));
    popupCategories.textContent = parts.length ? `Categories: ${parts.join(', ')}` : '';

    // Image
    popupImage.innerHTML = '';
    popupImage.style.display = '';
    if (currentProject.image) {
      const img = document.createElement('img');
      img.src = resolveURL(currentProject.image);
      img.alt = currentProject.title || 'Project image';
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      img.style.borderRadius = '8px';
      img.onerror = () => {
        popupImage.innerHTML = 'Image not available';
        popupImage.style.display = 'grid';
        popupImage.style.placeItems = 'center';
        popupImage.style.color = 'var(--color-muted)';
      };
      popupImage.appendChild(img);
    } else {
      popupImage.innerHTML = 'Project Image';
      popupImage.style.display = 'grid';
      popupImage.style.placeItems = 'center';
      popupImage.style.color = 'var(--color-muted)';
    }

    // Read More
    const hasUrl = !!currentProject.url;
    popupButton.textContent = hasUrl ? 'Read More' : 'Details coming soon';
    popupButton.disabled = !hasUrl;
    popupButton.setAttribute('aria-disabled', String(!hasUrl));
    popupButton.onclick = () => {
      if (hasUrl) {
        window.location.assign(resolveURL(currentProject.url));
      }
    };

    // Show popup, lock scroll, ensure no element is focused
    popupOverlay.classList.add('active');
    lockScroll();
    requestAnimationFrame(() => {
      if (document.activeElement) document.activeElement.blur();
      popupClose?.blur();
    });
  };

  // ----- close --------------------------------------------------------------
  window.closePopup = function() {
    if (!popupOverlay) return;
    popupOverlay.classList.remove('active');
    unlockScroll();
    currentProject = null;
  };

  // Click outside card closes (only if overlay itself is clicked)
  popupOverlay?.addEventListener('click', (e) => {
    if (e.target === popupOverlay) window.closePopup();
  });

  // Close button (mouse only; not focusable)
  popupClose?.addEventListener('click', window.closePopup);

  // Esc to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popupOverlay?.classList.contains('active')) {
      window.closePopup();
    }
  });
});

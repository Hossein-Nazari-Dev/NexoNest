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
  let triggerElement = null;

  // ----- helpers -------------------------------------------------------------
  const resolveURL   = (url) => new URL(url, document.baseURI).href;
  const lockScroll   = () => document.body.classList.add('no-scroll');
  const unlockScroll = () => document.body.classList.remove('no-scroll');

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
  window.openPopup = function(project, trigger) {
    if (!popupOverlay) return;

    currentProject = project || {};
    triggerElement = trigger || document.activeElement;

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
      img.className = 'popup-image-element';
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
    popupButton.textContent = hasUrl ? 'Open project' : 'Details coming soon';
    popupButton.disabled = !hasUrl;
    popupButton.setAttribute('aria-disabled', String(!hasUrl));
    popupButton.onclick = () => {
      if (hasUrl) {
        window.location.assign(resolveURL(currentProject.url));
      }
    };

    // Show the dialog and place focus on its close control.
    popupOverlay.classList.add('active');
    popupOverlay.setAttribute('aria-hidden', 'false');
    lockScroll();
    requestAnimationFrame(() => popupClose?.focus());
  };

  // ----- close --------------------------------------------------------------
  window.closePopup = function() {
    if (!popupOverlay) return;
    popupOverlay.classList.remove('active');
    popupOverlay.setAttribute('aria-hidden', 'true');
    unlockScroll();
    currentProject = null;
    triggerElement?.focus?.();
    triggerElement = null;
  };

  // Click outside card closes (only if overlay itself is clicked)
  popupOverlay?.addEventListener('click', (e) => {
    if (e.target === popupOverlay) window.closePopup();
  });

  // Close button
  popupClose?.addEventListener('click', window.closePopup);

  // Esc to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popupOverlay?.classList.contains('active')) {
      window.closePopup();
    }

    if (e.key === 'Tab' && popupOverlay?.classList.contains('active')) {
      const focusable = [...popupOverlay.querySelectorAll('button:not(:disabled), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')];
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
});

// Shared, low-key UX layer: native lazy loading, soft reveals, and intent prefetching.
(function () {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const observed = new WeakSet();
  const prefetched = new Set();
  let revealObserver;

  const revealSelector = [
    '.home-intro',
    '.home-route',
    '.header',
    '.nav-pill-container',
    '.projects-container',
    '.portfolio-section',
    '.content-section',
    '.project-footer'
  ].join(',');

  function markImageReady(img) {
    const finish = () => img.classList.add('is-loaded');
    if (img.decode) {
      img.decode().catch(() => {}).finally(finish);
    } else {
      finish();
    }
  }

  function configureImage(img) {
    if (observed.has(img)) return;
    observed.add(img);

    const rect = img.getBoundingClientRect();
    const visuallyImportant =
      rect.top < window.innerHeight * 1.15 ||
      !!img.closest('.header, .project-sidebar, .portfolio-sidebar, .suite-hero');

    if (!img.hasAttribute('loading')) {
      img.loading = visuallyImportant ? 'eager' : 'lazy';
    }
    img.decoding = 'async';

    if (img.loading === 'lazy') {
      img.classList.add('ux-lazy-image');
      if (img.complete) markImageReady(img);
      else {
        img.addEventListener('load', () => markImageReady(img), { once: true });
        img.addEventListener('error', () => img.classList.add('is-loaded'), { once: true });
      }
    }
  }

  function configureReveal(element, index = 0) {
    if (observed.has(element)) return;
    observed.add(element);
    element.classList.add('ux-reveal');

    if (element.matches('.home-route, .project-icon')) {
      element.style.setProperty('--ux-delay', `${Math.min(index * 38, 152)}ms`);
    }

    if (reducedMotion || !revealObserver) {
      element.classList.add('is-visible');
      return;
    }
    revealObserver.observe(element);
  }

  function scan(scope = document) {
    scope.querySelectorAll?.('img').forEach(configureImage);
    scope.querySelectorAll?.(revealSelector).forEach(configureReveal);
  }

  function prefetchLink(anchor) {
    const href = anchor.href;
    if (!href || prefetched.has(href)) return;

    const url = new URL(href, location.href);
    if (
      url.origin !== location.origin ||
      url.pathname === location.pathname ||
      !url.pathname.toLowerCase().endsWith('.html')
    ) return;

    prefetched.add(href);
    const hint = document.createElement('link');
    hint.rel = 'prefetch';
    hint.as = 'document';
    hint.href = href;
    document.head.appendChild(hint);
  }

  function setupIntentPrefetch() {
    const onIntent = (event) => {
      const anchor = event.target.closest?.('a[href]');
      if (anchor) prefetchLink(anchor);
    };
    document.addEventListener('pointerover', onIntent, { passive: true });
    document.addEventListener('focusin', onIntent);
    document.addEventListener('touchstart', onIntent, { passive: true });
  }

  function init() {
    root.classList.add('ux-ready');

    if ('IntersectionObserver' in window && !reducedMotion) {
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -5% 0px', threshold: 0.035 });
    }

    scan();
    setupIntentPrefetch();

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches('img')) configureImage(node);
          if (node.matches(revealSelector)) configureReveal(node);
          scan(node);
        });
      });
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    requestAnimationFrame(() => {
      document.querySelectorAll('.ux-reveal').forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) element.classList.add('is-visible');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();

// Shared, low-key UX layer: native lazy loading, soft reveals, and intent prefetching.
(function () {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const observed = new WeakSet();
  const prefetched = new Set();
  let revealObserver;
  let navigationTimer;
  let navigationFallback;
  let navigationLoader;

  function stopNavigationFeedback() {
    window.clearTimeout(navigationTimer);
    window.clearTimeout(navigationFallback);
    navigationTimer = null;
    navigationFallback = null;
    navigationLoader?.remove();
    navigationLoader = null;
  }

  function startNavigationFeedback() {
    stopNavigationFeedback();
    navigationTimer = window.setTimeout(() => {
      navigationLoader = document.createElement('div');
      navigationLoader.className = 'ux-navigation-loader';
      navigationLoader.setAttribute('role', 'status');
      navigationLoader.setAttribute('aria-live', 'polite');
      navigationLoader.textContent = 'Loading';
      document.body.appendChild(navigationLoader);
    }, 80);
    navigationFallback = window.setTimeout(stopNavigationFeedback, 10000);
  }

  window.showNavigationFeedback = startNavigationFeedback;

  function setupNavigationFeedback() {
    document.addEventListener('click', (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target.closest?.('a[href]');
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return;

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return;

      const destination = new URL(anchor.href, location.href);
      if (destination.origin !== location.origin) return;
      startNavigationFeedback();
    }, true);

    window.addEventListener('pageshow', stopNavigationFeedback);
    window.addEventListener('pagehide', stopNavigationFeedback);
  }

  function setupPageLoader() {
    const loader = document.createElement('div');
    loader.className = 'ux-page-loader';
    loader.setAttribute('role', 'status');
    loader.setAttribute('aria-live', 'polite');
    loader.setAttribute('aria-label', 'Loading page');
    document.body.appendChild(loader);

    const startedAt = performance.now();
    const criticalImages = [...document.images].filter((img) => img.loading !== 'lazy');
    const imageReady = criticalImages.map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.addEventListener('load', resolve, { once: true });
        img.addEventListener('error', resolve, { once: true });
      });
    });
    const fontsReady = document.fonts?.ready || Promise.resolve();
    const ready = Promise.all([fontsReady, ...imageReady]);
    const timeout = new Promise((resolve) => window.setTimeout(resolve, 650));

    Promise.race([ready, timeout]).then(() => {
      const remaining = Math.max(0, 100 - (performance.now() - startedAt));
      window.setTimeout(() => {
        loader.classList.add('is-complete');
        loader.addEventListener('transitionend', () => loader.remove(), { once: true });
        window.setTimeout(() => loader.remove(), 320);
      }, remaining);
    });
  }

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

  function warmInternalPages() {
    const warm = () => {
      document.querySelectorAll('a[href]').forEach(prefetchLink);
    };

    window.addEventListener('load', () => {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(warm, { timeout: 1200 });
      } else {
        window.setTimeout(warm, 300);
      }
    }, { once: true });
  }

  function loadOptionalIcons() {
    if (!document.querySelector('[data-lucide]') || window.lucide) return;
    const load = () => {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/lucide@0.468.0';
      script.async = true;
      script.onload = () => window.lucide?.createIcons?.();
      document.head.appendChild(script);
    };

    window.addEventListener('load', () => {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(load, { timeout: 1800 });
      } else {
        window.setTimeout(load, 600);
      }
    }, { once: true });
  }

  function init() {
    root.classList.add('ux-ready');
    setupPageLoader();

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
    setupNavigationFeedback();
    warmInternalPages();
    loadOptionalIcons();

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

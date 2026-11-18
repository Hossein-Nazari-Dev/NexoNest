// Product metadata is authored in projects-brief.json; update-seo owns the marked map.
(function () {
  const records = /* product-status-data:start */
{
  "p_nexopider": {
    "id": "p_nexopider",
    "title": "NexoPider",
    "url": "projects-pages/nexoPider.html",
    "product": {
      "editorialId": "nexopider",
      "release": "development-preview",
      "platforms": [
        "Rhino 8",
        "Grasshopper",
        "Windows"
      ],
      "compatibility": "Development preview for Rhino 8 and Grasshopper on Windows. No public installer.",
      "primaryAction": {
        "label": "Explore the workflow",
        "url": "projects-pages/nexoPider.html#workflow",
        "kind": "guide"
      },
      "verifiedOn": "2026-11-18",
      "evidence": {
        "kind": "repository",
        "reference": "NexoPider 0.7.4 local host demonstration and captured UI states"
      }
    }
  },
  "p_climora": {
    "id": "p_climora",
    "title": "ClimaNest",
    "url": "projects-pages/climora.html",
    "product": {
      "editorialId": "climora",
      "release": "development-preview",
      "platforms": [
        "Windows"
      ],
      "compatibility": "Local desktop preview; no public installer. Native Windows acceptance remains unverified.",
      "primaryAction": {
        "label": "Read the preview guide",
        "url": "projects-pages/climora.html#getting-started",
        "kind": "guide"
      },
      "verifiedOn": "2026-11-08",
      "evidence": {
        "kind": "repository",
        "reference": "climatic tools README.md and current strategy/reporting sources; NexoNest js/project-page.js"
      }
    }
  },
  "p_nexorhino": {
    "id": "p_nexorhino",
    "title": "NexoRhino",
    "url": "projects-pages/nexoRhino.html",
    "product": {
      "editorialId": "nexorhino",
      "release": "public-release",
      "platforms": [
        "VS Code",
        "PyCharm",
        "Python stubs"
      ],
      "compatibility": "Rhino 8 API assistance. VS Code 1.85+ with Python/Pylance; PyCharm 2023.3–2026.2.x. Execution requires Rhino.",
      "primaryAction": {
        "label": "Read installation guidance",
        "url": "projects-pages/nexoRhino.html#release-1-1",
        "kind": "guide"
      },
      "verifiedOn": "2026-11-08",
      "evidence": {
        "kind": "repository",
        "reference": "NexoNest js/project-page.js release-1-1; PROJECT_GUIDE.md 2026-10-29 public editor verification"
      }
    }
  },
  "p_curvadapt": {
    "id": "p_curvadapt",
    "title": "CurvAdapt",
    "url": "projects-pages/curvAdapt.html",
    "product": {
      "editorialId": "curvadapt",
      "release": "in-development",
      "releaseLabel": "Plugin in development",
      "platforms": [
        "Rhino",
        "Grasshopper"
      ],
      "compatibility": "Windows, Rhino 8.30+ with .NET 8 and Grasshopper. No public stable package confirmed.",
      "primaryAction": {
        "label": "Explore the plugin",
        "url": "projects-pages/curvAdapt.html",
        "kind": "details"
      },
      "verifiedOn": "2026-11-08",
      "evidence": {
        "kind": "repository",
        "reference": "curvAdapt README.md, curvAdapt.csproj and plugin resource registration"
      }
    }
  }
}
/* product-status-data:end */;
  const labels = {
    'development-preview': 'Development preview',
    'in-development': 'In development',
    'public-release': 'Public release'
  };
  const escape = value => String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  })[character]);
  const isText = value => typeof value === 'string' && value.trim().length > 0;

  function validActionURL(value) {
    if (!isText(value) || value.startsWith('/') || value.includes('..') || /[\u0000-\u0020\\]/.test(value)) return false;
    if (!/^https?:\/\//i.test(value) && !/^[a-zA-Z0-9_-][^:]*$/.test(value)) return false;
    try {
      return ['http:', 'https:'].includes(new URL(value, 'https://nexonest.com/').protocol);
    } catch {
      return false;
    }
  }

  function validate(record) {
    const product = record.product;
    if (product === undefined) return;
    if (!product || typeof product !== 'object' || Array.isArray(product)) throw new Error(`Invalid product metadata: ${record.id}`);
    const validDate = isText(product.verifiedOn) && /^\d{4}-\d{2}-\d{2}$/.test(product.verifiedOn)
      && !Number.isNaN(Date.parse(product.verifiedOn))
      && new Date(product.verifiedOn).toISOString().slice(0, 10) === product.verifiedOn;
    if (!labels[product.release] || !isText(product.editorialId)
      || !Array.isArray(product.platforms) || !product.platforms.length || !product.platforms.every(isText)
      || !isText(product.compatibility) || !validDate
      || (product.releaseLabel !== undefined && !isText(product.releaseLabel))
      || !['repository', 'public-release'].includes(product.evidence?.kind)
      || !isText(product.evidence.reference)) {
      throw new Error(`Invalid product metadata: ${record.id}`);
    }
    const action = product.primaryAction;
    if (!isText(action?.label) || !validActionURL(action.url)
      || !['guide', 'details', 'marketplace', 'download'].includes(action.kind)
      || (product.release !== 'public-release' && ['marketplace', 'download'].includes(action.kind))
      || (action.kind === 'download' && product.evidence.kind !== 'public-release')) {
      throw new Error(`Invalid product action: ${record.id}`);
    }
  }

  function get(identifier) {
    const record = typeof identifier === 'object' && identifier !== null ? identifier
      : records[identifier] || Object.values(records).find(item => item.product.editorialId === identifier || item.url === identifier);
    if (!record?.product) return null;
    validate(record);
    return { ...record, ...record.product, releaseLabel: record.product.releaseLabel || labels[record.product.release] };
  }

  function reviewLabel(product) {
    return product.evidence.kind === 'public-release' ? 'Public release verified' : 'Source reviewed';
  }

  function summary(identifier) {
    const product = get(identifier);
    if (!product) return '';
    return `${product.releaseLabel}. ${product.platforms.join(', ')}. ${product.compatibility} ${reviewLabel(product)} ${product.verifiedOn}. ${product.primaryAction.label}.`;
  }

  function action(identifier, { prefix = '' } = {}) {
    const product = get(identifier);
    if (!product) return null;
    const target = product.primaryAction;
    return { ...target, url: /^https?:\/\//i.test(target.url) ? target.url : prefix + target.url };
  }

  function render(identifier, { compact = false, includeAction = true, prefix = '../' } = {}) {
    const product = get(identifier);
    if (!product) return '';
    const target = action(identifier, { prefix });
    return `<aside class="product-status${compact ? ' product-status--compact' : ''}" data-product-status="${escape(product.id)}" aria-label="Product availability and compatibility">
      <p class="product-status-line"><strong>${escape(product.releaseLabel)}</strong><span> · ${escape(product.platforms.join(' / '))}</span></p>
      <p class="product-compatibility">${escape(product.compatibility)}</p>
      <p class="product-review">${reviewLabel(product)} <time datetime="${escape(product.verifiedOn)}">${escape(product.verifiedOn)}</time></p>
      ${includeAction ? `<a class="product-primary-action" href="${escape(target.url)}">${escape(target.label)} <span aria-hidden="true">↗</span></a>` : ''}
    </aside>`;
  }

  window.NexoNestProductStatus = { get, validate, summary, action, render };
})();

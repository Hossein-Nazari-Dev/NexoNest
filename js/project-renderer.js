class ProjectRenderer {
  constructor() {
    this.projectData = null;
    this.currentProjectId = this.getProjectIdFromURL();
    this.init();
  }

  async init() {
    try {
      if (!this.currentProjectId) throw new Error('Missing project id');
      this.projectData = await this.loadProjectData();

      // theme overrides (optional)
      this.applyThemeOverridesIfAny();

      // render structure
      this.renderTopTitle();          // Title & subtitle in MAIN content
      this.renderSidebarBrand();      // Icon + tags in SIDEBAR
      this.renderContentBlocks();     // Content sections
      this.renderMetrics();           // Optional metrics
      this.renderFooter();            // Optional footer buttons

      // update meta fields if any
      this.updatePageMetadata();

      // Let the nav builder know content sections exist now
      document.dispatchEvent(new CustomEvent('project:rendered'));
    } catch (error) {
      console.error('Error loading project data:', error);
      this.showErrorState(error);
    }
  }

  getProjectIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('id');
    if (q) return q;
    const m = window.location.pathname.match(/\/([^\/]+)\.html$/);
    return m ? m[1] : null;
  }

  async loadProjectData() {
    // robust, works from root
    const candidates = [
      `./data/projects-jsons/${this.currentProjectId}.json`,
      `data/projects-jsons/${this.currentProjectId}.json`,
      `../data/projects-jsons/${this.currentProjectId}.json`,
    ];
    let lastErr;
    for (const rel of candidates) {
      try {
        const url = new URL(rel, window.location.href).href;
        const resp = await fetch(url, { cache: 'no-store' });
        if (resp.ok) return await resp.json();
        lastErr = new Error(`Fetch failed ${resp.status} @ ${rel}`);
      } catch (e) { lastErr = e; }
    }
    throw lastErr || new Error('Failed to load project JSON');
  }

  applyThemeOverridesIfAny() {
    const t = this.projectData.theme;
    if (t && typeof t === 'object') {
      for (const [k, v] of Object.entries(t)) {
        document.documentElement.style.setProperty(`--${k}`, v);
      }
    }
    // convenience: if header.color present, use as accent unless explicitly set in theme
    const headerColor = this.projectData?.header?.color;
    if (headerColor && !(t && ('c-accent' in t))) {
      document.documentElement.style.setProperty('--c-accent', headerColor);
    }
  }

  /* ---------- LAYOUT TOP ---------- */
  renderTopTitle() {
    const title = this.projectData.title || 'Project';
    const subtitle = this.projectData.subtitle || '';
    document.title = `${title} - NexoNest`;

    const titleEl = document.getElementById('projectPageTitle');
    const subtitleEl = document.getElementById('projectPageSubtitle');
    if (titleEl) titleEl.textContent = title;
    if (subtitleEl) subtitleEl.textContent = subtitle;
  }

  renderSidebarBrand() {
    // icon
    const iconSrc =
      this.projectData?.header?.thumbnail ||
      this.projectData?.header?.image ||
      '';

    const iconEl = document.getElementById('projectIcon');
    if (iconEl) {
      if (iconSrc) {
        iconEl.src = iconSrc;
        iconEl.style.display = 'block';
      } else {
        iconEl.style.display = 'none';
      }
      iconEl.alt = this.projectData.title || 'Project icon';
    }

    // tags (kept in the sidebar)
    const tagsContainer = document.querySelector('.project-sidebar .project-tags');
    const tags = Array.isArray(this.projectData.tags) ? this.projectData.tags : [];
    if (tagsContainer) {
      tagsContainer.innerHTML = tags
        .map(t => `<span class="project-tag">${t}</span>`)
        .join('');
    }
  }

  /* ---------- CONTENT ---------- */
  renderContentBlocks() {
    const container = document.getElementById('projectContent');
    if (!container) return;

    const blocks = Array.isArray(this.projectData.content_blocks)
      ? this.projectData.content_blocks
      : Array.isArray(this.projectData.blocks)
        ? this.projectData.blocks
        : [];

    container.innerHTML = blocks.map(b => this.renderBlockUnified(b)).join('');

    // init widgets post-DOM insert
    this.initSliders();
    this.initInteractiveElements?.();
  }

  renderBlockUnified(block) {
    const type = block.type;
    const data = block.data || block;

    const map = {
      brief: this.renderBriefBlock,
      slider: this.renderSliderBlock,
      image: this.renderImageBlock,
      video: this.renderVideoBlock,
      contributors: this.renderContributorsBlock,
      text: this.renderTextBlock,
      text_image: this.renderTextImageBlock,
      features: this.renderFeaturesBlock,
      technical: this.renderTechnicalBlock,
      technologies: this.renderTechnologiesBlock,
    };

    const fn = map[type] || this.renderTextBlock;
    return fn.call(this, data);
  }

  /* ---------- BLOCK RENDERERS ---------- */
  renderBriefBlock(data) {
    return `
      <section class="content-section brief-section">
        <div class="section-header">
          <h2 class="section-title">${data.title || 'Project Overview'}</h2>
          ${data.subtitle ? `<p class="section-subtitle">${data.subtitle}</p>` : ''}
        </div>
        <div class="section-content">
          ${data.content ? `<p>${data.content}</p>` : ''}
          ${this.renderBriefMeta(data.meta)}
        </div>
      </section>`;
  }

  renderBriefMeta(meta) {
    if (!meta) return '';
    return `
      <div class="brief-meta">
        ${Object.entries(meta).map(([k, v]) => `
          <div class="meta-item">
            <span class="meta-label">${this.formatLabel(k)}:</span>
            <span class="meta-value">${v}</span>
          </div>`).join('')}
      </div>`;
  }

  renderSliderBlock(data) {
    const images = Array.isArray(data.images) ? data.images : [];
    return `
      <section class="content-section slider-section">
        <div class="section-header">
          <h2 class="section-title">${data.title || 'Gallery'}</h2>
          ${data.subtitle ? `<p class="section-subtitle">${data.subtitle}</p>` : ''}
        </div>
        <div class="section-content">
          <div class="slider-container">
            <div class="slider-track">
              ${images.map((img, i) => `
                <div class="slide" data-index="${i}">
                  <img src="${img.url}" alt="${img.alt || ''}" loading="lazy" decoding="async">
                  ${img.caption ? `<div class="slide-caption">${img.caption}</div>` : ''}
                </div>`).join('')}
            </div>
          </div>
          ${images.length > 1 ? `
            <div class="slider-controls">
              <button class="slider-btn prev" onclick="projectRenderer.prevSlide()">← Previous</button>
              <button class="slider-btn next" onclick="projectRenderer.nextSlide()">Next →</button>
            </div>` : ''}
        </div>
      </section>`;
  }

  renderImageBlock(data) {
    return `
      <section class="content-section single-image-section">
        <div class="section-header">
          ${data.title ? `<h2 class="section-title">${data.title}</h2>` : ''}
          ${data.subtitle ? `<p class="section-subtitle">${data.subtitle}</p>` : ''}
        </div>
        <div class="section-content">
          <img src="${data.url}" alt="${data.alt || ''}" loading="lazy" decoding="async">
          ${data.caption ? `<p class="image-caption">${data.caption}</p>` : ''}
        </div>
      </section>`;
  }

  renderVideoBlock(data) {
    return `
      <section class="content-section video-section">
        <div class="section-header">
          <h2 class="section-title">${data.title || 'Video Demonstration'}</h2>
          ${data.subtitle ? `<p class="section-subtitle">${data.subtitle}</p>` : ''}
        </div>
        <div class="section-content">
          <div class="video-container">
            <iframe src="${data.url}"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen></iframe>
          </div>
          ${data.caption ? `<p class="image-caption">${data.caption}</p>` : ''}
        </div>
      </section>`;
  }

  renderContributorsBlock(data) {
    const items = Array.isArray(data.contributors) ? data.contributors : [];
    return `
      <section class="content-section contributors-section">
        <div class="section-header">
          <h2 class="section-title">${data.title || 'Team & Contributors'}</h2>
          ${data.subtitle ? `<p class="section-subtitle">${data.subtitle}</p>` : ''}
        </div>
        <div class="section-content">
          <div class="contributors-grid">
            ${items.map(c => `
              <div class="contributor-card">
                ${c.image ? `<img src="${c.image}" alt="${c.name}" class="contributor-image" loading="lazy" decoding="async">` : ''}
                <h3 class="contributor-name">${c.name || ''}</h3>
                <p class="contributor-role">${c.role || ''}</p>
                ${Array.isArray(c.links) && c.links.length ? `
                  <div class="contributor-links">
                    ${c.links.map(l => `<a href="${l.url}" class="contributor-link" target="_blank" rel="noopener">${l.label}</a>`).join('')}
                  </div>` : ''}
              </div>`).join('')}
          </div>
        </div>
      </section>`;
  }

  renderTextBlock(data) {
    return `
      <section class="content-section text-section">
        <div class="section-header">
          ${data.title ? `<h2 class="section-title">${data.title}</h2>` : ''}
          ${data.subtitle ? `<p class="section-subtitle">${data.subtitle}</p>` : ''}
        </div>
        <div class="section-content">
          ${data.content || ''}
        </div>
      </section>`;
  }

  renderTextImageBlock(data) {
    const pos = data.image_position || 'right';
    return `
      <section class="content-section text-image-section text-image-${pos}">
        <div class="section-header">
          <h2 class="section-title">${data.title || ''}</h2>
          ${data.subtitle ? `<p class="section-subtitle">${data.subtitle}</p>` : ''}
        </div>
        <div class="section-content">
          <div class="text-content">${data.content ? `<p>${data.content}</p>` : ''}</div>
          <div class="image-content">
            ${data.image ? `<img src="${data.image}" alt="${data.image_caption || ''}" loading="lazy" decoding="async">` : ''}
            ${data.image_caption ? `<p class="image-caption">${data.image_caption}</p>` : ''}
          </div>
        </div>
      </section>`;
  }

  renderFeaturesBlock(data) {
    const items = Array.isArray(data.items) ? data.items : [];
    const html = `
      <section class="content-section features-section">
        <div class="section-header">
          <h2 class="section-title">${data.title || 'Features'}</h2>
          ${data.subtitle ? `<p class="section-subtitle">${data.subtitle}</p>` : ''}
        </div>
        <div class="features-grid">
          ${items.map(it => `
            <div class="feature-card">
              ${it.icon ? `<div class="feature-icon"><i data-lucide="${it.icon}"></i></div>` : ''}
              <h3 class="feature-title">${it.title || ''}</h3>
              <p class="feature-description">${it.description || ''}</p>
            </div>`).join('')}
        </div>
      </section>`;
    return html;
  }

  refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons({
        attrs: { 'stroke-width': 1.75 } // optional styling
      });
    }
  }

  renderContentBlocks() {
    const container = document.getElementById('projectContent');
    if (!container) return;
  
    const blocks = Array.isArray(this.projectData.content_blocks)
      ? this.projectData.content_blocks
      : Array.isArray(this.projectData.blocks)
        ? this.projectData.blocks
        : [];
  
    container.innerHTML = blocks.map(b => this.renderBlockUnified(b)).join('');
  
    // init widgets post-DOM insert
    this.initSliders();
    this.initInteractiveElements?.();
  
    // <<< important
    this.refreshIcons();
  }
  
  
  

  renderTechnicalBlock(data) {
    const sections = Array.isArray(data.sections) ? data.sections : [];
    return `
      <section class="content-section technical-section">
        <div class="section-header"><h2 class="section-title">${data.title || 'Technical Details'}</h2></div>
        <div class="technical-content">
          ${sections.map(s => `
            <div class="technical-item">
              <h4>${s.title || ''}</h4>
              <p>${s.content || ''}</p>
            </div>`).join('')}
        </div>
      </section>`;
  }

  renderTechnologiesBlock(data) {
    const items = Array.isArray(data.technologies) ? data.technologies : [];
    return `
      <section class="content-section technologies-section">
        <div class="section-header">
          <h2 class="section-title">${data.title || 'Technologies Used'}</h2>
        </div>
        <div class="technologies-grid">
          ${items.map(tech => `
            <div class="technology-item">
              <span class="tech-name">${tech.name || ''}</span>
              ${tech.category ? `<span class="tech-category">${tech.category}</span>` : ''}
            </div>
          `).join('')}
        </div>
      </section>`;
  }
  

  getProficiencyWidth(prof) {
    const levels = { 'Beginner': '30%', 'Intermediate': '60%', 'Advanced': '80%', 'Expert': '95%' };
    return levels[prof] || '50%';
  }

  renderMetrics() {
    if (!this.projectData.metrics) return;
    const container = document.getElementById('projectContent');
    container && container.insertAdjacentHTML('beforeend', `
      <section class="content-section metrics-section">
        <div class="section-header"><h2 class="section-title">Project Impact</h2></div>
        <div class="metrics-grid">
          ${Object.entries(this.projectData.metrics).map(([k, v]) => `
            <div class="metric-item">
              <div class="metric-value">${v}</div>
              <div class="metric-label">${this.labelFromKey(k)}</div>
            </div>`).join('')}
        </div>
      </section>`);
  }

  renderFooter() {
    const f = this.projectData.footer;
    if (!f) return;
  
    const main = document.querySelector('.project-footer .project-navigation');
    if (!main) return;
  
    const parts = [];
  
    // Clickable buttons
    if (f.documentation_url) {
      parts.push(`
        <a class="nav-button" href="${f.documentation_url}" target="_blank" rel="noopener">
          <i data-lucide="file-text" aria-hidden="true"></i>
          <span>Documentation</span>
        </a>
      `);
    }
    if (f.download_url) {
      parts.push(`
        <a class="nav-button" href="${f.download_url}" download>
          <i data-lucide="download" aria-hidden="true"></i>
          <span>Download</span>
        </a>
      `);
    }
  
    // Static pills
    if (f.license) {
      parts.push(`
        <span class="nav-button is-plain">
          <i data-lucide="scale" aria-hidden="true"></i>
          <span>${f.license}</span>
        </span>
      `);
    }
    if (f.version) {
      parts.push(`
        <span class="nav-button is-plain">
          <i data-lucide="tag" aria-hidden="true"></i>
          <span>v${f.version}</span>
        </span>
      `);
    }
    if (f.last_updated) {
      parts.push(`
        <span class="nav-button is-plain">
          <i data-lucide="calendar" aria-hidden="true"></i>
          <span>Updated: ${f.last_updated}</span>
        </span>
      `);
    }
  
    main.innerHTML = parts.join('');
  
    // Important: turn the <i data-lucide="..."> into SVGs
    this.refreshIcons?.();
  }



  refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons({ attrs: { 'stroke-width': 1.75 } });
    }
  }
  
  
  

  /* ---------- UTILS ---------- */
  labelFromKey(key) {
    return key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }
  formatLabel(key) {
    return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
  }
  updatePageMetadata() {
    document.querySelectorAll('[data-project-field]').forEach(el => {
      const f = el.getAttribute('data-project-field');
      if (f && this.projectData[f] != null) el.textContent = this.projectData[f];
    });
  }

  initSliders() {/* stub for future */}

  showErrorState(err) {
    const c = document.getElementById('projectContent');
    if (!c) return;
    c.innerHTML = `
      <section class="content-section">
        <div class="section-header"><h2 class="section-title">Project Not Found</h2></div>
        <div class="section-content">
          <p>Sorry, we couldn't load the project data.</p>
          <p><small>Reason: ${err?.message || 'Unknown'}</small></p>
          <a href="./nexonest.html" class="back-button">← Back to Projects</a>
        </div>
      </section>`;
  }

  // slider nav stubs
  nextSlide() { this.navigateSlide(1); }
  prevSlide() { this.navigateSlide(-1); }
  navigateSlide(dir) { console.log('Slide move:', dir); }
}

const projectRenderer = new ProjectRenderer();

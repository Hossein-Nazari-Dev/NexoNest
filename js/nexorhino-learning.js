'use strict';
(() => {
  const form = document.getElementById('reference-filters');
  const search = document.getElementById('reference-search');
  const topic = document.getElementById('reference-topic');
  const entries = [...document.querySelectorAll('.class-entry')];
  const links = [...document.querySelectorAll('.class-index a')];
  const status = document.getElementById('reference-status');
  // Index text once; avoid reading thousands of members on every keystroke.
  const indexed = entries.map(entry => ({
    entry,
    text: entry.textContent.toLowerCase(),
    name: entry.id.replace('Rhino.Geometry.', '').toLowerCase(),
    members: [...entry.querySelectorAll('.member')].map(member => member.id.toLowerCase()),
    tags: entry.dataset.tags.split(' '),
  }));
  function filter() {
    const query = search.value.trim().toLowerCase();
    let count = 0;
    indexed.forEach((item, i) => {
      const matches = (!topic.value || item.tags.includes(topic.value)) &&
        (!query || item.text.includes(query) || item.name.includes(query) || item.members.some(id => id.includes(query)));
      item.entry.hidden = !matches;
      links[i].hidden = !matches;
      if (matches) count++;
    });
    status.textContent = `${count} of ${entries.length} classes`;
    document.getElementById('no-results').hidden = count !== 0;
  }
  function revealHash() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    if (!id) return;
    const target = document.getElementById(id);
    if (!target || !target.closest('#class-entries')) return;
    // An incoming link must win over any previous filtering state.
    search.value = '';
    topic.value = '';
    filter();
    const owner = target.closest('.class-entry');
    if (owner) owner.open = true;
    target.scrollIntoView({ block: 'start' });
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    links.forEach(link => {
      if (link.hash === '#' + owner?.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  form.hidden = false;
  search.addEventListener('input', filter);
  topic.addEventListener('change', filter);
  form.addEventListener('reset', () => setTimeout(filter, 0));
  window.addEventListener('hashchange', revealHash);
  revealHash();
})();

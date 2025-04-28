export function initParticles() {
  const config = {
    particleCount: 40,
    maxParticles: 150,
    connectionDistance: 120,
    minParticleSize: 1,
    maxParticleSize: 5,
    baseSpeed: 2,
    rotationalSpeed: 0.01,
    innerRadius: 100,
    growthInterval: 3500,
    minLineWidth: 0.5,
    maxLineWidth: 3,
    lineOpacity: 0.2,
    updateConnectionsInterval: 100,
    repulsionDistance: 30,
    stickDistance: 4,
    collisionDamping: 0.8,
    startAngle: 0,
    endAngle: Math.PI * 2,
    targetFPS: 30
  };

  const colorPalette = [
    '#E0E0E0', '#BDBDBD', '#9E9E9E', '#757575', '#616161',
    '#424242', '#212121', '#F5F5F5', '#EEEEEE', '#E0F2F7',
    '#C8E6C9', '#D1C4E9', '#FFECB3', '#FFCCBC', '#D7CCC8',
    '#CFD8DC', '#B0BEC5'
  ];

  const svg = document.querySelector('.particles-bg svg');
  if (!svg) {
    console.error('SVG element not found!');
    return;
  }

  const particles = [];
  let connections = [];
  let animationId;
  let growthTimer;
  let lastFrameTime = 0;
  let phase = 'collapse';
  let currentWalker = null;
  let isActive = true;

  const centerX = () => window.innerWidth / 2;
  const centerY = () => window.innerHeight / 2;

  const helpers = {
    random: {
      color: () => colorPalette[Math.floor(Math.random() * colorPalette.length)],
      size: () => config.minParticleSize + Math.random() * (config.maxParticleSize - config.minParticleSize),
      speed: () => -config.baseSpeed + Math.random() * config.baseSpeed * 2,
      opacity: () => 0.5 + Math.random() * 0.5
    },
    distance: (p1, p2) => Math.hypot(p2.x - p1.x, p2.y - p1.y)
  };

  function createParticle(x, y, initialSpeed = false) {
    if (particles.length >= config.maxParticles) return null;
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    const angleToCenter = Math.atan2(y - centerY(), x - centerX());
    const speed = helpers.random.speed();
    const p = {
      element: circle,
      x, y,
      size: helpers.random.size(),
      speedX: initialSpeed ? Math.cos(angleToCenter) * speed : helpers.random.speed(),
      speedY: initialSpeed ? Math.sin(angleToCenter) * speed : helpers.random.speed(),
      color: helpers.random.color(),
      opacity: helpers.random.opacity(),
      locked: false
    };
    circle.setAttribute('r', p.size);
    circle.setAttribute('cx', p.x);
    circle.setAttribute('cy', p.y);
    circle.setAttribute('fill', p.color);
    circle.setAttribute('opacity', p.opacity);
    circle.setAttribute('class', 'particle');
    svg.appendChild(circle);
    particles.push(p);
    return p;
  }

  function createConnection(p1, p2) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    const lw = config.minLineWidth + Math.random() * (config.maxLineWidth - config.minLineWidth);
    const op = ((p1.opacity + p2.opacity) / 2) * config.lineOpacity;
    line.setAttribute('x1', p1.x);
    line.setAttribute('y1', p1.y);
    line.setAttribute('x2', p2.x);
    line.setAttribute('y2', p2.y);
    line.setAttribute('stroke', p1.color);
    line.setAttribute('stroke-opacity', op);
    line.setAttribute('stroke-width', lw);
    svg.appendChild(line);
    return line;
  }

  function updateConnections() {
    connections.forEach(c => svg.removeChild(c));
    connections = [];
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        if (helpers.distance(particles[i], particles[j]) < config.connectionDistance) {
          connections.push(createConnection(particles[i], particles[j]));
        }
      }
    }
  }

  function handleCollisions() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        if (p1.locked || p2.locked) continue;
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dist = Math.hypot(dx, dy);
        const minDist = p1.size + p2.size;
        if (dist < minDist && dist > 0) {
          const overlap = (minDist - dist) / 2;
          const ux = dx / dist;
          const uy = dy / dist;
          p1.x -= ux * overlap;
          p1.y -= uy * overlap;
          p2.x += ux * overlap;
          p2.y += uy * overlap;
          p1.speedX *= -config.collisionDamping;
          p1.speedY *= -config.collisionDamping;
          p2.speedX *= -config.collisionDamping;
          p2.speedY *= -config.collisionDamping;
        }
      }
    }
  }

  function moveCollapse() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    particles.forEach((p, i) => {
      if (p.locked) return;
      let fx = 0, fy = 0;
      particles.forEach((o, j) => {
        if (i !== j && !o.locked) {
          const d = helpers.distance(p, o);
          if (d < config.repulsionDistance) {
            const ang = Math.atan2(o.y - p.y, o.x - p.x);
            const f = (config.repulsionDistance - d) / config.repulsionDistance;
            fx -= Math.cos(ang) * f * 0.1;
            fy -= Math.sin(ang) * f * 0.1;
          }
        }
      });
      p.speedX += fx;
      p.speedY += fy;
      const dx = p.x - centerX();
      const dy = p.y - centerY();
      const cosA = Math.cos(config.rotationalSpeed);
      const sinA = Math.sin(config.rotationalSpeed);
      const rx = dx * cosA - dy * sinA;
      const ry = dx * sinA + dy * cosA;
      p.x = centerX() + rx + p.speedX;
      p.y = centerY() + ry + p.speedY;
      if (p.x < 0 || p.x > w) { p.speedX *= -0.8; p.x = Math.max(0, Math.min(w, p.x)); }
      if (p.y < 0 || p.y > h) { p.speedY *= -0.8; p.y = Math.max(0, Math.min(h, p.y)); }
    });
    handleCollisions();
    updateConnections();
    particles.forEach(p => {
      p.element.setAttribute('cx', p.x);
      p.element.setAttribute('cy', p.y);
    });
  }

  function startDLA() {
    phase = 'dla';
    const center = particles[Math.floor(particles.length/2)];
    particles.forEach(p => p.element.remove());
    particles.length = 0;
    center.locked = true;
    particles.push(center);
    svg.appendChild(center.element);
  }

  function createWalker() {
    const ang = Math.random() * Math.PI * 2;
    const r = config.innerRadius * 1.5;
    const x = centerX() + Math.cos(ang) * r;
    const y = centerY() + Math.sin(ang) * r;
    const w = createParticle(x, y);
    if (w) w.locked = false;
    return w;
  }

  // --- افکت زوم نرم ---
  let zoomLevel = 1;
  const zoomSpeed = 0.00005;
  const minZoom = 0.85;

  function animate(now = 0) {
    if (!isActive) return;

    const elapsed = now - lastFrameTime;
    if (elapsed > 1000 / config.targetFPS) {
      lastFrameTime = now;

      if (phase === 'collapse') {
        moveCollapse();
        if (particles.length > config.particleCount * 2) {
          startDLA();
        }
      } else {
        if (!currentWalker) currentWalker = createWalker();
        if (currentWalker) {
          currentWalker.x += (Math.random() - 0.5) * 2;
          currentWalker.y += (Math.random() - 0.5) * 2;
          for (let seed of particles) {
            const dx = seed.x - currentWalker.x;
            const dy = seed.y - currentWalker.y;
            if (Math.hypot(dx, dy) < config.stickDistance) {
              currentWalker.locked = true;
              particles.push(currentWalker);
              currentWalker = null;
              break;
            }
          }
          if (currentWalker) {
            currentWalker.element.setAttribute('cx', currentWalker.x);
            currentWalker.element.setAttribute('cy', currentWalker.y);
          }
        }
      }

      // مقیاس دهی نمای کلی
      if (zoomLevel > minZoom) {
        zoomLevel -= zoomSpeed;
        svg.style.transform = `scale(${zoomLevel})`;
        svg.style.transformOrigin = 'center center';
      }
    }
    animationId = requestAnimationFrame(animate);
  }

  function handleResize() {
    cancelAnimationFrame(animationId);
    svg.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);
    svg.setAttribute('width', window.innerWidth);
    svg.setAttribute('height', window.innerHeight);
    svg.innerHTML = '';
    particles.length = 0;
    connections.length = 0;
    phase = 'collapse';
    currentWalker = null;
    zoomLevel = 1;
    for (let i = 0; i < config.particleCount; i++) {
      const ang = config.startAngle + (i / config.particleCount) * (config.endAngle - config.startAngle);
      const x = centerX() + Math.cos(ang) * config.innerRadius;
      const y = centerY() + Math.sin(ang) * config.innerRadius;
      createParticle(x, y, true);
    }
    updateConnections();
    if (isActive) {
      animationId = requestAnimationFrame(animate);
    }
  }

  function handleVisibilityChange() {
    isActive = !document.hidden;
    if (isActive) {
      handleResize();
      growthTimer = setInterval(() => {
        if (phase === 'collapse' && isActive) createParticle(
          Math.random() * window.innerWidth,
          Math.random() * window.innerHeight
        );
      }, config.growthInterval);
      animationId = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animationId);
      clearInterval(growthTimer);
    }
  }

  function start() {
    handleResize();
    growthTimer = setInterval(() => {
      if (phase === 'collapse') createParticle(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight
      );
    }, config.growthInterval);
    animationId = requestAnimationFrame(animate);
    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);
  }

  start();

  return {
    destroy() {
      cancelAnimationFrame(animationId);
      clearInterval(growthTimer);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      svg.innerHTML = '';
    },
    getConfig() {
      return config;
    },
    setConfig(newC) {
      Object.assign(config, newC);
    }
  };
}

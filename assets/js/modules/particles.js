export function initParticles() {
  // تنظیمات سیستم
  const config = {
    particleCount: 40,
    maxParticles: 150,
    connectionDistance: 120,
    minParticleSize: 2,
    maxParticleSize: 5,
    baseSpeed: 0.6,
    innerRadius: 100,
    growthInterval: 3500,
    minLineWidth: 1,
    maxLineWidth: 3,
    lineOpacity: 0.2,
    updateConnectionsEvery: 2,
    repulsionDistance: 30,
    startAngle: 0,
    endAngle: Math.PI * 2
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
  let frameCount = 0;

  const helpers = {
    random: {
      color: () => colorPalette[Math.floor(Math.random() * colorPalette.length)],
      size: () => config.minParticleSize + Math.random() * (config.maxParticleSize - config.minParticleSize),
      speed: () => -config.baseSpeed + Math.random() * config.baseSpeed * 2,
      opacity: () => 0.5 + Math.random() * 0.5,
      direction: () => Math.random() * Math.PI * 2
    },
    distance: (p1, p2) => Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
  };

  function createParticle(x, y, initialSpeed = false) {
    if (particles.length >= config.maxParticles) return null;

    const particle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    const angleToCenter = Math.atan2(y - window.innerHeight/2, x - window.innerWidth/2);
    const speed = helpers.random.speed();
    
    const particleObj = {
      element: particle,
      x, y,
      speedX: initialSpeed ? Math.cos(angleToCenter) * speed : helpers.random.speed(),
      speedY: initialSpeed ? Math.sin(angleToCenter) * speed : helpers.random.speed(),
      color: helpers.random.color(),
      opacity: helpers.random.opacity(),
      size: helpers.random.size()
    };

    particle.setAttribute('r', particleObj.size);
    particle.setAttribute('cx', x);
    particle.setAttribute('cy', y);
    particle.setAttribute('fill', particleObj.color);
    particle.setAttribute('opacity', particleObj.opacity);
    particle.setAttribute('class', 'particle');

    svg.appendChild(particle);
    particles.push(particleObj);
    
    return particleObj;
  }

  function createConnection(p1, p2) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    const lineWidth = config.minLineWidth + Math.random() * (config.maxLineWidth - config.minLineWidth);
    const opacity = (p1.opacity + p2.opacity) / 2 * config.lineOpacity;
    
    line.setAttribute('x1', p1.x);
    line.setAttribute('y1', p1.y);
    line.setAttribute('x2', p2.x);
    line.setAttribute('y2', p2.y);
    line.setAttribute('stroke', p1.color);
    line.setAttribute('stroke-opacity', opacity);
    line.setAttribute('stroke-width', lineWidth);
    line.setAttribute('class', 'connection-line');
    
    svg.appendChild(line);
    return line;
  }

  function updateConnections() {
    connections.forEach(conn => svg.removeChild(conn));
    connections = [];
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        if (helpers.distance(particles[i], particles[j]) < config.connectionDistance) {
          connections.push(createConnection(particles[i], particles[j]));
        }
      }
    }
  }

  function moveParticles() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    particles.forEach((p1, i) => {
      let forceX = 0, forceY = 0;
      
      particles.forEach((p2, j) => {
        if (i !== j) {
          const dist = helpers.distance(p1, p2);
          if (dist < config.repulsionDistance) {
            const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
            const force = (config.repulsionDistance - dist) / config.repulsionDistance;
            forceX -= Math.cos(angle) * force * 0.1;
            forceY -= Math.sin(angle) * force * 0.1;
          }
        }
      });
      
      // محدود کردن سرعت
      const speed = Math.sqrt(p1.speedX * p1.speedX + p1.speedY * p1.speedY);
      const maxSpeed = config.baseSpeed * 1.5;
      if (speed > maxSpeed) {
        p1.speedX = (p1.speedX / speed) * maxSpeed;
        p1.speedY = (p1.speedY / speed) * maxSpeed;
      }
      
      // به‌روزرسانی موقعیت
      p1.x += p1.speedX;
      p1.y += p1.speedY;
      
      // برخورد با دیوارها
      if (p1.x < 0 || p1.x > width) p1.speedX *= -0.8;
      if (p1.y < 0 || p1.y > height) p1.speedY *= -0.8;
      
      p1.x = Math.max(0, Math.min(width, p1.x));
      p1.y = Math.max(0, Math.min(height, p1.y));
      
      p1.element.setAttribute('cx', p1.x);
      p1.element.setAttribute('cy', p1.y);
    });
    
    if (++frameCount % config.updateConnectionsEvery === 0) {
      updateConnections();
    }
    
    animationId = requestAnimationFrame(moveParticles);
  }

  function growSystem() {
    if (particles.length >= config.maxParticles) {
      clearInterval(growthTimer);
      return;
    }
    
    const edge = Math.floor(Math.random() * 4);
    let x, y;
    
    switch(edge) {
      case 0: x = Math.random() * window.innerWidth; y = -10; break;
      case 1: x = window.innerWidth + 10; y = Math.random() * window.innerHeight; break;
      case 2: x = Math.random() * window.innerWidth; y = window.innerHeight + 10; break;
      case 3: x = -10; y = Math.random() * window.innerHeight; break;
    }
    
    createParticle(x, y);
  }

  function handleResize() {
    cancelAnimationFrame(animationId);
    
    svg.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);
    svg.setAttribute('width', window.innerWidth);
    svg.setAttribute('height', window.innerHeight);
    
    // بازسازی سیستم
    svg.innerHTML = '';
    particles.length = 0;
    connections.length = 0;
    
    // ایجاد ذرات اولیه
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    for (let i = 0; i < config.particleCount; i++) {
      const angle = config.startAngle + (i / config.particleCount) * (config.endAngle - config.startAngle);
      const x = centerX + Math.cos(angle) * config.innerRadius;
      const y = centerY + Math.sin(angle) * config.innerRadius;
      createParticle(x, y, true);
    }
    
    updateConnections();
    moveParticles();
  }

  function init() {
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    handleResize();
    growthTimer = setInterval(growSystem, config.growthInterval);
    window.addEventListener('resize', handleResize);
  }

  init();

  return {
    destroy: () => {
      cancelAnimationFrame(animationId);
      clearInterval(growthTimer);
      window.removeEventListener('resize', handleResize);
      svg.innerHTML = '';
    },
    getConfig: () => config,
    setConfig: (newConfig) => Object.assign(config, newConfig)
  };
}
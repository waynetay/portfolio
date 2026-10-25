(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hero = document.querySelector('.interactive-hero');
  if (hero) {
    const canvas = hero.querySelector('canvas');
    const ctx = canvas && canvas.getContext('2d');
    const art = hero.querySelector('.ascii-art');
    const chars = ' .:-=+*#%@';
    let width = 0, height = 0, frame = 0, pointerX = 0, pointerY = 0;
    const resize = () => {
      if (!canvas || !ctx) return;
      const rect = hero.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = () => {
      if (!ctx || reduceMotion) return;
      ctx.clearRect(0, 0, width, height);
      const cell = width < 520 ? 17 : 20;
      const t = frame * 0.018;
      ctx.font = '12px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.textAlign = 'center';
      for (let y = 12; y < height; y += cell) {
        for (let x = 8; x < width; x += cell) {
          const dx = x - (width * 0.5 + pointerX * 22);
          const dy = y - (height * 0.5 + pointerY * 14);
          const wave = Math.sin(x * 0.025 + t) + Math.cos(y * 0.035 - t * 1.2);
          const influence = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / 190);
          const value = Math.min(1, Math.max(0, (wave + 2) / 4 + influence * 0.65));
          ctx.fillStyle = 'rgba(123,73,255,' + (0.07 + value * 0.28) + ')';
          ctx.fillText(chars[Math.min(chars.length - 1, Math.floor(value * chars.length))], x, y);
        }
      }
      frame++;
      if (art) art.style.transform = 'translate3d(' + (pointerX * 5).toFixed(1) + 'px,' + (pointerY * 3).toFixed(1) + 'px,0)';
      requestAnimationFrame(draw);
    };
    hero.addEventListener('pointermove', (event) => {
      const rect = hero.getBoundingClientRect();
      pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      hero.style.setProperty('--pointer-x', (50 + pointerX * 8) + '%');
      hero.style.setProperty('--pointer-y', (50 + pointerY * 8) + '%');
    });
    hero.addEventListener('pointerleave', () => { pointerX = 0; pointerY = 0; });
    resize();
    window.addEventListener('resize', resize, { passive: true });
    if (reduceMotion && ctx) {
      ctx.fillStyle = 'rgba(123,73,255,.12)';
      ctx.font = '12px monospace';
      ctx.fillText('010010  //  WAYNE.TAY', 18, 30);
    } else {
      requestAnimationFrame(draw);
    }
  }

  const cards = document.querySelectorAll('.project-card');
  cards.forEach((card) => {
    card.classList.add('motion-ready');
    if (reduceMotion) return;
    card.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'mouse') return;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      card.style.setProperty('--tilt-x', ((0.5 - y) * 2.4).toFixed(2) + 'deg');
      card.style.setProperty('--tilt-y', ((x - 0.5) * 2.8).toFixed(2) + 'deg');
      card.style.setProperty('--glow-x', (x * 100).toFixed(1) + '%');
      card.style.setProperty('--glow-y', (y * 100).toFixed(1) + '%');
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
      card.style.setProperty('--glow-x', '50%');
      card.style.setProperty('--glow-y', '50%');
    });
  });

  if (!reduceMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('h2, .project-card, #markdown-body > p, #markdown-body > table').forEach((el) => {
      el.classList.add('reveal-on-scroll');
      observer.observe(el);
    });
  } else {
    document.querySelectorAll('.reveal-on-scroll').forEach((el) => el.classList.add('is-visible'));
  }
})();
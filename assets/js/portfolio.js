(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hero = document.querySelector('.interactive-hero');
  if (hero) {
    hero.addEventListener('pointermove', (event) => {
      const rect = hero.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      hero.style.setProperty('--pointer-x', (50 + x * 8) + '%');
      hero.style.setProperty('--pointer-y', (50 + y * 8) + '%');
    });
  }

  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  document.body.appendChild(cursor);
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let x = -100, y = -100, targetX = -100, targetY = -100;
    const animateCursor = () => {
      x += (targetX - x) * 0.22;
      y += (targetY - y) * 0.22;
      cursor.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0) translate(-50%,-50%)';
      requestAnimationFrame(animateCursor);
    };
    window.addEventListener('pointermove', (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      cursor.classList.add('is-visible');
    }, { passive: true });
    window.addEventListener('pointerleave', () => cursor.classList.remove('is-visible'));
    document.querySelectorAll('a, button, .project-card').forEach((el) => {
      el.addEventListener('pointerenter', () => cursor.classList.add('is-hovering'));
      el.addEventListener('pointerleave', () => cursor.classList.remove('is-hovering'));
    });
    animateCursor();
  }

  // Fade the supporting hero text as the hero leaves view; reverse naturally when scrolling back up.
  const heroScrollFade = () => {
    const hero = document.querySelector('.interactive-hero');
    if (!hero) return;
    const subtitle = hero.querySelector('.hero-subtitle');
    const cta = hero.querySelector('.hero-cta');
    if (!subtitle && !cta) return;
    const rect = hero.getBoundingClientRect();
    const fadeStart = Math.max(60, rect.height * 0.18);
    const fadeEnd = rect.height * 0.82;
    const progress = Math.min(1, Math.max(0, (fadeStart - rect.top) / Math.max(1, fadeEnd)));
    const opacity = 1 - progress;
    [subtitle, cta].forEach((el) => {
      if (!el) return;
      el.style.opacity = opacity.toFixed(3);
      el.style.transform = 'translateY(' + (progress * -10).toFixed(1) + 'px)';
      el.style.pointerEvents = opacity < 0.08 ? 'none' : '';
    });
  };
  window.addEventListener('scroll', heroScrollFade, { passive: true });
  window.addEventListener('resize', heroScrollFade, { passive: true });
  heroScrollFade();

  // Lock the complete portfolio container until the visitor explicitly opens it.
  const intro = document.querySelector('.interactive-hero');
  const portfolio = document.getElementById('portfolio-content');
  if (intro && portfolio) {
    const cta = intro.querySelector('.hero-cta');
    portfolio.classList.add('portfolio-locked');
    portfolio.setAttribute('aria-hidden', 'true');
    if (cta) {
      cta.setAttribute('aria-controls', 'portfolio-content');
      cta.setAttribute('aria-expanded', 'false');
      cta.addEventListener('click', (event) => {
        event.preventDefault();
        portfolio.classList.remove('portfolio-locked');
        portfolio.classList.add('portfolio-unlocked');
        portfolio.removeAttribute('aria-hidden');
        cta.innerHTML = 'Portfolio unlocked <span aria-hidden="true">↘</span>';
        cta.setAttribute('aria-expanded', 'true');
        const target = document.getElementById('featured-projects');
        window.setTimeout(() => {
          (target || portfolio).scrollIntoView({
            behavior: reduceMotion ? 'auto' : 'smooth',
            block: 'start'
          });
        }, 80);
      }, { once: true });
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
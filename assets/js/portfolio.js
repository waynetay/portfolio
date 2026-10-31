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
    window.addEventListener('pointermove', (event) => {
      cursor.style.transform = 'translate3d(' + event.clientX + 'px,' + event.clientY + 'px,0) translate(-50%,-50%)';
      cursor.classList.add('is-visible');
    }, { passive: true });
    window.addEventListener('pointerleave', () => cursor.classList.remove('is-visible'));
    const projectCursorIcons = {
      quicknote: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 5 5 5M4 20l4.2-1 10.1-10.1a2.1 2.1 0 0 0-3-3L5.2 16 4 20Z"/></svg>',
      tava: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4.5 4.5L19 7"/></svg>',
      student: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3.5h7l4 4V20H7z"/><path d="M14 3.5V8h4M10 12h5M10 15.5h5"/></svg>'
    };
    const projectClasses = ['is-project-quicknote', 'is-project-tava', 'is-project-student'];
    document.querySelectorAll('a, button').forEach((el) => {
      el.addEventListener('pointerenter', () => cursor.classList.add('is-hovering'));
      el.addEventListener('pointerleave', () => cursor.classList.remove('is-hovering'));
    });
    document.querySelectorAll('.project-card').forEach((card) => {
      card.addEventListener('pointerenter', () => {
        const title = (card.querySelector('h3')?.textContent || '').toLowerCase();
        const project = title.includes('quicknote') ? 'quicknote' : title.includes('tava') ? 'tava' : title.includes('student management') ? 'student' : '';
        cursor.classList.add('is-hovering');
        cursor.classList.remove(...projectClasses);
        if (project) {
          cursor.classList.add('is-project-' + project);
          cursor.innerHTML = projectCursorIcons[project];
        } else {
          cursor.innerHTML = '';
        }
      });
      card.addEventListener('pointerleave', () => {
        cursor.classList.remove('is-hovering', ...projectClasses);
        cursor.innerHTML = '';
      });
    });
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
  let fadeQueued = false;
  window.addEventListener('scroll', () => {
    if (fadeQueued) return;
    fadeQueued = true;
    requestAnimationFrame(() => { heroScrollFade(); fadeQueued = false; });
  }, { passive: true });
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
        cta.setAttribute('aria-expanded', 'true');
        cta.remove();
        const target = portfolio.querySelector('.projects-scroll')
          || document.getElementById('featured-projects')
          || portfolio;
        window.setTimeout(() => {
          target.scrollIntoView({
            behavior: reduceMotion ? 'auto' : 'smooth',
            block: 'start'
          });
        }, 100);
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
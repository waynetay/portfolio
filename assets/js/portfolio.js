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
        intro.classList.add('is-open');
      }, { once: true });
    }
  }

})();
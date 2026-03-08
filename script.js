/* =============================================
   script.js — Advanced Animations & Interactions
   (Inspired by animejs.com)
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // ========== NAVBAR SCROLL ==========
  const navbar = document.getElementById('navbar');
  const navLinks = document.getElementById('navLinks');
  const navToggle = document.getElementById('navToggle');
  const sections = document.querySelectorAll('.section, .hero');

  function handleNavScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll);
  handleNavScroll();

  // ========== MOBILE MENU ==========
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // ========== ACTIVE NAV LINK ON SCROLL ==========
  function updateActiveLink() {
    const scrollPos = window.scrollY + 120;
    const allNavLinks = navLinks.querySelectorAll('a');

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        allNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink);

  // ========== DOT GRID ANIMATION (animejs.com style) ==========
  function createDotGrid() {
    const grid = document.getElementById('heroDotGrid');
    if (!grid) return;

    const hero = document.querySelector('.hero');
    const w = hero.offsetWidth;
    const h = hero.offsetHeight;
    const gap = 60;
    const cols = Math.floor(w / gap);
    const rows = Math.floor(h / gap);

    grid.style.gridTemplateColumns = `repeat(${cols}, ${gap}px)`;
    grid.style.gridTemplateRows = `repeat(${rows}, ${gap}px)`;
    grid.style.justifyContent = 'center';
    grid.style.alignContent = 'center';

    const totalDots = cols * rows;
    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement('div');
      dot.className = 'dot';
      dot.style.justifySelf = 'center';
      dot.style.alignSelf = 'center';
      grid.appendChild(dot);
    }

    // Fade in grid
    anime({
      targets: grid,
      opacity: [0, 1],
      duration: 1500,
      easing: 'easeOutCubic'
    });

    // Ripple wave animation on dots
    const dots = grid.querySelectorAll('.dot');
    function animateDotWave() {
      const centerX = cols / 2;
      const centerY = rows / 2;

      anime({
        targets: dots,
        opacity: [
          { value: 0.3, duration: 600 },
          { value: 0.08, duration: 600 }
        ],
        scale: [
          { value: 2, duration: 600 },
          { value: 1, duration: 600 }
        ],
        delay: anime.stagger(50, {
          grid: [cols, rows],
          from: 'center'
        }),
        easing: 'easeInOutQuad',
        complete: () => {
          setTimeout(animateDotWave, 2000);
        }
      });
    }

    setTimeout(animateDotWave, 1500);

    // Mouse interaction with dots
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      dots.forEach((dot, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const dotX = col * gap + gap / 2;
        const dotY = row * gap + gap / 2;
        const dist = Math.sqrt(Math.pow(mouseX - dotX, 2) + Math.pow(mouseY - dotY, 2));

        if (dist < 120) {
          const intensity = 1 - dist / 120;
          dot.style.opacity = 0.08 + intensity * 0.45;
          dot.style.transform = `scale(${1 + intensity * 2})`;
        } else {
          dot.style.opacity = '';
          dot.style.transform = '';
        }
      });
    });
  }

  createDotGrid();

  // ========== FLOATING PARTICLES ==========
  function createParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    const count = 20;
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      const size = Math.random() * 4 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      container.appendChild(particle);
    }

    const particles = container.querySelectorAll('.particle');

    anime({
      targets: particles,
      translateX: () => anime.random(-80, 80),
      translateY: () => anime.random(-80, 80),
      opacity: [
        { value: () => Math.random() * 0.12 + 0.04, duration: 2000 },
        { value: 0, duration: 2000 }
      ],
      scale: [
        { value: () => Math.random() * 1.5 + 0.5, duration: 2000 },
        { value: 0, duration: 2000 }
      ],
      delay: anime.stagger(200, { from: 'random' }),
      duration: 4000,
      easing: 'easeInOutSine',
      loop: true,
      direction: 'alternate'
    });
  }

  createParticles();

  // ========== PROFILE RING ANIMATION ==========
  function animateProfileRing() {
    const ring = document.getElementById('ringProgress');
    if (!ring) return;

    anime({
      targets: ring,
      strokeDashoffset: [597, 0],
      duration: 2000,
      delay: 500,
      easing: 'easeInOutCubic'
    });

    // Continuous slow rotation
    anime({
      targets: '.profile-ring',
      rotate: 360,
      duration: 20000,
      easing: 'linear',
      loop: true
    });
  }

  animateProfileRing();

  // ========== HERO TITLE LETTER-BY-LETTER ANIMATION ==========
  function animateHeroTitle() {
    const title = document.getElementById('heroTitle');
    if (!title) return;

    // Wrap each text node's characters in spans
    function wrapLetters(element) {
      const nodes = Array.from(element.childNodes);
      nodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent;
          const fragment = document.createDocumentFragment();
          text.split('').forEach(char => {
            if (char === ' ') {
              fragment.appendChild(document.createTextNode(' '));
            } else {
              const span = document.createElement('span');
              span.className = 'letter';
              span.textContent = char;
              fragment.appendChild(span);
            }
          });
          node.replaceWith(fragment);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName === 'BR') return;
          if (node.tagName === 'SPAN' && node.classList.contains('text-gradient')) {
            wrapLetters(node);
          }
        }
      });
    }

    wrapLetters(title);

    // Animate letters with stagger
    anime({
      targets: '#heroTitle .letter',
      opacity: [0, 1],
      translateY: [40, 0],
      duration: 600,
      delay: anime.stagger(30, { start: 300 }),
      easing: 'easeOutCubic'
    });
  }

  animateHeroTitle();

  // ========== PROFILE IMAGE ENTRANCE ==========
  anime({
    targets: '.profile-image-wrapper',
    scale: [0, 1],
    opacity: [0, 1],
    duration: 800,
    delay: 200,
    easing: 'easeOutBack'
  });

  // ========== SCROLL-TRIGGERED ANIMATIONS (anime.js) ==========
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  const observedSet = new Set();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !observedSet.has(entry.target)) {
        observedSet.add(entry.target);
        triggerAnimation(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  animatedElements.forEach(el => observer.observe(el));

  function triggerAnimation(el) {
    const type = el.dataset.animation;
    const delay = parseInt(el.dataset.delay) || 0;

    switch (type) {
      case 'fadeIn':
        anime({
          targets: el,
          opacity: [0, 1],
          duration: 800,
          delay: delay,
          easing: 'easeOutCubic'
        });
        break;

      case 'slideUp':
        anime({
          targets: el,
          opacity: [0, 1],
          translateY: [30, 0],
          duration: 800,
          delay: delay,
          easing: 'easeOutCubic'
        });
        break;

      case 'slideRight':
        anime({
          targets: el,
          opacity: [0, 1],
          translateX: [-30, 0],
          duration: 800,
          delay: delay,
          easing: 'easeOutCubic'
        });
        break;

      case 'slideLeft':
        anime({
          targets: el,
          opacity: [0, 1],
          translateX: [30, 0],
          duration: 800,
          delay: delay,
          easing: 'easeOutCubic'
        });
        break;

      case 'staggerUp':
        anime({
          targets: el,
          opacity: [0, 1],
          duration: 400,
          delay: delay,
          easing: 'easeOutCubic'
        });

        anime({
          targets: el.children,
          opacity: [0, 1],
          translateY: [20, 0],
          delay: anime.stagger(60, { start: delay + 100 }),
          duration: 600,
          easing: 'easeOutCubic'
        });
        break;
    }
  }

  // ========== HERO SCROLL-TRIGGERED (immediate on load) ==========
  const heroElements = document.querySelectorAll('.hero .animate-on-scroll');
  heroElements.forEach(el => {
    if (!observedSet.has(el)) {
      observedSet.add(el);
      triggerAnimation(el);
    }
  });

  // ========== SECTION DIVIDER ANIMATIONS ==========
  // Animate section headers with a line draw effect
  const sectionLabels = document.querySelectorAll('.section-label');
  const labelObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        anime({
          targets: entry.target,
          opacity: [0, 1],
          letterSpacing: ['0.2em', '0.1em'],
          duration: 800,
          easing: 'easeOutCubic'
        });
        labelObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  sectionLabels.forEach(label => labelObserver.observe(label));

  // ========== CONTACT FORM ==========
  const contactForm = document.getElementById('contactForm');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('.btn-primary');
    const originalHTML = btn.innerHTML;

    btn.innerHTML = '<span style="display:inline-flex;align-items:center;gap:8px;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Sent!</span>';
    btn.style.pointerEvents = 'none';

    showToast('Message sent successfully! ✨');

    anime({
      targets: btn,
      scale: [1, 0.95, 1],
      duration: 300,
      easing: 'easeInOutQuad'
    });

    setTimeout(() => {
      contactForm.reset();
      btn.innerHTML = originalHTML;
      btn.style.pointerEvents = '';
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    }, 2500);
  });

  // ========== TOAST ==========
  function showToast(message) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ========== SMOOTH SCROLL OFFSET ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const target = document.querySelector(targetId);
      if (target) {
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
        const top = target.offsetTop - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ========== SKILL PILL MAGNETIC HOVER ==========
  const skillPills = document.querySelectorAll('.skill-pill');
  skillPills.forEach(pill => {
    pill.addEventListener('mouseenter', () => {
      anime({
        targets: pill,
        scale: 1.05,
        duration: 200,
        easing: 'easeOutCubic'
      });
    });
    pill.addEventListener('mouseleave', () => {
      anime({
        targets: pill,
        scale: 1,
        duration: 200,
        easing: 'easeOutCubic'
      });
    });
  });

  // ========== PROJECT CARD TILT ==========
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -3;
      const rotateY = (x - centerX) / centerX * 3;

      card.style.transform = `translateY(-4px) perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      anime({
        targets: card,
        rotateX: 0,
        rotateY: 0,
        translateY: 0,
        duration: 400,
        easing: 'easeOutCubic',
        complete: () => {
          card.style.transform = '';
        }
      });
    });
  });

  // ========== STAGGER WAVE ON ABOUT CARDS (animejs.com style) ==========
  const aboutCards = document.querySelectorAll('.about-card');
  const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        anime({
          targets: '.about-card',
          translateY: [40, 0],
          opacity: [0, 1],
          delay: anime.stagger(150),
          duration: 800,
          easing: 'easeOutCubic'
        });
        aboutObserver.disconnect();
      }
    });
  }, { threshold: 0.2 });

  if (aboutCards.length > 0) {
    aboutObserver.observe(aboutCards[0]);
  }

  // ========== PROJECT CARDS STAGGER ENTRANCE ==========
  const projectCardElements = document.querySelectorAll('.project-card');
  const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        anime({
          targets: '.project-card',
          translateY: [50, 0],
          opacity: [0, 1],
          scale: [0.95, 1],
          delay: anime.stagger(120),
          duration: 900,
          easing: 'easeOutCubic'
        });
        projectObserver.disconnect();
      }
    });
  }, { threshold: 0.2 });

  if (projectCardElements.length > 0) {
    projectObserver.observe(projectCardElements[0]);
  }
});

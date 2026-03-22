/* =========================================================
   SARISHMA RAI — PORTFOLIO WEBSITE  ·  JavaScript
   ========================================================= */
(() => {
  'use strict';

  /* ── DOM References ── */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const preloader    = $('#preloader');
  const cursorGlow   = $('#cursor-glow');
  const header       = $('#header');
  const navToggle    = $('#nav-toggle');
  const navLinks     = $('#nav-links');
  const navLinkList  = $$('.nav-link');
  const backToTop    = $('#back-to-top');
  const typedText    = $('#typed-text');
  const contactForm  = $('#contact-form');
  const formStatus   = $('#form-status');

  /* ── Preloader ── */
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('hidden'), 600);
  });

  /* ── Custom Cursor Glow (desktop) ── */
  if (window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    (function animate() {
      glowX += (mouseX - glowX) * 0.12;
      glowY += (mouseY - glowY) * 0.12;
      cursorGlow.style.left = glowX + 'px';
      cursorGlow.style.top  = glowY + 'px';
      requestAnimationFrame(animate);
    })();
  }

  /* ── Navbar Scroll State ── */
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
    backToTop.classList.toggle('visible', window.scrollY > 400);
    highlightNavLink();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Active Nav Link on Scroll ── */
  function highlightNavLink() {
    const sections = $$('.section');
    let current = '';
    for (const sec of sections) {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.id;
    }
    navLinkList.forEach((link) => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }

  /* ── Mobile Menu Toggle ── */
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });
  navLinkList.forEach((link) =>
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    })
  );

  /* ── Back to Top ── */
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── Typing Effect ── */
  const phrases = [
    'A Student & Developer',
    'A Creative Thinker',
    'A UI / UX Enthusiast',
    'A Problem Solver',
  ];
  let phraseIndex = 0, charIndex = 0, isDeleting = false;
  function typeLoop() {
    const current = phrases[phraseIndex];
    if (isDeleting) {
      typedText.textContent = current.substring(0, charIndex--);
    } else {
      typedText.textContent = current.substring(0, charIndex++);
    }

    let speed = isDeleting ? 35 : 70;

    if (!isDeleting && charIndex > current.length) {
      speed = 2000; // pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex < 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      speed = 400;
    }
    setTimeout(typeLoop, speed);
  }
  typeLoop();

  /* ── Intersection Observer — Scroll Animations ── */
  const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -40px 0px' };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Animate skill bars inside this element
        const fills = $$('.skill-fill', entry.target);
        fills.forEach((fill) => {
          fill.style.width = fill.dataset.percent + '%';
        });
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  $$('.animate-on-scroll').forEach((el) => observer.observe(el));

  /* ── Also observe skill cards container to fill bars ── */
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        $$('.skill-fill').forEach((fill) => {
          fill.style.width = fill.dataset.percent + '%';
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  const skillsSection = $('#skills');
  if (skillsSection) skillObserver.observe(skillsSection);

  /* ── Contact Form (front-end only — no backend) ── */
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = $('#form-name').value.trim();
    const email   = $('#form-email').value.trim();
    const message = $('#form-message').value.trim();

    if (!name || !email || !message) {
      showFormStatus('Please fill in all required fields.', false);
      return;
    }

    // Simulate send
    const btn = $('#form-submit');
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Sending…';

    setTimeout(() => {
      showFormStatus('Thank you, ' + name + '! Your message has been received. 🎉', true);
      contactForm.reset();
      btn.disabled = false;
      btn.querySelector('span').textContent = 'Send Message';
    }, 1200);
  });

  function showFormStatus(msg, success) {
    formStatus.textContent = msg;
    formStatus.style.color = success ? 'hsl(140, 60%, 55%)' : 'hsl(0, 70%, 60%)';
    formStatus.classList.add('visible');
    setTimeout(() => formStatus.classList.remove('visible'), 5000);
  }

  /* ── Smooth anchor scrolling backup ── */
  $$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = $(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ── Tilt Effect on Project Cards ── */
  if (window.matchMedia('(pointer: fine)').matches) {
    $$('.project-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-8px) perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

})();

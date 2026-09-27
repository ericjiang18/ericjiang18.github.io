(() => {
  'use strict';

  const root = document.documentElement;
  const savePreference = (key, value) => {
    try { localStorage.setItem(key, value); } catch (error) { /* Storage is optional. */ }
  };

  const themeToggle = document.querySelector('.theme-toggle');
  const updateThemeLabel = () => {
    const label = `Switch to ${root.dataset.theme === 'dark' ? 'light' : 'dark'} theme`;
    themeToggle.setAttribute('aria-label', label);
    themeToggle.title = label;
  };
  updateThemeLabel();
  themeToggle.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    savePreference('eric-theme', root.dataset.theme);
    updateThemeLabel();
  });

  // Manual navigation keeps the requested first photo visible until a visitor acts.
  const gallery = document.querySelector('.profile-gallery');
  if (gallery) {
    const slides = [...gallery.querySelectorAll('.photo-slide')];
    const dots = [...gallery.querySelectorAll('.photo-dot')];
    const announcement = gallery.querySelector('.photo-announcement');
    let current = 0;

    const showPhoto = (index) => {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        slide.hidden = i !== current;
        slide.classList.toggle('is-active', i === current);
        dots[i].classList.toggle('is-active', i === current);
        dots[i].setAttribute('aria-pressed', String(i === current));
      });
      announcement.textContent = `Photo ${current + 1} of ${slides.length}`;
    };

    gallery.querySelector('.photo-previous').addEventListener('click', () => showPhoto(current - 1));
    gallery.querySelector('.photo-next').addEventListener('click', () => showPhoto(current + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => showPhoto(i)));
    gallery.addEventListener('keydown', (event) => {
      const destinations = { ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: slides.length - 1 };
      if (Object.prototype.hasOwnProperty.call(destinations, event.key)) {
        event.preventDefault();
        showPhoto(destinations[event.key]);
      }
    });

    const stage = gallery.querySelector('.photo-stage');
    let touchStart = null;
    stage.addEventListener('touchstart', (event) => {
      touchStart = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
    }, { passive: true });
    stage.addEventListener('touchend', (event) => {
      if (!touchStart || !event.changedTouches.length) return;
      const dx = event.changedTouches[0].clientX - touchStart.x;
      const dy = event.changedTouches[0].clientY - touchStart.y;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) showPhoto(current + (dx < 0 ? 1 : -1));
      touchStart = null;
    }, { passive: true });
    stage.addEventListener('touchcancel', () => { touchStart = null; }, { passive: true });
  }

  const wechatLink = document.querySelector('.wechat-link');
  const wechatDialog = document.querySelector('#wechat-dialog');
  wechatLink.addEventListener('click', (event) => {
    // The link opens the image directly if the dialog API is unavailable.
    if (typeof wechatDialog.showModal !== 'function' || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    wechatDialog.showModal();
    document.body.classList.add('modal-open');
  });
  wechatDialog.querySelector('.dialog-close').addEventListener('click', () => wechatDialog.close());
  wechatDialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    wechatLink.focus({ preventScroll: true });
  });
  wechatDialog.addEventListener('click', (event) => {
    const rect = wechatDialog.getBoundingClientRect();
    if (event.target === wechatDialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) {
      wechatDialog.close();
    }
  });

  const accentControl = document.querySelector('.accent-control');
  const accentToggle = document.querySelector('.accent-toggle');
  const accentOptions = document.querySelector('#accent-options');
  const swatches = [...accentOptions.querySelectorAll('[data-color]')];
  const updateSwatches = () => swatches.forEach((swatch) => swatch.setAttribute('aria-pressed', String(swatch.dataset.color === root.dataset.accent)));
  const setPaletteOpen = (open) => {
    accentOptions.hidden = !open;
    accentToggle.setAttribute('aria-expanded', String(open));
  };
  updateSwatches();
  accentToggle.addEventListener('click', () => {
    const open = accentOptions.hidden;
    setPaletteOpen(open);
    if (open) accentOptions.querySelector('[aria-pressed="true"]').focus();
  });
  swatches.forEach((swatch) => swatch.addEventListener('click', () => {
    root.dataset.accent = swatch.dataset.color;
    savePreference('eric-accent', root.dataset.accent);
    updateSwatches();
  }));
  document.addEventListener('click', (event) => {
    if (!accentControl.contains(event.target)) setPaletteOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !accentOptions.hidden) {
      setPaletteOpen(false);
      accentToggle.focus();
    }
  });
  accentControl.addEventListener('focusout', (event) => {
    if (!accentControl.contains(event.relatedTarget)) setPaletteOpen(false);
  });

  const progress = document.querySelector('.reading-progress');
  const header = document.querySelector('.site-header');
  const navLinks = [...document.querySelectorAll('.page-navigation a[href^="#"]')];
  const sections = navLinks.map((link) => document.querySelector(link.getAttribute('href')));
  let scheduled = false;
  const updateScroll = () => {
    const scrollable = root.scrollHeight - window.innerHeight;
    const fraction = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    progress.style.transform = `scaleX(${fraction})`;
    let activeIndex = 0;
    sections.forEach((section, i) => {
      if (section && section.getBoundingClientRect().top <= header.offsetHeight + 80) activeIndex = i;
    });
    // The last section can reach the page bottom before reaching the sticky header.
    if (scrollable > 0 && fraction >= 0.999) activeIndex = navLinks.length - 1;
    navLinks.forEach((link, i) => {
      link.classList.toggle('active', i === activeIndex);
      if (i === activeIndex) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    scheduled = false;
  };
  const requestScrollUpdate = () => {
    if (!scheduled) {
      scheduled = true;
      window.requestAnimationFrame(updateScroll);
    }
  };
  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  window.addEventListener('resize', requestScrollUpdate);
  window.addEventListener('load', updateScroll);
  updateScroll();
})();

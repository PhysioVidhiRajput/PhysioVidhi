/* =========================================
   DR. VIDHI RAJPUT – PHYSIOTHERAPY WEBSITE
   Main Script
   ========================================= */

'use strict';

/* ---- Loader ---- */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
    // Trigger hero animations
    document.querySelectorAll('.hero .animate-fade-left, .hero .animate-fade-right').forEach(el => {
      el.classList.add('in-view');
    });
    // Start counters
    startCounters();
  }, 2200);
});

/* ---- Scroll Progress Bar ---- */
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (scrollProgress) scrollProgress.style.width = pct + '%';
}, { passive: true });

/* ---- Sticky Navbar ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 80);
  }
}, { passive: true });

/* ---- Hamburger Menu ---- */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });
  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });
  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    }
  });
}

/* ---- Scroll Reveal (IntersectionObserver) ---- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      // Animate skill bars when visible
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.w + '%';
      });
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll(
  '.reveal-up, .reveal-left, .reveal-right, .why-card, .service-card, .skill-bar-card, .cert-badge, .online-card, .testi-card, .gallery-grid, .faq-list'
).forEach(el => revealObserver.observe(el));

/* ---- Counter Animation ---- */
function startCounters() {
  document.querySelectorAll('.counter').forEach(counter => {
    const target = parseInt(counter.dataset.target, 10);
    const duration = 1800;
    const step = Math.ceil(target / (duration / 16));
    let current = 0;
    const update = () => {
      current = Math.min(current + step, target);
      counter.textContent = current;
      if (current < target) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  });
}

/* ---- Button Ripple Effect ---- */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.ripple');
  if (!btn) return;
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2;
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;
  const ripple = document.createElement('span');
  ripple.className = 'ripple-effect';
  Object.assign(ripple.style, {
    width: size + 'px', height: size + 'px',
    left: x + 'px', top: y + 'px'
  });
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 700);
});

/* ---- FAQ Accordion ---- */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ---- Testimonials Slider ---- */
const testiTrack = document.getElementById('testiTrack');
const testiPrev = document.getElementById('testiPrev');
const testiNext = document.getElementById('testiNext');
const testiDots = document.getElementById('testiDots');

let testiIndex = 0;
let cardsPerView = 3;
let totalCards = 0;
let autoSlide;

function getCardsPerView() {
  if (window.innerWidth <= 768) return 1;
  if (window.innerWidth <= 900) return 2;
  return 3;
}

function buildDots() {
  if (!testiDots) return;
  testiDots.innerHTML = '';
  const totalDots = Math.ceil(totalCards / cardsPerView);
  for (let i = 0; i < totalDots; i++) {
    const dot = document.createElement('button');
    dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Slide ' + (i + 1));
    dot.addEventListener('click', () => goToSlide(i));
    testiDots.appendChild(dot);
  }
}

function updateDots() {
  if (!testiDots) return;
  const dots = testiDots.querySelectorAll('.testi-dot');
  dots.forEach((d, i) => d.classList.toggle('active', i === testiIndex));
}

function goToSlide(idx) {
  if (!testiTrack) return;
  const maxIndex = Math.ceil(totalCards / cardsPerView) - 1;
  testiIndex = Math.max(0, Math.min(idx, maxIndex));
  const cardWidth = testiTrack.querySelector('.testi-card')?.offsetWidth || 0;
  const gap = 24;
  testiTrack.style.transform = `translateX(-${testiIndex * (cardWidth + gap) * cardsPerView}px)`;
  updateDots();
}

function initSlider() {
  if (!testiTrack) return;
  cardsPerView = getCardsPerView();
  totalCards = testiTrack.querySelectorAll('.testi-card').length;
  testiIndex = 0;
  testiTrack.style.transform = 'translateX(0)';
  buildDots();
}

if (testiPrev) testiPrev.addEventListener('click', () => { goToSlide(testiIndex - 1); resetAutoSlide(); });
if (testiNext) testiNext.addEventListener('click', () => { goToSlide(testiIndex + 1); resetAutoSlide(); });

function resetAutoSlide() {
  clearInterval(autoSlide);
  autoSlide = setInterval(() => {
    const maxIndex = Math.ceil(totalCards / cardsPerView) - 1;
    goToSlide(testiIndex >= maxIndex ? 0 : testiIndex + 1);
  }, 5000);
}

window.addEventListener('resize', () => {
  initSlider();
  resetAutoSlide();
});

initSlider();
resetAutoSlide();

// Touch/swipe support for slider
let tsX = 0;
if (testiTrack) {
  testiTrack.addEventListener('touchstart', e => { tsX = e.touches[0].clientX; }, { passive: true });
  testiTrack.addEventListener('touchend', e => {
    const diff = tsX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goToSlide(diff > 0 ? testiIndex + 1 : testiIndex - 1);
      resetAutoSlide();
    }
  }, { passive: true });
}

/* ---- Skill Bars (also triggered by IntersectionObserver above) ---- */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.w + '%';
      });
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.skill-bar-card').forEach(c => skillObserver.observe(c));

/* ---- WhatsApp Appointment Booking ---- */
const bookBtn = document.getElementById('bookBtn');
if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const name    = document.getElementById('fullName')?.value.trim() || '—';
    const phone   = document.getElementById('phone')?.value.trim() || '—';
    const age     = document.getElementById('age')?.value.trim() || '—';
    const gender  = document.getElementById('gender')?.value || '—';
    const email   = document.getElementById('email')?.value.trim() || '—';
    const date    = document.getElementById('apptDate')?.value || '—';
    const time    = document.getElementById('apptTime')?.value || '—';
    const service = document.getElementById('service')?.value || '—';
    const problem = document.getElementById('problem')?.value.trim() || '—';
    const consultType = document.querySelector('input[name="consultType"]:checked')?.value || '—';

    if (!name || name === '—') { alert('Please enter your full name.'); return; }
    if (!phone || phone === '—') { alert('Please enter your phone number.'); return; }

    const msg = [
      'Hello Dr. Vidhi Rajput,',
      '',
      'I would like to book an appointment.',
      '',
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Age: ${age}`,
      `Gender: ${gender}`,
      `Email: ${email}`,
      `Service: ${service}`,
      `Consultation: ${consultType}`,
      `Preferred Date: ${date}`,
      `Preferred Time: ${time}`,
      `Problem: ${problem}`,
      '',
      'Please contact me. Thank you!'
    ].join('\n');

    const url = 'https://wa.me/919022166184?text=' + encodeURIComponent(msg);
    window.open(url, '_blank');
  });
}

/* ---- Scroll To Top ---- */
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
  if (scrollTopBtn) {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
  }
}, { passive: true });

if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---- Smooth scroll for anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = navbar ? navbar.offsetHeight + 16 : 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ---- Active nav link highlight ---- */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ---- Lazy load images ---- */
if ('loading' in HTMLImageElement.prototype) {
  // Native lazy loading already in HTML via loading="lazy"
} else {
  // Fallback for older browsers
  const lazyImgs = document.querySelectorAll('img[loading="lazy"]');
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) { img.src = img.dataset.src; delete img.dataset.src; }
        imgObserver.unobserve(img);
      }
    });
  });
  lazyImgs.forEach(img => imgObserver.observe(img));
}

/* ---- Parallax hero background orbs ---- */
window.addEventListener('mousemove', (e) => {
  const orb1 = document.querySelector('.orb1');
  const orb2 = document.querySelector('.orb2');
  if (!orb1 || !orb2) return;
  const x = (e.clientX / window.innerWidth - 0.5) * 30;
  const y = (e.clientY / window.innerHeight - 0.5) * 30;
  orb1.style.transform = `translate(${x}px, ${y}px)`;
  orb2.style.transform = `translate(${-x * 0.6}px, ${-y * 0.6}px)`;
}, { passive: true });

/* ---- Gallery image hover zoom (CSS handles it, but add loading class) ---- */
document.querySelectorAll('.gallery-item img').forEach(img => {
  img.addEventListener('load', () => img.style.opacity = '1');
  img.style.opacity = img.complete ? '1' : '0';
  img.style.transition = 'opacity 0.4s ease';
});

console.log('%c✅ Dr. Vidhi Rajput Physio Website Loaded', 'color:#009E9A;font-weight:bold;font-size:14px;');

const nav = document.querySelector('.site-nav');
const navToggle = document.querySelector('.nav-toggle');

navToggle?.addEventListener('click', () => {
  const isOpen = nav?.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(Boolean(isOpen)));
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

document.querySelectorAll('[data-carousel]').forEach((carousel) => {
  const wrap = carousel.closest('.carousel-wrap');
  const prev = wrap.querySelector('[data-prev]');
  const next = wrap.querySelector('[data-next]');
  let frame = null;

  const step = () => {
    const card = carousel.querySelector('figure');
    if (!card) return carousel.clientWidth * .9;
    const styles = window.getComputedStyle(carousel);
    const gap = parseFloat(styles.columnGap || styles.gap) || 0;
    return card.getBoundingClientRect().width + gap;
  };

  const updateControls = () => {
    const maxScroll = Math.max(0, carousel.scrollWidth - carousel.clientWidth);
    const atStart = carousel.scrollLeft <= 2;
    const atEnd = carousel.scrollLeft >= maxScroll - 2;

    if (prev) prev.disabled = atStart || maxScroll <= 2;
    if (next) next.disabled = atEnd || maxScroll <= 2;
  };

  const requestUpdate = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(updateControls);
  };

  prev?.addEventListener('click', () => carousel.scrollBy({ left: -step(), behavior: 'smooth' }));
  next?.addEventListener('click', () => carousel.scrollBy({ left: step(), behavior: 'smooth' }));
  carousel.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  carousel.querySelectorAll('img').forEach((image) => {
    image.addEventListener('load', requestUpdate, { once: true });
  });

  updateControls();
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .12 });

document.querySelectorAll('.case-card,.metric-card,.about-card,.award-grid img').forEach((el) => revealObserver.observe(el));

const projectLinks = [...document.querySelectorAll('.project-nav a')];
const projectSections = projectLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

const updateActiveProject = () => {
  const anchorLine = window.scrollY + window.innerHeight * .34;
  const current = projectSections.reduce((active, section) => {
    return section.offsetTop <= anchorLine ? section : active;
  }, projectSections[0]);

  projectLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current.id}`);
  });
};

if (projectSections.length) {
  updateActiveProject();
  window.addEventListener('scroll', updateActiveProject, { passive: true });
  window.addEventListener('resize', updateActiveProject);
}

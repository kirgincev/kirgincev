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
  const step = () => {
    const card = carousel.querySelector('figure');
    return card ? card.getBoundingClientRect().width + 16 : carousel.clientWidth * .9;
  };

  prev?.addEventListener('click', () => carousel.scrollBy({ left: -step(), behavior: 'smooth' }));
  next?.addEventListener('click', () => carousel.scrollBy({ left: step(), behavior: 'smooth' }));
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

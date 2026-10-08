// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Typing animation for the hero title
const typed = document.querySelector('.typed');
if (typed) {
  const words = typed.dataset.words.split('|');
  const caret = typed.nextElementSibling;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let wordIndex = 0;
  let text = words[0];
  let deleting = true;

  const tick = () => {
    caret.classList.add('typing');
    if (deleting) {
      text = text.slice(0, -1);
      if (!text) { deleting = false; wordIndex = (wordIndex + 1) % words.length; }
      typed.textContent = text;
      setTimeout(tick, text ? 45 : 300);
    } else {
      const next = words[wordIndex];
      text = next.slice(0, text.length + 1);
      typed.textContent = text;
      if (text === next) {
        deleting = true;
        caret.classList.remove('typing');
        setTimeout(tick, 2000);   // pause on the full title
      } else {
        setTimeout(tick, 85 + Math.random() * 60);
      }
    }
  };
  if (!reduceMotion) setTimeout(tick, 2600);
}

// Fade sections in as they scroll into view
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 70}ms`;
  revealObserver.observe(el);
});

// Show the floating dock once the hero cards scroll out of view
const dock = document.getElementById('dock');
const heroCards = document.querySelector('.hero-cards');
new IntersectionObserver(([entry]) => {
  dock.classList.toggle('show', !entry.isIntersecting && entry.boundingClientRect.top < 0);
}).observe(heroCards);

// Highlight the dock item for the section on screen
const dockLinks = [...dock.querySelectorAll('a')];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    dockLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main .section').forEach((s) => sectionObserver.observe(s));

// Popups: [data-open="id"] opens a <dialog>, [data-close] or a click on the backdrop closes it
document.querySelectorAll('[data-open]').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('dialog[open]').forEach((d) => d.close());
    document.getElementById(btn.dataset.open).showModal();
  });
});
document.querySelectorAll('dialog.modal').forEach((dialog) => {
  dialog.querySelectorAll('[data-close]').forEach((btn) => btn.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('click', (e) => {
    if (e.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    const outside = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    if (outside) dialog.close();
  });
});

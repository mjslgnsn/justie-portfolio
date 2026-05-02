/*=============== HOME REVEAL — VANILLA JS (no anime.js needed) ===============*/
/* Delays home animations until the loader finishes */
function homeReveal() {

   /* ── Easing functions (Original) ────────────────────────────────────── */
   function easeOutExpo(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }
   function easeOutBack(t) { const c = 2.70158; return 1 + c * Math.pow(t - 1, 3) + 1.70158 * Math.pow(t - 1, 2); }
   function easeInExpo(t)  { return t === 0 ? 0 : Math.pow(2, 10 * t - 10); }

   /* ── Core tween (Original) ─────────────────────────────────────────── */
   function tween({ target, props, duration, delay = 0, easing = easeOutExpo }) {
      return new Promise(resolve => {
         setTimeout(() => {
            let start = null;
            function step(ts) {
               if (!start) start = ts;
               const p  = Math.min((ts - start) / duration, 1);
               const e  = easing(p);
               let tfm  = '';
               for (const key in props) {
                  const [from, to] = props[key];
                  const fN = parseFloat(from), tN = parseFloat(to);
                  const unit = String(from).replace(/[-\d.]/g, '') || '';
                  const val  = fN + (tN - fN) * e;
                  if (key === 'opacity')     target.style.opacity   = val;
                  else if (key === 'translateY') tfm += `translateY(${val}${unit}) `;
                  else if (key === 'translateX') tfm += `translateX(${val}${unit}) `;
               }
               if (tfm) target.style.transform = tfm.trim();
               if (p < 1) requestAnimationFrame(step);
               else resolve();
            }
            requestAnimationFrame(step);
         }, delay);
      });
   }


   /* ── Stagger helper ─────────────────────────────────────────────────── */
   function stagger({ targets, props, duration, startDelay = 0, staggerMs = 48, easing = easeOutExpo, reverse = false }) {
      const els = Array.isArray(targets) ? targets : Array.from(document.querySelectorAll(targets));
      const ordered = reverse ? [...els].reverse() : els;
      return Promise.all(ordered.map((el, i) =>
         tween({ target: el, props, duration, delay: startDelay + i * staggerMs, easing })
      ));
   }

   /* ── Wrap each character in a span ─────────────────────────────────── */
   function wrapChars(el, cls) {
      const text = el.textContent;
      el.innerHTML = text.split('').map(ch =>
         `<span class="${cls}" style="display:inline-block">${ch === ' ' ? '&nbsp;' : ch}</span>`
      ).join('');
      return Array.from(el.querySelectorAll('.' + cls));
   }

   /* ── Wrap text content in an inner span ────────────────────────────── */
   function wrapInner(el) {
      const text = el.textContent;
      el.textContent = '';
      const inner = document.createElement('span');
      inner.style.cssText = 'display:block';
      inner.textContent = text;
      el.appendChild(inner);
      return inner;
   }

   /* ══════════════════════════════════════════════════════════════════════
      1. "Hello, I'm" — typewriter loop
   ══════════════════════════════════════════════════════════════════════ */
   const greetingEl = document.querySelector('.home__greeting');
   if (greetingEl) {
      const greetingText = greetingEl.textContent.trim();
      greetingEl.textContent = '';
      greetingEl.style.opacity = '1';

      function typeGreeting(delay) {
         return new Promise(resolve => {
            setTimeout(() => {
               let i = 0;
               greetingEl.textContent = '';
               const interval = setInterval(() => {
                  greetingEl.textContent += greetingText[i];
                  i++;
                  if (i >= greetingText.length) {
                     clearInterval(interval);
                     resolve();
                  }
               }, 60); // typing speed per character
            }, delay);
         });
      }

      function eraseGreeting() {
         return new Promise(resolve => {
            const interval = setInterval(() => {
               const t = greetingEl.textContent;
               if (t.length === 0) { clearInterval(interval); resolve(); return; }
               greetingEl.textContent = t.slice(0, -1);
            }, 35); // erase speed
         });
      }

      // Start typing after short delay then loop
      typeGreeting(200).then(async function loop() {
         await new Promise(r => setTimeout(r, 2800));
         await eraseGreeting();
         await new Promise(r => setTimeout(r, 400));
         await typeGreeting(0);
         loop();
      });
   }

   /* ══════════════════════════════════════════════════════════════════════
      2. Name lines — slide up (MJ / Lagnason)
   ══════════════════════════════════════════════════════════════════════ */
   document.querySelectorAll('.home__name-line').forEach((line, i) => {
      line.style.overflow = 'hidden';
      const inner = wrapInner(line);
      inner.style.transform = 'translateY(105%)';
      tween({
         target: inner,
         props: { translateY: ['105%', '0%'] },
         duration: 1000,
         delay: 400 + i * 150,
         easing: easeOutExpo,
      });
   });

   /* ══════════════════════════════════════════════════════════════════════
      3. "Creative" label — fade + slide
   ══════════════════════════════════════════════════════════════════════ */
   const splitEl = document.querySelector('.home__split');
   if (splitEl) {
      splitEl.style.opacity = '0';
      tween({ target: splitEl, props: { opacity: [0, 1], translateY: [10, 0] }, duration: 800, delay: 600 });
   }

   /* ══════════════════════════════════════════════════════════════════════
      4. .home__profession wrapper — instant reveal
   ══════════════════════════════════════════════════════════════════════ */
   const profEl = document.querySelector('.home__profession');
   if (profEl) {
      profEl.style.opacity = '0';
      setTimeout(() => { profEl.style.opacity = '1'; }, 680);
   }

   /* ══════════════════════════════════════════════════════════════════════
      5. "Developer" — ascend (slide up) loop animation
      FIX: -webkit-text-fill-color:transparent blocks visibility of spans,
           so we animate the parent overflow clip instead of individual chars
   ══════════════════════════════════════════════════════════════════════ */
   const dev1El = document.querySelector('.home__profession-1');
   if (dev1El) {
      // Wrap in a clip container so gradient text stays intact
      const clipWrap = document.createElement('span');
      clipWrap.style.cssText = 'display:block; overflow:hidden;';
      const textSpan = document.createElement('span');
      textSpan.style.cssText = 'display:block;';
      textSpan.textContent = dev1El.textContent;

      // Copy gradient styles from parent to textSpan so text is visible
      textSpan.style.background = 'linear-gradient(to bottom, var(--first-color-light) 0%, var(--title-color) 100%)';
      textSpan.style.webkitBackgroundClip = 'text';
      textSpan.style.backgroundClip = 'text';
      textSpan.style.webkitTextFillColor = 'transparent';
      textSpan.style.fontSize = 'inherit';
      textSpan.style.fontFamily = 'inherit';
      textSpan.style.fontWeight = 'inherit';

      // Clear parent gradient (prevent double-clip conflict)
      dev1El.style.background = 'none';
      dev1El.style.webkitTextFillColor = 'unset';
      dev1El.style.color = 'transparent';
      dev1El.textContent = '';

      clipWrap.appendChild(textSpan);
      dev1El.appendChild(clipWrap);

      function ascendIn(startDelay) {
         textSpan.style.transform = 'translateY(110%)';
         textSpan.style.opacity = '0';
         return tween({
            target: textSpan,
            props: { translateY: ['110%', '0%'], opacity: [0, 1] },
            duration: 700,
            delay: startDelay,
            easing: easeOutBack,
         });
      }

      function ascendOut() {
         return tween({
            target: textSpan,
            props: { translateY: ['0%', '-110%'], opacity: [1, 0] },
            duration: 500,
            delay: 0,
            easing: easeInExpo,
         });
      }

      ascendIn(750).then(async function loop() {
         await new Promise(r => setTimeout(r, 3200));
         await ascendOut();
         await new Promise(r => setTimeout(r, 180));
         await ascendIn(0);
         loop();
      });
   }

   /* ══════════════════════════════════════════════════════════════════════
      6. "& Designer" — same looping ascend as Developer (in sync)
   ══════════════════════════════════════════════════════════════════════ */
   const dev2El = document.querySelector('.home__profession-2');
   if (dev2El) {
      dev2El.style.overflow = 'hidden';
      const inner2 = wrapInner(dev2El);
      inner2.style.transform = 'translateY(110%)';
      inner2.style.opacity = '0';

      function ascend2In(startDelay) {
         inner2.style.transform = 'translateY(110%)';
         inner2.style.opacity = '0';
         return tween({
            target: inner2,
            props: { translateY: ['110%', '0%'], opacity: [0, 1] },
            duration: 700,
            delay: startDelay,
            easing: easeOutBack,
         });
      }

      function ascend2Out() {
         return tween({
            target: inner2,
            props: { translateY: ['0%', '-110%'], opacity: [1, 0] },
            duration: 500,
            delay: 0,
            easing: easeInExpo,
         });
      }

      // Start slightly after Developer (1000ms) then loop in sync
      ascend2In(1000).then(async function loop() {
         await new Promise(r => setTimeout(r, 3200)); // stay in sync with Developer
         await ascend2Out();
         await new Promise(r => setTimeout(r, 180));
         await ascend2In(0);
         loop();
      });
   }

   /* ══════════════════════════════════════════════════════════════════════
      7. Profile image — fade + scale up from center
   ══════════════════════════════════════════════════════════════════════ */
   const imgWrapper = document.querySelector('.home__img-wrapper');
   if (imgWrapper) {
      imgWrapper.style.opacity = '0';
      imgWrapper.style.transform = 'scale(0.88) translateY(24px)';
      imgWrapper.style.transition = 'opacity 900ms cubic-bezier(0.22,1,0.36,1), transform 900ms cubic-bezier(0.22,1,0.36,1)';
      setTimeout(() => {
         imgWrapper.style.opacity = '1';
         imgWrapper.style.transform = 'scale(1) translateY(0)';
      }, 500);
   }

   /* ══════════════════════════════════════════════════════════════════════
      8. Social icons — stagger slide in from left
   ══════════════════════════════════════════════════════════════════════ */
   const socialLinks = Array.from(document.querySelectorAll('.home__social-link'));
   socialLinks.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateX(-18px)'; });
   stagger({
      targets: socialLinks,
      props: { opacity: [0, 1], translateX: [-18, 0] },
      duration: 600,
      startDelay: 1050,
      staggerMs: 80,
      easing: easeOutBack,
   });

   /* ══════════════════════════════════════════════════════════════════════
      9. Resume button — fade + slide up
   ══════════════════════════════════════════════════════════════════════ */
   const cvEl = document.querySelector('.home__cv');
   if (cvEl) {
      cvEl.style.opacity = '0';
      tween({ target: cvEl, props: { opacity: [0, 1], translateY: [8, 0] }, duration: 700, delay: 1350 });
   }

}

/* Run after loader fires 'loaderDone', or immediately if loader is absent */
if (document.getElementById('mj-loader')) {
   window.addEventListener('loaderDone', homeReveal, { once: true });
} else {
   homeReveal();
}


/*=============== SWIPER PROJECTS ===============*/
if (typeof Swiper !== 'undefined') {
   // Destroy any existing instance first to avoid double-init
   const swiperEl = document.querySelector('.projects__swiper');
   if (swiperEl && swiperEl.swiper) swiperEl.swiper.destroy(true, true);

   const swiper = new Swiper('.projects__swiper', {
      loop: true,
      grabCursor: true,
      slidesPerView: 1,
      spaceBetween: 24,
      observer: true,
      observeParents: true,
      resizeObserver: true,
      watchSlidesProgress: true,
      pagination: {
         el: '.swiper-pagination',
         clickable: true,
         dynamicBullets: false,
      },
      breakpoints: {
         640:  { slidesPerView: 1.3 },
         900:  { slidesPerView: 1.6 },
         1150: { slidesPerView: 2 },
      },
      on: {
         init: function () {
            // Force correct slide positions after init
            this.update();
         },
      },
   });

   // Also update after all page assets are loaded
   window.addEventListener('load', () => swiper.update());
}


/*=============== WORK TABS ===============*/
(function workTabs() {
   const buttons  = document.querySelectorAll('.work__button');
   const contents = document.querySelectorAll('.work__content');
   buttons.forEach(btn => {
      btn.addEventListener('click', () => {
         const target = btn.dataset.target;
         // Update active button
         buttons.forEach(b => b.classList.remove('work__button--active'));
         btn.classList.add('work__button--active');
         // Show correct content
         contents.forEach(c => c.classList.remove('work__content--active'));
         const targetEl = document.getElementById('work-' + target);
         if (targetEl) targetEl.classList.add('work__content--active');
      });
   });
})();


/*=============== SERVICES ACCORDION ===============*/
(function servicesAccordion() {
   const items = document.querySelectorAll('.services__item');
   items.forEach(item => {
      const header = item.querySelector('.services__header');
      if (!header) return;
      header.addEventListener('click', () => {
         const isOpen = item.classList.contains('services__item--open');
         items.forEach(i => i.classList.remove('services__item--open'));
         if (!isOpen) item.classList.add('services__item--open');
      });
   });
   if (items.length) items[0].classList.add('services__item--open');
})();


/*=============== COPY EMAIL IN CONTACT ===============*/
(function copyEmail() {
   const btn     = document.getElementById('contact-copy');
   const emailEl = document.getElementById('contact-email');
   if (!btn || !emailEl) return;
   const email = emailEl.textContent.trim();
   let timeout;
   btn.addEventListener('click', () => {
      navigator.clipboard.writeText(email).then(() => {
         emailEl.textContent = 'Email copied!';
         emailEl.classList.add('contact__email--copied');
         clearTimeout(timeout);
         timeout = setTimeout(() => {
            emailEl.textContent = email;
            emailEl.classList.remove('contact__email--copied');
         }, 2500);
      }).catch(() => {
         const ta = document.createElement('textarea');
         ta.value = email;
         ta.style.cssText = 'position:fixed;opacity:0';
         document.body.appendChild(ta);
         ta.select();
         document.execCommand('copy');
         ta.remove();
         emailEl.textContent = 'Email copied!';
         emailEl.classList.add('contact__email--copied');
         clearTimeout(timeout);
         timeout = setTimeout(() => {
            emailEl.textContent = email;
            emailEl.classList.remove('contact__email--copied');
         }, 2500);
      });
   });
})();


/*=============== CURRENT YEAR OF THE FOOTER ===============*/
(function footerYear() {
   const el = document.querySelector('.footer__year');
   if (el) el.textContent = new Date().getFullYear();
})();


/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
(function activeLinks() {
   const sections = document.querySelectorAll('section[id]');
   window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      sections.forEach(sec => {
         const top    = sec.offsetTop - 120;
         const height = sec.offsetHeight;
         const id     = sec.getAttribute('id');
         const link   = document.querySelector(`.nav__link[href="#${id}"]`);
         if (!link) return;
         link.classList.toggle('active-link', scrollY >= top && scrollY < top + height);
      });
   }, { passive: true });
})();


/*=============== HEADER SCROLL CLASS ===============*/
(function headerScroll() {
   const header = document.getElementById('header');
   if (!header) return;
   window.addEventListener('scroll', () => {
      header.classList.toggle('scroll-header', window.scrollY > 40);
   }, { passive: true });
})();


/*=============== NAV MENU (mobile) ===============*/
(function navMenu() {
   const toggle = document.getElementById('nav-toggle');
   const close  = document.getElementById('nav-close');
   const menu   = document.getElementById('nav-menu');
   if (!menu) return;
   toggle?.addEventListener('click', () => menu.classList.add('nav__menu--open'));
   close?.addEventListener('click',  () => menu.classList.remove('nav__menu--open'));
   document.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => menu.classList.remove('nav__menu--open'));
   });
})();


/*=============== CUSTOM CURSOR ===============*/
(function initCursor() {
   const dot     = document.querySelector('.cursor__dot');
   const outline = document.querySelector('.cursor__outline');
   if (!dot || !outline) return;
   let mx = 0, my = 0, ox = 0, oy = 0;
   window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
   });
   (function raf() {
      ox += (mx - ox) * 0.13;
      oy += (my - oy) * 0.13;
      outline.style.left = ox + 'px';
      outline.style.top  = oy + 'px';
      requestAnimationFrame(raf);
   })();
   document.querySelectorAll('a, button, .home__social-link').forEach(el => {
      el.addEventListener('mouseenter', () => {
         dot.style.cssText     += '; width:14px; height:14px; background-color:var(--first-color-light)';
         outline.style.cssText += '; width:54px; height:54px; border-color:hsla(var(--hue),60%,74%,.35)';
      });
      el.addEventListener('mouseleave', () => {
         dot.style.width = ''; dot.style.height = ''; dot.style.backgroundColor = '';
         outline.style.width = ''; outline.style.height = ''; outline.style.borderColor = '';
      });
   });
})();


/*=============== SCROLL REVEAL ANIMATION ===============*/
if (typeof ScrollReveal !== 'undefined') {
   const sr = ScrollReveal({
      origin:   'bottom',
      distance: '48px',
      duration: 900,
      delay:    200,
      easing:   'ease',
      reset:    false,
   });
   sr.reveal('.section__title',     { delay: 100 });
   sr.reveal('.about__img-wrapper', { origin: 'left',  delay: 200 });
   sr.reveal('.about__data',        { origin: 'right', delay: 300 });
   // NOTE: .projects__card removed — Swiper clones break ScrollReveal
   // NOTE: .work__item removed — display:none tabs break ScrollReveal
   sr.reveal('.services__item',     { interval: 100 });
   sr.reveal('.contact__left',      { origin: 'left',  delay: 200 });
   sr.reveal('.contact__right',     { origin: 'right', delay: 300 });
}


/*=============== WORK TABS — RE-REVEAL ON CLICK ===============*/
/* 
   ScrollReveal hides elements in display:none containers with opacity:0.
   We fix this by NOT using ScrollReveal on .work__item at all,
   and instead using a simple CSS transition triggered on tab switch.
*/
(function workTabsReveal() {
   // Make all work items visible immediately (no SR hiding)
   document.querySelectorAll('.work__item').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
   });

   // Animate items — reset first, then ascend with stagger
   function animateItems(container) {
      const items = container.querySelectorAll('.work__item');

      // Step 1: instantly set all to hidden/below
      items.forEach(item => {
         item.style.transition = 'none';
         item.style.opacity    = '0';
         item.style.transform  = 'translateY(48px)';
      });

      // Step 2: on next frame, apply transition and ascend each with stagger
      requestAnimationFrame(() => {
         items.forEach((item, i) => {
            item.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
            setTimeout(() => {
               item.style.opacity   = '1';
               item.style.transform = 'translateY(0)';
            }, 100 * i);
         });
      });
   }

   // Animate the initially active tab when the work section scrolls into view
   const workSection = document.getElementById('work');
   const activeContent = document.querySelector('.work__content--active');

   if (workSection && activeContent) {
      let triggered = false;
      const sectionObserver = new IntersectionObserver((entries) => {
         entries.forEach(entry => {
            if (entry.isIntersecting && !triggered) {
               triggered = true;
               setTimeout(() => animateItems(activeContent), 200);
               sectionObserver.disconnect();
            }
         });
      }, { threshold: 0.1 });
      sectionObserver.observe(workSection);
   }

   // Re-animate when switching tabs
   document.querySelectorAll('.work__button').forEach(btn => {
      btn.addEventListener('click', () => {
         const targetId = 'work-' + btn.dataset.target;
         const targetEl = document.getElementById(targetId);
         if (targetEl) animateItems(targetEl);
      });
   });
})();


/*=============== SCROLL ASCEND — PROJECTS & WORK ===============*/
(function scrollAscend() {

   // Generic ascend-on-scroll using IntersectionObserver
   function observeAscend(selector, { stagger = 0, delay = 0, once = true } = {}) {
      const els = Array.from(document.querySelectorAll(selector));
      if (!els.length) return;

      // Set initial hidden state
      els.forEach(el => {
         el.style.opacity    = '0';
         el.style.transform  = 'translateY(48px)';
         el.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
      });

      const observer = new IntersectionObserver((entries) => {
         entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const el    = entry.target;
            const index = els.indexOf(el);
            const wait  = delay + (stagger ? index * stagger : 0);

            setTimeout(() => {
               el.style.opacity   = '1';
               el.style.transform = 'translateY(0)';
            }, wait);

            if (once) observer.unobserve(el);
         });
      }, { threshold: 0.15 });

      els.forEach(el => observer.observe(el));
   }

   /* ── Projects section title ── */
   observeAscend('#projects .section__title', { delay: 0 });

   /* ── Project cards (Swiper slides — only real ones, not clones) ── */
   // We target the original slides only (not swiper-generated clones)
   const projectCards = Array.from(
      document.querySelectorAll('.projects__swiper .swiper-slide:not(.swiper-slide-duplicate)')
   );
   projectCards.forEach(el => {
      el.style.opacity    = '0';
      el.style.transform  = 'translateY(48px)';
      el.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
   });

   const projectObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
         if (!entry.isIntersecting) return;
         setTimeout(() => {
            entry.target.style.opacity   = '1';
            entry.target.style.transform = 'translateY(0)';
         }, 100);
         projectObserver.unobserve(entry.target);
      });
   }, { threshold: 0.1 });

   projectCards.forEach(el => projectObserver.observe(el));

   /* ── Work section title ── */
   observeAscend('#work .section__title', { delay: 0 });

   /* ── Work tabs buttons ── */
   observeAscend('.work__tabs', { delay: 100 });

})();

/*=============== LICENSES — SEE MORE / SEE LESS TOGGLE ===============*/
(function licensesToggle() {
   const btn     = document.getElementById('licenses-see-more');
   const hidden  = document.querySelectorAll('.license__card--hidden');
   if (!btn || !hidden.length) return;

   btn.addEventListener('click', () => {
      const isOpen = btn.classList.contains('licenses__see-more--open');

      hidden.forEach((card, i) => {
         if (!isOpen) {
            // Reveal — stagger each card
            card.style.display     = 'flex';
            card.style.opacity     = '0';
            card.style.transform   = 'translateY(20px)';
            card.style.transition  = 'none';
            requestAnimationFrame(() => {
               setTimeout(() => {
                  card.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
                  card.style.opacity    = '1';
                  card.style.transform  = 'translateY(0)';
               }, i * 60);
            });
         } else {
            // Hide — fade out simultaneously
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity    = '0';
            card.style.transform  = 'translateY(10px)';
            setTimeout(() => {
               card.style.display = 'none';
               card.style.opacity = '';
               card.style.transform = '';
            }, 320);
         }
      });

      btn.classList.toggle('licenses__see-more--open', !isOpen);
      btn.querySelector('.licenses__see-more-text').textContent = isOpen
         ? 'See all 12 credentials'
         : 'See less';
   });
})();


/*=============== CERTIFICATE MODAL ===============*/
(function certModal() {
   const modal    = document.getElementById('cert-modal');
   const backdrop = document.getElementById('cert-modal-backdrop');
   const closeBtn = document.getElementById('cert-modal-close');
   const imgEl    = document.getElementById('cert-modal-img');
   const labelEl  = document.getElementById('cert-modal-label');
   const placeholder = document.getElementById('cert-modal-placeholder');
   if (!modal) return;

   // Map cert image src to a Credly verify URL (adjust per card if needed)
   const verifyMap = {
      'cert-cythreat': 'https://www.credly.com/badges/7cf11f83-f2e8-4ffe-8ce6-cd6e5f50d023/public_url',
      'cert-ic3':      'https://www.credly.com/badges/90325014-4079-4415-9b4d-7dd313821e42/public_url',
      'cert-cyber':    'https://www.credly.com/badges/2857e29d-1f39-492a-83d5-7fe2868421da/public_url',
      'cert-softdev':  'https://www.credly.com/badges/82cddf04-286c-4246-845d-5fdb4c0e2a81/public_url',
      'cert-devcon':   'https://www.credly.com/badges/d9885a42-82dc-49d6-bc6c-5b146b7016ac/public_url',
      'cert-netsec':   'https://www.credly.com/badges/8adbcbd8-4c4b-4a12-b8b0-7109a5ff90ac/public_url',
      'cert-asso':     'https://www.credly.com/badges/bd54501f-33bc-4235-96b3-13b7069f6d79/public_url',
      'cert-excel':    'https://www.credly.com/badges/f8ea98d0-7459-494a-b17a-d64b356cff5d/public_url',
      'cert-ppt':      'https://www.credly.com/badges/9d4beeeb-8274-4618-b00e-64f80a7bbae0/public_url',
      'cert-word':     'https://www.credly.com/badges/0360c26a-b1b6-4e07-b041-84c4fe9a3e1d/public_url',
      'cert-pmi':      'https://www.credly.com/badges/7a32663f-62ec-4971-a6c7-46b1dfa4f371/public_url',
      'cert-googleads':'#',
   };

   function openModal(card) {
      const imgSrc   = card.dataset.certImg   || '';
      const title    = card.dataset.certTitle || '';

      labelEl.textContent = title;

      // Try loading the cert image
      if (imgSrc) {
         imgEl.onload  = () => { imgEl.style.display = 'block'; placeholder.style.display = 'none'; };
         imgEl.onerror = () => { imgEl.style.display = 'none';  placeholder.style.display = 'flex'; };
         imgEl.src = imgSrc;
      } else {
         imgEl.style.display = 'none';
         placeholder.style.display = 'flex';
      }

      // Verify link
      const verifyEl = document.getElementById('cert-modal-verify');
      if (verifyEl) {
         const key = imgSrc.split('/').pop().replace('.png', '');
         const url = verifyMap[key] || '#';
         verifyEl.href = url;
         verifyEl.style.display = url === '#' ? 'none' : 'inline-flex';
      }

      modal.classList.add('cert-modal--open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
   }

   function closeModal() {
      modal.classList.remove('cert-modal--open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      // reset after transition
      setTimeout(() => { imgEl.src = ''; }, 350);
   }

   // Delegate click on all credential buttons
   document.addEventListener('click', e => {
      const btn = e.target.closest('.license__credential-btn');
      if (btn) {
         const card = btn.closest('.license__card');
         if (card) openModal(card);
      }
   });

   backdrop?.addEventListener('click', closeModal);
   closeBtn?.addEventListener('click',  closeModal);
   document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeModal();
   });
})();


/*=============== SKILL MATRIX — ANIMATE BARS ON SCROLL ===============*/
(function skillMatrixBars() {
   const fills = document.querySelectorAll('.skillmatrix__fill');
   if (!fills.length) return;

   const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
         if (entry.isIntersecting) {
            const fill = entry.target;
            // Width is set via CSS custom property in HTML
            const w = fill.style.getPropertyValue('--skill-w') || '0%';
            // Reset then animate
            fill.style.width = '0%';
            requestAnimationFrame(() => {
               setTimeout(() => { fill.style.width = w; }, 80);
            });
            observer.unobserve(fill);
         }
      });
   }, { threshold: 0.2 });

   fills.forEach(f => observer.observe(f));

   // Also animate group cards on scroll
   const groups = document.querySelectorAll('.skillmatrix__group');
   groups.forEach((g, i) => {
      g.style.opacity   = '0';
      g.style.transform = 'translateY(36px)';
      g.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
   });

   const groupObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
         if (!entry.isIntersecting) return;
         const g = entry.target;
         const i = Array.from(groups).indexOf(g);
         setTimeout(() => {
            g.style.opacity   = '1';
            g.style.transform = 'translateY(0)';
         }, i * 80);
         groupObserver.unobserve(g);
      });
   }, { threshold: 0.1 });

   groups.forEach(g => groupObserver.observe(g));
})();


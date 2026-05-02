/* =============================================
   BLOG ENTRY — Shared JS
   All 8 blog pages load this script.
   Related entries are generated automatically
   based on the current page's filename.
   ============================================= */

// ── Registry of all blog entries ─────────────────────────────────────────────
const ALL_ENTRIES = [
  {
    file: 'blog-2026-internship.html',
    date: 'April 2026',
    category: 'life',
    title: 'JG Worldwide Internship — Stepping Into the Real World',
    badge: '<i class="ri-briefcase-line"></i> Life',
    badgeClass: 'badge--life-sm'
  },
  {
    file: 'blog-2026-graduation.html',
    date: '2026',
    category: 'milestone',
    title: 'Starting Again, But Stronger',
    badge: '<i class="ri-graduation-cap-line"></i> Milestone',
    badgeClass: 'badge--milestone-sm'
  },
  {
    file: 'blog-2025-life.html',
    date: '2025',
    category: 'life',
    title: 'Carrying More Than I Thought I Could',
    badge: '<i class="ri-heart-line"></i> Life',
    badgeClass: 'badge--life-sm'
  },
  {
    file: 'blog-2025-gawad.html',
    date: '2025',
    category: 'milestone',
    title: 'Most Active Governance Awardee — Gawad Batang Bayani 2025',
    badge: '<i class="ri-trophy-line"></i> Milestone',
    badgeClass: 'badge--milestone-sm'
  },
  {
    file: 'blog-2025-dost.html',
    date: '2025',
    category: 'milestone',
    title: '1st Place — DOST Startup Incubation',
    badge: '<i class="ri-award-line"></i> Milestone',
    badgeClass: 'badge--milestone-sm'
  },
  {
    file: 'blog-2024-life.html',
    date: '2024',
    category: 'life',
    title: 'Learning to Show Up',
    badge: '<i class="ri-seedling-line"></i> Life',
    badgeClass: 'badge--life-sm'
  },
  {
    file: 'blog-2023-life.html',
    date: '2023',
    category: 'life',
    title: 'Trying, Even When I\'m Not Ready',
    badge: '<i class="ri-door-open-line"></i> Life',
    badgeClass: 'badge--life-sm'
  },
  {
    file: 'blog-2023-milestone.html',
    date: '2023',
    category: 'milestone',
    title: 'Making It Through',
    badge: '<i class="ri-checkbox-circle-line"></i> Milestone',
    badgeClass: 'badge--milestone-sm'
  }
];

// ── Auto-build Related Entries ────────────────────────────────────────────────
function buildRelatedEntries() {
  const container = document.getElementById('relatedGrid');
  if (!container) return;

  // Detect current page filename
  const currentFile = window.location.pathname.split('/').pop() || '';

  // Find current entry index
  const currentIndex = ALL_ENTRIES.findIndex(e => e.file === currentFile);
  const current = ALL_ENTRIES[currentIndex] ?? null;

  // Pick related: prefer same category (excluding self), then others, max 3
  const sameCategory = ALL_ENTRIES.filter(e =>
    e.file !== currentFile && current && e.category === current.category
  );
  const otherCategory = ALL_ENTRIES.filter(e =>
    e.file !== currentFile && current && e.category !== current.category
  );

  // Merge: same-category first, fill rest with others, slice to 3
  const picks = [...sameCategory, ...otherCategory].slice(0, 3);

  // If nothing found (e.g. only 1 entry total), hide section
  if (picks.length === 0) {
    const section = document.querySelector('.related-section');
    if (section) section.style.display = 'none';
    return;
  }

  container.innerHTML = picks.map(entry => `
    <a href="${entry.file}" class="related-card">
      <div class="related-card__meta">
        <span class="related-card__date">${entry.date}</span>
        <span class="related-badge ${entry.badgeClass}">${entry.badge}</span>
      </div>
      <div class="related-card__title">${entry.title}</div>
    </a>
  `).join('');
}

// ── Reading progress bar ──────────────────────────────────────────────────────
function initProgressBar() {
  const bar = document.getElementById('progressBar');
  const btn = document.getElementById('scrollTop');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = scrolled + '%';
    if (btn) {
      if (window.scrollY > 300) btn.classList.add('show');
      else btn.classList.remove('show');
    }
  });
}

// ── Animate skill progress bars on scroll ────────────────────────────────────
function initSkillBars() {
  const section = document.getElementById('progressSection');
  if (!section) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.progress-fill').forEach(fill => {
          setTimeout(() => { fill.style.width = fill.dataset.target + '%'; }, 200);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(section);
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initProgressBar();
  initSkillBars();
  buildRelatedEntries();
});

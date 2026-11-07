const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Catalogue filtering and search
let currentCategory = 'Semua', searchQuery = '';

function filterThemes(category) {
  currentCategory = category;
  document.querySelectorAll('.filter-btn').forEach((button) => {
    button.setAttribute('aria-pressed', button.dataset.category === category);
  });
  applyFilters();
}

function handleSearch(query) {
  searchQuery = query.toLowerCase().trim();
  const clearBtn = document.getElementById('clear-search');
  clearBtn.classList.toggle('hidden', searchQuery.length === 0);
  applyFilters();
}

function clearSearch() {
  document.getElementById('theme-search').value = '';
  searchQuery = '';
  document.getElementById('clear-search').classList.add('hidden');
  applyFilters();
  document.getElementById('theme-search').focus();
}

function scrollToSearch() {
  document.getElementById('theme-search').focus({ preventScroll: true });
  document.getElementById('katalog-grid').scrollIntoView({ behavior: reduceMotion.matches ? 'instant' : 'smooth' });
}

window.addEventListener('keydown', (e) => {
  if (document.getElementById('theme-search') && e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey && !e.isComposing &&
      !document.querySelector('#preview-modal[open]') &&
      !e.target.closest('input, textarea, select, [contenteditable]')) {
    e.preventDefault();
    scrollToSearch();
  }
});

function applyFilters() {
  const cards = document.querySelectorAll('.theme-card');
  let visibleCount = 0;

  cards.forEach(card => {
    const cat = card.getAttribute('data-category') || '';
    const title = (card.getAttribute('data-title') || '').toLowerCase();
    const matchesCategory = currentCategory === 'Semua' || cat.includes(currentCategory);
    const matchesSearch = !searchQuery || title.includes(searchQuery) || cat.toLowerCase().includes(searchQuery);

    if (matchesCategory && matchesSearch) {
      card.classList.remove('hidden');
      visibleCount++;
    } else {
      card.classList.add('hidden');
    }
  });

  document.getElementById('no-results').classList.toggle('hidden', visibleCount > 0);
}

const previewDialog = document.getElementById('preview-modal');

// Preview dialog
function openPreviewModal(title, imageSrc, category, description) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-badge').textContent = category;
  const image = document.getElementById('modal-image');
  image.src = imageSrc;
  image.alt = `Pratinjau desain ${title}`;
  document.getElementById('modal-desc').textContent = description;

  const waMessage = encodeURIComponent(`Halo Tata Digital, saya tertarik dengan desain portofolio "${title}". Bisa kita diskusikan untuk proyek saya?`);
  document.getElementById('modal-contact-btn').href = `https://wa.me/6285126461085?text=${waMessage}`;
  previewDialog.showModal();
  document.body.style.overflow = 'hidden';
}

function closePreviewModal() {
  previewDialog.close();
}

previewDialog?.addEventListener('click', (event) => {
  if (event.target === previewDialog) closePreviewModal();
});
previewDialog?.addEventListener('close', () => {
  document.body.style.removeProperty('overflow');
});

const serviceMenu = document.querySelector('.studio-service-menu');

serviceMenu?.addEventListener('click', (event) => {
  if (event.target.closest('a')) serviceMenu.open = false;
});

document.addEventListener('click', (event) => {
  if (serviceMenu?.open && !serviceMenu.contains(event.target)) serviceMenu.open = false;
});

serviceMenu?.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || !serviceMenu.open) return;
  serviceMenu.open = false;
  serviceMenu.querySelector('summary').focus();
});

if ('IntersectionObserver' in window && !reduceMotion.matches) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('has-entered');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.12 });

  document.querySelectorAll('.studio-service-grid article, .catalog-grid-pattern h1, .studio-work-teaser h2, .theme-card, #alur-kerja h2, #tentang h2, #kontak h2').forEach((item) => observer.observe(item));
}

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function switchHeroDevice(mode) {
  const compact = mode === 'mobile';
  document.getElementById('hero-device-wrapper').classList.toggle('is-compact', compact);
  document.getElementById('active-device-label').textContent = compact ? 'Tampilan ringkas' : 'Tampilan lebar';
  document.getElementById('btn-dev-desktop').setAttribute('aria-pressed', !compact);
  document.getElementById('btn-dev-mobile').setAttribute('aria-pressed', compact);
}

// Portfolio investment calculator
function updateCalculator(val) {
  const num = parseInt(val, 10);
  const formatted = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  document.getElementById('calc-val-display').textContent = formatted;
  
  const roi = Math.round((num - 75000) / 75000);
  document.getElementById('calc-roi-display').textContent = `${roi}x Lipat (${roi * 100}%)`;
}


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
  if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey && !e.isComposing &&
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
function openPreviewModal(title, imageSrc, category, price, description) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-badge').textContent = category;
  const image = document.getElementById('modal-image');
  image.src = imageSrc;
  image.alt = `Pratinjau desain ${title}`;
  document.getElementById('modal-price').textContent = price;
  document.getElementById('modal-desc').textContent = description;

  const waMessage = encodeURIComponent(`Halo Tata Digital, saya tertarik memesan template portofolio "${title}" (${price}). Boleh minta info pengerjaannya?`);
  document.getElementById('modal-order-btn').href = `https://wa.me/6285126461085?text=${waMessage}`;
  previewDialog.showModal();
  document.body.style.overflow = 'hidden';
}

function closePreviewModal() {
  previewDialog.close();
}

previewDialog.addEventListener('click', (event) => {
  if (event.target === previewDialog) closePreviewModal();
});
previewDialog.addEventListener('close', () => {
  document.body.style.removeProperty('overflow');
});

if ('IntersectionObserver' in window && !reduceMotion.matches) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('has-entered');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.12 });

  document.querySelectorAll('.studio-service-grid article, .catalog-grid-pattern h2, .theme-card, #alur-kerja h2, #harga h2').forEach((item) => observer.observe(item));
}

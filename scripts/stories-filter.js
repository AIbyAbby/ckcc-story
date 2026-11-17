/* ==========================================================================
   全部故事頁互動篩選腳本（scripts/stories-filter.js）
   支援關鍵字搜尋、依單元篩選、依日期由新到舊／由舊到新排序
   ========================================================================== */

(function () {
  const searchInput = document.getElementById('stories-search');
  const sortSelect = document.getElementById('stories-sort');
  const unitButtons = document.querySelectorAll('.js-unit-filter');
  const listEl = document.getElementById('stories-feed');
  const countEl = document.getElementById('stories-count');
  const emptyEl = document.getElementById('stories-empty');

  if (!listEl) return;

  const items = Array.from(listEl.querySelectorAll('.article-feed__item'));
  let activeUnit = 'all';

  // 讀取網址 ?q= 參數
  const params = new URLSearchParams(window.location.search);
  const initialQ = params.get('q');
  if (initialQ && searchInput) {
    searchInput.value = initialQ;
  }

  function applyFilters() {
    const q = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const sortDir = sortSelect ? sortSelect.value : 'desc';

    const visibleItems = [];
    items.forEach(function (el) {
      const unit = el.getAttribute('data-unit') || '';
      const text = (el.getAttribute('data-search') || '').toLowerCase();
      const matchUnit = activeUnit === 'all' || unit === activeUnit;
      const matchQuery = !q || text.includes(q);
      const show = matchUnit && matchQuery;
      el.hidden = !show;
      if (show) visibleItems.push(el);
    });

    // 排序（無日期或 TODO 排在最後）
    const sorted = items.slice().sort(function (a, b) {
      const da = a.getAttribute('data-date') || '';
      const db = b.getAttribute('data-date') || '';
      const aEmpty = !da || da === 'TODO';
      const bEmpty = !db || db === 'TODO';
      if (aEmpty && !bEmpty) return 1;
      if (bEmpty && !aEmpty) return -1;
      if (da === db) return 0;
      return sortDir === 'asc' ? (da < db ? -1 : 1) : (da > db ? -1 : 1);
    });

    sorted.forEach(function (el) {
      listEl.appendChild(el);
    });

    if (emptyEl) {
      emptyEl.hidden = visibleItems.length > 0;
    }
  }

  unitButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      activeUnit = btn.getAttribute('data-unit-value') || 'all';
      unitButtons.forEach(function (b) {
        b.setAttribute('aria-pressed', String(b === btn));
      });
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }
  if (sortSelect) {
    sortSelect.addEventListener('change', applyFilters);
  }

  applyFilters();
})();

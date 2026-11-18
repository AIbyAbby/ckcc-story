/* ==========================================================================
   全站互動腳本（scripts/ui.js）
   - A- / A / A+ 字級調整（記住使用者選擇）
   - 手機版「選單」開關
   - 頁首即時搜尋（含全部 12 篇故事、單元與地圖）
   - 文章頁：複製連結、列印、圖片點開放大燈箱、本頁目錄高亮
   ========================================================================== */

(function () {
  const SCALE_KEY = 'chufangjian-font-scale';
  const SCALES = { sm: '0.9', md: '1', lg: '1.15' };

  const root = document.documentElement;
  const navToggle = document.getElementById('nav-toggle');
  const siteNav = document.getElementById('site-nav');
  const fontBtns = document.querySelectorAll('[data-font-size]');

  function applyFontScale(sizeKey) {
    const key = SCALES[sizeKey] ? sizeKey : 'md';
    root.style.setProperty('--font-scale', SCALES[key]);
    fontBtns.forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-font-size') === key));
    });
  }

  let savedScale = 'md';
  try {
    savedScale = localStorage.getItem(SCALE_KEY) || 'md';
  } catch {
    // Reading controls still work when browser storage is unavailable.
  }
  applyFontScale(savedScale);
  fontBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const sizeKey = btn.getAttribute('data-font-size') || 'md';
      localStorage.setItem(SCALE_KEY, sizeKey);
      applyFontScale(sizeKey);
    });
  });

  const banner = document.getElementById('home-banner-video');
  const bannerToggle = document.getElementById('banner-play-btn');
  if (banner && bannerToggle) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncBanner = function () {
      if (reducedMotion.matches) banner.pause();
      bannerToggle.hidden = reducedMotion.matches;
      bannerToggle.textContent = banner.paused ? '播放動畫' : '暫停動畫';
    };
    bannerToggle.addEventListener('click', function () {
      if (banner.paused) banner.play().catch(syncBanner);
      else banner.pause();
    });
    banner.addEventListener('play', syncBanner);
    banner.addEventListener('pause', syncBanner);
    reducedMotion.addEventListener('change', syncBanner);
    syncBanner();
  }

  const routeMapDialog = document.getElementById('route-map-dialog');
  if (routeMapDialog && typeof routeMapDialog.showModal === 'function') {
    const enlargedMap = routeMapDialog.querySelector('img');
    document.querySelectorAll('.mymaps-image').forEach(function (link) {
      link.addEventListener('click', function (event) {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        enlargedMap.src = link.href;
        enlargedMap.alt = link.querySelector('img').alt;
        routeMapDialog.showModal();
      });
    });
  }

  if (navToggle && siteNav) {
    root.classList.add('has-nav-menu');
    navToggle.addEventListener('click', function () {
      const isOpen = siteNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.textContent = isOpen ? '關閉' : '選單';
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && siteNav.classList.contains('is-open')) {
        siteNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.textContent = '選單';
        navToggle.focus();
      }
    });
  }

  // 複製連結與列印
  const copyBtn = document.getElementById('copy-link-btn');
  const copyStatus = document.getElementById('copy-status');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      const url = window.location.href;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () {
          if (copyStatus) copyStatus.textContent = '已複製連結！';
          setTimeout(function () {
            if (copyStatus) copyStatus.textContent = '';
          }, 3000);
        });
      } else {
        const temp = document.createElement('input');
        temp.value = url;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        if (copyStatus) copyStatus.textContent = '已複製連結！';
      }
    });
  }

  const printBtn = document.getElementById('print-page-btn');
  if (printBtn) {
    printBtn.addEventListener('click', function () {
      window.print();
    });
  }

  // 圖片放大燈箱
  const lightbox = document.getElementById('image-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  let lastTrigger = null;

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    document.body.style.overflow = '';
    if (lastTrigger) lastTrigger.focus();
  }

  if (lightbox && lightboxImg && lightboxCaption && lightboxClose) {
    document.querySelectorAll('.js-zoom-trigger').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const img = btn.querySelector('img');
        const fig = btn.closest('figure');
        const cap = fig ? fig.querySelector('figcaption') : null;
        if (!img) return;

        lastTrigger = btn;
        lightboxImg.src = img.currentSrc || img.src;
        lightboxImg.alt = img.alt || '';
        lightboxCaption.textContent = cap ? cap.textContent : img.alt;
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
        lightboxClose.focus();
      });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeLightbox();
    });
  }

  // 本頁目錄當前章節
  const tocLinks = document.querySelectorAll('.page-toc__link');

  function handleScroll() {
    if (tocLinks.length > 0) {
      let currentId = '';
      tocLinks.forEach(function (link) {
        const targetId = link.getAttribute('href').slice(1);
        const sec = document.getElementById(targetId);
        if (sec && sec.getBoundingClientRect().top <= 180) {
          currentId = targetId;
        }
      });
      tocLinks.forEach(function (link) {
        link.classList.toggle('is-active', link.getAttribute('href') === '#' + currentId);
      });
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
})();

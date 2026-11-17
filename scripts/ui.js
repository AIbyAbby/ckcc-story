/* ==========================================================================
   全站互動腳本（scripts/ui.js）
   - 淺色／深色模式切換
   - A- / A / A+ 字級調整（記住使用者選擇）
   - 手機版「選單」開關
   - 頁首即時搜尋（含全部 12 篇故事、單元與地圖）
   - 文章頁：複製連結、列印、圖片點開放大燈箱、本頁目錄高亮、回到頂部
   ========================================================================== */

(function () {
  const THEME_KEY = 'chufangjian-theme';
  const SCALE_KEY = 'chufangjian-font-scale';
  const SCALES = { sm: '0.9', md: '1', lg: '1.15' };

  const root = document.documentElement;
  const basePrefix = document.body.getAttribute('data-base') || './';
  const themeBtn = document.getElementById('theme-toggle');
  const navToggle = document.getElementById('nav-toggle');
  const siteNav = document.getElementById('site-nav');
  const fontBtns = document.querySelectorAll('[data-font-size]');

  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (themeBtn) {
      const isDark = theme === 'dark';
      themeBtn.setAttribute('aria-pressed', String(isDark));
      themeBtn.textContent = isDark ? '淺色' : '深色';
      themeBtn.setAttribute('aria-label', isDark ? '切換為淺色閱讀模式' : '切換為深色閱讀模式');
    }
  }

  applyTheme(getPreferredTheme());
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });
  }

  function applyFontScale(sizeKey) {
    const key = SCALES[sizeKey] ? sizeKey : 'md';
    root.style.setProperty('--font-scale', SCALES[key]);
    fontBtns.forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-font-size') === key));
    });
  }

  applyFontScale(localStorage.getItem(SCALE_KEY) || 'md');
  fontBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const sizeKey = btn.getAttribute('data-font-size') || 'md';
      localStorage.setItem(SCALE_KEY, sizeKey);
      applyFontScale(sizeKey);
    });
  });

  if (navToggle && siteNav) {
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

  // 全站 12 篇故事＋頁面索引
  const SEARCH_INDEX = [
    {
      title: '新店小獅頭山走讀',
      unit: '獅頭是火山 天機活潑・文：盧淑',
      keywords: '小獅頭山 廣明禪寺 廣照禪寺 昆塞特小屋 振山煤礦 大坪林圳 盧淑 水果師 伏虎師 廣欽 頂七張',
      url: basePrefix + 'stories/2026-09-24-lion-head-hill/'
    },
    {
      title: '獅山腰的大佛',
      unit: '獅頭是火山 天機活潑・文：賴玉芳',
      keywords: '獅山腰 大佛 阿彌陀佛 廣明禪寺 廣照禪寺 廣欽老和尚 開山紀念堂 賴玉芳',
      url: basePrefix + 'stories/2026-09-24-cliff-buddha/'
    },
    {
      title: '廣明禪寺',
      unit: '獅頭是火山 天機活潑・文：王淑美',
      keywords: '廣明禪寺 廣明寺 廣照寺 廣欽老和尚 伏虎 王淑美',
      url: basePrefix + 'stories/2026-09-24-guangming-temple/'
    },
    {
      title: '檳榔坑溪',
      unit: '獅頭是火山 天機活潑・文：賴玉芳',
      keywords: '檳榔坑溪 大坪林圳 蓄洪池 新坡一街 長春路 福民橋 賴玉芳',
      url: basePrefix + 'stories/2026-09-24-binlangkeng-creek/'
    },
    {
      title: '廣欽老和尚修行路',
      unit: '獅頭是火山 天機活潑・文：尤素秋',
      keywords: '廣欽老和尚 修行路 廣明寺 廣濟禪寺 南天母山 土城 尤素秋',
      url: basePrefix + 'stories/guangqin-monk-path/'
    },
    {
      title: '瑠公圳力行聚落踏查紀錄',
      unit: '瑠公圳漫步・文：張美枝',
      keywords: '瑠公圳 力行路 力行聚落 許碧燕 蔡金木宅 張美枝',
      url: basePrefix + 'stories/2026-10-01-liugong-lixing-settlement/'
    },
    {
      title: '瑠公圳漫步',
      unit: '瑠公圳漫步・文：賴玉芳',
      keywords: '瑠公圳 郭錫瑠 萬善同歸 蔡金木宅 黃媽媽 許碧燕 小紅橋 力行營區 賴玉芳',
      url: basePrefix + 'stories/2026-10-01-liugong-canal-walk/'
    },
    {
      title: '瑠公圳走讀',
      unit: '瑠公圳漫步・文：盧淑',
      keywords: '瑠公圳 碧潭堰 引水石硿 萬善同歸 蔡金木宅 過水橋 許碧燕 力行營區 美河市 盧淑',
      url: basePrefix + 'stories/2026-10-01-liugong-field-notes/'
    },
    {
      title: '大坪林圳東西幹線',
      unit: '圳水川流 孕育大地・文：尤素秋',
      keywords: '大坪林圳 東西幹線 青潭溪 引水石硿 景美溪 斯馨祠 咸亨宮 尤素秋',
      url: basePrefix + 'stories/2026-10-08-dapinglin-east-west-canals/'
    },
    {
      title: '淑敏的盤點和故事書寫',
      unit: '彼此相顧 激發愛心・文：侯淑敏',
      keywords: '德華女子公寓 靈性製圖師 侯淑敏 淑敏',
      url: basePrefix + 'stories/2026-10-29-shumin-inventory-and-stories/'
    },
    {
      title: '靈性製圖師的25年軌跡',
      unit: '彼此相顧 激發愛心・文：侯淑敏（影片）',
      keywords: '靈性製圖師 25年軌跡 影片 字幕 侯淑敏',
      url: basePrefix + 'stories/2026-10-31-spiritual-cartographer/'
    },
    {
      title: '在歲月裂縫中種植光明：從聖三堂到德華女子公寓',
      unit: '彼此相顧 激發愛心・文：侯淑敏',
      keywords: '聖三堂 德華女子公寓 萬德華 柏克偉 寶斗厝 寶安街 女工 侯淑敏',
      url: basePrefix + 'stories/2026-11-01-holy-trinity-to-dehua-womens-dorm/'
    },
    {
      title: '踏查地圖（互動地圖與路線站點）',
      unit: '四大走讀路線站點',
      keywords: '地圖 路線 踏查 座標 Leaflet',
      url: basePrefix + 'map/'
    },
    {
      title: '計畫源起',
      unit: '新店崇光社區大學',
      keywords: '源起 處方箋 說明',
      url: basePrefix + 'origin/'
    }
  ];

  document.querySelectorAll('.js-search-form').forEach(function (form) {
    const input = form.querySelector('.js-search-input');
    const panel = form.parentElement.querySelector('.js-search-panel');
    if (!input || !panel) return;

    function renderMatches(query) {
      const q = query.trim().toLowerCase();
      if (!q) {
        panel.hidden = true;
        panel.innerHTML = '';
        return;
      }

      const hits = SEARCH_INDEX.filter(function (item) {
        return (
          item.title.toLowerCase().includes(q) ||
          item.unit.toLowerCase().includes(q) ||
          item.keywords.toLowerCase().includes(q)
        );
      });

      if (hits.length === 0) {
        panel.innerHTML =
          '<p style="margin:0;">找不到「' +
          q.replace(/</g, '&lt;') +
          '」的項目，可改點 <a href="' +
          basePrefix +
          'stories/">全部故事</a> 篩選瀏覽。</p>';
        panel.hidden = false;
        return;
      }

      const itemsHtml = hits
        .slice(0, 6)
        .map(function (item) {
          return (
            '<li><a href="' +
            item.url +
            '">' +
            item.title +
            '<span class="search-results-meta">' +
            item.unit +
            '</span></a></li>'
          );
        })
        .join('');

      const moreLink =
        '<li style="padding-top:6px;"><a href="' +
        basePrefix +
        'stories/?q=' +
        encodeURIComponent(query.trim()) +
        '">前往全部故事檢視完整結果（共 ' +
        hits.length +
        ' 筆）→</a></li>';

      panel.innerHTML = '<ul class="search-results-list">' + itemsHtml + moreLink + '</ul>';
      panel.hidden = false;
    }

    input.addEventListener('input', function () {
      renderMatches(input.value);
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const q = input.value.trim();
      if (q) {
        window.location.href = basePrefix + 'stories/?q=' + encodeURIComponent(q);
      }
    });

    document.addEventListener('click', function (event) {
      if (!form.parentElement.contains(event.target)) {
        panel.hidden = true;
      }
    });
  });

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

  // 回到頂部＋本頁目錄當前章節
  const backToTop = document.getElementById('back-to-top');
  const tocLinks = document.querySelectorAll('.page-toc__link');

  function handleScroll() {
    if (backToTop) {
      backToTop.hidden = window.scrollY < 420;
    }

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

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
})();

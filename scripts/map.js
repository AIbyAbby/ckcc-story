/* ==========================================================================
   踏查地圖互動腳本（scripts/map.js）
   使用 Leaflet + OpenStreetMap 讀取 ../data/stops.json
   支援依單元篩選站點，點擊站點定位並連結至對應文章
   ========================================================================== */

(function () {
  const mapEl = document.getElementById('fieldwork-map');
  const stopListEl = document.getElementById('map-stop-list');
  const filterBtns = document.querySelectorAll('.js-map-filter');
  if (!mapEl || !stopListEl || typeof L === 'undefined') return;

  const map = L.map('fieldwork-map', { scrollWheelZoom: false }).setView([24.963, 121.541], 14);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(map);

  const markerLayer = L.layerGroup().addTo(map);
  let allStops = [];
  let activeUnit = 'all';

  function renderStops() {
    markerLayer.clearLayers();
    stopListEl.innerHTML = '';

    const visible = allStops.filter(function (s) {
      return activeUnit === 'all' || s.unit === activeUnit;
    });

    const markersById = {};

    visible.forEach(function (stop, idx) {
      const marker = L.circleMarker([stop.lat, stop.lng], {
        radius: 9,
        color: '#1D5E7A',
        weight: 2.5,
        fillColor: '#B4650E',
        fillOpacity: 0.9
      }).addTo(markerLayer);

      const popupHtml =
        '<div style="font-family:Noto Sans TC,sans-serif;line-height:1.6;min-width:200px;">' +
        '<strong>' + stop.name + '</strong><br>' +
        '<span style="font-size:13px;color:#485861;">' + stop.unit + '</span><br>' +
        '<p style="margin:6px 0;font-size:14px;">' + stop.note + '</p>' +
        '<a href="../stories/' + stop.story_slug + '/" style="font-weight:700;">閱讀：' + stop.story_title + ' →</a>' +
        '</div>';

      marker.bindPopup(popupHtml);
      markersById[stop.id] = marker;

      const li = document.createElement('li');
      li.className = 'stop-item';
      li.innerHTML =
        '<button type="button" class="stop-item__btn" data-stop-id="' + stop.id + '">' +
        (idx + 1) + '. ' + stop.name +
        '</button>' +
        '<p class="stop-item__meta">' + stop.unit + '</p>' +
        '<p class="stop-item__desc">' + stop.note + '</p>' +
        '<a href="../stories/' + stop.story_slug + '/">閱讀對應文章：' + stop.story_title + ' →</a>';

      li.querySelector('button').addEventListener('click', function () {
        map.setView([stop.lat, stop.lng], 16, { animate: true });
        marker.openPopup();
      });

      stopListEl.appendChild(li);
    });

    if (visible.length > 0) {
      const bounds = L.latLngBounds(visible.map(function (s) { return [s.lat, s.lng]; }));
      map.fitBounds(bounds, { padding: [36, 36] });
    }
  }

  fetch('../data/stops.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      allStops = data;
      renderStops();
    })
    .catch(function () {
      stopListEl.innerHTML = '<li class="stop-item">暫時無法載入站點資料（../data/stops.json）。</li>';
    });

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      activeUnit = btn.getAttribute('data-unit-value') || 'all';
      filterBtns.forEach(function (b) {
        b.setAttribute('aria-pressed', String(b === btn));
      });
      renderStops();
    });
  });
})();

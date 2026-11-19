# 網站架構與設計紀錄（site-plan.md）

## 現場走讀分頁

- 新增 `walks/index.html`，主標「把課堂帶進風景裡」，按四次課程順序編排。
- 每次課程採一篇短文、一組照片拼貼，共四篇短文與四組拼貼；日期沿用首頁淡青綠圓標，不加直槓。
- 以人物照片為主，拼貼不足時加入同一次走讀的景物照；保留完整比例，不使用地圖與翻拍資料。
- 文案來源為 `content/walks.json`，照片清單為 `content/walks-photos.json`；使用 `scripts/build-walks.py` 產生頁面。
- 「現場走讀」為主選單最後一項獨立入口。

- **技術架構**：純靜態 HTML / CSS / JS（無資料庫與建置工具），搭配 Leaflet + OpenStreetMap（`data/stops.json`）與站內搜尋篩選（`scripts/ui.js`、`scripts/stories-filter.js`）。
- **色彩與字體（`design/tokens.css`）**：
  - 淺色：淡青灰紙底 `#F2F4F2`、墨藍灰字 `#1E2B33`、溪水藍 `#1D5E7A`、燈籠琥珀重點 `#B4650E`。
  - 深色：深墨青夜紙 `#141B1E`、柔白字 `#E7ECEA`、夜色溪水藍 `#6BB6D6`、夜燈琥珀 `#E8A848`。
  - 內文 `Noto Serif TC` 19.5px、行高 `1.95`、`max-width: 34em`、`line-break: strict`；導覽與介面 `Noto Sans TC`，提供 `A− A A+` 字級調整。
- **單元 SVG 線稿系統（`design/icons/`）**：`shishan`、`liugong`、`dapinglin`、`care`、`map` 各備 `160px` / `96px` / `32px` 三種尺寸，旁側固定顯示完整單元名稱。
- **頁面清單（共 20 頁）**：
  - `index.html`（水圳路線第一屏＋各單元入口＋最新文章＋計畫簡介）
  - `origin/`（源起）、`map/`（踏查地圖）、`stories/`（全部故事搜尋與篩選）
  - 四大單元頁：`shishan/`、`liugong/`、`dapinglin/`、`care/`（雙欄全卡可點擊網格，參考 `works.html` 編排）
  - 12 篇獨立文章／影片頁：`stories/<slug>/index.html`（單欄舒適閱讀、複製連結／列印、點圖放大燈箱、同單元延伸閱讀、框線前後篇導覽、回到頂部）
- **測試紀錄**：本機 `http://127.0.0.1:8765/` 實測 20 頁 HTTP 200、0 斷鏈、390px／1280px 淺深色無水平溢位。

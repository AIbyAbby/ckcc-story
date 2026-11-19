"""Build the fieldwork photo page from approved copy and photo metadata."""
import json
import re
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
data = json.loads((ROOT / 'content/walks.json').read_text(encoding='utf-8'))
photos = json.loads((ROOT / 'content/walks-photos.json').read_text(encoding='utf-8'))
home = (ROOT / 'index.html').read_text(encoding='utf-8')
header = re.search(r'<header>.*?</header>', home, re.S).group(0)
header = header.replace(' aria-current="page"', '')
header = header.replace('href="walks/index.html"', 'href="walks/index.html" aria-current="page"')
header = re.sub(r'(href|src)="(?!https?:|#)([^"]+)"', r'\1="../\2"', header)

def collage(items, label):
    panels = []
    offset = 0
    while offset < len(items):
        # A portrait at the fourth position can occupy the tall side slot.
        remaining = items[offset:]
        tall = len(remaining) >= 4 and remaining[3]['height'] > remaining[3]['width'] * 1.15
        count = min(4 if tall else 5, len(remaining))
        group = remaining[:count]
        figures = []
        for index, photo in enumerate(group):
            responsive = ''
            if 'small_file' in photo:
                sizes = '(max-width: 640px) calc(100vw - 72px), (max-width: 900px) 420px, 460px' if index == 0 else '(max-width: 640px) calc(100vw - 72px), (max-width: 900px) 300px, 230px'
                responsive = f' srcset="../{photo["small_file"]} {photo["small_width"]}w, ../{photo["file"]} {photo["width"]}w" sizes="{sizes}"'
            figures.append(
                f'<figure class="walks-photo"><img src="../{escape(photo["file"])}"{responsive} '
                f'width="{photo["width"]}" height="{photo["height"]}" '
                f'alt="{escape(photo["alt"])}" loading="lazy" decoding="async"></figure>'
            )
        mirror = ' walks-panel--mirror' if len(panels) % 2 else ''
        portrait = ' walks-panel--tall' if tall else ''
        panels.append(f'<div class="walks-panel walks-panel--{count}{mirror}{portrait}">' + '\n'.join(figures) + '</div>')
        offset += count
    return f'<div class="walks-collage" role="group" aria-label="{escape(label)}">' + '\n'.join(panels) + '</div>'

chapters = []
for number, chapter in enumerate(data['chapters'], 1):
    selected = [p for group in (1, 2) for p in photos if p['unit'] == number and p['group'] == group]
    prose = ''.join(chapter['paragraphs'])
    parts = [f'<p class="walks-prose">{escape(prose)}</p>', collage(selected, chapter['title'] + '走讀照片')]
    chapters.append(
        f'<section class="walks-chapter" id="walk-{number}" aria-labelledby="walk-title-{number}">'
        f'<h2 id="walk-title-{number}"><span class="home-course-cards__date home-course-cards__date--badge">'
        f'{chapter["date"]}</span><span>{escape(chapter["title"])}</span></h2>'
        + '\n'.join(parts)
        + f'<a class="walks-unit-link" href="../{chapter["unit"]}/index.html">閱讀這次走讀的文章 →</a></section>'
    )
links = ''.join(f'<a href="#walk-{i}">{c["date"]} {escape(c["title"])}</a>' for i, c in enumerate(data['chapters'], 1))
html = f'''<!doctype html>
<html lang="zh-Hant-TW"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>現場走讀｜里里有故事 × 樂齡友善處方箋</title>
<meta name="description" content="{escape(data['intro'])}">
<link rel="stylesheet" href="../design/home-layout.css?v=walks">
<link rel="stylesheet" href="../design/walks.css?v=asymmetric-2">
</head><body>{header}
<main id="main" class="walks-page"><div class="wrap">
<div class="walks-breadcrumb"><a href="../index.html">首頁</a> &gt; 現場走讀</div>
<section class="walks-opening" aria-labelledby="walks-title"><h1 id="walks-title">{escape(data['title'])}</h1>
<p>{escape(data['intro'])}</p><nav class="walks-chapters-nav" aria-label="四次走讀">{links}</nav></section>
{''.join(chapters)}
<a class="walks-unit-link" href="../index.html">← 回首頁</a>
</div></main></body></html>'''
(ROOT / 'walks').mkdir(exist_ok=True)
(ROOT / 'walks/index.html').write_text(html, encoding='utf-8')
print(f'Built walks/index.html: {len(chapters)} chapters, {len(photos)} photos')

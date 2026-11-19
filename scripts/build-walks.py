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
    figures = []
    for index, photo in enumerate(items):
        responsive = ''
        if 'small_file' in photo:
            sizes = '(max-width: 640px) calc(100vw - 72px), 920px' if index == 0 else '(max-width: 640px) calc(100vw - 72px), (max-width: 900px) 400px, 300px'
            responsive = f' srcset="../{photo["small_file"]} {photo["small_width"]}w, ../{photo["file"]} {photo["width"]}w" sizes="{sizes}"'
        figures.append(
            f'<figure class="walks-photo"><img src="../{escape(photo["file"])}"{responsive} '
            f'width="{photo["width"]}" height="{photo["height"]}" '
            f'alt="{escape(photo["alt"])}" loading="lazy" decoding="async"></figure>'
        )
    return f'<div class="walks-collage" role="group" aria-label="{escape(label)}">' + '\n'.join(figures) + '</div>'

chapters = []
for number, chapter in enumerate(data['chapters'], 1):
    parts = []
    for group in (1, 2):
        selected = [p for p in photos if p['unit'] == number and p['group'] == group]
        parts.append(f'<p class="walks-prose">{escape(chapter["paragraphs"][group - 1])}</p>')
        parts.append(collage(selected, chapter['title'] + ('同行與觀察' if group == 1 else '交流與傾聽')))
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
<link rel="stylesheet" href="../design/walks.css?v=1">
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

#!/usr/bin/env python3
"""
Génère muscu-preview.html — script standalone inline CSS+JS.
Usage : python3 build-preview.py
"""
import re, subprocess, sys, os

APP = os.path.dirname(os.path.abspath(__file__))
DIST = '/tmp/muscu-dist'
OUT = os.path.join(APP, '../../OneDrive/Documents/Claude/Projects/Muscu app/muscu-preview.html')

print('Building...')
result = subprocess.run(
    ['npx', 'vite@8', 'build', '--outDir', DIST],
    cwd=APP, capture_output=True, text=True
)
if result.returncode != 0:
    print('BUILD FAILED:\n', result.stderr[-2000:])
    sys.exit(1)
print('Build OK')

with open(f'{DIST}/index.html') as f: html = f.read()
with open(f'{DIST}/assets/index.css') as f: css = f.read()
with open(f'{DIST}/assets/index.js') as f: js = f.read()

css_link  = re.search(r'<link[^>]+\.css[^>]*>', html).group(0)
js_script = re.search(r'<script[^>]+\.js[^>]*></script>', html).group(0)

html = html.replace('<link rel="manifest" href="./manifest.json" />', '')
html = html.replace(css_link,  f'<style>{css}</style>')
html = html.replace(js_script, f'<script type="module">{js}</script>')

with open(OUT, 'w', encoding='utf-8') as f: f.write(html)
print(f'Preview written: {len(html):,} bytes → {OUT}')

import httpx
from PIL import Image, ImageDraw, ImageFont
import json

API = 'http://127.0.0.1:8000/api/words'

r = httpx.get(API, timeout=10.0)
data = r.json()
words = data.get('words', [])

lines = []
for w in words:
    lines.append(f"{w['text']} — {w.get('pronunciation') or ''} — {w.get('definition') or ''}")
if not lines:
    lines = ['(no words)']

# create image
width = 1000
line_height = 30
height = max(120, line_height * (len(lines) + 2))
img = Image.new('RGB', (width, height), color=(255,255,255))
d = ImageDraw.Draw(img)
try:
    font = ImageFont.truetype('arial.ttf', 16)
except Exception:
    font = ImageFont.load_default()

y = 20
for line in lines:
    d.text((20, y), line, fill=(0,0,0), font=font)
    y += line_height

out = 'C:/tmp/workspace/frontend_like_screenshot.png'
img.save(out)
print('Saved screenshot-like image to', out)
print(json.dumps({'lines': lines}, ensure_ascii=False))

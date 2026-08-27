# Sleeping Pets Prototype v9

## Positions-Fix
Der Positionsfehler ist jetzt sauber behoben.

Ursache:
Beim Wechsel von `<img>` auf `<canvas>` in V7 ist die CSS-Klasse `pet-image`
verloren gegangen. Dadurch wurden die bereits richtigen Positionswerte aus V6
nicht mehr angewendet.

V9:
- Canvas hat wieder `class="pet-image"`
- exakt dieselbe Positionierung wie vor der Sprite-Sheet-Umstellung
- Desktop: bottom 44px, 520x360
- Mobile: bottom 55px, 430x300
- keine neu geschätzten Positionswerte
- Sprite-Sheets und 30-FPS-Animationen bleiben erhalten

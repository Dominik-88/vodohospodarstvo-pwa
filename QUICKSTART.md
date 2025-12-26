# 🚀 Rychlý start

## Instalace

1. **Naklonujte repozitář:**
```bash
git clone https://github.com/Dominik-88/vodohospodarstvo-pwa.git
cd vodohospodarstvo-pwa
```

2. **Konfigurace Firebase (volitelné):**
   - Vytvořte projekt na [Firebase Console](https://console.firebase.google.com/)
   - Přidejte webovou aplikaci
   - Zkopírujte konfiguraci do `firebase-config.js`
   - Povolte Authentication a Firestore

3. **Spuštění lokálně:**
```bash
# Python
python -m http.server 8000

# Node.js
npx serve

# PHP
php -S localhost:8000
```

4. **Otevřete v prohlížeči:**
```
http://localhost:8000
```

## Základní použití

### 1. Zobrazení mapy
- Mapa se načte automaticky s 41 areály
- Klikněte na marker pro detail areálu

### 2. Vyhledávání
```
🔎 Hledat areál... → Zadejte název (např. "Plav")
```

### 3. Filtrace
- **Okres:** CB, CK, PI, PT, ST, TA
- **Kategorie:** I., II., Bez kategorie
- **Řazení:** Název, Výměra, Vzdálenost

### 4. Geolokace
```
📍 Najít mou polohu → Automatické řazení podle vzdálenosti
```

### 5. Export dat
```
📥 Export do CSV → Stáhne filtrované areály
```

### 6. Statistiky
```
📊 Zobrazit statistiky → Grafy a analýzy
```

### 7. Optimalizace trasy
```
🚗 Optimalizovat trasu → Nearest Neighbor algoritmus
```

## Pokročilé funkce

### Heatmapa
```javascript
// Zobrazení heatmapy podle výměry
🔥 Heatmapa → Červená = největší, Modrá = nejmenší
```

### Clustering
```javascript
// Seskupování markerů
🎯 Clustering → Zapnout/Vypnout
```

### Offline režim
```javascript
// Automaticky aktivní díky Service Worker
⚠️ Offline režim aktivní → Aplikace funguje bez internetu
```

## Deployment

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### GitHub Pages
```bash
# V nastavení repozitáře:
Settings → Pages → Source: main branch
```

## Troubleshooting

### Mapa se nenačítá
```javascript
// Zkontrolujte konzoli prohlížeče
F12 → Console → Hledejte chyby
```

### Firebase nefunguje
```javascript
// Ověřte konfiguraci v firebase-config.js
console.log(firebaseConfig);
```

### Service Worker chyby
```javascript
// Odregistrujte starý Service Worker
navigator.serviceWorker.getRegistrations()
  .then(regs => regs.forEach(reg => reg.unregister()));
```

## Další zdroje

- 📖 [Kompletní dokumentace](README.md)
- 🐛 [Nahlásit chybu](https://github.com/Dominik-88/vodohospodarstvo-pwa/issues)
- 💬 [Diskuze](https://github.com/Dominik-88/vodohospodarstvo-pwa/discussions)

---

**Vytvořeno s ❤️ pro efektivní správu vodohospodářské infrastruktury**
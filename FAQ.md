# ❓ Často kladené otázky (FAQ)

## Obecné otázky

### Co je to PWA?
Progressive Web App (PWA) je webová aplikace, která se chová jako nativní mobilní aplikace. Můžete ji nainstalovat na domovskou obrazovku a používat offline.

### Jak nainstaluji aplikaci?
1. Otevřete aplikaci v prohlížeči
2. Klikněte na ikonu "Nainstalovat" v adresním řádku
3. Nebo v menu prohlížeče: "Přidat na plochu"

### Funguje aplikace offline?
Ano! Díky Service Worker aplikace funguje i bez internetového připojení. Data jsou cachována lokálně.

### Je aplikace zdarma?
Ano, aplikace je zcela zdarma a open-source pod MIT licencí.

---

## Technické otázky

### Jaké prohlížeče jsou podporovány?
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Opera 76+

### Jak aktualizuji data areálů?
Upravte soubor `data.js` a přidejte/upravte areály. Poté commitněte změny.

### Jak přidám nový areál?
```javascript
// data.js
{
  okres: 'CB',
  nazev: 'VDJ Nový areál',
  kategorie: 'I.',
  oploceni: 300,
  vymera: 5000,
  lat: 49.0,
  lng: 14.0,
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=49.0,14.0'
}
```

### Jak změním barvy kategorií?
```javascript
// app.js - funkce getColorByCategory()
function getColorByCategory(category) {
  switch(category) {
    case 'I.': return '#dc2626';  // Změňte barvu zde
    case 'II.': return '#f59e0b';
    default: return '#6b7280';
  }
}
```

### Jak přidám nový filtr?
1. Přidejte HTML element do `index.html`
2. Přidejte logiku do funkce `filterAreas()` v `app.js`
3. Přidejte event listener v `initEventListeners()`

---

## Firebase otázky

### Potřebuji Firebase?
Ne, aplikace funguje i bez Firebase. Firebase je volitelný pro:
- Autentizaci uživatelů
- Realtime databázi
- Push notifikace

### Jak nakonfiguruji Firebase?
1. Vytvořte projekt na [Firebase Console](https://console.firebase.google.com/)
2. Přidejte webovou aplikaci
3. Zkopírujte konfiguraci do `firebase-config.js`
4. Povolte Authentication a Firestore

### Je Firebase zdarma?
Ano, Firebase má bezplatný plán (Spark) s omezeními:
- 10 GB hosting/měsíc
- 50,000 čtení/den z Firestore
- 20,000 zápisů/den do Firestore

---

## Mapové otázky

### Jak změním výchozí pozici mapy?
```javascript
// app.js - funkce initMap()
const center = [49.0, 14.4]; // Změňte souřadnice
map = L.map('map').setView(center, 9); // Změňte zoom
```

### Jak přidám vlastní map tiles?
```javascript
// app.js - funkce initMap()
L.tileLayer('https://YOUR_TILE_SERVER/{z}/{x}/{y}.png', {
  attribution: 'Your attribution',
  maxZoom: 19
}).addTo(map);
```

### Jak změním ikony markerů?
```javascript
// app.js - funkce createMarker()
const icon = L.divIcon({
  className: 'custom-marker',
  html: `<div style="...">Váš HTML</div>`,
  iconSize: [30, 30]
});
```

---

## Výkonnostní otázky

### Aplikace je pomalá, co dělat?
1. Zkontrolujte počet markerů (clustering pomáhá)
2. Vypněte heatmapu, pokud není potřeba
3. Zkontrolujte konzoli prohlížeče pro chyby
4. Vymažte cache prohlížeče

### Jak zlepšit rychlost načítání?
1. Minifikujte JavaScript a CSS
2. Použijte CDN pro knihovny
3. Optimalizujte obrázky
4. Povolte gzip kompresi na serveru

### Kolik dat aplikace cachuje?
Přibližně 5-10 MB včetně:
- HTML, CSS, JavaScript
- Map tiles (podle použití)
- Data areálů

---

## Deployment otázky

### Kde mohu aplikaci hostovat?
- Firebase Hosting (doporučeno)
- Netlify
- GitHub Pages
- Vercel
- Cloudflare Pages

### Jak nastavím custom doménu?
Viz [DEPLOYMENT.md](DEPLOYMENT.md) pro detailní návod.

### Jak aktualizuji produkční verzi?
```bash
# Firebase
firebase deploy

# Netlify
netlify deploy --prod

# GitHub Pages
git push origin main
```

---

## Bezpečnostní otázky

### Je aplikace bezpečná?
Ano, aplikace používá:
- HTTPS (automaticky na všech platformách)
- Firebase Security Rules
- Content Security Policy (připraveno)
- XSS ochrana

### Jak chráním Firebase API klíče?
Firebase API klíče jsou veřejné a bezpečné. Skutečná bezpečnost je v Firebase Security Rules.

### Jak zabráním neoprávněnému přístupu?
Implementujte Firebase Authentication a nastavte Security Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /areas/{areaId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      request.auth.token.admin == true;
    }
  }
}
```

---

## Mobilní otázky

### Funguje na iOS?
Ano, aplikace funguje na iOS 14+ v Safari.

### Funguje na Androidu?
Ano, aplikace funguje na Android 5+ ve všech moderních prohlížečích.

### Jak nainstaluji na iPhone?
1. Otevřete v Safari
2. Klikněte na ikonu "Sdílet"
3. Vyberte "Přidat na plochu"

### Jak nainstaluji na Android?
1. Otevřete v Chrome
2. Klikněte na menu (tři tečky)
3. Vyberte "Přidat na plochu"

---

## Datové otázky

### Odkud pocházejí data?
Data 41 vodohospodářských areálů jsou z oficiálních zdrojů aktualizovaných k 11/2025.

### Jak často jsou data aktualizována?
Data jsou statická v souboru `data.js`. Pro aktualizaci upravte soubor a commitněte změny.

### Mohu exportovat data?
Ano, klikněte na tlačítko "📥 Export do CSV" pro export filtrovaných dat.

### Jaký formát má export?
CSV soubor s následujícími sloupci:
- Okres
- Název
- Kategorie
- Výměra (m²)
- Oplocení (bm)
- Latitude
- Longitude

---

## Troubleshooting

### Mapa se nenačítá
1. Zkontrolujte internetové připojení
2. Otevřete konzoli prohlížeče (F12)
3. Hledejte chyby v konzoli
4. Zkuste obnovit stránku (Ctrl+F5)

### Geolokace nefunguje
1. Povolte geolokaci v prohlížeči
2. Zkontrolujte, že používáte HTTPS
3. Některé prohlížeče vyžadují uživatelskou interakci

### Service Worker chyby
```javascript
// Odregistrujte Service Worker
navigator.serviceWorker.getRegistrations()
  .then(regs => regs.forEach(reg => reg.unregister()));

// Obnovte stránku
location.reload();
```

### Aplikace se nenainstaluje
1. Zkontrolujte, že používáte podporovaný prohlížeč
2. Ověřte, že manifest.json je dostupný
3. Zkontrolujte, že Service Worker je registrován
4. Zkuste jiný prohlížeč

---

## Kontakt a podpora

### Kde mohu nahlásit chybu?
[GitHub Issues](https://github.com/Dominik-88/vodohospodarstvo-pwa/issues)

### Kde mohu klást otázky?
[GitHub Discussions](https://github.com/Dominik-88/vodohospodarstvo-pwa/discussions)

### Jak mohu přispět?
Viz [CONTRIBUTING.md](CONTRIBUTING.md)

### Kontaktní email
d.schmied@lantaron.cz

---

**Nenašli jste odpověď? Vytvořte issue na GitHubu!**
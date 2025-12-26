# Changelog

Všechny významné změny v projektu budou dokumentovány v tomto souboru.

Formát je založen na [Keep a Changelog](https://keepachangelog.com/cs/1.0.0/),
a tento projekt dodržuje [Semantic Versioning](https://semver.org/lang/cs/).

## [1.0.0] - 2025-12-26

### Přidáno
- ✨ Kompletní PWA aplikace pro správu vodohospodářských areálů
- 🗺️ Interaktivní mapa s Leaflet.js
- 📍 41 vodohospodářských areálů v Jihočeském kraji
- 🔥 Heatmapa podle výměry areálů
- 🎯 Marker clustering pro lepší přehlednost
- 📊 Dynamické statistiky a grafy (Chart.js)
- 🔍 Pokročilé filtry (okres, kategorie, výměra)
- 📱 Geolokace s automatickým řazením podle vzdálenosti
- 🚗 Optimalizace tras (Nearest Neighbor algoritmus)
- 📥 Export dat do CSV
- 💾 Offline režim s Service Worker
- 🔐 Firebase autentizace (připraveno)
- 📱 Responzivní design pro mobily a tablety
- 🌐 PWA manifest pro instalaci
- 📖 Kompletní dokumentace (README, QUICKSTART, TECHNICAL)
- 🚀 Deployment guide pro Firebase, Netlify, GitHub Pages
- 📄 MIT licence

### Technologie
- Vanilla JavaScript (ES6+)
- Tailwind CSS
- Leaflet.js + plugins (markercluster, heat)
- Chart.js
- Firebase (Auth, Firestore)
- Service Worker
- Web App Manifest

### Funkce
- Zobrazení 41 areálů na mapě
- Vyhledávání podle názvu
- Filtrace podle okresu (CB, CK, PI, PT, ST, TA)
- Filtrace podle kategorie (I., II., bez kategorie)
- Řazení podle názvu, výměry, vzdálenosti
- Geolokace uživatele
- Výpočet vzdáleností (Haversine formula)
- Optimalizace tras
- Heatmapa vizualizace
- Marker clustering
- Export do CSV
- Statistiky a grafy
- Offline režim
- Push notifikace (připraveno)

### Optimalizace
- Lazy loading map tiles
- Debouncing vyhledávání (300ms)
- Service Worker caching
- Marker clustering pro výkon
- Responzivní design

### Bezpečnost
- Firebase Security Rules
- Content Security Policy (připraveno)
- HTTPS automaticky

---

## [Unreleased]

### Plánováno
- [ ] Geofencing notifikace
- [ ] Realtime kolaborace
- [ ] AI generování reportů (Gemini)
- [ ] Integrace s Open-Meteo API (počasí)
- [ ] OSRM routing (optimalizace tras)
- [ ] Exporty do PDF
- [ ] Editační modály pro areály
- [ ] Undo historie akcí
- [ ] Simulace scénářů
- [ ] Unit testy (Jest)
- [ ] E2E testy (Playwright)
- [ ] Google Analytics integrace
- [ ] Sentry error tracking

---

## Formát verzí

### [Major.Minor.Patch]

- **Major**: Zásadní změny, breaking changes
- **Minor**: Nové funkce, zpětně kompatibilní
- **Patch**: Opravy chyb, drobné vylepšení

### Typy změn

- **Přidáno** - nové funkce
- **Změněno** - změny v existujících funkcích
- **Zastaralé** - funkce, které budou odstraněny
- **Odstraněno** - odstraněné funkce
- **Opraveno** - opravy chyb
- **Bezpečnost** - bezpečnostní opravy

---

**Vytvořeno s ❤️ pro efektivní správu vodohospodářské infrastruktury**
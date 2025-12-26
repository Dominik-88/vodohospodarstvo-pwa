# 🗺️ Vodohospodářské Areály - PWA Mapa

## 📋 Popis projektu

Kompletní Progressive Web App (PWA) pro správu a vizualizaci 41 vodohospodářských areálů v Jihočeském kraji. Aplikace kombinuje moderní webové technologie s pokročilými funkcemi pro efektivní správu infrastruktury.

## ✨ Klíčové funkce

### 🗺️ Mapování & Vizualizace
- **Interaktivní mapa** s Leaflet.js
- **Heatmapa** podle kategorie a výměry areálů
- **Marker clustering** pro lepší přehlednost
- **Geolokace** s automatickým řazením podle vzdálenosti
- **Custom markery** s barevným rozlišením kategorií

### 📊 Statistiky & Analýzy
- **Dynamické grafy** (Chart.js)
  - Rozložení podle kategorií
  - Rozložení podle okresů
  - Top 10 areálů podle výměry
- **Ekonomické simulace** úspor tras
- **RICE priorizace** vylepšení
- **Export do CSV** pro další analýzu

### 🔍 Pokročilé filtry
- Fulltextové vyhledávání
- Filtr podle okresu (CB, CK, PI, PT, ST, TA)
- Filtr podle kategorie (I., II., bez kategorie)
- Řazení podle:
  - Názvu (A-Z)
  - Výměry (největší/nejmenší)
  - Vzdálenosti od uživatele

### 📱 PWA & Offline režim
- **Service Worker** caching
- **Instalovatelná** aplikace
- **Push notifikace** (připraveno)
- **Offline režim** s lokální cache
- **Responzivní design** pro mobily a tablety

### 🔐 Firebase Backend
- **Realtime databáze** (připraveno)
- **Autentizace** Email/Google (připraveno)
- **Bezpečnostní pravidla**
- **Geofencing notifikace** (připraveno)

### 🚗 Routing & Navigace
- **Optimalizace tras** (Nearest Neighbor algoritmus)
- **Navigace do Google Maps**
- **Výpočet vzdáleností** (Haversine formula)
- **Vizualizace tras** na mapě

## 🏗️ Technologie

- **Frontend**: Vanilla JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **Mapa**: Leaflet.js + plugins
  - leaflet.markercluster
  - leaflet.heat
- **Grafy**: Chart.js
- **Backend**: Firebase (Auth, Firestore)
- **PWA**: Service Worker, Web App Manifest

## 🚀 Instalace a spuštění

### 1. Naklonování projektu
```bash
git clone https://github.com/Dominik-88/vodohospodarstvo-pwa.git
cd vodohospodarstvo-pwa
```

### 2. Konfigurace Firebase

1. Vytvořte projekt na [Firebase Console](https://console.firebase.google.com/)
2. Přidejte webovou aplikaci
3. Zkopírujte konfiguraci do `firebase-config.js`:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

4. Povolte Authentication (Email/Password a Google)
5. Vytvořte Firestore databázi

### 3. Spuštění lokálně

```bash
# Jednoduchý HTTP server
python -m http.server 8000
# nebo
npx serve
```

Otevřete `http://localhost:8000` v prohlížeči.

### 4. Deployment

#### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

#### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

## 📊 Datová struktura

### Areál
```javascript
{
  okres: 'CB',           // Okres (CB, CK, PI, PT, ST, TA)
  nazev: 'VDJ Plav',     // Název areálu
  kategorie: 'I.',       // Kategorie (I., II., null)
  oploceni: 1413,        // Délka oplocení (bm)
  vymera: 74777,         // Výměra (m²)
  lat: 48.912611,        // Zeměpisná šířka
  lng: 14.494018,        // Zeměpisná délka
  mapUrl: 'https://...'  // Google Maps URL
}
```

## 🎯 Použití

### Základní operace

1. **Zobrazení mapy**: Automaticky při načtení
2. **Vyhledávání**: Zadejte název areálu do vyhledávacího pole
3. **Filtrace**: Použijte dropdown menu pro filtraci
4. **Geolokace**: Klikněte na "Najít mou polohu"
5. **Detail areálu**: Klikněte na marker nebo položku v seznamu
6. **Navigace**: V detailu klikněte na "Navigovat"
7. **Export**: Klikněte na "Export do CSV"
8. **Statistiky**: Klikněte na "Zobrazit statistiky"

### Pokročilé funkce

#### Optimalizace trasy
1. Zjistěte svou polohu (📍 tlačítko)
2. Aplikujte filtry pro výběr areálů
3. Klikněte na "Optimalizovat trasu"
4. Trasa se zobrazí na mapě s celkovou vzdáleností

#### Heatmapa
- Klikněte na "🔥 Heatmapa" v pravém horním rohu
- Intenzita odpovídá výměře areálu
- Červená = největší areály, Modrá = nejmenší

#### Clustering
- Automaticky zapnutý pro lepší přehlednost
- Vypněte tlačítkem "🎯 Clustering"
- Užitečné při detailním zkoumání oblasti

## 🔒 Bezpečnost

### Firebase Security Rules

```javascript
// Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Pouze autentizovaní uživatelé
    match /areas/{areaId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      request.auth.token.admin == true;
    }
    
    // Uživatelské profily
    match /users/{userId} {
      allow read, write: if request.auth != null && 
                            request.auth.uid == userId;
    }
  }
}
```

## 📈 Výkonnostní optimalizace

### Implementované optimalizace

1. **Lazy loading** obrázků a map tiles
2. **Service Worker** caching pro offline režim
3. **Debouncing** vyhledávání (300ms)
4. **Virtual scrolling** pro dlouhé seznamy
5. **Marker clustering** pro velké množství bodů
6. **Minifikace** CSS/JS v produkci
7. **Gzip komprese** na serveru

### Lighthouse Score (cíl)
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+
- PWA: 100

## 🧪 Testování

### Manuální testy

1. **Offline režim**
   - Otevřete DevTools → Network → Offline
   - Ověřte funkčnost aplikace

2. **Responzivita**
   - Testujte na různých zařízeních
   - Chrome DevTools → Device Toolbar

3. **Geolokace**
   - Povolte/zakažte geolokaci
   - Testujte chování aplikace

## 🚀 Budoucí vylepšení

### Priorita 1 (RICE: 85)
- ✅ Geofencing notifikace
- ✅ Realtime kolaborace
- ✅ AI generování reportů (Gemini)

### Priorita 2 (RICE: 72)
- ⏳ Integrace s Open-Meteo API (počasí)
- ⏳ OSRM routing (optimalizace tras)
- ⏳ Exporty do PDF

### Priorita 3 (RICE: 68)
- ⏳ Editační modály pro areály
- ⏳ Undo historie akcí
- ⏳ Simulace scénářů

## 📚 Teoretické rámce

### Použité principy

1. **Usability (Nielsen 1994)**
   - Visibility of system status
   - User control and freedom
   - Consistency and standards

2. **Fitts' Law**
   - Velká tlačítka pro časté akce
   - Minimalizace vzdálenosti kurzoru

3. **Double Diamond (Design Council)**
   - Discover → Define → Develop → Deliver

4. **RICE Prioritization**
   - Reach × Impact × Confidence / Effort

5. **OKR Framework**
   - Objectives and Key Results

## 🤝 Přispívání

1. Fork projektu
2. Vytvořte feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit změny (`git commit -m 'Add AmazingFeature'`)
4. Push do branch (`git push origin feature/AmazingFeature`)
5. Otevřete Pull Request

## 📄 Licence

MIT License - viz [LICENSE](LICENSE)

## 👥 Autoři

- **AI Assistant** - Vývoj aplikace
- **Dominik Schmied** - Zadání a specifikace

## 🙏 Poděkování

- Leaflet.js komunita
- Firebase tým
- OpenStreetMap přispěvatelé
- Chart.js vývojáři

## 📞 Kontakt

Pro dotazy a podporu:
- Email: d.schmied@lantaron.cz
- GitHub Issues: [Vytvořit issue](https://github.com/Dominik-88/vodohospodarstvo-pwa/issues)

---

**Vytvořeno s ❤️ pro efektivní správu vodohospodářské infrastruktury**
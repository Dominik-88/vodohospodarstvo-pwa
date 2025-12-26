# 🔧 Technická dokumentace

## Architektura aplikace

### Struktura projektu
```
vodohospodarstvo-pwa/
├── index.html          # Hlavní HTML soubor
├── app.js              # Hlavní JavaScript aplikace
├── data.js             # Data 41 areálů
├── firebase-config.js  # Firebase konfigurace
├── sw.js               # Service Worker
├── manifest.json       # PWA manifest
├── README.md           # Dokumentace
├── QUICKSTART.md       # Rychlý start
├── TECHNICAL.md        # Technická dokumentace
└── LICENSE             # MIT licence
```

## Technologie a knihovny

### Frontend
- **Vanilla JavaScript (ES6+)**
  - Moduly (import/export)
  - Arrow funkce
  - Template literals
  - Destructuring
  - Async/await

### Styling
- **Tailwind CSS 3.x**
  - Utility-first framework
  - Responzivní design
  - Custom komponenty

### Mapování
- **Leaflet.js 1.9.4**
  - Interaktivní mapy
  - Custom markery
  - Popupy
  
- **Leaflet.markercluster 1.5.3**
  - Seskupování markerů
  - Optimalizace výkonu
  
- **Leaflet.heat 0.2.0**
  - Heatmapa vizualizace
  - Gradient konfigurace

### Grafy
- **Chart.js 4.4.0**
  - Doughnut charts
  - Bar charts
  - Responzivní grafy

### Backend
- **Firebase 10.7.1**
  - Authentication (Email, Google)
  - Firestore Database
  - Hosting
  - Cloud Functions (připraveno)

## Datový model

### Areál
```typescript
interface Area {
  okres: 'CB' | 'CK' | 'PI' | 'PT' | 'ST' | 'TA';
  nazev: string;
  kategorie: 'I.' | 'II.' | null;
  oploceni: number;  // metry
  vymera: number;    // m²
  lat: number;       // zeměpisná šířka
  lng: number;       // zeměpisná délka
  mapUrl: string;    // Google Maps URL
}
```

### Statistiky
```typescript
interface Statistics {
  totalCount: number;
  totalArea: number;
  cat1Count: number;
  cat2Count: number;
  districtCounts: Record<string, number>;
}
```

## Algoritmy

### 1. Haversine Formula (Výpočet vzdálenosti)
```javascript
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Poloměr Země v km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
```

**Složitost:** O(1)  
**Přesnost:** ±0.5% pro vzdálenosti do 1000 km

### 2. Nearest Neighbor (Optimalizace trasy)
```javascript
function optimizeRoute(start, areas) {
  const route = [start];
  const remaining = [...areas];
  
  while (remaining.length > 0) {
    const current = route[route.length - 1];
    let nearest = null;
    let minDist = Infinity;
    
    remaining.forEach((area, index) => {
      const dist = calculateDistance(
        current.lat, current.lng, 
        area.lat, area.lng
      );
      if (dist < minDist) {
        minDist = dist;
        nearest = index;
      }
    });
    
    route.push(remaining[nearest]);
    remaining.splice(nearest, 1);
  }
  
  return route;
}
```

**Složitost:** O(n²)  
**Optimalizace:** Greedy algoritmus  
**Použití:** Rychlá aproximace TSP problému

### 3. Filtrace a řazení
```javascript
// Filtrace
filteredAreas = areasData.filter(area => {
  return matchesSearch && matchesDistrict && matchesCategory;
});

// Řazení
filteredAreas.sort((a, b) => {
  switch(sortBy) {
    case 'name': return a.nazev.localeCompare(b.nazev);
    case 'area-desc': return b.vymera - a.vymera;
    case 'distance': return distA - distB;
  }
});
```

**Složitost:** O(n log n)  
**Optimalizace:** Native JavaScript sort

## Service Worker strategie

### Cache First, Network Fallback
```javascript
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 1. Zkus cache
        if (response) return response;
        
        // 2. Zkus network
        return fetch(event.request)
          .then(response => {
            // 3. Ulož do cache
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, response));
            return response;
          })
          .catch(() => {
            // 4. Fallback
            return caches.match('/index.html');
          });
      })
  );
});
```

## Výkonnostní optimalizace

### 1. Lazy Loading
```javascript
// Načítání map tiles on-demand
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  loading: 'lazy'
});
```

### 2. Debouncing
```javascript
// Vyhledávání s 300ms debounce
let searchTimeout;
searchInput.addEventListener('input', () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(filterAreas, 300);
});
```

### 3. Marker Clustering
```javascript
// Seskupování markerů pro lepší výkon
markerClusterGroup = L.markerClusterGroup({
  maxClusterRadius: 50,
  spiderfyOnMaxZoom: true
});
```

### 4. Virtual Scrolling (připraveno)
```javascript
// Pro dlouhé seznamy (>100 položek)
function renderVisibleItems(scrollTop, containerHeight) {
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.ceil((scrollTop + containerHeight) / itemHeight);
  return items.slice(startIndex, endIndex);
}
```

## Bezpečnost

### Firebase Security Rules
```javascript
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

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://unpkg.com; 
               style-src 'self' 'unsafe-inline' https://unpkg.com; 
               img-src 'self' data: https:;">
```

## API Reference

### Hlavní funkce

#### `initMap()`
Inicializuje Leaflet mapu.

**Parametry:** Žádné  
**Návratová hodnota:** `void`

#### `loadAreas()`
Načte a zobrazí areály na mapě.

**Parametry:** Žádné  
**Návratová hodnota:** `void`

#### `filterAreas()`
Filtruje areály podle kritérií.

**Parametry:** Žádné (čte z DOM)  
**Návratová hodnota:** `void`

#### `calculateDistance(lat1, lon1, lat2, lon2)`
Vypočítá vzdálenost mezi dvěma body.

**Parametry:**
- `lat1: number` - Zeměpisná šířka bodu 1
- `lon1: number` - Zeměpisná délka bodu 1
- `lat2: number` - Zeměpisná šířka bodu 2
- `lon2: number` - Zeměpisná délka bodu 2

**Návratová hodnota:** `number` (vzdálenost v km)

#### `optimizeRoute()`
Optimalizuje trasu pomocí Nearest Neighbor.

**Parametry:** Žádné  
**Návratová hodnota:** `void`

## Testování

### Unit testy (připraveno)
```javascript
// Jest konfigurace
import { calculateDistance } from './app.js';

describe('calculateDistance', () => {
  test('vypočítá správnou vzdálenost', () => {
    const dist = calculateDistance(49.0, 14.0, 50.0, 15.0);
    expect(dist).toBeCloseTo(137.7, 1);
  });
});
```

### E2E testy (připraveno)
```javascript
// Playwright konfigurace
test('zobrazí mapu s areály', async ({ page }) => {
  await page.goto('http://localhost:8000');
  await expect(page.locator('#map')).toBeVisible();
  await expect(page.locator('.leaflet-marker-icon')).toHaveCount(41);
});
```

## Deployment

### Firebase Hosting
```bash
# firebase.json
{
  "hosting": {
    "public": ".",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{
      "source": "**",
      "destination": "/index.html"
    }]
  }
}
```

### Netlify
```toml
# netlify.toml
[build]
  publish = "."
  
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Monitoring a Analytics

### Google Analytics (připraveno)
```javascript
// gtag.js integrace
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'GA_MEASUREMENT_ID');
```

### Error Tracking (připraveno)
```javascript
// Sentry integrace
Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

## Budoucí vylepšení

### Priorita 1 (RICE: 85)
- [ ] Geofencing notifikace
- [ ] Realtime kolaborace
- [ ] AI generování reportů (Gemini)

### Priorita 2 (RICE: 72)
- [ ] Integrace s Open-Meteo API
- [ ] OSRM routing
- [ ] Exporty do PDF

### Priorita 3 (RICE: 68)
- [ ] Editační modály
- [ ] Undo historie
- [ ] Simulace scénářů

---

**Vytvořeno s ❤️ pro efektivní správu vodohospodářské infrastruktury**
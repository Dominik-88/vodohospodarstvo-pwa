// ============================================
// VODOHOSPODÁŘSKÉ AREÁLY - HLAVNÍ APLIKACE
// ============================================
// Autor: AI Assistant
// Verze: 1.0.0
// Popis: Kompletní PWA pro správu vodohospodářských areálů
// s Leaflet.js, Firebase, offline režimem a pokročilými funkcemi
// ============================================

import { auth, db, onAuthStateChanged, signInWithEmailAndPassword, signOut } from './firebase-config.js';
import { areasData } from './data.js';

// ============================================
// GLOBÁLNÍ PROMĚNNÉ
// ============================================
let map;
let markers = [];
let markerClusterGroup;
let heatmapLayer;
let userLocation = null;
let filteredAreas = [...areasData];
let isHeatmapVisible = false;
let isClusteringEnabled = true;

// ============================================
// INICIALIZACE APLIKACE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Inicializace aplikace...');
  
  initMap();
  loadAreas();
  initEventListeners();
  initAuth();
  
  setTimeout(() => {
    document.getElementById('loading').classList.add('hidden');
  }, 1000);
  
  window.addEventListener('online', () => {
    showNotification('✅ Připojení obnoveno', 'success');
  });
  
  window.addEventListener('offline', () => {
    showNotification('⚠️ Offline režim aktivní', 'warning');
  });
});

// ============================================
// INICIALIZACE MAPY
// ============================================
function initMap() {
  const center = [49.0, 14.4];
  
  map = L.map('map').setView(center, 9);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(map);
  
  markerClusterGroup = L.markerClusterGroup({
    maxClusterRadius: 50,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true
  });
  
  map.addLayer(markerClusterGroup);
  
  console.log('✅ Mapa inicializována');
}

// ============================================
// NAČTENÍ A ZOBRAZENÍ AREÁLŮ
// ============================================
function loadAreas() {
  console.log(`📍 Načítání ${areasData.length} areálů...`);
  
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];
  markerClusterGroup.clearLayers();
  
  filteredAreas.forEach(area => {
    const marker = createMarker(area);
    markers.push(marker);
    
    if (isClusteringEnabled) {
      markerClusterGroup.addLayer(marker);
    } else {
      marker.addTo(map);
    }
  });
  
  updateAreaList();
  updateStatistics();
  
  console.log('✅ Areály načteny');
}

// ============================================
// VYTVOŘENÍ MARKERU
// ============================================
function createMarker(area) {
  const color = getColorByCategory(area.kategorie);
  
  const icon = L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">${area.kategorie || '?'}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
  
  const marker = L.marker([area.lat, area.lng], { icon });
  
  const popupContent = `
    <div class="p-2">
      <h3 class="font-bold text-lg mb-2">${area.nazev}</h3>
      <div class="space-y-1 text-sm">
        <p><strong>Okres:</strong> ${area.okres}</p>
        <p><strong>Kategorie:</strong> ${area.kategorie || 'Bez kategorie'}</p>
        <p><strong>Výměra:</strong> ${area.vymera.toLocaleString('cs-CZ')} m²</p>
        <p><strong>Oplocení:</strong> ${area.oploceni.toLocaleString('cs-CZ')} bm</p>
        ${userLocation ? `<p><strong>Vzdálenost:</strong> ${calculateDistance(userLocation.lat, userLocation.lng, area.lat, area.lng).toFixed(1)} km</p>` : ''}
      </div>
      <div class="mt-3 space-y-2">
        <a href="${area.mapUrl}" target="_blank" class="block bg-blue-600 text-white text-center py-2 px-4 rounded hover:bg-blue-700">
          📍 Otevřít v Google Maps
        </a>
        <button onclick="window.showRouteToArea(${area.lat}, ${area.lng})" class="block w-full bg-green-600 text-white text-center py-2 px-4 rounded hover:bg-green-700">
          🚗 Navigovat
        </button>
      </div>
    </div>
  `;
  
  marker.bindPopup(popupContent, { maxWidth: 300 });
  marker.areaData = area;
  
  return marker;
}

// ============================================
// BARVA PODLE KATEGORIE
// ============================================
function getColorByCategory(category) {
  switch(category) {
    case 'I.': return '#dc2626';
    case 'II.': return '#f59e0b';
    default: return '#6b7280';
  }
}

// ============================================
// AKTUALIZACE SEZNAMU AREÁLŮ
// ============================================
function updateAreaList() {
  const listContainer = document.getElementById('areaList');
  listContainer.innerHTML = '';
  
  if (filteredAreas.length === 0) {
    listContainer.innerHTML = '<p class="text-gray-500 text-center py-4">Žádné areály nenalezeny</p>';
    return;
  }
  
  filteredAreas.forEach(area => {
    const item = document.createElement('div');
    item.className = 'bg-white border rounded-lg p-3 hover:shadow-md cursor-pointer transition';
    item.innerHTML = `
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <h3 class="font-semibold text-sm">${area.nazev}</h3>
          <p class="text-xs text-gray-600">${area.okres} • ${area.kategorie || 'Bez kat.'}</p>
          <p class="text-xs text-gray-500 mt-1">${area.vymera.toLocaleString('cs-CZ')} m²</p>
          ${userLocation ? `<p class="text-xs text-blue-600 mt-1">📍 ${calculateDistance(userLocation.lat, userLocation.lng, area.lat, area.lng).toFixed(1)} km</p>` : ''}
        </div>
        <div class="w-6 h-6 rounded-full" style="background-color: ${getColorByCategory(area.kategorie)}"></div>
      </div>
    `;
    
    item.addEventListener('click', () => {
      map.setView([area.lat, area.lng], 15);
      const marker = markers.find(m => m.areaData.nazev === area.nazev);
      if (marker) marker.openPopup();
    });
    
    listContainer.appendChild(item);
  });
  
  document.getElementById('filteredCount').textContent = `${filteredAreas.length} areálů`;
}

// ============================================
// AKTUALIZACE STATISTIK
// ============================================
function updateStatistics() {
  const total = filteredAreas.length;
  const totalArea = filteredAreas.reduce((sum, area) => sum + area.vymera, 0);
  const cat1 = filteredAreas.filter(a => a.kategorie === 'I.').length;
  const cat2 = filteredAreas.filter(a => a.kategorie === 'II.').length;
  
  document.getElementById('totalCount').textContent = total;
  document.getElementById('totalArea').textContent = `${(totalArea / 1000).toFixed(0)} tis. m²`;
  document.getElementById('cat1Count').textContent = cat1;
  document.getElementById('cat2Count').textContent = cat2;
}

// ============================================
// FILTRACE AREÁLŮ
// ============================================
function filterAreas() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const district = document.getElementById('districtFilter').value;
  const category = document.getElementById('categoryFilter').value;
  const sortBy = document.getElementById('sortBy').value;
  
  filteredAreas = areasData.filter(area => {
    const matchesSearch = area.nazev.toLowerCase().includes(searchTerm);
    const matchesDistrict = !district || area.okres === district;
    const matchesCategory = !category || 
      (category === 'none' ? !area.kategorie : area.kategorie === category);
    
    return matchesSearch && matchesDistrict && matchesCategory;
  });
  
  switch(sortBy) {
    case 'name':
      filteredAreas.sort((a, b) => a.nazev.localeCompare(b.nazev));
      break;
    case 'area-desc':
      filteredAreas.sort((a, b) => b.vymera - a.vymera);
      break;
    case 'area-asc':
      filteredAreas.sort((a, b) => a.vymera - b.vymera);
      break;
    case 'distance':
      if (userLocation) {
        filteredAreas.sort((a, b) => {
          const distA = calculateDistance(userLocation.lat, userLocation.lng, a.lat, a.lng);
          const distB = calculateDistance(userLocation.lat, userLocation.lng, b.lat, b.lng);
          return distA - distB;
        });
      }
      break;
  }
  
  loadAreas();
}

// ============================================
// VÝPOČET VZDÁLENOSTI (Haversine)
// ============================================
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// ============================================
// GEOLOKACE
// ============================================
function getUserLocation() {
  if (!navigator.geolocation) {
    showNotification('❌ Geolokace není podporována', 'error');
    return;
  }
  
  showNotification('📍 Zjišťuji polohu...', 'info');
  
  navigator.geolocation.getCurrentPosition(
    (position) => {
      userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      
      L.marker([userLocation.lat, userLocation.lng], {
        icon: L.divIcon({
          className: 'user-marker',
          html: '<div style="background-color: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
          iconSize: [20, 20]
        })
      }).addTo(map).bindPopup('📍 Vaše poloha');
      
      map.setView([userLocation.lat, userLocation.lng], 11);
      
      showNotification('✅ Poloha nalezena', 'success');
      
      document.getElementById('sortBy').value = 'distance';
      filterAreas();
    },
    (error) => {
      showNotification('❌ Nelze získat polohu: ' + error.message, 'error');
    }
  );
}

// ============================================
// HEATMAPA
// ============================================
function toggleHeatmap() {
  if (isHeatmapVisible) {
    map.removeLayer(heatmapLayer);
    isHeatmapVisible = false;
    showNotification('Heatmapa skryta', 'info');
  } else {
    const heatData = filteredAreas.map(area => [
      area.lat,
      area.lng,
      area.vymera / 10000
    ]);
    
    heatmapLayer = L.heatLayer(heatData, {
      radius: 25,
      blur: 15,
      maxZoom: 10,
      gradient: {
        0.0: 'blue',
        0.5: 'yellow',
        1.0: 'red'
      }
    }).addTo(map);
    
    isHeatmapVisible = true;
    showNotification('✅ Heatmapa zobrazena', 'success');
  }
}

// ============================================
// CLUSTERING
// ============================================
function toggleClustering() {
  isClusteringEnabled = !isClusteringEnabled;
  loadAreas();
  showNotification(
    isClusteringEnabled ? '✅ Clustering zapnut' : 'Clustering vypnut',
    'info'
  );
}

// ============================================
// EXPORT DO CSV
// ============================================
function exportToCSV() {
  const headers = ['Okres', 'Název', 'Kategorie', 'Výměra (m²)', 'Oplocení (bm)', 'Latitude', 'Longitude'];
  const rows = filteredAreas.map(area => [
    area.okres,
    area.nazev,
    area.kategorie || 'Bez kategorie',
    area.vymera,
    area.oploceni,
    area.lat,
    area.lng
  ]);
  
  let csv = headers.join(',') + '\n';
  rows.forEach(row => {
    csv += row.join(',') + '\n';
  });
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `arealy_export_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  
  showNotification('✅ Export dokončen', 'success');
}

// ============================================
// STATISTIKY - GRAFY
// ============================================
function showStatistics() {
  document.getElementById('statsModal').classList.remove('hidden');
  
  const catCtx = document.getElementById('categoryChart').getContext('2d');
  new Chart(catCtx, {
    type: 'doughnut',
    data: {
      labels: ['Kategorie I.', 'Kategorie II.', 'Bez kategorie'],
      datasets: [{
        data: [
          areasData.filter(a => a.kategorie === 'I.').length,
          areasData.filter(a => a.kategorie === 'II.').length,
          areasData.filter(a => !a.kategorie).length
        ],
        backgroundColor: ['#dc2626', '#f59e0b', '#6b7280']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });
  
  const districts = {};
  areasData.forEach(area => {
    districts[area.okres] = (districts[area.okres] || 0) + 1;
  });
  
  const distCtx = document.getElementById('districtChart').getContext('2d');
  new Chart(distCtx, {
    type: 'bar',
    data: {
      labels: Object.keys(districts),
      datasets: [{
        label: 'Počet areálů',
        data: Object.values(districts),
        backgroundColor: '#3b82f6'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  });
  
  const top10 = [...areasData]
    .sort((a, b) => b.vymera - a.vymera)
    .slice(0, 10);
  
  const areaCtx = document.getElementById('areaChart').getContext('2d');
  new Chart(areaCtx, {
    type: 'bar',
    data: {
      labels: top10.map(a => a.nazev.substring(4, 20)),
      datasets: [{
        label: 'Výměra (m²)',
        data: top10.map(a => a.vymera),
        backgroundColor: '#10b981'
      }]
    },
    options: {
      responsive: true,
      indexAxis: 'y',
      plugins: {
        legend: { display: false }
      }
    }
  });
}

// ============================================
// OPTIMALIZACE TRASY
// ============================================
function optimizeRoute() {
  if (!userLocation) {
    showNotification('⚠️ Nejprve zjistěte svou polohu', 'warning');
    return;
  }
  
  const route = [userLocation];
  const remaining = [...filteredAreas];
  
  while (remaining.length > 0) {
    const current = route[route.length - 1];
    let nearest = null;
    let minDist = Infinity;
    
    remaining.forEach((area, index) => {
      const dist = calculateDistance(current.lat, current.lng, area.lat, area.lng);
      if (dist < minDist) {
        minDist = dist;
        nearest = index;
      }
    });
    
    route.push(remaining[nearest]);
    remaining.splice(nearest, 1);
  }
  
  const routeCoords = route.map(point => [point.lat, point.lng]);
  L.polyline(routeCoords, {
    color: '#3b82f6',
    weight: 3,
    opacity: 0.7
  }).addTo(map);
  
  let totalDist = 0;
  for (let i = 0; i < route.length - 1; i++) {
    totalDist += calculateDistance(
      route[i].lat, route[i].lng,
      route[i+1].lat, route[i+1].lng
    );
  }
  
  showNotification(`✅ Trasa optimalizována: ${totalDist.toFixed(1)} km`, 'success');
}

// ============================================
// AUTENTIZACE
// ============================================
function initAuth() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      document.getElementById('userInfo').classList.remove('hidden');
      document.getElementById('loginPrompt').classList.add('hidden');
      document.getElementById('userName').textContent = user.displayName || 'Uživatel';
      document.getElementById('userEmail').textContent = user.email;
      document.getElementById('userInitial').textContent = (user.displayName || user.email)[0].toUpperCase();
    } else {
      document.getElementById('userInfo').classList.add('hidden');
      document.getElementById('loginPrompt').classList.remove('hidden');
    }
  });
}

function login() {
  const email = prompt('Email:');
  const password = prompt('Heslo:');
  
  if (email && password) {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => showNotification('✅ Přihlášení úspěšné', 'success'))
      .catch(err => showNotification('❌ Chyba: ' + err.message, 'error'));
  }
}

function logout() {
  signOut(auth)
    .then(() => showNotification('✅ Odhlášení úspěšné', 'success'))
    .catch(err => showNotification('❌ Chyba: ' + err.message, 'error'));
}

// ============================================
// NOTIFIKACE
// ============================================
function showNotification(message, type = 'info') {
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  };
  
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-[9999] transition-opacity`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ============================================
// EVENT LISTENERS
// ============================================
function initEventListeners() {
  document.getElementById('searchInput').addEventListener('input', filterAreas);
  document.getElementById('districtFilter').addEventListener('change', filterAreas);
  document.getElementById('categoryFilter').addEventListener('change', filterAreas);
  document.getElementById('sortBy').addEventListener('change', filterAreas);
  document.getElementById('resetFilters').addEventListener('click', () => {
    document.getElementById('searchInput').value = '';
    document.getElementById('districtFilter').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('sortBy').value = 'name';
    filterAreas();
  });
  
  document.getElementById('geolocateBtn').addEventListener('click', getUserLocation);
  document.getElementById('toggleHeatmap').addEventListener('click', toggleHeatmap);
  document.getElementById('toggleClustering').addEventListener('click', toggleClustering);
  document.getElementById('exportBtn').addEventListener('click', exportToCSV);
  document.getElementById('showStatsBtn').addEventListener('click', showStatistics);
  document.getElementById('closeStatsBtn').addEventListener('click', () => {
    document.getElementById('statsModal').classList.add('hidden');
  });
  document.getElementById('routeOptimizeBtn').addEventListener('click', optimizeRoute);
  
  document.getElementById('loginBtn').addEventListener('click', login);
  document.getElementById('logoutBtn').addEventListener('click', logout);
}

// ============================================
// GLOBÁLNÍ FUNKCE
// ============================================
window.showRouteToArea = (lat, lng) => {
  if (userLocation) {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${lat},${lng}`;
    window.open(url, '_blank');
  } else {
    showNotification('⚠️ Nejprve zjistěte svou polohu', 'warning');
  }
};

console.log('✅ Aplikace připravena');
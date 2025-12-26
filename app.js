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

// Pokračování v dalším souboru...
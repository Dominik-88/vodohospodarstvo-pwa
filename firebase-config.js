// ============================================
// FIREBASE KONFIGURACE
// ============================================
// DŮLEŽITÉ: Nahraďte těmito hodnotami z Firebase Console
// ============================================

// Import Firebase SDK (v9 modular)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Firebase konfigurace
// NAHRAĎTE těmito hodnotami z Firebase Console:
// 1. Jděte na https://console.firebase.google.com/
// 2. Vytvořte nový projekt
// 3. Přidejte webovou aplikaci
// 4. Zkopírujte konfiguraci sem
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Inicializace Firebase
let app, auth, db;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  console.log('✅ Firebase inicializován');
} catch (error) {
  console.warn('⚠️ Firebase není nakonfigurován. Aplikace běží v offline režimu.');
  console.warn('Nahraďte konfiguraci v firebase-config.js hodnotami z Firebase Console.');
}

// Export pro použití v aplikaci
export { 
  auth, 
  db, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
};
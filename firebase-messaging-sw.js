/* WallFlixHub Firebase Messaging Service Worker
   Saves background push notifications so they appear inside the website notifications page. */

importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyAzP0RUkpglCJGLSG3U_f_MDnA4Qkh1r0g',
  authDomain: 'wallflixhub-io.firebaseapp.com',
  projectId: 'wallflixhub-io',
  storageBucket: 'wallflixhub-io.firebasestorage.app',
  messagingSenderId: '331742171946',
  appId: '1:331742171946:web:3fecda85d1597baa970453',
  measurementId: 'G-E29GMX88E5'
});

const messaging = firebase.messaging();
const DB_NAME = 'wfhPushNotificationsDB';
const STORE_NAME = 'notifications';

function openDB(){
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if(!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME, { keyPath:'id' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function saveNotification(item){
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(item);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}

function normalizePayload(payload){
  payload = payload || {};
  const n = payload.notification || {};
  const d = payload.data || {};
  return {
    id: d.id || payload.messageId || ('push-' + Date.now() + '-' + Math.random().toString(36).slice(2)),
    title: n.title || d.title || 'WallFlixHub',
    body: n.body || d.body || 'New wallpaper available',
    icon: n.icon || d.icon || '/images/logo.png',
    image: n.image || d.image || '',
    url: d.url || d.link || '/',
    ts: Date.now(),
    read: false
  };
}

async function broadcastNotification(item){
  const clientsList = await self.clients.matchAll({ type:'window', includeUncontrolled:true });
  for(const client of clientsList){
    client.postMessage({ type:'WFH_PUSH_NOTIFICATION', payload:item });
  }
}

messaging.onBackgroundMessage(async (payload) => {
  const item = normalizePayload(payload);
  try{ await saveNotification(item); }catch(err){ console.warn('WFH notification DB save failed', err); }
  try{ await broadcastNotification(item); }catch(_e){}

  const options = {
    body: item.body,
    icon: item.icon || '/images/logo.png',
    badge: '/images/logo.png',
    image: item.image || undefined,
    data: { url:item.url, id:item.id },
    tag: item.id,
    renotify: false
  };
  return self.registration.showNotification(item.title, options);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification && event.notification.data && event.notification.data.url) || '/';
  event.waitUntil((async () => {
    const allClients = await clients.matchAll({ type:'window', includeUncontrolled:true });
    for(const client of allClients){
      if('focus' in client){
        client.postMessage({ type:'WFH_OPEN_NOTIFICATIONS' });
        return client.focus();
      }
    }
    if(clients.openWindow) return clients.openWindow(url);
  })());
});

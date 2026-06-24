importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAzP0RUkpglCJGLSG3U_f_MDnA4Qkh1r0g",
  authDomain: "wallflixhub-io.firebaseapp.com",
  databaseURL: "https://wallflixhub-io-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "wallflixhub-io",
  storageBucket: "wallflixhub-io.firebasestorage.app",
  messagingSenderId: "331742171946",
  appId: "1:331742171946:web:3fecda85d1597baa970453",
  measurementId: "G-E29GMX88E5"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notification = payload.notification || {};
  const data = payload.data || {};
  const title = notification.title || data.title || 'WallFlixHub';
  const options = {
    body: notification.body || data.body || 'New wallpaper available',
    icon: notification.icon || data.icon || '/images/logo.png',
    badge: '/images/logo.png',
    data: { url: data.url || data.link || '/' }
  };
  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification && event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(clients.openWindow(url));
});

importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDLv0FWvThD7h6EnHMb-l9Tn0pfOLfbvGE",
  authDomain: "wallflixhub.firebaseapp.com",
  projectId: "wallflixhub",
  storageBucket: "wallflixhub.firebasestorage.app",
  messagingSenderId: "621224536171",
  appId: "1:621224536171:web:f48f9a44609741fb63692e",
  measurementId: "G-BYR8JH0QTM"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || 'WallFlixHub';
  const options = {
    body: payload.notification?.body || 'New wallpaper available',
    icon: '/logo.png',
    badge: '/logo.png'
  };

  self.registration.showNotification(title, options);
});

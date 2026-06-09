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
};

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

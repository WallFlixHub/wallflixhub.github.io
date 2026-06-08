import { initializeApp } from "https://www.gstatic.com/firebasejs/9.24.0/firebase-app.js";
  import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.24.0/firebase-auth.js";
  import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.24.0/firebase-firestore.js";

  // Firebase new config from user
const firebaseConfig = {
  apiKey: "AIzaSyDLv0FWvThD7h6EnHMb-l9Tn0pfOLfbvGE",
  authDomain: "wallflixhub.firebaseapp.com",
  databaseURL: "https://wallflixhub-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "wallflixhub",
  storageBucket: "wallflixhub.firebasestorage.app",
  messagingSenderId: "621224536171",
  appId: "1:621224536171:web:dc3884c7d5c9026463692e",
  measurementId: "G-T6QZ6N8DDJ"
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const provider = new GoogleAuthProvider();

  const LOCAL_KEY = "my_wallpapers";

  function getLocalWallpapers() {
    const data = localStorage.getItem(LOCAL_KEY);
    return data ? JSON.parse(data) : [];
  }

  function saveLocalWallpapers(wallpapers) {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(wallpapers));
  }

  async function mergeWallpapers(uid) {
    const userDoc = doc(db, "users", uid);
    const localWallpapers = getLocalWallpapers();

    const docSnap = await getDoc(userDoc);
    if (docSnap.exists()) {
      const remoteWallpapers = docSnap.data().wallpapers || [];
      const merged = Array.from(new Set([...remoteWallpapers, ...localWallpapers]));
      await setDoc(userDoc, { wallpapers: merged }, { merge: true });
      saveLocalWallpapers(merged);
    } else {
      await setDoc(userDoc, { wallpapers: localWallpapers });
    }
  }

  async function googleLogin() {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Logged in as:", user.email);
      await mergeWallpapers(user.uid);

      document.getElementById("profileGoogleLoginBtn").style.display = "none";
      document.getElementById("profileLogoutBtn").style.display = "block";
      alert("Login successful! Wallpapers synced.");
    } catch (error) {
      console.error(error);
      alert("Login failed: " + error.message);
    }
  }

  async function logout() {
    try {
      await signOut(auth);
      console.log("Logged out");
      document.getElementById("profileGoogleLoginBtn").style.display = "block";
      document.getElementById("profileLogoutBtn").style.display = "none";
      // Optionally clear localStorage if needed:
      // localStorage.removeItem(LOCAL_KEY);
      alert("Logged out");
    } catch (error) {
      console.error(error);
    }
  }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      document.getElementById("profileGoogleLoginBtn").style.display = "none";
      document.getElementById("profileLogoutBtn").style.display = "block";
      console.log("User logged in:", user.email);
    } else {
      document.getElementById("profileGoogleLoginBtn").style.display = "block";
      document.getElementById("profileLogoutBtn").style.display = "none";
      console.log("No user logged in");
    }
  });

  window.googleLogin = googleLogin;
  window.logout = logout;

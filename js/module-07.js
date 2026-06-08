import { getFirestore, doc, updateDoc, getDocs, collection, query, where } from "https://www.gstatic.com/firebasejs/9.24.0/firebase-firestore.js";

  const db = getFirestore();

  async function toggleFeatured(wallpaperId, isActive) {
    try {
      const wallpaperDoc = doc(db, "wallpapers", wallpaperId);
      await updateDoc(wallpaperDoc, { featured: isActive });

      // بعد التحديث، استرجع جميع featured wallpapers
      const q = query(collection(db, "wallpapers"), where("featured", "==", true));
      const querySnapshot = await getDocs(q);
      const featuredWallpapers = [];
      querySnapshot.forEach((docSnap) => {
        featuredWallpapers.push({ id: docSnap.id, ...docSnap.data() });
      });

      // حدّث DOM مباشرة
      const featuredGrid = document.getElementById("wfhFeaturedGrid");
      featuredGrid.innerHTML = ""; // مسح القديم
      featuredWallpapers.forEach((wp) => {
        const card = document.createElement("div");
        card.className = "card";
        card.style.backgroundImage = `url(${wp.url})`;
        card.onclick = () => viewWallpaper(wp.id);
        featuredGrid.appendChild(card);
      });

      console.log("Featured wallpapers updated successfully!");
    } catch (error) {
      console.error("Error updating featured wallpaper:", error);
    }
  }

  // Make it globally accessible
  window.toggleFeatured = toggleFeatured;

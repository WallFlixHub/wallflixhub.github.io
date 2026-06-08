import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getFirestore, collection, addDoc, updateDoc, deleteDoc, doc,
  onSnapshot, query, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const WFH_FIREBASE_CONFIG = {
  apiKey:'AIzaSyDLv0FWvThD7h6EnHMb-l9Tn0pfOLfbvGE',
  authDomain:'wallflixhub.firebaseapp.com',
  databaseURL:'https://wallflixhub-default-rtdb.europe-west1.firebasedatabase.app',
  projectId:'wallflixhub',
  storageBucket:'wallflixhub.firebasestorage.app',
  messagingSenderId:'621224536171',
  appId:'1:621224536171:web:f48f9a44609741fb63692e',
  measurementId:'G-BYR8JH0QTM'
};

const COLLECTION_NAME = 'wallflixhub_uploads';
const app = getApps().length ? getApp() : initializeApp(WFH_FIREBASE_CONFIG);
const db = getFirestore(app);
window.fbDb = db;
window.firebaseReady = true;

function qs(id){ return document.getElementById(id); }
function cleanUrl(u){
  u = String(u || '').trim();
  if(!u) return '';
  try{ if(typeof fixGithubUrl === 'function') u = fixGithubUrl(u); }catch(e){}
  return u;
}
function looksLikeRemoteUrl(u){ return /^https?:\/\//i.test(String(u || '').trim()); }
function isImageUrl(u){
  const s = String(u || '').toLowerCase();
  return /^data:image\//i.test(s) || /\.(jpg|jpeg|png|webp|gif|avif|bmp|svg)(\?|#|$)/i.test(s) || s.includes('/image/upload/');
}
function isVideoUrl(u, type){
  const s = String(u || '').toLowerCase();
  if(isImageUrl(s)) return false;
  return type === 'live' || /^data:video\//i.test(s) || /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(s) || s.includes('/video/upload/');
}
function isDirectMediaUrl(u){
  const s = String(u || '').trim();
  return isImageUrl(s) || isVideoUrl(s, '') || /^https?:\/\/res\.cloudinary\.com\//i.test(s) || /^https?:\/\/raw\.githubusercontent\.com\//i.test(s);
}
function localSave(){
  try{ localStorage.setItem('wfhUploads', JSON.stringify(uploads || [])); }catch(e){}
}
function mergeUploads(cloudItems){
  const oldLocal = Array.isArray(window.uploads) ? window.uploads : [];
  const out = [];
  const seen = new Set();
  [...cloudItems, ...oldLocal].forEach(item => {
    if(!item || !item.url) return;
    const key = String(item.firestoreId || item.id || item.url);
    const urlKey = 'url:' + String(item.url);
    if(seen.has(key) || seen.has(urlKey)) return;
    seen.add(key); seen.add(urlKey);
    out.push(item);
  });
  uploads = out;
  localSave();
}
function rerender(){
  try{ if(typeof render === 'function') render(); }catch(e){}
  try{ if(typeof renderAdmin === 'function') renderAdmin(); }catch(e){}
  try{ if(typeof updateStats === 'function') updateStats(); }catch(e){}
  try{ if(typeof startHeroSlider === 'function') setTimeout(startHeroSlider, 120); }catch(e){}
}
function toastSafe(msg){ try{ toast(msg); }catch(e){ console.log(msg); } }

onSnapshot(query(collection(db, COLLECTION_NAME), orderBy('createdAt','desc')), snap => {
  const cloudItems = snap.docs.map(d => {
    const x = d.data() || {};
    return {
      id: x.id || d.id,
      firestoreId: d.id,
      title: x.title || 'New Wallpaper',
      url: x.url || '',
      type: x.type || 'static',
      cat: x.cat || 'Anime',
      likes: Number(x.likes || 0),
      views: Number(x.views || 0),
      downloads: Number(x.downloads || 0),
      featured: !!x.featured,
      createdAt: Number(x.createdAtMs || x.createdAt || Date.now()),
      updatedAt: Number(x.updatedAtMs || x.updatedAt || Date.now())
    };
  });
  mergeUploads(cloudItems);
  rerender();
}, err => {
  console.warn('WFH Firestore uploads listener error:', err);
  toastSafe('Firestore rules / connection problem');
});

window.publishItem = async function(){
  const title = (qs('quickTitle')?.value || 'New Wallpaper').trim();
  let url = cleanUrl(qs('quickUrl')?.value || '');
  const fileData = typeof chosenFileData !== 'undefined' ? chosenFileData : '';

  if(!url && fileData){
    toastSafe('استعمل رابط Cloudinary/GitHub باش تبان عند الجميع');
    return;
  }
  if(!url){ toastSafe('دخل رابط صورة Cloudinary أو فيديو MP4 مباشر'); return; }
  if(!looksLikeRemoteUrl(url)){
    toastSafe('الرابط خاصو يبدأ بـ https://');
    return;
  }

  if(!isDirectMediaUrl(url)){
    toastSafe('الرابط خاصو يكون صورة مباشرة أو فيديو مباشر');
    return;
  }

  let type = qs('quickType')?.value || 'static';
  const mode = typeof uploadMode !== 'undefined' ? uploadMode : 'static';
  if(isImageUrl(url)){
    type = (type === 'premium') ? 'premium' : 'static';
  }else if(mode === 'live' || isVideoUrl(url, type)){
    type = 'live';
  }else if(type !== 'premium'){
    type = 'static';
  }

  const cat = qs('quickCat')?.value || 'Anime';
  const now = Date.now();

  try{
    if(typeof wfhEditingId !== 'undefined' && wfhEditingId){
      const current = (uploads || []).find(u => String(u.id) === String(wfhEditingId));
      const patch = { title, url, type, cat, updatedAtMs: now, updatedAt: now };
      if(current && current.firestoreId){
        await updateDoc(doc(db, COLLECTION_NAME, current.firestoreId), patch);
      }else{
        const idx = (uploads || []).findIndex(u => String(u.id) === String(wfhEditingId));
        if(idx > -1){ uploads[idx] = {...uploads[idx], ...patch}; localSave(); }
      }
      wfhEditingId = null;
      if(qs('publishBtn')) qs('publishBtn').innerHTML = '<i class="fa-solid fa-upload"></i> Publish Wallpaper';
      toastSafe('Updated in Firestore');
    }else{
      const item = {
        id: now,
        title, url, type, cat,
        likes:0, views:0, downloads:0,
        createdAtMs: now,
        updatedAtMs: now,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      const ref = await addDoc(collection(db, COLLECTION_NAME), item);
      const localItem = {...item, firestoreId: ref.id, createdAt: now, updatedAt: now};
      window.uploads = [localItem, ...(uploads || []).filter(u => String(u.url) !== String(url))];
      localSave();
      toastSafe(type === 'live' ? 'Video saved to Firestore' : 'Wallpaper saved to Firestore');
    }

    if(qs('quickTitle')) qs('quickTitle').value = '';
    if(qs('quickUrl')) qs('quickUrl').value = '';
    try{ if(typeof setUploadMode === 'function') setUploadMode(type === 'live' ? 'live' : 'static'); }catch(e){}
    rerender();
    const first = (uploads || []).find(u => String(u.url) === String(url));
    if(first && typeof openViewer === 'function') setTimeout(() => openViewer(first.id), 250);
  }catch(e){
    console.error('Publish to Firestore failed:', e);
    toastSafe('Firestore publish failed: شوف Rules');
  }
};

window.deleteUpload = async function(id, confirmDelete=true){
  const item = (uploads || []).find(u => String(u.id) === String(id));
  if(confirmDelete && !confirm('واش متأكد بغيتي تمسح هاد Wallpaper / Video؟')) return;
  try{
    if(item && item.firestoreId) await deleteDoc(doc(db, COLLECTION_NAME, item.firestoreId));
    window.uploads = (uploads || []).filter(u => String(u.id) !== String(id));
    localSave();
    rerender();
    toastSafe('Deleted from Firestore');
  }catch(e){
    console.error('Delete from Firestore failed:', e);
    toastSafe('Delete failed');
  }
};

console.log('WFH Firestore global publish fix loaded');

import { doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

(function(){
  function safeToast(msg){
    try{
      const t=document.getElementById('toast');
      if(t){
        t.textContent=msg;
        t.classList.add('show');
        setTimeout(()=>t.classList.remove('show'),2600);
      }else alert(msg);
    }catch(e){ alert(msg); }
  }

  function syncUI(){
    try{
      const user = window.fbUser || null;
      const acc=document.getElementById('syncAccountText');
      const st=document.getElementById('syncStatusText');
      const btn=document.getElementById('syncLoginBtn');
      if(acc) acc.textContent='Account: '+(user ? (user.email || user.displayName || 'Connected') : 'Not connected');
      if(st) st.textContent='Last backup: '+(localStorage.getItem('wfhLastBackup') || 'Not synced yet');
      if(btn) btn.style.display=user ? 'none' : 'block';
    }catch(e){}
  }

  function arr(name, fallback){
    try{
      if(Array.isArray(window[name])) return window[name];
      if(typeof eval(name) !== 'undefined' && Array.isArray(eval(name))) return eval(name);
    }catch(e){}
    return fallback || [];
  }

  function obj(name){
    try{
      if(window[name] && typeof window[name] === 'object') return window[name];
      if(typeof eval(name) !== 'undefined' && eval(name) && typeof eval(name) === 'object') return eval(name);
    }catch(e){}
    return {};
  }

  function cleanString(s, max){
    s = String(s || '');
    return s.length > max ? s.slice(0, max) : s;
  }

  function safeUpload(u){
    u = u || {};
    let url = cleanString(u.url || '', 250000);

    /* Firestore document has a small size limit.
       Big base64 video/image files make backup fail with invalid-argument.
       Keep Direct URL uploads. For local files, keep metadata and warn user. */
    const isData = /^data:/i.test(url);
    const tooBig = url.length > 700000;
    if(isData || tooBig){
      url = '';
    }

    return {
      id: String(u.id || Date.now()),
      title: cleanString(u.title || 'New Wallpaper', 160),
      url: url,
      type: cleanString(u.type || 'static', 30),
      cat: cleanString(u.cat || 'Other', 60),
      likes: Number.isFinite(Number(u.likes)) ? Number(u.likes) : 0,
      views: Number.isFinite(Number(u.views)) ? Number(u.views) : 0,
      downloads: Number.isFinite(Number(u.downloads)) ? Number(u.downloads) : 0,
      cloudNote: (isData || tooBig) ? 'Local file needs Firebase Storage or Direct URL' : ''
    };
  }

  function cleanObjectMap(o, maxItems){
    const out = {};
    o = o || {};
    Object.keys(o).slice(0, maxItems || 300).forEach(k=>{
      const v = o[k];
      if(Array.isArray(v)){
        out[String(k)] = v.slice(-50).map(x=>{
          if(x && typeof x === 'object'){
            return {
              text: cleanString(x.text || '', 500),
              date: cleanString(x.date || '', 80)
            };
          }
          return cleanString(x, 500);
        });
      }else if(v && typeof v === 'object'){
        out[String(k)] = JSON.parse(JSON.stringify(v, (key,val)=>{
          if(val === undefined || typeof val === 'function') return null;
          if(typeof val === 'string') return cleanString(val, 500);
          if(typeof val === 'number') return Number.isFinite(val) ? val : 0;
          return val;
        }));
      }else{
        out[String(k)] = cleanString(v, 500);
      }
    });
    return out;
  }

  function backupData(){
    const up = arr('uploads', []);
    const f = arr('favs', []);
    const d = arr('downs', []);
    const c = obj('comments');
    const r = obj('ratings');

    return {
      uploads: up.map(safeUpload).slice(0, 250),
      favorites: f.map(x=>String(x)).slice(0,500),
      downloads: d.map(x=>String(x)).slice(0,500),
      comments: cleanObjectMap(c, 250),
      ratings: cleanObjectMap(r, 500),
      theme: document.body.classList.contains('light-mode') ? 'light' : 'dark',
      language: document.documentElement.lang || 'en',
      updatedAt: serverTimestamp()
    };
  }

  window.updateSyncUI = syncUI;

  window.backupToFirebase = async function(){
    try{
      const user = window.fbUser || null;
      const db = window.fbDb || null;

      if(!user){ safeToast('Login with Google first'); return; }
      if(!db){ safeToast('Firestore not ready. Reload page'); return; }

      const data = backupData();
      const bigLocalFiles = data.uploads.filter(u=>!u.url && u.cloudNote).length;

      safeToast('Backing up...');
      await setDoc(doc(db, 'users', String(user.uid)), data, {merge:true});

      const now = new Date().toLocaleString();
      localStorage.setItem('wfhLastBackup', now);
      syncUI();

      if(bigLocalFiles){
        safeToast('Backup done. Local files need Direct URL');
      }else{
        safeToast('Backup to Firebase done');
      }
    }catch(e){
      console.error('Backup failed:', e);
      const msg = String((e && (e.code || e.message)) || 'Unknown error');
      if(msg.toLowerCase().includes('permission')){
        safeToast('Backup failed: Firestore Rules blocked');
      }else if(msg.toLowerCase().includes('invalid')){
        safeToast('Backup failed: bad upload data fixed? Try Direct URL');
      }else{
        safeToast('Backup failed: '+msg.slice(0,70));
      }
    }
  };

  window.restoreFromFirebase = async function(){
    try{
      const user = window.fbUser || null;
      const db = window.fbDb || null;

      if(!user){ safeToast('Login with Google first'); return; }
      if(!db){ safeToast('Firestore not ready. Reload page'); return; }

      safeToast('Restoring...');
      const snap = await getDoc(doc(db, 'users', String(user.uid)));
      if(!snap.exists()){ safeToast('No cloud backup found'); return; }

      const d = snap.data() || {};
      const up = Array.isArray(d.uploads) ? d.uploads : [];
      const fv = Array.isArray(d.favorites) ? d.favorites : [];
      const dn = Array.isArray(d.downloads) ? d.downloads : [];

      window.uploads = up;
      window.favs = fv;
      window.downs = dn;
      window.comments = d.comments || {};
      window.ratings = d.ratings || {};

      try{ uploads = up; favs = fv; downs = dn; comments = d.comments || {}; ratings = d.ratings || {}; }catch(e){}

      localStorage.setItem('wfhUploads', JSON.stringify(up));
      localStorage.setItem('wfhFavs', JSON.stringify(fv));
      localStorage.setItem('wfhDowns', JSON.stringify(dn));
      localStorage.setItem('wfhComments', JSON.stringify(d.comments || {}));
      localStorage.setItem('wfhRatings', JSON.stringify(d.ratings || {}));

      if(typeof render === 'function') render();
      syncUI();
      safeToast('Restored from Firebase');
    }catch(e){
      console.error('Restore failed:', e);
      const msg = String((e && (e.code || e.message)) || 'Unknown error');
      if(msg.toLowerCase().includes('permission')) safeToast('Restore failed: Firestore Rules blocked');
      else safeToast('Restore failed: '+msg.slice(0,70));
    }
  };

  document.addEventListener('DOMContentLoaded', syncUI);
  setTimeout(syncUI, 500);
  setTimeout(syncUI, 1600);
})();

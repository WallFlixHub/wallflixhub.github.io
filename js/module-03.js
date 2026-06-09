import { doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

(function(){
  let backupTimer=null;
  let restoring=false;
  let restoredOnce=false;

  function toastMsg(msg){
    try{
      const t=document.getElementById('toast');
      if(t){
        t.textContent=msg;
        t.classList.add('show');
        setTimeout(()=>t.classList.remove('show'),2200);
      }
    }catch(e){}
  }

  function g(name, fallback){
    try{
      if(name in window) return window[name];
      if(typeof eval(name)!=='undefined') return eval(name);
    }catch(e){}
    return fallback;
  }

  function s(name, value){
    window[name]=value;
    try{ eval(name+' = value'); }catch(e){}
  }

  function up(){return Array.isArray(g('uploads',[]))?g('uploads',[]):[]}
  function fv(){return Array.isArray(g('favs',[]))?g('favs',[]):[]}
  function dn(){return Array.isArray(g('downs',[]))?g('downs',[]):[]}
  function cm(){const x=g('comments',{});return x&&typeof x==='object'?x:{}}
  function rt(){const x=g('ratings',{});return x&&typeof x==='object'?x:{}}

  function saveLocal(){
    localStorage.setItem('wfhUploads',JSON.stringify(up()));
    localStorage.setItem('wfhFavs',JSON.stringify(fv()));
    localStorage.setItem('wfhDowns',JSON.stringify(dn()));
    localStorage.setItem('wfhComments',JSON.stringify(cm()));
    localStorage.setItem('wfhRatings',JSON.stringify(rt()));
  }

  function short(v,max){
    v=String(v||'');
    return v.length>max?v.slice(0,max):v;
  }

  function safeUpload(u){
    u=u||{};
    let url=short(u.url||'',650000);
    const bad=/^data:/i.test(url) || url.length>640000;
    if(bad) url='';
    return {
      id:String(u.id||Date.now()),
      title:short(u.title||'New Wallpaper',160),
      url:url,
      type:short(u.type||'static',30),
      cat:short(u.cat||'Other',60),
      likes:Number.isFinite(Number(u.likes))?Number(u.likes):0,
      views:Number.isFinite(Number(u.views))?Number(u.views):0,
      downloads:Number.isFinite(Number(u.downloads))?Number(u.downloads):0,
      updatedAt:Number(u.updatedAt||u.createdAt||u.id||Date.now())||Date.now(),
      cloudNote:bad?'Use Cloudinary Direct URL':''
    };
  }

  function cleanMap(o,maxItems){
    const out={}; o=o||{};
    Object.keys(o).slice(0,maxItems||300).forEach(k=>{
      const v=o[k];
      if(Array.isArray(v)){
        out[String(k)] = v.slice(-80).map(x=>{
          if(x&&typeof x==='object') return {text:short(x.text||'',500),date:short(x.date||'',80)};
          return short(x,500);
        });
      }else if(typeof v==='number'){
        out[String(k)] = Number.isFinite(v)?v:0;
      }else if(v&&typeof v==='object'){
        try{out[String(k)] = JSON.parse(JSON.stringify(v,(key,val)=>{
          if(val===undefined||typeof val==='function') return null;
          if(typeof val==='string') return short(val,500);
          if(typeof val==='number') return Number.isFinite(val)?val:0;
          return val;
        }));}catch(e){out[String(k)]={};}
      }else{
        out[String(k)] = short(v,500);
      }
    });
    return out;
  }

  function mergeUploads(local, cloud){
    const map=new Map();
    [...(cloud||[]),...(local||[])].forEach(u=>{
      if(!u) return;
      const key=String(u.id||u.url||u.title||Math.random());
      const old=map.get(key)||{};
      map.set(key,{
        ...old,
        ...u,
        likes:Math.max(Number(old.likes||0),Number(u.likes||0)),
        views:Math.max(Number(old.views||0),Number(u.views||0)),
        downloads:Math.max(Number(old.downloads||0),Number(u.downloads||0))
      });
    });
    return [...map.values()].sort((a,b)=>Number(b.id||0)-Number(a.id||0));
  }

  function mergeArray(a,b){return [...new Set([...(b||[]).map(String),...(a||[]).map(String)])]}
  function mergeObj(a,b){return {...(b||{}),...(a||{})}}

  function syncUI(){
    const user=window.fbUser||null;
    const acc=document.getElementById('syncAccountText');
    const st=document.getElementById('syncStatusText');
    const btn=document.getElementById('syncLoginBtn');
    if(acc) acc.textContent='Account: '+(user?(user.email||user.displayName||'Connected'):'Not connected');
    if(st) st.textContent='Last backup: '+(localStorage.getItem('wfhLastBackup')||'Not synced yet');
    if(btn) btn.style.display=user?'none':'block';
  }

  function cloudData(){
    return {
      uploads:up().map(safeUpload).slice(0,350),
      favorites:fv().map(String).slice(0,800),
      downloads:dn().map(String).slice(0,800),
      comments:cleanMap(cm(),350),
      ratings:cleanMap(rt(),700),
      theme:document.body.classList.contains('light-mode')?'light':'dark',
      language:document.documentElement.lang||'en',
      updatedAt:serverTimestamp()
    };
  }

  async function doBackup(silent){
    const user=window.fbUser||null, db=window.fbDb||null;
    if(!user){if(!silent)toastMsg('Login with Google first');return false}
    if(!db){if(!silent)toastMsg('Firestore not ready');return false}
    try{
      if(!silent) toastMsg('Backing up...');
      await setDoc(doc(db,'users',String(user.uid)),cloudData(),{merge:true});
      localStorage.setItem('wfhLastBackup',new Date().toLocaleString());
      syncUI();
      if(!silent) toastMsg('Backup to Firebase done');
      return true;
    }catch(e){
      console.error(e);
      if(!silent) toastMsg('Backup failed: use Cloudinary URL');
      return false;
    }
  }

  async function doRestore(){
    const user=window.fbUser||null, db=window.fbDb||null;
    if(!user){toastMsg('Login with Google first');return false}
    if(!db){toastMsg('Firestore not ready');return false}
    try{
      restoring=true;
      toastMsg('Restoring...');
      const snap=await getDoc(doc(db,'users',String(user.uid)));
      if(!snap.exists()){toastMsg('No cloud backup found');return false}
      const d=snap.data()||{};
      const mu=mergeUploads(up(),Array.isArray(d.uploads)?d.uploads:[]);
      const mf=mergeArray(fv(),Array.isArray(d.favorites)?d.favorites:[]);
      const md=mergeArray(dn(),Array.isArray(d.downloads)?d.downloads:[]);
      const mc=mergeObj(cm(),d.comments||{});
      const mr=mergeObj(rt(),d.ratings||{});
      s('uploads',mu); s('favs',mf); s('downs',md); s('comments',mc); s('ratings',mr);
      saveLocal();
      if(typeof render==='function') render();
      if(typeof updateStats==='function') updateStats();
      syncUI();
      toastMsg('Restored + merged from Firebase');
      setTimeout(()=>doBackup(true),900);
      return true;
    }catch(e){
      console.error(e);
      toastMsg('Restore failed');
      return false;
    }finally{
      setTimeout(()=>{restoring=false},1200);
    }
  }

  window.backupToFirebase=function(){return doBackup(false)};
  window.restoreFromFirebase=doRestore;
  window.updateSyncUI=syncUI;
  window.wfhAutoBackup=function(){
    if(restoring || !window.fbUser || !window.fbDb) return;
    clearTimeout(backupTimer);
    backupTimer=setTimeout(()=>doBackup(true),1200);
  };

  const oldPublish=window.publishItem;
  window.publishItem=function(){
    const result=oldPublish?oldPublish.apply(this,arguments):undefined;
    setTimeout(()=>{saveLocal();window.wfhAutoBackup();},700);
    return result;
  };

  const oldDelete=window.deleteUpload;
  window.deleteUpload=function(){
    const result=oldDelete?oldDelete.apply(this,arguments):undefined;
    setTimeout(()=>{saveLocal();window.wfhAutoBackup();},700);
    return result;
  };

  const oldEdit=window.editUpload;
  window.editUpload=function(){
    const result=oldEdit?oldEdit.apply(this,arguments):undefined;
    setTimeout(()=>{saveLocal();window.wfhAutoBackup();},700);
    return result;
  };

  ['toggleLike','downloadCurrent','addComment','rate'].forEach(fn=>{
    const old=window[fn];
    if(typeof old==='function'){
      window[fn]=function(){
        const result=old.apply(this,arguments);
        setTimeout(()=>{saveLocal();window.wfhAutoBackup();},1000);
        return result;
      };
    }
  });

  setInterval(()=>{
    if(window.fbUser && window.fbDb && !restoredOnce){
      restoredOnce=true;
      setTimeout(()=>doRestore(),1200);
    }
  },1200);

  document.addEventListener('DOMContentLoaded',syncUI);
  setTimeout(syncUI,500);
  setTimeout(syncUI,1800);
})();

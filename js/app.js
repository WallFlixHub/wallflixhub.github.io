// WallFlixHub cleaned app layer
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-QHWGTYQHGL');

/* Added from SnapTube Video.7z - local videos */
BASE_WALLPAPERS.unshift(...[{"id":1790000000001,"title":"Amoled 90 Live","url":"videos/amoled_90-live.mp4","type":"live","cat":"AMOLED","likes":901,"views":4212,"downloads":651,"createdAt":1790000000001},{"id":1790000000002,"title":"Anime 1 Live","url":"videos/anime_1-live.mp4","type":"live","cat":"Anime","likes":902,"views":4224,"downloads":652,"createdAt":1790000000002},{"id":1790000000003,"title":"Anime 2 Live","url":"videos/anime_2-live.mp4","type":"live","cat":"Anime","likes":903,"views":4236,"downloads":653,"createdAt":1790000000003},{"id":1790000000004,"title":"Anime 3 Live","url":"videos/anime_3-live.mp4","type":"live","cat":"Anime","likes":904,"views":4248,"downloads":654,"createdAt":1790000000004},{"id":1790000000005,"title":"Car 1 Live","url":"videos/car_1-live.mp4","type":"live","cat":"Cars","likes":905,"views":4260,"downloads":655,"createdAt":1790000000005},{"id":1790000000006,"title":"Car 2 Live","url":"videos/car_2-live.mp4","type":"live","cat":"Cars","likes":906,"views":4272,"downloads":656,"createdAt":1790000000006}]);


let favs=JSON.parse(localStorage.getItem('wfhFavs')||'[]'),downs=JSON.parse(localStorage.getItem('wfhDowns')||'[]'),uploads=JSON.parse(localStorage.getItem('wfhUploads')||'[]'),comments=JSON.parse(localStorage.getItem('wfhComments')||'{}'),ratings=JSON.parse(localStorage.getItem('wfhRatings')||'{}');let wallpapers=[],current=null,slide=0,uploadMode='static',chosenFileData='',chosenFileType='',firebaseReady=false,fbAuth=null,fbDb=null,fbUser=null;
function $(id){return document.getElementById(id)}function save(k,v){localStorage.setItem(k,JSON.stringify(v))}function allWalls(){wallpapers=[...uploads,...BASE_WALLPAPERS.filter(b=>!uploads.some(u=>String(u.id)===String(b.id)))];return wallpapers}function isVideo(w){const u=String(w?.url||'').toLowerCase();return w?.type==='live'||u.startsWith('data:video/')||/\.(mp4|webm|mov)(\?|#|$)/i.test(u)||u.includes('/video/upload/')}function mediaHTML(w){return isVideo(w)?`<video src="${w.url}" muted loop playsinline preload="metadata"></video>`:`<img src="${w.url}">`}
function card(w,small=false){let liked=favs.includes(w.id);return `<div class="card ${small?'small':''} ${isVideo(w)?'live':''}" onclick="openViewer(${w.id})">${mediaHTML(w)}<span class="card-tag ${isVideo(w)?'tag-live':'tag-premium'}">${isVideo(w)?'LIVE':w.type==='premium'?'PREMIUM':'4K'}</span><div class="card-stats"><span onclick="event.stopPropagation();toggleLike(${w.id},this)"><i class="fa-${liked?'solid heart-red':'regular'} fa-heart"></i> <span class="like-count">${w.likes||0}</span></span><span><i class="fa-regular fa-eye"></i> ${w.views||0}</span></div></div>`}
function cat(c){return `<div class="cat" onclick="filterCat('${c[0]}')"><i class="fa-solid ${c[1]}" style="color:${c[2]}"></i><b>${c[0]}</b><span>${allWalls().filter(w=>w.cat===c[0]).length} items</span></div>`}
function render(){allWalls();const prem=wallpapers.filter(w=>w.type==='premium').slice(0,4);$('slider').innerHTML=prem.map(w=>`<div class="slide" onclick="openViewer(${w.id})" style="background-image:url('${w.url}')"><div class="slide-content"><span class="tag">EDITOR CHOICE</span><h2>${w.title}</h2><p>${w.cat} premium wallpaper</p><button class="btn">View Wallpaper</button></div></div>`).join('');$('dots').innerHTML=prem.map((_,i)=>`<span class="${i===slide?'active':''}"></span>`).join('');$('homeTrending').innerHTML=wallpapers.slice(0,3).map(w=>card(w,true)).join('');$('homeCats').innerHTML=categories.slice(0,3).map(cat).join('');$('newArrivals').innerHTML=wallpapers.slice(0,4).map(w=>card(w)).join('');$('exploreGrid').innerHTML=wallpapers.map(w=>card(w)).join('');$('liveGrid').innerHTML=wallpapers.filter(isVideo).map(w=>card(w)).join('')||'<p style="color:var(--muted);grid-column:1/-1;text-align:center">No ringtones yet</p>';$('catGrid').innerHTML=categories.map(cat).join('');$('trendGrid').innerHTML=[...wallpapers].sort((a,b)=>(b.likes+b.downloads)-(a.likes+a.downloads)).slice(0,12).map(w=>card(w)).join('');$('newGrid').innerHTML=wallpapers.slice(0,12).map(w=>card(w)).join('');$('editorGrid').innerHTML=wallpapers.filter(w=>w.type==='premium').map(w=>card(w)).join('');$('mostGrid').innerHTML=[...wallpapers].sort((a,b)=>b.downloads-a.downloads).map(w=>card(w)).join('');$('langList').innerHTML=langs.map(l=>`<div class="lang" onclick="setLang('${l[0]}',this)"><span>${l[1]}</span><b>${l[2]}</b></div>`).join('');$('requestList').innerHTML=[['Joker_2026','Need 4K dark Zoro background neon colors','PENDING'],['Saber_Hub','Live scrolling galaxy abstract layout','READY']].map(r=>`<div class="row"><div><b>${r[0]}</b><p>${r[1]}</p></div><span class="pill">${r[2]}</span></div>`).join('');$('notifList').innerHTML=[['fa-crown','Weekly Premium lineup updated','2m'],['fa-cloud-arrow-up','Admin approved your request','1h'],['fa-heart','Your wallpaper reached 10K views','5h']].map(n=>`<div class="row"><i class="fa-solid ${n[0]}" style="color:var(--glow);font-size:23px"></i><div><b>${n[1]}</b><p>${n[2]} ago</p></div></div>`).join('');renderFavs();renderDowns();renderAdmin();wfhRenderTopMonth();wfhRenderRecentlyViewed();updateStats()}
function go(id,btn){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));$(id)?.classList.add('active');document.querySelectorAll('.nav').forEach(n=>n.classList.remove('active'));if(btn)btn.classList.add('active');document.querySelector('.viewport').scrollTo(0,0);if(id==='admin')renderAdmin();if(id==='topmonth')wfhRenderTopMonth()}function filterCat(name){go('explore');$('exploreGrid').innerHTML=allWalls().filter(w=>w.cat===name).map(w=>card(w)).join('')||'<p style="color:var(--muted)">No wallpapers</p>'}
function setUploadMode(mode){uploadMode=(mode==='live'||mode==='video')?'live':'static';$('wallTab').classList.toggle('active',uploadMode==='static');$('videoTab').classList.toggle('active',uploadMode==='live');$('quickType').value=uploadMode==='live'?'live':'static';if($('quickFileInput')){$('quickFileInput').value='';$('quickFileInput').accept=uploadMode==='live'?'video/*':'image/*'}if($('pickText'))$('pickText').innerHTML='<i class="fa-solid fa-link"></i> Cloudinary URL Only';if($('quickFileName'))$('quickFileName').textContent='Direct URL only';$('publishBtn').innerHTML=uploadMode==='live'?'<i class="fa-solid fa-upload"></i> Publish Video':'<i class="fa-solid fa-upload"></i> Publish Wallpaper';$('uploadPreview').style.display='none';$('uploadPreview').innerHTML='';chosenFileData='';chosenFileType=''}
function previewUploadFile(e){const f=e.target.files[0];if(!f)return;chosenFileType=f.type||'';if(chosenFileType.startsWith('video')){uploadMode='live';$('videoTab').classList.add('active');$('wallTab').classList.remove('active');$('quickType').value='live';$('pickText').innerHTML='<i class="fa-solid fa-film"></i> Choose Video';$('publishBtn').innerHTML='<i class="fa-solid fa-upload"></i> Publish Video'}$('quickFileName').textContent=f.name;const r=new FileReader();r.onload=ev=>{chosenFileData=ev.target.result;$('uploadPreview').style.display='block';$('uploadPreview').innerHTML=uploadMode==='live'?`<video src="${chosenFileData}" controls playsinline></video>`:`<img src="${chosenFileData}">`};r.readAsDataURL(f)}
function fixGithubUrl(url){return url.replace('github.dev/','github.com/').replace('/blob/','/raw/').replace('github.com/WallFlixHub/WallFlixHub/raw/refs/heads/main/','raw.githubusercontent.com/WallFlixHub/WallFlixHub/main/')}
async function publishItem(){
  const titleEl = $('quickTitle');
  const urlEl = $('quickUrl');
  const typeEl = $('quickType');
  const catEl = $('quickCat');
  const fileEl = $('quickFileInput');
  const fileNameEl = $('quickFileName');

  const title = ((titleEl && titleEl.value) || '').trim();
  const directUrl = fixGithubUrl(((urlEl && urlEl.value) || '').trim());
  const cat = (catEl && catEl.value) || 'Anime';
  const file = fileEl && fileEl.files ? fileEl.files[0] : null;

  let finalUrl = '';

  /* Direct URL Priority: Cloudinary / GitHub raw / MP4 */
  if(directUrl){
    finalUrl = directUrl;
  }
  /* Local File Fallback */
  else if(chosenFileData){
    finalUrl = chosenFileData;
  }
  else if(file){
    finalUrl = URL.createObjectURL(file);
  }
  /* Nothing Found */
  else{
    toast('Wallpaper not found');
    return;
  }

  if(!title){
    toast('Enter title');
    return;
  }

  let type = (typeEl && typeEl.value) || 'static';
  if(uploadMode === 'live' || /^data:video\//i.test(finalUrl) || /\.(mp4|webm|mov)(\?|#|$)/i.test(finalUrl) || finalUrl.includes('/video/upload/')){
    type = 'live';
  }else if(type !== 'premium'){
    type = 'static';
  }

  /* Edit Selected Wallpaper / Video */
  if(typeof wfhEditingId !== 'undefined' && wfhEditingId){
    const editIndex = uploads.findIndex(u => String(u.id) === String(wfhEditingId));
    if(editIndex > -1){
      uploads[editIndex] = {
        ...uploads[editIndex],
        title,
        url: finalUrl,
        type,
        cat,
        updatedAt: Date.now()
      };
      save('wfhUploads', uploads);
      try{
        if(typeof window.wfhPublishFirestore === 'function'){
          await window.wfhPublishFirestore(uploads[editIndex]);
        }
      }catch(e){
        console.warn(e);
        toast('Firestore publish failed: شوف Rules');
        return;
      }
      wfhEditingId = null;
      if(titleEl) titleEl.value = '';
      if(urlEl) urlEl.value = '';
      if(fileEl) fileEl.value = '';
      if(fileNameEl) fileNameEl.innerText = 'No file selected';
      chosenFileData = '';
      setUploadMode(type === 'live' ? 'live' : 'static');
      render();
      renderAdmin();
      go('admin');
      toast('Updated');
      return;
    }
  }

  const item = {
    id: Date.now(),
    title,
    url: finalUrl,
    type,
    cat,
    likes: 0,
    views: 0,
    downloads: 0,
    createdAt: Date.now()
  };

  uploads.unshift(item);
  save('wfhUploads', uploads);

  /* Firestore publish */
  try{
    if(typeof window.wfhPublishFirestore === 'function'){
      await window.wfhPublishFirestore(item);
    }
  }catch(e){
    console.warn(e);
    toast('Firestore publish failed: شوف Rules');
    return;
  }

  render();
  renderAdmin();

  toast(type === 'live' ? 'Video published' : 'Wallpaper published');

  /* Clear AFTER success */
  if(titleEl) titleEl.value = '';
  if(urlEl) urlEl.value = '';
  if(fileEl) fileEl.value = '';
  if(fileNameEl) fileNameEl.innerText = 'No file selected';
  chosenFileData = '';
  setUploadMode(type === 'live' ? 'live' : 'static');

  openViewer(item.id);
}
function openViewer(id){current=allWalls().find(w=>String(w.id)===String(id));if(!current)return;current.views=(current.views||0)+1;$('previewMedia').innerHTML=isVideo(current)?`<video src="${current.url}" controls autoplay loop playsinline></video>`:`<img src="${current.url}">`;$('vTitle').textContent=current.title;$('vLikes').textContent=current.likes||0;$('vViews').textContent=current.views||0;$('vDown').textContent=current.downloads||0;$('viewerHeart').className=`fa-${favs.includes(current.id)?'solid heart-red':'regular'} fa-heart`;$('downloadBtn').textContent=isVideo(current)?'Download Ringtone':'Download Wallpaper';$('shareBtn').textContent=isVideo(current)?'Share Ringtone':'Share Wallpaper';$('related').innerHTML=allWalls().filter(w=>w.id!==current.id).slice(0,8).map(w=>isVideo(w)?`<video src="${w.url}" muted playsinline onclick="openViewer(${w.id})"></video>`:`<img src="${w.url}" onclick="openViewer(${w.id})">`).join('');renderComments();$('viewer').classList.add('show')}function closeViewer(){$('viewer').classList.remove('show')}
function toggleLike(id,el){let w=allWalls().find(x=>x.id===id);if(!w)return;if(favs.includes(id)){favs=favs.filter(x=>x!==id);w.likes=Math.max(0,(w.likes||0)-1)}else{favs.push(id);w.likes=(w.likes||0)+1}save('wfhFavs',favs);if(el){el.querySelector('i').className=`fa-${favs.includes(id)?'solid heart-red':'regular'} fa-heart`;el.querySelector('.like-count').textContent=w.likes}updateStats()}function likeCurrent(){if(current)toggleLike(current.id);openViewer(current.id)}
async function downloadCurrent(){if(!current)return;current.downloads=(current.downloads||0)+1;if(!downs.includes(current.id))downs.unshift(current.id);save('wfhDowns',downs);$('vDown').textContent=current.downloads;updateStats();toast('Download started');const ext=isVideo(current)?'.mp4':'.jpg';try{const res=await fetch(current.url,{mode:'cors'});const blob=await res.blob();const obj=URL.createObjectURL(blob);const a=document.createElement('a');a.href=obj;a.download=(current.title||'wallflix').replace(/\s+/g,'_')+ext;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(obj),1200)}catch(e){const a=document.createElement('a');a.href=current.url;a.target='_blank';a.download=(current.title||'wallflix')+ext;document.body.appendChild(a);a.click();a.remove()}}
function shareCurrent(){if(!current)return;if(navigator.share)navigator.share({title:current.title,text:'WallFlixHub',url:current.url}).catch(()=>{});else{navigator.clipboard?.writeText(current.url);toast('Link copied')}}function rate(n){if(!current)return;ratings[current.id]=n;save('wfhRatings',ratings);$('ratingValue').textContent=n;document.querySelectorAll('.stars button').forEach((b,i)=>b.style.color=i<n?'#ffd700':'#555')}function addComment(){if(!current)return;const txt=$('commentInput').value.trim();if(!txt){toast('Write comment first');return}(comments[current.id]=comments[current.id]||[]).push({text:txt,date:new Date().toLocaleString()});save('wfhComments',comments);$('commentInput').value='';renderComments()}function renderComments(){if(!current)return;const list=comments[current.id]||[];$('commentList').innerHTML=list.length?list.map(c=>`<div style="padding:8px;border-bottom:1px solid var(--border)"><b>You:</b> ${c.text}<br><small>${c.date}</small></div>`).join(''):'No comments yet.';rate(ratings[current.id]||0)}
function renderFavs(){$('favGrid').innerHTML=favs.length?favs.map(id=>card(allWalls().find(w=>w.id===id))).join(''):'<p style="color:var(--muted);grid-column:1/-1;text-align:center">No favorites yet</p>'}function renderDowns(){$('downloadList').innerHTML=downs.length?downs.map(id=>{let w=allWalls().find(x=>x.id===id)||allWalls()[0];return `<div class="row" onclick="openViewer(${w.id})">${mediaHTML(w)}<div><b>${w.title}</b><p>Downloaded ${isVideo(w)?'video':'wallpaper'}</p></div></div>`}).join(''):'<p style="color:var(--muted);text-align:center">No downloads yet</p>'}function clearDownloads(){downs=[];save('wfhDowns',downs);renderDowns();updateStats()}
function verifyAdmin(){if($('adminSecret').value===ADMIN_SECRET){localStorage.setItem('wfhAdmin','1');renderAdmin();toast('Admin unlocked')}else toast('Wrong admin secret')}function renderAdmin(){const unlocked=localStorage.getItem('wfhAdmin')==='1';$('adminLock').style.display=unlocked?'none':'block';$('adminPanel').style.display=unlocked?'block':'none';$('adminUploads').textContent=uploads.length;$('adminFavs').textContent=favs.length;$('adminDowns').textContent=downs.length;$('adminList').innerHTML=uploads.length?uploads.map(u=>`<div class="row" onclick="openViewer(${u.id})">${mediaHTML(u)}<div><b>${u.title}</b><p>${isVideo(u)?'Video':'Wallpaper'} • ${u.cat}</p></div><button class="btn" onclick="event.stopPropagation();editUpload(${u.id})">Edit</button><button class="btn" onclick="event.stopPropagation();deleteUpload(${u.id})">Delete</button></div>`).join(''):'<p style="color:var(--muted);text-align:center">No uploads yet</p>'}let wfhEditingId=null;function editUpload(id){const u=uploads.find(x=>String(x.id)===String(id));if(!u)return;wfhEditingId=id;go('upload');setTimeout(()=>{$('quickTitle').value=u.title||'';$('quickUrl').value=u.url||'';$('quickCat').value=u.cat||'Cyberpunk';$('quickType').value=u.type||'static';setUploadMode(isVideo(u)?'live':'static');$('publishBtn').innerHTML='<i class="fa-solid fa-floppy-disk"></i> Save Changes';toast('Edit mode')},120)}function deleteUpload(id,rer=true){if(rer&&!confirm('واش متأكد بغيتي تمسح هاد Wallpaper / Video؟'))return;uploads=uploads.filter(u=>String(u.id)!==String(id));save('wfhUploads',uploads);if(rer){render();renderAdmin();toast('Deleted')}}
function setLang(l,el){document.querySelectorAll('.lang').forEach(x=>x.classList.remove('active'));el.classList.add('active');document.documentElement.lang=l;document.documentElement.dir=l==='ar'?'rtl':'ltr';if($('searchInput'))$('searchInput').placeholder={ar:'ابحث عن خلفيات...',fr:'Rechercher...',es:'Buscar...',it:'Cerca...',pt:'Pesquisar...',tr:'Ara...'}[l]||'Search wallpapers...';toast('Language changed')}function markRead(){$('notifBadge').style.display='none';$('menuNotif').textContent='0';toast('All read')}function toggleTheme(){document.body.classList.toggle('light-mode');toast('Theme changed')}function smartSearch(q){
  q=String(q||'').trim();
  if(!q)return;
  const exact=(Array.isArray(categories)?categories.map(c=>c[0]):[]).find(c=>c.toLowerCase()===q.toLowerCase());
  if(exact){filterCat(exact);toast(exact+' wallpapers');return;}
  const words=q.toLowerCase().split(/\s+/).filter(Boolean);
  const list=allWalls().filter(w=>{
    const hay=(String(w.title||'')+' '+String(w.cat||'')).toLowerCase();
    return words.every(x=>hay.includes(x)) || hay.includes(q.toLowerCase());
  });
  go('explore');
  $('exploreGrid').innerHTML=(list.length?list:allWalls()).map(w=>card(w)).join('');
  toast(q+' suggestions');
}
function search(q){const list=allWalls().filter(w=>w.title.toLowerCase().includes(q.toLowerCase())||w.cat.toLowerCase().includes(q.toLowerCase()));$('exploreGrid').innerHTML=(q?list:allWalls()).map(w=>card(w)).join('');if(q)go('explore')}function updateStats(){$('statFav').textContent=favs.length;$('favPill').textContent=favs.length;$('statDown').textContent=downs.length;$('statUpload').textContent=uploads.length}function updateProfileAuthUI(user){const gl=$('profileGoogleLoginBtn');const lo=$('profileLogoutBtn');const bk=$('profileBackupBtn');if(user){if(gl)gl.style.display='none';if(lo)lo.style.display='block';if(bk)bk.style.display='block';if($('profileName'))$('profileName').textContent=user.displayName||user.email||'WallFlixHub';}else{if(gl)gl.style.display='block';if(lo)lo.style.display='none';if(bk)bk.style.display='block';if($('profileName'))$('profileName').textContent='WallFlixHub';}}function logout(){localStorage.removeItem('wfhAdmin');try{if(fbAuth){import('https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js').then(m=>m.signOut(fbAuth)).catch(()=>{});}}catch(e){}fbUser=null;updateProfileAuthUI(null);if(typeof updateSyncUI==='function')updateSyncUI();toast('Logged out')}function toast(m){$('toast').textContent=m;$('toast').classList.add('show');setTimeout(()=>$('toast').classList.remove('show'),1500)}
/* WFH old hero interval disabled: controlled by startHeroSlider() */
window.addEventListener('DOMContentLoaded',()=>{setUploadMode('static');render();if(typeof updateProfileAuthUI==='function')updateProfileAuthUI(fbUser)});render();if(typeof updateProfileAuthUI==='function')updateProfileAuthUI(null);
async function googleLogin(){toast(firebaseReady?'Opening Google Login':'Firebase not loaded yet')}async function backupToFirebase(){toast(firebaseReady?'Backup saved to Firebase':'Firebase offline / not loaded')}async function restoreFromFirebase(){toast(firebaseReady?'Restore from Firebase':'Firebase offline / not loaded')}function updateSyncUI(){const acc=$('syncAccountText');const st=$('syncStatusText');const btn=$('syncLoginBtn');if(acc)acc.textContent='Account: '+(fbUser?(fbUser.email||fbUser.displayName||'Connected'):'Not connected');if(st)st.textContent='Last backup: '+(localStorage.getItem('wfhLastBackup')||'Not synced yet');if(btn)btn.style.display=fbUser?'none':'block';}


function sendContactForm(){
  const name=($('contactName')?.value||'').trim();
  const email=($('contactEmail')?.value||'').trim();
  const msg=($('contactMessage')?.value||'').trim();
  if(!msg){toast('Write your message first');return}
  const subject=encodeURIComponent('WallFlixHub Contact - '+(name||'User'));
  const body=encodeURIComponent('Name: '+name+'\nEmail: '+email+'\n\nMessage:\n'+msg);
  window.location.href='mailto:wallflixhub@gmail.com?subject='+subject+'&body='+body;
  toast('Opening Gmail');
}






function wfhRenderTopMonth(){
  const list=[...allWalls()].sort((a,b)=>(b.downloads||0)-(a.downloads||0));
  const home=$('wfhTopMonthHomeGrid');
  const page=$('topMonthGrid');
  if(home)home.innerHTML=list.slice(0,8).map(w=>card(w,true)).join('');
  if(page)page.innerHTML=list.slice(0,20).map(w=>card(w)).join('');
}
function subscribeNewsletter(){
  const input=$('newsletterEmail');
  const email=(input?.value||'').trim();
  if(!email || !email.includes('@')){toast('Enter valid email');return}
  let subs=JSON.parse(localStorage.getItem('wfhNewsletter')||'[]');
  if(!subs.includes(email))subs.push(email);
  localStorage.setItem('wfhNewsletter',JSON.stringify(subs));
  if(input)input.value='';
  toast('Subscribed');
}
function reportWallpaper(){
  if(!current){toast('Open wallpaper first');return}
  let reports=JSON.parse(localStorage.getItem('wfhReports')||'[]');
  reports.unshift({id:current.id,title:current.title,url:current.url,date:new Date().toLocaleString()});
  localStorage.setItem('wfhReports',JSON.stringify(reports.slice(0,100)));
  const subject=encodeURIComponent('WallFlixHub Report - '+current.title);
  const body=encodeURIComponent('Reported content:\n'+current.title+'\n'+current.url+'\n\nReason:\n');
  try{window.location.href='mailto:wallflixhub@gmail.com?subject='+subject+'&body='+body}catch(e){}
  toast('Report saved');
}

(function(){
  function clean(){
    const s=document.getElementById('syncLoginBtn');
    if(s){s.innerHTML='Google Login';}
    const p=document.getElementById('profileGoogleLoginBtn');
    if(p){p.innerHTML='Google Login';}
  }
  document.addEventListener('DOMContentLoaded',clean);
  setTimeout(clean,300);
  setTimeout(clean,1200);
})();

(function(){
  const $id = id => document.getElementById(id);
  const safeToast = msg => { try{ if(typeof toast === 'function') toast(msg); }catch(e){} };
  const listWalls = () => { try{ return typeof allWalls === 'function' ? allWalls() : []; }catch(e){ return []; } };
  const isVid = w => { try{ return typeof isVideo === 'function' ? isVideo(w) : false; }catch(e){ const u=String((w&&w.url)||'').toLowerCase(); return (w&&w.type==='live') || u.startsWith('data:video/') || /\.(mp4|webm|mov)(\?|#|$)/i.test(u); } };
  const setCur = w => { window.current=w; try{ current=w; }catch(e){} };
  const getCur = () => window.current || (typeof current !== 'undefined' ? current : null);
  const esc = s => String(s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
  const absUrl = url => { const u=String(url||''); if(!u || u.startsWith('data:')) return location.href; try{return new URL(u, location.href).href}catch(e){return location.href} };

  function ensureTopBar(){
    const preview=$id('previewMedia');
    if(!preview) return null;
    let top=preview.querySelector('.viewer-top');
    if(!top){ top=document.createElement('div'); top.className='viewer-top'; preview.prepend(top); }
    top.querySelectorAll('#viewerPrevBtn,#viewerNextBtn,.viewer-nav-group,#viewerNavGroup').forEach(n=>n.remove());
    let back=top.querySelector('#viewerBackBtn') || top.querySelector('button[onclick*="closeViewer"]');
    if(!back){ back=document.createElement('button'); top.prepend(back); }
    back.id='viewerBackBtn'; back.type='button'; back.setAttribute('aria-label','Back');
    back.innerHTML='<i class="fa-solid fa-chevron-left"></i>';
    back.onclick=function(e){ e.preventDefault(); e.stopPropagation(); window.closeViewer(); };
    let like=top.querySelector('#viewerLikeBtn') || top.querySelector('button[onclick*="likeCurrent"]');
    if(!like){ like=document.createElement('button'); top.appendChild(like); }
    like.id='viewerLikeBtn'; like.type='button'; like.setAttribute('aria-label','Like');
    like.innerHTML='<i id="viewerHeart" class="fa-regular fa-heart"></i>';
    like.onclick=function(e){ e.preventDefault(); e.stopPropagation(); if(typeof likeCurrent==='function') likeCurrent(); };
    return top;
  }

  function optimizeMedia(root=document){
    root.querySelectorAll('img').forEach(img=>{ img.loading='lazy'; img.decoding='async'; });
    root.querySelectorAll('.card video,.related video,.row video').forEach(v=>{
      v.muted=true; v.loop=true; v.playsInline=true; v.preload='none'; v.removeAttribute('autoplay');
      try{ v.pause(); }catch(e){}
    });
  }

  let videoObserver=null;
  function setupVideoObserver(){
    if(!('IntersectionObserver' in window)) return;
    if(!videoObserver){
      videoObserver=new IntersectionObserver(entries=>{
        entries.forEach(entry=>{
          const v=entry.target;
          if(entry.isIntersecting){
            v.preload='metadata';
            if(!document.hidden) { try{ v.play().catch(()=>{}); }catch(e){} }
          }else{
            try{ v.pause(); }catch(e){}
          }
        });
      },{root:document.querySelector('.viewport')||null,threshold:.35});
    }
    document.querySelectorAll('.card video,.related video,.row video').forEach(v=>videoObserver.observe(v));
  }

  window.closeViewer=function(){ const v=$id('viewer'); if(v){ v.classList.remove('show'); v.style.display='none'; } };

  window.openViewer=function(id){
    const list=listWalls();
    const item=list.find(w=>String(w.id)===String(id));
    if(!item){ safeToast('Wallpaper not found'); return false; }
    setCur(item);
    item.views=(item.views||0)+1;
    const preview=$id('previewMedia');
    if(preview){
      const topBar='<div class="viewer-top"><button id="viewerBackBtn" type="button" aria-label="Back"><i class="fa-solid fa-chevron-left"></i></button><button id="viewerLikeBtn" type="button" aria-label="Like"><i id="viewerHeart" class="fa-regular fa-heart"></i></button></div>';
      preview.innerHTML = topBar + (isVid(item)
        ? '<video src="'+esc(item.url)+'" controls autoplay loop playsinline preload="metadata"></video>'
        : '<img src="'+esc(item.url)+'" alt="'+esc(item.title||'Wallpaper')+'" loading="eager" decoding="async">');
    }
    ensureTopBar();
    if($id('vTitle')) $id('vTitle').textContent=item.title||'Wallpaper';
    if($id('vLikes')) $id('vLikes').textContent=item.likes||0;
    if($id('vViews')) $id('vViews').textContent=item.views||0;
    if($id('vDown')) $id('vDown').textContent=item.downloads||0;
    const heart=$id('viewerHeart');
    if(heart){ let liked=false; try{ liked=Array.isArray(favs)&&favs.includes(item.id); }catch(e){} heart.className='fa-'+(liked?'solid heart-red':'regular')+' fa-heart'; }
    if($id('downloadBtn')) $id('downloadBtn').textContent=isVid(item)?'Download Ringtone':'Download Wallpaper';
    if($id('shareBtn')) $id('shareBtn').textContent=isVid(item)?'Share Ringtone':'Share Wallpaper';
    const sameCat=list.filter(w=>String(w.id)!==String(item.id)&&String(w.cat||'')===String(item.cat||''));
    const rel=(sameCat.length?sameCat:list.filter(w=>String(w.id)!==String(item.id))).slice(0,10);
    if($id('relatedTitle')) $id('relatedTitle').textContent='More '+(isVid(item)?'Live Videos':(item.cat||'Similar')+' Wallpapers');
    if($id('related')){
      $id('related').innerHTML=rel.map(w=>isVid(w)
        ? '<video data-wall-id="'+w.id+'" src="'+esc(w.url)+'" muted loop playsinline preload="none"></video>'
        : '<img data-wall-id="'+w.id+'" src="'+esc(w.url)+'" alt="'+esc(w.title||'')+'" loading="lazy" decoding="async">'
      ).join('');
    }
    try{ if(typeof renderComments==='function') renderComments(); }catch(e){}
    const viewer=$id('viewer'); if(viewer){ viewer.classList.add('show'); viewer.style.display='block'; viewer.scrollTop=0; }
    optimizeMedia($id('related')||document);
    setupVideoObserver();
    return false;
  };

  window.shareCurrent=async function(){
    const cur=getCur(); if(!cur){ safeToast('No link to share'); return; }
    const shareUrl=absUrl(cur.url);
    try{
      if(navigator.share) await navigator.share({title:cur.title||'WallFlixHub',text:isVid(cur)?'WallFlixHub Video Wallpaper':'WallFlixHub Wallpaper',url:shareUrl});
      else if(navigator.clipboard) { await navigator.clipboard.writeText(shareUrl); safeToast('Link copied'); }
      else { const i=document.createElement('input'); i.value=shareUrl; document.body.appendChild(i); i.select(); document.execCommand('copy'); i.remove(); safeToast('Link copied'); }
    }catch(e){ try{ await navigator.clipboard.writeText(shareUrl); safeToast('Link copied'); }catch(_){ safeToast('Share failed'); } }
  };

  const oldPublish=window.publishItem;
  window.publishItem=function(){
    if(typeof oldPublish==='function') return oldPublish.apply(this,arguments);
  };

  const oldRender=window.render;
  if(typeof oldRender==='function'){
    window.render=function(){
      const out=oldRender.apply(this,arguments);
      setTimeout(()=>{ optimizeMedia(); setupVideoObserver(); },50);
      return out;
    };
  }
  document.addEventListener('click',function(e){
    const item=e.target.closest && e.target.closest('#related [data-wall-id]');
    if(item){ e.preventDefault(); e.stopPropagation(); window.openViewer(item.getAttribute('data-wall-id')); }
  },true);
  document.addEventListener('visibilitychange',()=>{ if(document.hidden) document.querySelectorAll('video').forEach(v=>{try{v.pause()}catch(e){}}); });
  document.addEventListener('DOMContentLoaded',()=>{ optimizeMedia(); setupVideoObserver(); ensureTopBar(); });
  setTimeout(()=>{ optimizeMedia(); setupVideoObserver(); ensureTopBar(); },300);
})();

(function(){
  const $id=id=>document.getElementById(id);
  const toastSafe=msg=>{try{if(typeof toast==='function')toast(msg)}catch(e){}};
  const walls=()=>{try{return typeof allWalls==='function'?allWalls():[]}catch(e){return []}};
  const isVid=w=>{try{return typeof isVideo==='function'?isVideo(w):false}catch(e){const u=String((w&&w.url)||'').toLowerCase();return (w&&w.type==='live')||u.startsWith('data:video/')||/\.(mp4|webm|mov)(\?|#|$)/i.test(u)}};
  const esc=s=>String(s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
  const getCur=()=>window.current || (typeof current!=='undefined'?current:null);
  const setCur=w=>{window.current=w;try{current=w}catch(e){}};
  const saveJSON=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
  let shares={}; try{shares=JSON.parse(localStorage.getItem('wfhShares')||'{}')}catch(e){shares={}};

  function fileExt(cur){
    const u=String(cur&&cur.url||'').split('?')[0].toLowerCase();
    if(isVid(cur)) return u.match(/\.(webm|mov|mp4)$/)?.[0] || '.mp4';
    return u.match(/\.(png|webp|jpeg|jpg)$/)?.[0] || '.jpg';
  }
  function fileName(cur){return (String(cur&&cur.title||'wallflix').replace(/[^a-z0-9_-]+/gi,'_').replace(/^_+|_+$/g,'')||'wallflix')+fileExt(cur)}
  function absoluteUrl(url){const u=String(url||''); if(!u || u.startsWith('data:')) return u; try{return new URL(u,location.href).href}catch(e){return u}}
  async function dataUrlToBlob(dataUrl){const r=await fetch(dataUrl);return await r.blob()}
  async function downloadBlob(blob,name){
    const a=document.createElement('a');
    const obj=URL.createObjectURL(blob);
    a.href=obj; a.download=name; a.rel='noopener'; a.style.display='none';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(obj),1500);
  }
  function ensureShareMetric(cur){
    const metrics=document.querySelector('#viewer .metrics');
    if(!metrics) return;
    let m=$id('shareMetricBox');
    if(!m){
      m=document.createElement('div');
      m.id='shareMetricBox';
      m.className='metric share-metric';
      m.innerHTML='<i class="fa-solid fa-share-nodes"></i> <b id="vShares">0</b><span>Shares</span>';
      metrics.appendChild(m);
    }
    if($id('vShares')) $id('vShares').textContent=shares[cur?.id]||0;
  }

  const oldOpen=window.openViewer;
  window.openViewer=function(id){
    const list=walls(); const item=list.find(w=>String(w.id)===String(id));
    if(!item){ if(typeof oldOpen==='function') return oldOpen.apply(this,arguments); toastSafe('Wallpaper not found'); return false; }
    setCur(item);
    item.views=(item.views||0)+1;
    const preview=$id('previewMedia');
    if(preview){
      const topBar='<div class="viewer-top"><button id="viewerBackBtn" type="button" aria-label="Back"><i class="fa-solid fa-chevron-left"></i></button><button id="viewerLikeBtn" type="button" aria-label="Like"><i id="viewerHeart" class="fa-regular fa-heart"></i></button></div>';
      preview.innerHTML=topBar+(isVid(item)?'<video src="'+esc(item.url)+'" controls autoplay loop playsinline preload="metadata"></video>':'<img src="'+esc(item.url)+'" alt="'+esc(item.title||'Wallpaper')+'" loading="eager" decoding="async">');
      const back=$id('viewerBackBtn'); if(back) back.onclick=function(e){e.preventDefault();e.stopPropagation(); if(typeof closeViewer==='function') closeViewer();};
      const like=$id('viewerLikeBtn'); if(like) like.onclick=function(e){e.preventDefault();e.stopPropagation(); if(typeof likeCurrent==='function') likeCurrent();};
    }
    if($id('vTitle')) $id('vTitle').textContent=item.title||'Wallpaper';
    if($id('vLikes')) $id('vLikes').textContent=item.likes||0;
    if($id('vViews')) $id('vViews').textContent=item.views||0;
    if($id('vDown')) $id('vDown').textContent=item.downloads||0;
    const heart=$id('viewerHeart'); if(heart){let liked=false;try{liked=Array.isArray(favs)&&favs.includes(item.id)}catch(e){} heart.className='fa-'+(liked?'solid heart-red':'regular')+' fa-heart'}
    if($id('downloadBtn')) $id('downloadBtn').textContent=isVid(item)?'Download Ringtone':'Download Wallpaper';
    if($id('shareBtn')) $id('shareBtn').textContent=isVid(item)?'Share Ringtone':'Share Wallpaper';
    ensureShareMetric(item);
    const sameCat=list.filter(w=>String(w.id)!==String(item.id)&&String(w.cat||'')===String(item.cat||''));
    const rel=(sameCat.length?sameCat:list.filter(w=>String(w.id)!==String(item.id))).slice(0,10);
    if($id('relatedTitle')) $id('relatedTitle').textContent='More '+(isVid(item)?'Live Videos':(item.cat||'Similar')+' Wallpapers');
    if($id('related')) $id('related').innerHTML=rel.map(w=>isVid(w)?'<video data-wall-id="'+w.id+'" src="'+esc(w.url)+'" muted loop playsinline preload="none"></video>':'<img data-wall-id="'+w.id+'" src="'+esc(w.url)+'" alt="'+esc(w.title||'')+'" loading="lazy" decoding="async">').join('');
    try{if(typeof renderComments==='function')renderComments()}catch(e){}
    const viewer=$id('viewer'); if(viewer){viewer.classList.add('show');viewer.style.display='block';viewer.scrollTop=0}
    return false;
  };

  window.shareCurrent=async function(){
    const cur=getCur(); if(!cur){toastSafe('No link to share');return}
    const url=absoluteUrl(cur.url) || location.href;
    shares[cur.id]=(shares[cur.id]||0)+1; saveJSON('wfhShares',shares); ensureShareMetric(cur);
    try{
      if(navigator.share) await navigator.share({title:cur.title||'WallFlixHub',text:isVid(cur)?'WallFlixHub Video Wallpaper':'WallFlixHub Wallpaper',url:url.startsWith('data:')?location.href:url});
      else if(navigator.clipboard){await navigator.clipboard.writeText(url.startsWith('data:')?location.href:url);toastSafe('Link copied')}
    }catch(e){try{await navigator.clipboard.writeText(url.startsWith('data:')?location.href:url);toastSafe('Link copied')}catch(_){toastSafe('Share failed')}}
  };

  window.downloadCurrent=async function(){
    const cur=getCur(); if(!cur||!cur.url){toastSafe('No file selected');return}
    cur.downloads=(cur.downloads||0)+1;
    try{if(Array.isArray(downs)&&!downs.includes(cur.id)){downs.unshift(cur.id);saveJSON('wfhDowns',downs)}}catch(e){}
    if($id('vDown')) $id('vDown').textContent=cur.downloads;
    const name=fileName(cur);
    toastSafe(isVid(cur)?'Downloading video...':'Downloading wallpaper...');
    try{
      let blob;
      if(String(cur.url).startsWith('data:')) blob=await dataUrlToBlob(cur.url);
      else { const res=await fetch(absoluteUrl(cur.url),{mode:'cors',cache:'no-store'}); if(!res.ok) throw new Error('download failed'); blob=await res.blob(); }
      await downloadBlob(blob,name);
      toastSafe('Saved to phone downloads');
    }catch(e){
      try{
        const a=document.createElement('a'); a.href=absoluteUrl(cur.url); a.download=name; a.rel='noopener'; a.style.display='none'; document.body.appendChild(a); a.click(); a.remove();
        toastSafe('Download started');
      }catch(_){toastSafe('Download failed')}
    }
    try{if(typeof renderDowns==='function')renderDowns(); if(typeof updateStats==='function')updateStats()}catch(e){}
  };

  function addSuggestions(){
    const wrap=document.querySelector('#home .search-floating'); if(!wrap || $id('wfhSuggests')) return;
    const box=document.createElement('div'); box.id='wfhSuggests'; box.className='wfh-suggests';
    ['Anime','Cars','Nature','AMOLED','Live','Cyberpunk','Sports','Technology'].forEach(q=>{const b=document.createElement('button'); b.type='button'; b.textContent=q; b.onclick=()=>{const inp=$id('searchInput'); if(inp) inp.value=q; if(q==='Live'){try{go('live')}catch(e){}}else if(typeof search==='function') search(q);}; box.appendChild(b)});
    wrap.insertAdjacentElement('afterend',box);
  }

  const oldRender=window.render;
  window.render=function(){
    const out=typeof oldRender==='function'?oldRender.apply(this,arguments):undefined;
    try{
      const slider=$id('slider'), dots=$id('dots');
      if(slider){
        const fs=[...uploads,...BASE_WALLPAPERS].filter(w=>w && !isVid(w)).slice(0,4);
        if(fs.length){ slider.innerHTML=fs.map(w=>'<div class="slide" onclick="openViewer('+w.id+')" style="background-image:url(\''+esc(w.url)+'\')"><div class="slide-content"><span class="tag">FEATURED</span><h2>'+esc(w.title||'Wallpaper')+'</h2><p>'+(w.cat||'WallFlixHub')+' wallpaper</p><button class="btn">View Wallpaper</button></div></div>').join(''); if(dots)dots.innerHTML=fs.map((_,i)=>'<span class="'+(i===0?'active':'')+'"></span>').join(''); }
      }
      addSuggestions();
      if(typeof renderDowns==='function')renderDowns();
    }catch(e){}
    return out;
  };

  window.renderDowns=function(){
    const list=$id('downloadList'); if(!list) return;
    if(!downs.length){list.innerHTML='<p style="color:var(--muted);text-align:center">No downloads yet</p>';return}
    list.innerHTML=downs.map(id=>{const w=walls().find(x=>String(x.id)===String(id)); if(!w) return ''; const media=isVid(w)?'<video src="'+esc(w.url)+'" muted playsinline preload="none"></video>':'<img src="'+esc(w.url)+'" loading="lazy" decoding="async">'; return '<div class="row wfh-download-row" onclick="openViewer('+w.id+')">'+media+'<div><b>'+esc(w.title||'Wallpaper')+'</b><p>Downloaded '+(isVid(w)?'video':'wallpaper')+'</p></div><span class="pill">Open</span></div>'}).join('');
  };

  document.addEventListener('click',function(e){const item=e.target.closest&&e.target.closest('#related [data-wall-id]'); if(item){e.preventDefault();e.stopPropagation();window.openViewer(item.getAttribute('data-wall-id'))}},true);
  document.addEventListener('DOMContentLoaded',()=>{addSuggestions(); try{renderDowns()}catch(e){}; setTimeout(()=>{try{render()}catch(e){}},80)});
  setTimeout(()=>{addSuggestions(); try{render()}catch(e){}},250);
})();

(function(){
  function $(id){return document.getElementById(id)}
  function toastMsg(msg){ try{ if(typeof toast==='function') toast(msg); }catch(e){} }

  function ensureBox(){
    const input=$('quickUrl');
    if(!input || $('cloudinaryUrlCheck')) return;
    const box=document.createElement('div');
    box.id='cloudinaryUrlCheck';
    box.className='wfh-url-check';
    input.insertAdjacentElement('afterend',box);
    input.addEventListener('input',checkCloudinaryUrl);
    input.addEventListener('blur',checkCloudinaryUrl);
  }

  function isDirectMedia(url){
    return /\.(jpg|jpeg|png|webp|gif|mp4|webm|mov)(\?|#|$)/i.test(url) ||
           /\/image\/upload\//i.test(url) ||
           /\/video\/upload\//i.test(url);
  }

  function checkCloudinaryUrl(){
    const input=$('quickUrl');
    const box=$('cloudinaryUrlCheck');
    if(!input || !box) return true;

    const url=(input.value||'').trim();
    box.className='wfh-url-check';
    box.textContent='';

    if(!url){
      box.style.display='none';
      return true;
    }

    if(!/^https?:\/\//i.test(url)){
      box.className='wfh-url-check bad';
      box.textContent='❌ الرابط خاصو يبدا بـ https://';
      return false;
    }

    const isCloudinary=/res\.cloudinary\.com/i.test(url);
    const direct=isDirectMedia(url);

    if(isCloudinary && direct){
      box.className='wfh-url-check ok';
      box.textContent='✅ Cloudinary direct media URL صحيح';
      return true;
    }

    if(isCloudinary && !direct){
      box.className='wfh-url-check warn';
      box.textContent='⚠️ رابط Cloudinary ولكن ما باينش مباشر للصورة/الفيديو';
      return false;
    }

    if(!isCloudinary && direct){
      box.className='wfh-url-check warn';
      box.textContent='⚠️ الرابط مباشر ولكن ماشي Cloudinary';
      return true;
    }

    box.className='wfh-url-check bad';
    box.textContent='❌ الرابط ماشي مباشر. استعمل Cloudinary Copy URL';
    return false;
  }

  window.checkCloudinaryUrl=checkCloudinaryUrl;

  const oldPublish=window.publishItem;
  window.publishItem=function(){
    const url=(($('quickUrl')||{}).value||'').trim();
    if(url && !checkCloudinaryUrl()){
      toastMsg('Cloudinary URL غير صالح');
      return;
    }
    return oldPublish ? oldPublish.apply(this,arguments) : undefined;
  };

  document.addEventListener('DOMContentLoaded',ensureBox);
  setTimeout(ensureBox,500);
  setTimeout(ensureBox,1500);
})();

(function(){
  function toastMsg(msg){
    try{
      if(typeof toast === 'function') toast(msg);
      else {
        const t=document.getElementById('toast');
        if(t){
          t.textContent=msg;
          t.classList.add('show');
          setTimeout(()=>t.classList.remove('show'),1800);
        }
      }
    }catch(e){}
  }

  async function copyText(txt){
    try{
      if(navigator.clipboard && window.isSecureContext){
        await navigator.clipboard.writeText(txt);
        return true;
      }
    }catch(e){}

    try{
      const ta=document.createElement('textarea');
      ta.value=txt;
      ta.style.position='fixed';
      ta.style.left='-9999px';
      ta.style.top='0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok=document.execCommand('copy');
      ta.remove();
      return ok;
    }catch(e){
      return false;
    }
  }

  const oldShare = window.shareCurrent;
  window.shareCurrent = async function(){
    const item = window.current || (typeof current !== 'undefined' ? current : null);
    if(!item) return;

    const url = item.url || location.href;
    const title = item.title || 'WallFlixHub';

    try{
      if(navigator.share){
        await navigator.share({title:title,text:'WallFlixHub',url:url});
        toastMsg('Shared');
        return;
      }
    }catch(e){}

    const copied = await copyText(url);
    toastMsg(copied ? 'Link copied' : 'Copy failed');
  };

  const oldDelete = window.deleteUpload;
  window.deleteUpload = function(id, rer){
    const ok = confirm('واش متأكد بغيتي تمسح هاد Wallpaper / Video؟');
    if(!ok){
      toastMsg('Delete cancelled');
      return;
    }
    return oldDelete ? oldDelete.apply(this, arguments) : undefined;
  };
})();

(function(){
  let deferredInstallPrompt=null;

  function toastMsg(msg){
    try{
      if(typeof toast === 'function') toast(msg);
      else{
        const t=document.getElementById('toast');
        if(t){
          t.textContent=msg;
          t.classList.add('show');
          setTimeout(()=>t.classList.remove('show'),1800);
        }
      }
    }catch(e){}
  }

  function copyText(txt){
    return new Promise(resolve=>{
      if(navigator.clipboard && window.isSecureContext){
        navigator.clipboard.writeText(txt).then(()=>resolve(true)).catch(()=>resolve(false));
      }else{
        try{
          const ta=document.createElement('textarea');
          ta.value=txt;
          ta.style.position='fixed';
          ta.style.left='-9999px';
          document.body.appendChild(ta);
          ta.focus();
          ta.select();
          const ok=document.execCommand('copy');
          ta.remove();
          resolve(ok);
        }catch(e){ resolve(false); }
      }
    });
  }

  function ensureHeaderUX(){
    const icons=document.querySelector('header .icons');
    if(!icons) return;

    if(!document.getElementById('netBadge')){
      const badge=document.createElement('span');
      badge.id='netBadge';
      badge.className='wfh-net-badge';
      badge.innerHTML='<span class="wfh-net-dot"></span><span id="netText">Online</span>';
      icons.prepend(badge);
    }

    if(!document.getElementById('installAppBtn')){
      const btn=document.createElement('button');
      btn.id='installAppBtn';
      btn.className='wfh-install-btn';
      btn.type='button';
      btn.innerHTML='<i class="fa-solid fa-mobile-screen"></i> Install';
      btn.onclick=installApp;
      icons.prepend(btn);
    }

    updateOnlineBadge();
  }

  function updateOnlineBadge(){
    const badge=document.getElementById('netBadge');
    const txt=document.getElementById('netText');
    if(!badge || !txt) return;
    if(navigator.onLine){
      badge.classList.remove('offline');
      txt.textContent='Online';
    }else{
      badge.classList.add('offline');
      txt.textContent='Offline';
    }
  }

  window.addEventListener('online',function(){
    updateOnlineBadge();
    toastMsg('Back Online');
  });

  window.addEventListener('offline',function(){
    updateOnlineBadge();
    toastMsg('Offline Mode');
  });

  window.addEventListener('beforeinstallprompt',function(e){
    e.preventDefault();
    deferredInstallPrompt=e;
    const btn=document.getElementById('installAppBtn');
    if(btn) btn.style.display='inline-flex';
  });

  async function installApp(){
    const btn=document.getElementById('installAppBtn');
    if(!deferredInstallPrompt){
      toastMsg('Install not available yet');
      return;
    }
    deferredInstallPrompt.prompt();
    try{
      await deferredInstallPrompt.userChoice;
    }catch(e){}
    deferredInstallPrompt=null;
    if(btn) btn.style.display='none';
  }

  window.addEventListener('appinstalled',function(){
    const btn=document.getElementById('installAppBtn');
    if(btn) btn.style.display='none';
    toastMsg('App installed');
  });

  function ensureCopyUrlButton(){
    const shareBtn=document.getElementById('shareBtn');
    if(!shareBtn || document.getElementById('copyUrlBtn')) return;
    const btn=document.createElement('button');
    btn.id='copyUrlBtn';
    btn.className='full-btn share-btn';
    btn.type='button';
    btn.innerHTML='<i class="fa-regular fa-copy"></i> Copy URL';
    btn.onclick=copyCurrentUrl;
    shareBtn.insertAdjacentElement('afterend',btn);
  }

  async function copyCurrentUrl(){
    const item=window.current || (typeof current !== 'undefined' ? current : null);
    if(!item || !item.url){
      toastMsg('No URL found');
      return;
    }
    const ok=await copyText(item.url);
    toastMsg(ok ? 'URL copied' : 'Copy failed');
  }

  const oldOpen=window.openViewer;
  window.openViewer=function(){
    const result=oldOpen ? oldOpen.apply(this,arguments) : undefined;
    setTimeout(ensureCopyUrlButton,80);
    setTimeout(ensureCopyUrlButton,400);
    return result;
  };

  const oldRender=window.render;
  window.render=function(){
    const result=oldRender ? oldRender.apply(this,arguments) : undefined;
    setTimeout(ensureHeaderUX,80);
    return result;
  };

  document.addEventListener('DOMContentLoaded',function(){
    ensureHeaderUX();
    ensureCopyUrlButton();
  });
  setTimeout(ensureHeaderUX,500);
  setTimeout(ensureCopyUrlButton,500);
  setTimeout(ensureHeaderUX,1500);
})();

(function(){
  function isAdmin(){
    try{return localStorage.getItem('wfhAdmin') === '1'}catch(e){return false}
  }

  function toastMsg(msg){
    try{ if(typeof toast === 'function') toast(msg); }catch(e){}
  }

  function lockUploadUI(){
    const form=document.querySelector('#upload .form');
    if(!form) return;

    let note=document.getElementById('adminOnlyUploadNote');
    if(!note){
      note=document.createElement('div');
      note.id='adminOnlyUploadNote';
      note.className='wfh-admin-only-note';
      note.innerHTML='<i class="fa-solid fa-lock"></i> غير الإدمن يقدر ينشر Wallpapers و Videos. دخل Admin Dashboard وكتب Admin Secret.';
      form.prepend(note);
    }

    const locked=!isAdmin();
    note.style.display=locked?'block':'none';

    form.querySelectorAll('input,select,textarea,button,label.filepick').forEach(el=>{
      if(el.id==='adminOnlyUploadNote') return;
      if(el.tagName==='LABEL'){
        el.style.pointerEvents=locked?'none':'auto';
        el.style.opacity=locked?'.45':'1';
      }else{
        el.disabled=locked;
        el.style.opacity=locked?'.55':'1';
      }
    });
  }

  const oldGo=window.go;
  window.go=function(id,btn){
    const result=oldGo ? oldGo.apply(this,arguments) : undefined;
    setTimeout(lockUploadUI,80);
    if(id==='upload' && !isAdmin()){
      toastMsg('Upload خاص بالإدمن فقط');
    }
    return result;
  };

  const oldPublish=window.publishItem;
  window.publishItem=function(){
    if(!isAdmin()){
      toastMsg('خاصك تدخل Admin Secret قبل Upload');
      if(typeof go==='function') go('admin');
      return;
    }
    return oldPublish ? oldPublish.apply(this,arguments) : undefined;
  };

  const oldVerify=window.verifyAdmin;
  window.verifyAdmin=function(){
    const result=oldVerify ? oldVerify.apply(this,arguments) : undefined;
    setTimeout(lockUploadUI,120);
    return result;
  };

  const oldLogout=window.logout;
  window.logout=function(){
    const result=oldLogout ? oldLogout.apply(this,arguments) : undefined;
    setTimeout(lockUploadUI,120);
    return result;
  };

  document.addEventListener('DOMContentLoaded',lockUploadUI);
  setTimeout(lockUploadUI,500);
  setTimeout(lockUploadUI,1500);
})();

(function(){
  let editingId = null;

  function toastMsg(msg){
    try{ if(typeof toast === 'function') toast(msg); }catch(e){}
  }

  function saveUploads(){
    try{
      localStorage.setItem('wfhUploads', JSON.stringify(uploads || []));
    }catch(e){}
  }

  function resetPublishButton(){
    const btn = document.getElementById('publishBtn');
    if(!btn) return;
    btn.innerHTML = '<i class="fa-solid fa-upload"></i> Publish Wallpaper';
    btn.onclick = window.publishItem;
  }

  const oldPublishItem = window.publishItem;
  window.publishItem = function(){
    if(editingId !== null){
      const id = editingId;
      const idx = (uploads || []).findIndex(u => String(u.id) === String(id));
      if(idx < 0){
        editingId = null;
        resetPublishButton();
        toastMsg('Item not found');
        return;
      }

      const title = (document.getElementById('quickTitle')?.value || uploads[idx].title || 'Wallpaper').trim();
      let url = (document.getElementById('quickUrl')?.value || uploads[idx].url || '').trim();
      try{
        if(typeof fixGithubUrl === 'function') url = fixGithubUrl(url);
      }catch(e){}

      let type = document.getElementById('quickType')?.value || uploads[idx].type || 'static';
      const isVid = (typeof isVideo === 'function' && isVideo({...uploads[idx],url,type})) ||
        type === 'live' ||
        /\.(mp4|webm|mov)(\?|#|$)/i.test(url) ||
        url.includes('/video/upload/');

      if(isVid) type = 'live';
      else if(type !== 'premium') type = 'static';

      uploads[idx] = {
        ...uploads[idx],
        title,
        url,
        type,
        cat: document.getElementById('quickCat')?.value || uploads[idx].cat || 'Abstract',
        updatedAt: Date.now()
      };

      saveUploads();
      editingId = null;
      resetPublishButton();

      if(document.getElementById('quickTitle')) document.getElementById('quickTitle').value = '';
      if(document.getElementById('quickUrl')) document.getElementById('quickUrl').value = '';
      try{ if(typeof setUploadMode === 'function') setUploadMode('static'); }catch(e){}

      if(typeof render === 'function') render();
      if(typeof renderAdmin === 'function') renderAdmin();
      if(typeof go === 'function') go('admin');
      toastMsg('Updated');
      return;
    }

    return oldPublishItem ? oldPublishItem.apply(this, arguments) : undefined;
  };

  window.editUpload = function(id){
    const u = (uploads || []).find(x => String(x.id) === String(id));
    if(!u){
      toastMsg('Item not found');
      return;
    }

    editingId = id;

    if(typeof go === 'function') go('upload');

    setTimeout(function(){
      const title = document.getElementById('quickTitle');
      const url = document.getElementById('quickUrl');
      const cat = document.getElementById('quickCat');
      const type = document.getElementById('quickType');
      const btn = document.getElementById('publishBtn');

      if(title) title.value = u.title || '';
      if(url) url.value = u.url || '';
      if(cat) cat.value = u.cat || 'Abstract';
      if(type) type.value = u.type || 'static';

      try{
        if(typeof setUploadMode === 'function') setUploadMode((typeof isVideo === 'function' && isVideo(u)) ? 'live' : 'static');
      }catch(e){}

      if(btn){
        btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save Changes';
        btn.onclick = window.publishItem;
      }

      toastMsg('Edit mode');
    },120);
  };

  window.deleteUpload = function(id, rer=true){
    const ok = confirm('واش متأكد بغيتي تمسح هاد Wallpaper / Video؟');
    if(!ok){
      toastMsg('Delete cancelled');
      return;
    }

    uploads = (uploads || []).filter(u => String(u.id) !== String(id));
    saveUploads();

    if(window.current && String(window.current.id) === String(id)){
      try{ if(typeof closeViewer === 'function') closeViewer(); }catch(e){}
      window.current = null;
      try{ current = null; }catch(e){}
    }

    if(typeof render === 'function') render();
    if(typeof renderAdmin === 'function') renderAdmin();
    if(typeof updateStats === 'function') updateStats();

    toastMsg('Deleted');
  };

  const oldRenderAdmin = window.renderAdmin;
  window.renderAdmin = function(){
    const result = oldRenderAdmin ? oldRenderAdmin.apply(this, arguments) : undefined;

    try{
      document.querySelectorAll('#adminList .row button').forEach(btn=>{
        btn.style.padding = '8px 10px';
        btn.style.fontSize = '11px';
        btn.style.borderRadius = '10px';
      });
    }catch(e){}

    return result;
  };

  document.addEventListener('DOMContentLoaded', function(){
    resetPublishButton();
  });
})();

(function(){
  const FEATURE_KEY='wfhFeaturedIds';
  const OLD_FEATURE_KEY='wfhFeatured';

  function q(id){return document.getElementById(id)}
  function toastSafe(m){try{if(typeof toast==='function')toast(m)}catch(e){}}
  function list(){try{return typeof allWalls==='function'?allWalls().filter(Boolean):[]}catch(e){return[]}}
  function isVid(w){try{return typeof isVideo==='function'?isVideo(w):false}catch(e){let u=String((w&&w.url)||'').toLowerCase();return (w&&w.type==='live')||u.startsWith('data:video/')||/\.(mp4|webm|mov)(\?|#|$)/i.test(u)||u.includes('/video/upload/')}}
  function media(w){try{return typeof mediaHTML==='function'?mediaHTML(w):''}catch(e){return''}}
  function normalCard(w){try{return card(w,true)}catch(e){return''}}

  function getFeaturedIds(){
    try{
      let a=JSON.parse(localStorage.getItem(FEATURE_KEY)||'[]');
      if(!Array.isArray(a))a=[];
      let b=JSON.parse(localStorage.getItem(OLD_FEATURE_KEY)||'[]');
      if(Array.isArray(b)) a=a.concat(b);
      try{
        (uploads||[]).filter(u=>u&&u.featured).forEach(u=>a.push(u.id));
      }catch(e){}
      return [...new Set(a.map(x=>String(x)))];
    }catch(e){return[]}
  }

  function saveFeaturedIds(ids){
    const clean=[...new Set((ids||[]).map(x=>String(x)))];
    localStorage.setItem(FEATURE_KEY,JSON.stringify(clean));
    localStorage.setItem(OLD_FEATURE_KEY,JSON.stringify(clean));
    try{
      (uploads||[]).forEach(u=>{u.featured=clean.includes(String(u.id));});
      localStorage.setItem('wfhUploads',JSON.stringify(uploads||[]));
    }catch(e){}
  }

  function isFeatured(id){
    return getFeaturedIds().includes(String(id));
  }

  window.wfhFeaturedCard=function(w){
    return '<div class="card small wfh-feature-card '+(isVid(w)?'live':'')+'" onclick="openViewer('+JSON.stringify(w.id).replace(/"/g,'&quot;')+')">'+
      media(w)+
      '<span class="wfh-feature-badge">FEATURED</span>'+
      '<div class="card-stats"><span><i class="fa-regular fa-heart"></i> '+(w.likes||0)+'</span><span><i class="fa-regular fa-eye"></i> '+(w.views||0)+'</span></div>'+
    '</div>';
  };

  function hist(){
    try{let a=JSON.parse(localStorage.getItem('wfhViewingHistory')||'[]');return Array.isArray(a)?a:[]}catch(e){return[]}
  }

  function addHistory(id){
    let item=list().find(w=>String(w.id)===String(id));
    if(!item||!item.url)return;
    let h=hist().filter(x=>String(x.id)!==String(item.id));
    h.unshift({id:item.id,title:item.title,url:item.url,type:item.type,cat:item.cat});
    localStorage.setItem('wfhViewingHistory',JSON.stringify(h.slice(0,10)));
  }

  window.wfhRenderFinalSections=function(){
    const featuredGrid=q('wfhFeaturedGrid');
    if(featuredGrid){
      const ids=getFeaturedIds();
      const featured=list().filter(w=>ids.includes(String(w.id))).slice(0,8);
      featuredGrid.innerHTML=featured.length
        ? featured.map(w=>window.wfhFeaturedCard(w)).join('')
        : '<div class="wfh-empty-soft">No featured yet. Open Admin Dashboard and press Feature.</div>';
    }

    const contGrid=q('wfhContinueGrid');
    if(contGrid){
      const walls=list();
      const h=hist().map(x=>walls.find(w=>String(w.id)===String(x.id))||x).filter(x=>x&&x.url).slice(0,6);
      contGrid.innerHTML=h.length
        ? h.map(w=>'<div class="wfh-continue-card" onclick="openViewer('+JSON.stringify(w.id).replace(/"/g,'&quot;')+')">'+media(w)+'<b>'+String(w.title||'Wallpaper')+'</b></div>').join('')
        : '<div class="wfh-empty-soft">Open any wallpaper or video to continue viewing.</div>';
    }

    const vidsGrid=q('wfhLatestVideosGrid');
    if(vidsGrid){
      const vids=list().filter(isVid).slice(0,8);
      vidsGrid.innerHTML=vids.length
        ? vids.map(normalCard).join('')
        : '<div class="wfh-empty-soft">No ringtones yet.</div>';
    }
  };

  window.toggleFeatured=function(id){
    const sid=String(id);
    let ids=getFeaturedIds();
    if(ids.includes(sid)) ids=ids.filter(x=>x!==sid);
    else ids.unshift(sid);
    saveFeaturedIds(ids);
    if(typeof render==='function')render();
    if(typeof renderAdmin==='function')renderAdmin();
    setTimeout(window.wfhRenderFinalSections,100);
    toastSafe(ids.includes(sid)?'Added to Featured':'Removed from Featured');
  };

  function addFeatureButtons(){
    const adminList=q('adminList');
    if(!adminList)return;
    adminList.querySelectorAll('.row').forEach(function(row){
      if(row.querySelector('.wfh-feature-btn'))return;
      const m=(row.getAttribute('onclick')||'').match(/openViewer\(([^)]+)\)/);
      if(!m)return;
      const id=String(m[1]).replace(/['"]/g,'');
      const btn=document.createElement('button');
      btn.className='btn wfh-feature-btn '+(isFeatured(id)?'wfh-feature-on':'');
      btn.textContent=isFeatured(id)?'Featured':'Feature';
      btn.onclick=function(ev){ev.stopPropagation();window.toggleFeatured(id)};
      const buttons=row.querySelectorAll('button');
      if(buttons.length)row.insertBefore(btn,buttons[0]); else row.appendChild(btn);
    });
  }

  const oldRender=window.render;
  window.render=function(){
    const r=oldRender?oldRender.apply(this,arguments):undefined;
    setTimeout(window.wfhRenderFinalSections,60);
    setTimeout(window.wfhRenderFinalSections,300);
    return r;
  };

  const oldOpen=window.openViewer;
  window.openViewer=function(id){
    const r=oldOpen?oldOpen.apply(this,arguments):undefined;
    addHistory(id);
    try{
      const cur=window.current||(typeof current!=='undefined'?current:null);
      const rel=q('related');
      if(cur&&rel){
        const smart=list().filter(w=>String(w.id)!==String(cur.id)).sort(function(a,b){
          return ((b.cat===cur.cat?10000:0)+(isVid(b)===isVid(cur)?1000:0)+(b.likes||0)+(b.downloads||0))-
                 ((a.cat===cur.cat?10000:0)+(isVid(a)===isVid(cur)?1000:0)+(a.likes||0)+(a.downloads||0));
        }).slice(0,10);
        if(smart.length){
          rel.innerHTML=smart.map(w=>isVid(w)?'<video src="'+w.url+'" muted playsinline onclick="openViewer('+w.id+')"></video>':'<img src="'+w.url+'" onclick="openViewer('+w.id+')">').join('');
        }
      }
    }catch(e){}
    setTimeout(window.wfhRenderFinalSections,120);
    return r;
  };

  const oldAdmin=window.renderAdmin;
  window.renderAdmin=function(){
    const r=oldAdmin?oldAdmin.apply(this,arguments):undefined;
    setTimeout(addFeatureButtons,40);
    return r;
  };

  const oldBackup=window.backupToFirebase;
  if(typeof oldBackup==='function'){
    window.backupToFirebase=async function(){
      try{ localStorage.setItem(FEATURE_KEY,JSON.stringify(getFeaturedIds())); }catch(e){}
      return await oldBackup.apply(this,arguments);
    };
  }

  const oldRestore=window.restoreFromFirebase;
  if(typeof oldRestore==='function'){
    window.restoreFromFirebase=async function(){
      const r=await oldRestore.apply(this,arguments);
      setTimeout(window.wfhRenderFinalSections,300);
      return r;
    };
  }

  document.addEventListener('DOMContentLoaded',function(){
    setTimeout(window.wfhRenderFinalSections,250);
    setTimeout(function(){window.wfhRenderFinalSections(); addFeatureButtons();},900);
  });
  setTimeout(window.wfhRenderFinalSections,500);
})();

(function(){
  const HISTORY_KEY = 'wfhViewingHistory';

  function $id(id){ return document.getElementById(id); }
  function safeToast(msg){ try{ if(typeof toast === 'function') toast(msg); }catch(e){} }
  function walls(){ try{ return typeof allWalls === 'function' ? allWalls().filter(Boolean) : []; }catch(e){ return []; } }
  function isVid(w){ try{ return typeof isVideo === 'function' ? isVideo(w) : false; }catch(e){ return false; } }
  function media(w){ try{ return typeof mediaHTML === 'function' ? mediaHTML(w) : ''; }catch(e){ return ''; } }

  function readHistory(){
    try{
      const h = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
      return Array.isArray(h) ? h : [];
    }catch(e){ return []; }
  }

  function writeHistory(h){
    localStorage.setItem(HISTORY_KEY, JSON.stringify((h || []).slice(0, 10)));
  }

  function addToHistory(id){
    const item = walls().find(w => String(w.id) === String(id));
    if(!item || !item.url) return;
    const old = readHistory().filter(x => String(x.id) !== String(item.id));
    old.unshift({
      id: item.id,
      title: item.title || 'Wallpaper',
      url: item.url,
      type: item.type || (isVid(item) ? 'live' : 'static'),
      cat: item.cat || ''
    });
    writeHistory(old);
  }

  function renderContinue(){
    const grid = $id('wfhContinueGrid');
    if(!grid) return;

    const list = walls();
    const items = readHistory()
      .map(h => list.find(w => String(w.id) === String(h.id)) || h)
      .filter(w => w && w.url)
      .slice(0, 6);

    if(!items.length){
      grid.innerHTML = '<div class="wfh-empty-soft">Open any wallpaper or video to continue viewing.</div>';
      return;
    }

    grid.innerHTML = items.map(w =>
      '<div class="wfh-continue-card" onclick="openViewer(' + JSON.stringify(w.id).replace(/"/g,'&quot;') + ')">' +
        media(w) +
        '<b>' + String(w.title || 'Wallpaper') + '</b>' +
      '</div>'
    ).join('');
  }

  window.wfhClearContinueViewing = function(){
    localStorage.removeItem(HISTORY_KEY);
    renderContinue();
    try{ if(typeof wfhRenderSafeSections === 'function') wfhRenderSafeSections(); }catch(e){}
    try{ if(typeof wfhRenderFinalSections === 'function') wfhRenderFinalSections(); }catch(e){}
    setTimeout(renderContinue, 120);
    safeToast('Continue Viewing cleared');
  };

  const oldOpen = window.openViewer;
  window.openViewer = function(id){
    const result = oldOpen ? oldOpen.apply(this, arguments) : undefined;
    addToHistory(id);
    setTimeout(renderContinue, 80);
    return result;
  };

  const oldRenderSafe = window.wfhRenderSafeSections;
  if(typeof oldRenderSafe === 'function'){
    window.wfhRenderSafeSections = function(){
      const r = oldRenderSafe.apply(this, arguments);
      setTimeout(renderContinue, 50);
      return r;
    };
  }

  const oldRenderFinal = window.wfhRenderFinalSections;
  if(typeof oldRenderFinal === 'function'){
    window.wfhRenderFinalSections = function(){
      const r = oldRenderFinal.apply(this, arguments);
      setTimeout(renderContinue, 50);
      return r;
    };
  }

  const oldRender = window.render;
  window.render = function(){
    const r = oldRender ? oldRender.apply(this, arguments) : undefined;
    setTimeout(renderContinue, 80);
    setTimeout(renderContinue, 350);
    return r;
  };

  function removeDuplicateCopyLink(){
    const buttons = Array.from(document.querySelectorAll('#copyLinkBtn'));
    buttons.forEach(b => b.remove());
    const viewer = document.querySelector('.viewer-card');
    if(viewer){
      const copyButtons = Array.from(viewer.querySelectorAll('button')).filter(b => 
        (b.textContent || '').trim().toLowerCase() === 'copy link'
      );
      copyButtons.forEach(b => b.remove());
    }
  }

  document.addEventListener('DOMContentLoaded', function(){
    removeDuplicateCopyLink();
    renderContinue();
    setTimeout(renderContinue, 500);
    setTimeout(removeDuplicateCopyLink, 500);
  });

  setTimeout(renderContinue, 300);
  setTimeout(removeDuplicateCopyLink, 300);
})();

(function(){
  function toastSafe(msg){
    try{ if(typeof toast === 'function') toast(msg); }catch(e){}
  }

  function walls(){
    try{ return typeof allWalls === 'function' ? allWalls().filter(Boolean) : []; }catch(e){ return []; }
  }

  function addPremiumGlow(){
    document.querySelectorAll('.card').forEach(card=>{
      const tag = card.querySelector('.tag-premium');
      if(tag && /premium|4k/i.test(tag.textContent || '')){
        card.classList.add('wfh-premium-glow');
      }
    });
  }

  function addRandomButton(){
    if(document.getElementById('wfhRandomBtn')) return;
    const sliderWrap = document.querySelector('#homeReal .slider-wrap');
    if(!sliderWrap) return;

    const btn = document.createElement('button');
    btn.id = 'wfhRandomBtn';
    btn.className = 'wfh-random-btn';
    btn.innerHTML = '<i class="fa-solid fa-shuffle"></i> Random Wallpaper';
    btn.onclick = function(){
      const list = walls();
      if(!list.length){
        toastSafe('No wallpapers yet');
        return;
      }
      const item = list[Math.floor(Math.random() * list.length)];
      if(typeof openViewer === 'function') openViewer(item.id);
    };

    sliderWrap.insertAdjacentElement('afterend', btn);
  }

  const oldToggleLike = window.toggleLike;
  window.toggleLike = function(id, el){
    const r = oldToggleLike ? oldToggleLike.apply(this, arguments) : undefined;
    try{
      let icon = null;
      if(el) icon = el.querySelector('i');
      if(!icon && window.current && String(window.current.id) === String(id)){
        icon = document.getElementById('viewerHeart');
      }
      if(icon){
        icon.classList.remove('wfh-heart-pop');
        void icon.offsetWidth;
        icon.classList.add('wfh-heart-pop');
      }
    }catch(e){}
    return r;
  };

  const oldRender = window.render;
  window.render = function(){
    const r = oldRender ? oldRender.apply(this, arguments) : undefined;
    setTimeout(addPremiumGlow, 60);
    setTimeout(addRandomButton, 80);
    return r;
  };

  document.addEventListener('DOMContentLoaded', function(){
    setTimeout(addRandomButton, 300);
    setTimeout(addPremiumGlow, 350);

    try{
      const last = Number(localStorage.getItem('wfhLastVisit') || '0');
      const now = Date.now();
      localStorage.setItem('wfhLastVisit', String(now));
      if(last && now - last > 1000 * 60 * 20){
        setTimeout(()=>toastSafe('Welcome Back to WallFlixHub'), 700);
      }
    }catch(e){}
  });

  setTimeout(addRandomButton, 500);
  setTimeout(addPremiumGlow, 600);
})();

(function(){
  function q(id){return document.getElementById(id)}
  function safeToast(m){try{if(typeof toast==='function')toast(m)}catch(e){}}
  function list(){try{return typeof allWalls==='function'?allWalls().filter(Boolean):[]}catch(e){return[]}}
  function isVid(w){try{return typeof isVideo==='function'?isVideo(w):false}catch(e){return false}}
  function media(w){try{return typeof mediaHTML==='function'?mediaHTML(w):''}catch(e){return''}}
  function normalCard(w){try{return card(w,true)}catch(e){return''}}

  function pickDaily(){
    const arr=list();
    if(!arr.length)return null;
    const day=Math.floor(Date.now()/86400000);
    return arr[day % arr.length];
  }

  function pickWeekly(){
    const arr=list();
    if(!arr.length)return null;
    const week=Math.floor(Date.now()/(86400000*7));
    const sorted=[...arr].sort((a,b)=>(Number(b.likes||0)+Number(b.downloads||0))-(Number(a.likes||0)+Number(a.downloads||0)));
    return sorted[week % sorted.length];
  }

  function heroHTML(w,label){
    if(!w)return '<div class="wfh-empty-soft">No wallpaper yet.</div>';
    const bg=isVid(w)?'':String(w.url||'');
    if(isVid(w)){
      return '<div class="wfh-hero-bg" onclick="openViewer('+JSON.stringify(w.id).replace(/"/g,'&quot;')+')">'+media(w)+'<div class="wfh-hero-info"><b>'+String(w.title||label)+'</b><span>'+label+' • '+String(w.cat||'Video')+'</span></div></div>';
    }
    return '<div class="wfh-hero-bg" onclick="openViewer('+JSON.stringify(w.id).replace(/"/g,'&quot;')+')" style="background-image:url(\''+bg.replace(/'/g,"\\'")+'\')"><div class="wfh-hero-info"><b>'+String(w.title||label)+'</b><span>'+label+' • '+String(w.cat||'Wallpaper')+'</span></div></div>';
  }

  window.wfhOpenDailyWallpaper=function(){
    const w=pickDaily();
    if(w&&typeof openViewer==='function')openViewer(w.id);
  };

  window.wfhOpenWeeklyWallpaper=function(){
    const w=pickWeekly();
    if(w&&typeof openViewer==='function')openViewer(w.id);
  };

  window.wfhOpenRandomVideo=function(){
    const vids=list().filter(isVid);
    if(!vids.length){safeToast('No ringtones yet');return;}
    const w=vids[Math.floor(Math.random()*vids.length)];
    if(typeof openViewer==='function')openViewer(w.id);
  };

  function recentlyAdded(){
    const arr=list();
    return [...arr].sort((a,b)=>Number(b.updatedAt||b.createdAt||b.id||0)-Number(a.updatedAt||a.createdAt||a.id||0)).slice(0,8);
  }

  function aiRecommended(){
    const arr=list();
    const favCats={};
    try{
      (favs||[]).forEach(id=>{
        const w=arr.find(x=>String(x.id)===String(id));
        if(w)favCats[w.cat]=(favCats[w.cat]||0)+1;
      });
    }catch(e){}
    return [...arr].sort((a,b)=>{
      const sa=(favCats[a.cat]||0)*1000+Number(a.likes||0)*2+Number(a.downloads||0)*3+Number(a.views||0);
      const sb=(favCats[b.cat]||0)*1000+Number(b.likes||0)*2+Number(b.downloads||0)*3+Number(b.views||0);
      return sb-sa;
    }).slice(0,8);
  }

  function renderCollections(){
    const grid=q('wfhCollectionsGrid');
    if(!grid)return;
    const arr=list();
    const cats=[...new Set(arr.map(w=>w.cat).filter(Boolean))].slice(0,8);
    grid.innerHTML=cats.length?cats.map(catName=>{
      const items=arr.filter(w=>w.cat===catName).slice(0,2);
      return '<div class="wfh-collection" onclick="filterCat('+JSON.stringify(catName).replace(/"/g,'&quot;')+')"><div class="imgs">'+items.map(media).join('')+'</div><b>'+catName+'</b><span>'+arr.filter(w=>w.cat===catName).length+' wallpapers</span></div>';
    }).join(''):'<div class="wfh-empty-soft">No collections yet.</div>';
  }

  function renderCreators(){
    const box=q('wfhCreatorsList');
    if(!box)return;
    const arr=list();
    const data=[
      ['WallFlixHub Team','Official Premium Collection',arr.length],
      ['Anime Creator','Anime & AMOLED Picks',arr.filter(w=>/anime|amoled/i.test(w.cat||'')).length],
      ['Nature Studio','Nature Wallpapers',arr.filter(w=>/nature/i.test(w.cat||'')).length],
      ['Cars Hub','Cars Wallpapers',arr.filter(w=>/cars/i.test(w.cat||'')).length]
    ];
    box.innerHTML=data.map((c,i)=>'<div class="row" style="cursor:default"><div class="logo" style="width:46px;height:46px;font-size:20px">'+(i+1)+'</div><div><b>'+c[0]+'</b><p>'+c[1]+' • '+c[2]+' items</p></div><span class="pill">TOP</span></div>').join('');
  }

  function addDurationBadges(root=document){
    root.querySelectorAll('.card.live').forEach(card=>{
      if(card.querySelector('.wfh-duration'))return;
      const v=card.querySelector('video');
      const b=document.createElement('span');
      b.className='wfh-duration';
      b.textContent='LIVE';
      card.appendChild(b);
      if(v){
        const set=()=>{
          if(Number.isFinite(v.duration)&&v.duration>0){
            const m=Math.floor(v.duration/60);
            const s=Math.floor(v.duration%60).toString().padStart(2,'0');
            b.textContent=m+':'+s;
          }
        };
        v.addEventListener('loadedmetadata',set,{once:true});
        setTimeout(set,800);
      }
    });
  }

  window.wfhRefreshAI=function(){
    const grid=q('wfhAIGrid');
    if(grid){
      const arr=aiRecommended().sort(()=>Math.random()-.5).slice(0,8);
      grid.innerHTML=arr.length?arr.map(normalCard).join(''):'<div class="wfh-empty-soft">No recommendations yet.</div>';
      addDurationBadges(grid);
    }
  };

  function renderSmartExtras(){
    const daily=q('wfhDailyWallpaperGrid');
    if(daily)daily.innerHTML=heroHTML(pickDaily(),'Daily Wallpaper');

    const weekly=q('wfhWeeklyWallpaperGrid');
    if(weekly)weekly.innerHTML=heroHTML(pickWeekly(),'Wallpaper of the Week');

    const recent=q('wfhRecentlyAddedGrid');
    if(recent){
      const arr=recentlyAdded();
      recent.innerHTML=arr.length?arr.map(normalCard).join(''):'<div class="wfh-empty-soft">No recent items yet.</div>';
    }

    const ai=q('wfhAIGrid');
    if(ai){
      const arr=aiRecommended();
      ai.innerHTML=arr.length?arr.map(normalCard).join(''):'<div class="wfh-empty-soft">No recommendations yet.</div>';
    }

    renderCollections();
    renderCreators();
    addDurationBadges(document);
  }

  const oldRender=window.render;
  window.render=function(){
    const r=oldRender?oldRender.apply(this,arguments):undefined;
    setTimeout(renderSmartExtras,90);
    setTimeout(renderSmartExtras,500);
    return r;
  };

  const oldOpen=window.openViewer;
  window.openViewer=function(){
    const r=oldOpen?oldOpen.apply(this,arguments):undefined;
    setTimeout(()=>addDurationBadges(document),120);
    return r;
  };

  document.addEventListener('DOMContentLoaded',function(){
    const loader=q('wfhPremiumLoader');
    setTimeout(()=>{if(loader)loader.classList.add('hide')},650);
    setTimeout(renderSmartExtras,350);
    setTimeout(renderSmartExtras,1000);
  });

  setTimeout(renderSmartExtras,700);
  setTimeout(()=>{const loader=q('wfhPremiumLoader'); if(loader)loader.classList.add('hide')},1200);
})();

(function(){
  function $id(id){return document.getElementById(id)}
  function safeToast(m){try{if(typeof toast==='function')toast(m)}catch(e){}}

  function forceMediaVisible(){
    document.querySelectorAll(
      '.card img,.card video,.related img,.related video,.row img,.row video,.wfh-collection img,.wfh-collection video,.wfh-hero-mini img,.wfh-hero-mini video,.wfh-hero-bg video'
    ).forEach(el=>{
      el.style.opacity='1';
      el.style.visibility='visible';
      el.style.display='block';
      el.classList.add('wfh-media-visible');
    });
    document.querySelectorAll('.slide').forEach(el=>{
      el.style.opacity='1';
      el.style.visibility='visible';
      el.classList.add('wfh-media-visible');
    });
  }

  function updateProgress(){
    const vp=document.querySelector('.viewport');
    const bar=$id('wfhScrollProgress');
    if(!vp||!bar)return;
    const max=vp.scrollHeight-vp.clientHeight;
    const p=max>0?(vp.scrollTop/max)*100:0;
    bar.style.width=Math.max(0,Math.min(100,p))+'%';
  }

  function addSwipeHints(){
    document.querySelectorAll('.wfh-row').forEach(row=>{
      const prev=row.previousElementSibling;
      if(!prev || !prev.classList || !prev.classList.contains('section'))return;
      if(prev.nextElementSibling && prev.nextElementSibling.classList && prev.nextElementSibling.classList.contains('wfh-swipe-hint'))return;
      const hint=document.createElement('div');
      hint.className='wfh-swipe-hint';
      hint.innerHTML='<i class="fa-solid fa-arrows-left-right"></i> Swipe to explore';
      prev.insertAdjacentElement('afterend',hint);
    });
  }

  function showDownloadPop(){
    const pop=$id('wfhDownloadPop');
    if(!pop)return;
    pop.classList.add('show');
    setTimeout(()=>pop.classList.remove('show'),1300);
  }

  const oldRender=window.render;
  window.render=function(){
    const r=oldRender?oldRender.apply(this,arguments):undefined;
    setTimeout(()=>{forceMediaVisible();addSwipeHints();updateProgress();},80);
    setTimeout(()=>{forceMediaVisible();addSwipeHints();updateProgress();},450);
    setTimeout(()=>{forceMediaVisible();addSwipeHints();updateProgress();},1000);
    return r;
  };

  const oldOpen=window.openViewer;
  if(typeof oldOpen==='function'){
    window.openViewer=function(){
      const r=oldOpen.apply(this,arguments);
      setTimeout(forceMediaVisible,100);
      return r;
    };
  }

  const oldDownload=window.downloadCurrent;
  if(typeof oldDownload==='function'){
    window.downloadCurrent=async function(){
      showDownloadPop();
      return await oldDownload.apply(this,arguments);
    };
  }

  const oldToggleLike=window.toggleLike;
  if(typeof oldToggleLike==='function'){
    window.toggleLike=function(id,el){
      const wasFav=(()=>{try{return Array.isArray(favs)&&favs.includes(id)}catch(e){return false}})();
      const r=oldToggleLike.apply(this,arguments);
      const nowFav=(()=>{try{return Array.isArray(favs)&&favs.includes(id)}catch(e){return false}})();
      if(!wasFav && nowFav) safeToast('Added to favorites');
      else if(wasFav && !nowFav) safeToast('Removed from favorites');
      return r;
    };
  }

  document.addEventListener('DOMContentLoaded',function(){
    const vp=document.querySelector('.viewport');
    if(vp)vp.addEventListener('scroll',updateProgress,{passive:true});
    setTimeout(()=>{forceMediaVisible();addSwipeHints();updateProgress();},250);
    setTimeout(()=>{forceMediaVisible();addSwipeHints();updateProgress();},900);
  });

  setInterval(forceMediaVisible,1200);
})();

(function(){
  function q(id){return document.getElementById(id)}
  function safeToast(m){try{if(typeof toast==='function')toast(m)}catch(e){}}
  function list(){try{return typeof allWalls==='function'?allWalls().filter(Boolean):[]}catch(e){return[]}}
  function isVid(w){try{return typeof isVideo==='function'?isVideo(w):false}catch(e){return false}}
  function media(w){try{return typeof mediaHTML==='function'?mediaHTML(w):''}catch(e){return''}}
  function cardSafe(w){try{return card(w,true)}catch(e){return''}}

  function forceMediaVisible(){
    document.querySelectorAll('.card img,.card video,.related img,.related video,.row img,.row video,.wfh-hero-mini img,.wfh-hero-mini video,.wfh-collection img,.wfh-collection video').forEach(el=>{
      el.style.opacity='1';
      el.style.visibility='visible';
    });
  }

  function heroVideoHTML(w,label){
    if(!w)return '<div class="wfh-empty-soft">No video yet.</div>';
    return '<div class="wfh-hero-bg wfh-featured-video" onclick="openViewer('+JSON.stringify(w.id).replace(/"/g,'&quot;')+')">'+media(w)+'<div class="wfh-hero-info"><b>'+String(w.title||label)+'</b><span>'+label+' • '+String(w.cat||'Video')+'</span></div></div>';
  }

  function renderRecentlyDownloaded(){
    const grid=q('wfhRecentlyDownloadedGrid');
    if(!grid)return;
    const arr=list();
    let ids=[];
    try{ids=Array.isArray(downs)?downs:[]}catch(e){}
    const items=ids.map(id=>arr.find(w=>String(w.id)===String(id))).filter(Boolean).slice(0,8);
    grid.innerHTML=items.length?items.map(cardSafe).join(''):'<div class="wfh-empty-soft">No downloads yet.</div>';
  }

  function renderWeeklyDownloads(){
    const grid=q('wfhWeeklyDownloadsGrid');
    if(!grid)return;
    const items=[...list()].sort((a,b)=>Number(b.downloads||0)-Number(a.downloads||0)).slice(0,8);
    grid.innerHTML=items.length?items.map(cardSafe).join(''):'<div class="wfh-empty-soft">No top downloads yet.</div>';
  }

  function getFeaturedVideo(){
    const vids=list().filter(isVid);
    if(!vids.length)return null;
    const day=Math.floor(Date.now()/86400000);
    return vids[day%vids.length];
  }

  window.wfhOpenFeaturedVideo=function(){
    const v=getFeaturedVideo();
    if(v&&typeof openViewer==='function')openViewer(v.id);
    else safeToast('No ringtones yet');
  };

  function renderFeaturedVideo(){
    const box=q('wfhFeaturedVideoGrid');
    if(!box)return;
    box.innerHTML=heroVideoHTML(getFeaturedVideo(),'Featured Video');
  }

  function addVerifiedBadge(){
    const small=document.querySelector('.viewer-card small');
    if(!small || small.querySelector('.wfh-verified-pro'))return;
    const b=document.createElement('span');
    b.className='wfh-verified-pro';
    b.innerHTML='<i class="fa-solid fa-circle-check"></i> VERIFIED';
    small.appendChild(b);
  }

  function updateNewCounter(){
    document.querySelectorAll('.section h3').forEach(h=>{
      if((h.textContent||'').trim()!=='New Arrivals')return;
      if(h.querySelector('.wfh-new-counter'))return;
      const arr=list();
      const c=arr.filter(w=>Number(w.createdAt||w.updatedAt||w.id||0)>Date.now()-86400000).length || Math.min(4, arr.length);
      const b=document.createElement('span');
      b.className='wfh-new-counter';
      b.textContent=c+' NEW';
      h.appendChild(b);
    });
  }

  function showCopyToast(text){
    const t=q('wfhCopyToast');
    if(!t)return;
    t.textContent=text||'Link copied';
    t.classList.add('show');
    setTimeout(()=>t.classList.remove('show'),1300);
  }

  function setupSearchSuggestions(){
    const box=document.querySelector('.search-floating');
    const input=q('searchInput');
    if(!box||!input||q('wfhSuggestBox'))return;
    const s=document.createElement('div');
    s.id='wfhSuggestBox';
    s.className='wfh-suggest-box';
    box.appendChild(s);

    function render(val){
      const v=String(val||'').toLowerCase().trim();
      if(!v){s.classList.remove('show');return;}
      const cats=[...new Set(list().map(w=>w.cat).filter(Boolean))];
      const titles=list().map(w=>w.title).filter(Boolean);
      const found=[...cats,...titles].filter(x=>String(x).toLowerCase().includes(v)).slice(0,5);
      if(!found.length){s.classList.remove('show');return;}
      s.innerHTML=found.map(x=>'<div class="wfh-suggest-item" data-value="'+String(x).replace(/"/g,'&quot;')+'"><i class="fa-solid fa-magnifying-glass"></i>'+String(x)+'</div>').join('');
      s.classList.add('show');
      s.querySelectorAll('.wfh-suggest-item').forEach(item=>{
        item.onclick=function(){
          input.value=this.getAttribute('data-value')||'';
          s.classList.remove('show');
          if(typeof search==='function')search(input.value);
        };
      });
    }

    input.addEventListener('input',()=>render(input.value));
    input.addEventListener('blur',()=>setTimeout(()=>s.classList.remove('show'),250));
  }

  window.wfhOpenRandomCategory=function(){
    let cats=[];
    try{cats=Array.isArray(categories)?categories.map(c=>c[0]).filter(Boolean):[]}catch(e){}
    if(!cats.length){safeToast('No categories');return;}
    const c=cats[Math.floor(Math.random()*cats.length)];
    if(typeof filterCat==='function')filterCat(c);
  };

  function setupBackTop(){
    const vp=document.querySelector('.viewport');
    const btn=q('wfhBackTopBtn');
    if(!vp||!btn||btn.dataset.ready)return;
    btn.dataset.ready='1';
    vp.addEventListener('scroll',()=>btn.classList.toggle('show',vp.scrollTop>550),{passive:true});
  }

  function showSkeletonOnce(){
    const sk=q('wfhSkeletonOverlay');
    if(!sk||sessionStorage.getItem('wfhSkeletonShown'))return;
    sessionStorage.setItem('wfhSkeletonShown','1');
    sk.classList.add('show');
    setTimeout(()=>sk.classList.remove('show'),750);
  }

  function renderAllLightFeatures(){
    renderRecentlyDownloaded();
    renderWeeklyDownloads();
    renderFeaturedVideo();
    updateNewCounter();
    addVerifiedBadge();
    setupSearchSuggestions();
    setupBackTop();
    forceMediaVisible();
  }

  const oldRender=window.render;
  window.render=function(){
    const r=oldRender?oldRender.apply(this,arguments):undefined;
    setTimeout(renderAllLightFeatures,90);
    setTimeout(renderAllLightFeatures,500);
    return r;
  };

  const oldOpen=window.openViewer;
  if(typeof oldOpen==='function'){
    window.openViewer=function(){
      const r=oldOpen.apply(this,arguments);
      setTimeout(()=>{addVerifiedBadge();forceMediaVisible();},100);
      return r;
    };
  }

  const oldShare=window.shareCurrent;
  if(typeof oldShare==='function'){
    window.shareCurrent=function(){
      const r=oldShare.apply(this,arguments);
      showCopyToast('Share ready / Link copied');
      return r;
    };
  }

  document.addEventListener('DOMContentLoaded',function(){
    showSkeletonOnce();
    setTimeout(renderAllLightFeatures,280);
    setTimeout(renderAllLightFeatures,1000);
  });

  setInterval(forceMediaVisible,1500);
})();

(function(){
  function q(id){return document.getElementById(id)}
  function safeToast(m){try{if(typeof toast==='function')toast(m)}catch(e){}}
  function list(){try{return typeof allWalls==='function'?allWalls().filter(Boolean):[]}catch(e){return[]}}
  function isVid(w){try{return typeof isVideo==='function'?isVideo(w):false}catch(e){return false}}

  function forceVisible(){
    document.querySelectorAll('.card img,.card video,.related img,.related video,.row img,.row video,.wfh-hero-mini img,.wfh-hero-mini video,.wfh-collection img,.wfh-collection video').forEach(el=>{
      el.style.opacity='1';
      el.style.visibility='visible';
    });
  }

  function updateCounters(){
    const walls=list();
    const wc=q('wfhWallpaperCount');
    const vc=q('wfhVideoCount');
    const cc=q('wfhCategoryCount');
    if(wc)wc.textContent=walls.filter(w=>!isVid(w)).length;
    if(vc)vc.textContent=walls.filter(isVid).length;
    if(cc){
      const cats=[...new Set(walls.map(w=>w.cat).filter(Boolean))];
      cc.textContent=cats.length;
    }
  }

  function addPremiumCrowns(){
    document.querySelectorAll('.card').forEach(card=>{
      if(card.querySelector('.wfh-crown-badge'))return;
      const tag=card.querySelector('.card-tag,.tag-premium');
      const txt=(tag&&tag.textContent||'').toLowerCase();
      if(txt.includes('premium')){
        const c=document.createElement('span');
        c.className='wfh-crown-badge';
        c.innerHTML='<i class="fa-solid fa-crown"></i>';
        card.appendChild(c);
      }
    });
  }

  function heartBurst(){
    const preview=q('previewMedia');
    if(!preview)return;
    let h=preview.querySelector('.wfh-double-heart');
    if(!h){
      h=document.createElement('div');
      h.className='wfh-double-heart';
      h.innerHTML='<i class="fa-solid fa-heart"></i>';
      preview.appendChild(h);
    }
    h.classList.remove('show');
    void h.offsetWidth;
    h.classList.add('show');
  }

  let lastTap=0;
  function setupDoubleTapLike(){
    const preview=q('previewMedia');
    if(!preview || preview.dataset.doubleTapReady)return;
    preview.dataset.doubleTapReady='1';
    preview.addEventListener('click',function(e){
      const now=Date.now();
      if(now-lastTap<330){
        try{
          if(typeof likeCurrent==='function')likeCurrent();
          heartBurst();
          safeToast('Liked');
        }catch(err){}
        lastTap=0;
      }else{
        lastTap=now;
      }
    });
  }

  function setupZoom(){
    const preview=q('previewMedia');
    if(!preview)return;
    preview.classList.add('wfh-zoomable');

    if(!preview.dataset.zoomReady){
      preview.dataset.zoomReady='1';
      preview.addEventListener('dblclick',function(e){
        if(preview.querySelector('img')){
          preview.classList.toggle('wfh-zoomed');
        }
      });
      preview.addEventListener('click',function(e){
        if(preview.classList.contains('wfh-zoomed') && preview.querySelector('img')){
          setTimeout(()=>preview.classList.remove('wfh-zoomed'),30);
        }
      });
    }

    if(preview.querySelector('img') && !preview.querySelector('.wfh-zoom-hint')){
      const hint=document.createElement('div');
      hint.className='wfh-zoom-hint';
      hint.innerHTML='<i class="fa-solid fa-magnifying-glass-plus"></i> Double tap';
      preview.appendChild(hint);
      setTimeout(()=>{try{hint.remove()}catch(e){}},2300);
    }
  }

  function runAll(){
    forceVisible();
    updateCounters();
    addPremiumCrowns();
    setupDoubleTapLike();
  }

  const oldRender=window.render;
  window.render=function(){
    const r=oldRender?oldRender.apply(this,arguments):undefined;
    setTimeout(runAll,80);
    setTimeout(runAll,500);
    return r;
  };

  const oldOpen=window.openViewer;
  if(typeof oldOpen==='function'){
    window.openViewer=function(){
      const r=oldOpen.apply(this,arguments);
      setTimeout(()=>{runAll();setupZoom();},120);
      return r;
    };
  }

  document.addEventListener('DOMContentLoaded',function(){
    setTimeout(runAll,300);
    setTimeout(runAll,900);
  });

  setInterval(forceVisible,1500);
})();

(function(){
  function q(id){return document.getElementById(id)}
  function list(){try{return typeof allWalls==='function'?allWalls().filter(Boolean):[]}catch(e){return[]}}
  function isVid(w){try{return typeof isVideo==='function'?isVideo(w):false}catch(e){return false}}

  function forceVisible(){
    document.querySelectorAll('.card img,.card video,.related img,.related video,.row img,.row video,.wfh-hero-mini img,.wfh-hero-mini video,.wfh-collection img,.wfh-collection video').forEach(el=>{
      el.style.opacity='1';
      el.style.visibility='visible';
    });
  }

  function setWelcome(){
    const h=new Date().getHours();
    const txt=q('wfhWelcomeText');
    if(txt){
      txt.textContent = h < 12 ? 'Good Morning, WallFlixHub 👋' : h < 18 ? 'Good Afternoon, WallFlixHub 👋' : 'Good Evening, WallFlixHub 👋';
    }
    const d=q('wfhTodayDate');
    if(d){
      try{
        d.textContent=new Date().toLocaleDateString(undefined,{weekday:'long',year:'numeric',month:'long',day:'numeric'});
      }catch(e){
        d.textContent=new Date().toDateString();
      }
    }
  }

  function addTrendingRanks(){
    const grid=q('homeTrending');
    if(!grid)return;
    Array.from(grid.querySelectorAll('.card')).forEach((card,i)=>{
      if(card.querySelector('.wfh-rank-badge'))return;
      const b=document.createElement('span');
      b.className='wfh-rank-badge';
      b.textContent='#'+(i+1);
      card.appendChild(b);
    });

    const trend=q('trendGrid');
    if(trend){
      Array.from(trend.querySelectorAll('.card')).slice(0,12).forEach((card,i)=>{
        if(card.querySelector('.wfh-rank-badge'))return;
        const b=document.createElement('span');
        b.className='wfh-rank-badge';
        b.textContent='#'+(i+1);
        card.appendChild(b);
      });
    }
  }

  function showWelcomeToast(){
    const t=q('wfhWelcomeToast');
    if(!t)return;
    const now=Date.now();
    const last=Number(localStorage.getItem('wfhWelcomeToastLast')||'0');
    localStorage.setItem('wfhWelcomeToastLast',String(now));
    if(last && now-last<1000*60*2)return;
    setTimeout(()=>{
      t.classList.add('show');
      setTimeout(()=>t.classList.remove('show'),1600);
    },650);
  }

  function runAll(){
    setWelcome();
    addTrendingRanks();
    forceVisible();
  }

  const oldRender=window.render;
  window.render=function(){
    const r=oldRender?oldRender.apply(this,arguments):undefined;
    setTimeout(runAll,80);
    setTimeout(runAll,500);
    return r;
  };

  const oldGo=window.go;
  if(typeof oldGo==='function'){
    window.go=function(){
      const r=oldGo.apply(this,arguments);
      setTimeout(runAll,100);
      return r;
    };
  }

  document.addEventListener('DOMContentLoaded',function(){
    setTimeout(runAll,250);
    setTimeout(runAll,900);
    showWelcomeToast();
  });

  setInterval(forceVisible,1500);
})();

(function(){
  function q(id){return document.getElementById(id)}
  function safeToast(m){try{if(typeof toast==='function')toast(m)}catch(e){}}
  function list(){try{return typeof allWalls==='function'?allWalls().filter(Boolean):[]}catch(e){return[]}}
  function isVid(w){try{return typeof isVideo==='function'?isVideo(w):false}catch(e){return false}}
  function cardSafe(w){try{return card(w,true)}catch(e){return''}}

  function forceVisible(){
    document.querySelectorAll('.card img,.card video,.related img,.related video,.row img,.row video,.wfh-hero-mini img,.wfh-hero-mini video,.wfh-collection img,.wfh-collection video').forEach(el=>{
      el.style.opacity='1';
      el.style.visibility='visible';
    });
  }

  function vibrateSoft(){
    try{ if(navigator.vibrate) navigator.vibrate(18); }catch(e){}
  }

  function addRipple(e){
    const target=e.currentTarget;
    if(!target || target.querySelector('.wfh-ripple-lock'))return;
    const rect=target.getBoundingClientRect();
    const size=Math.max(rect.width,rect.height);
    const span=document.createElement('span');
    span.className='wfh-ripple';
    span.style.width=span.style.height=size+'px';
    span.style.left=(e.clientX-rect.left-size/2)+'px';
    span.style.top=(e.clientY-rect.top-size/2)+'px';
    target.appendChild(span);
    setTimeout(()=>span.remove(),600);
  }

  function setupRipple(){
    document.querySelectorAll('.card,.btn,.full-btn,.filter,.cat,.menu-row,.nav').forEach(el=>{
      if(el.dataset.rippleReady)return;
      el.dataset.rippleReady='1';
      if(getComputedStyle(el).position==='static') el.style.position='relative';
      el.style.overflow='hidden';
      el.addEventListener('click',addRipple);
    });
  }

  function renderNewToday(){
    const grid=q('wfhNewTodayGrid');
    if(!grid)return;
    const now=Date.now();
    const arr=list().filter(w=>Number(w.createdAt||w.updatedAt||w.id||0)>now-86400000).slice(0,8);
    const fallback=[...list()].sort((a,b)=>Number(b.updatedAt||b.createdAt||b.id||0)-Number(a.updatedAt||a.createdAt||a.id||0)).slice(0,6);
    const items=arr.length?arr:fallback;
    grid.innerHTML=items.length?items.map(cardSafe).join(''):'<div class="wfh-empty-soft">No new items today.</div>';
  }

  function addUpdatedTexts(){
    document.querySelectorAll('.section').forEach(sec=>{
      const h=sec.querySelector('h3');
      if(!h)return;
      const name=(h.textContent||'').trim();
      if(!/Featured|Trending|Recently|Recommendations|Videos|Arrivals|Today/i.test(name))return;
      const next=sec.nextElementSibling;
      if(next && next.classList && next.classList.contains('wfh-updated-now'))return;
      const u=document.createElement('div');
      u.className='wfh-updated-now';
      u.innerHTML='<i class="fa-solid fa-circle"></i> Updated now';
      sec.insertAdjacentElement('afterend',u);
    });
  }

  function addForYouLabel(){
    document.querySelectorAll('.section h3').forEach(h=>{
      if(!/AI Recommendations/i.test(h.textContent||''))return;
      if(h.querySelector('.wfh-for-you-label'))return;
      const s=document.createElement('span');
      s.className='wfh-for-you-label';
      s.innerHTML='<i class="fa-solid fa-wand-magic-sparkles"></i> For You';
      h.appendChild(document.createTextNode(' '));
      h.appendChild(s);
    });
  }

  function setupCategoryGlow(){
    document.querySelectorAll('.cat').forEach(el=>{
      if(el.dataset.catGlowReady)return;
      el.dataset.catGlowReady='1';
      el.addEventListener('click',()=>{
        document.querySelectorAll('.cat').forEach(c=>c.classList.remove('wfh-cat-selected'));
        el.classList.add('wfh-cat-selected');
      });
    });
  }

  function setupSearchAutoHide(){
    const vp=document.querySelector('.viewport');
    const search=document.querySelector('.search-floating');
    if(!vp||!search||search.dataset.hideReady)return;
    search.dataset.hideReady='1';
    let last=0;
    vp.addEventListener('scroll',()=>{
      const y=vp.scrollTop;
      if(y>170 && y>last+8) search.classList.add('wfh-search-hide');
      if(y<last-8 || y<80) search.classList.remove('wfh-search-hide');
      last=y;
    },{passive:true});
  }

  

  

  const oldShare=window.shareCurrent;
  if(typeof oldShare==='function'){
    window.shareCurrent=function(){
      const id=(window.current&&window.current.id)||'';
      if(id){
        let data={};
        try{data=JSON.parse(localStorage.getItem('wfhShareCounts')||'{}')}catch(e){}
        data[id]=Number(data[id]||0)+1;
        localStorage.setItem('wfhShareCounts',JSON.stringify(data));
      }
      const r=oldShare.apply(this,arguments);
      
      safeToast('Shared');
      vibrateSoft();
      return r;
    };
  }

  const oldToggleLike=window.toggleLike;
  if(typeof oldToggleLike==='function'){
    window.toggleLike=function(){
      vibrateSoft();
      return oldToggleLike.apply(this,arguments);
    };
  }

  const oldDownload=window.downloadCurrent;
  if(typeof oldDownload==='function'){
    window.downloadCurrent=async function(){
      vibrateSoft();
      const r=await oldDownload.apply(this,arguments);
      const v=q('vDown');
      if(v){
        v.classList.remove('wfh-count-pop');
        void v.offsetWidth;
        v.classList.add('wfh-count-pop');
      }
      return r;
    };
  }

  function runAll(){
    forceVisible();
    setupRipple();
    renderNewToday();
    addUpdatedTexts();
    addForYouLabel();
    setupCategoryGlow();
    setupSearchAutoHide();
    
    
  }

  const oldRender=window.render;
  window.render=function(){
    const r=oldRender?oldRender.apply(this,arguments):undefined;
    setTimeout(runAll,90);
    setTimeout(runAll,520);
    return r;
  };

  const oldOpen=window.openViewer;
  if(typeof oldOpen==='function'){
    window.openViewer=function(){
      const r=oldOpen.apply(this,arguments);
      setTimeout(()=>{runAll();},120);
      return r;
    };
  }

  document.addEventListener('DOMContentLoaded',function(){
    setTimeout(runAll,300);
    setTimeout(runAll,950);
  });

  setInterval(forceVisible,1600);
})();

(function(){
  function id(x){return document.getElementById(x)}
  function forceNoShareCounter(){
    document.querySelectorAll('.wfh-share-count,#wfhShareCountChip').forEach(el=>el.remove());
  }
  function forceVisible(){
    document.querySelectorAll('.card img,.card video,.related img,.related video,.row img,.row video,.wfh-hero-mini img,.wfh-hero-mini video,.slide').forEach(el=>{
      el.style.opacity='1';
      el.style.visibility='visible';
    });
  }
  function progress(){
    const vp=document.querySelector('.viewport');
    const bar=id('wfhTopProgress');
    if(!vp||!bar)return;
    const max=vp.scrollHeight-vp.clientHeight;
    const pct=max>0?(vp.scrollTop/max)*100:0;
    bar.style.width=Math.max(0,Math.min(100,pct))+'%';
  }
  function addHint(){
    const home=document.querySelector('#homeReal');
    if(!home || id('wfhMiniHint'))return;
    const search=document.querySelector('.search-floating');
    if(!search)return;
    const hint=document.createElement('div');
    hint.id='wfhMiniHint';
    hint.className='wfh-mini-hint';
    hint.innerHTML='<i class="fa-solid fa-bolt"></i> Premium experience optimized for mobile';
    search.insertAdjacentElement('afterend',hint);
  }
  function enhanceShareButton(){
    const b=id('shareBtn');
    if(b && !b.dataset.wfhClean){
      b.dataset.wfhClean='1';
      b.innerHTML='<i class="fa-solid fa-copy"></i> Copy URL';
    }
  }
  function cleanAll(){
    forceNoShareCounter();
    forceVisible();
    addHint();
    enhanceShareButton();
    progress();
  }

  const oldOpen=window.openViewer;
  if(typeof oldOpen==='function'){
    window.openViewer=function(){
      const r=oldOpen.apply(this,arguments);
      setTimeout(cleanAll,80);
      setTimeout(cleanAll,450);
      return r;
    };
  }

  const oldShare=window.shareCurrent;
  if(typeof oldShare==='function'){
    window.shareCurrent=function(){
      const r=oldShare.apply(this,arguments);
      forceNoShareCounter();
      return r;
    };
  }

  document.addEventListener('DOMContentLoaded',function(){
    const vp=document.querySelector('.viewport');
    if(vp)vp.addEventListener('scroll',progress,{passive:true});
    setTimeout(cleanAll,250);
    setTimeout(cleanAll,900);
  });

  setInterval(function(){
    forceNoShareCounter();
    forceVisible();
  },1200);
})();

(function(){
  const KEY='wfh_recent_view_guaranteed_v3';

  function safeParse(v,fallback){
    try{return JSON.parse(v || '')}catch(e){return fallback}
  }

  function getWalls(){
    try{
      if(typeof allWalls==='function'){
        const list=allWalls();
        if(Array.isArray(list)) return list;
      }
    }catch(e){}
    try{
      if(Array.isArray(window.wallpapers)) return window.wallpapers;
    }catch(e){}
    try{
      if(Array.isArray(BASE_WALLPAPERS)) return BASE_WALLPAPERS;
    }catch(e){}
    return [];
  }

  function saveItem(item){
    if(!item || !item.id || !item.url) return;
    const snap={
      id:String(item.id),
      title:item.title || 'Wallpaper',
      url:item.url || '',
      type:item.type || 'static',
      cat:item.cat || 'WallFlixHub',
      likes:item.likes || 0,
      views:item.views || 0,
      downloads:item.downloads || 0,
      savedAt:Date.now()
    };
    let list=safeParse(localStorage.getItem(KEY),[]);
    if(!Array.isArray(list)) list=[];
    list=list.filter(x=>String(x.id)!==String(snap.id));
    list.unshift(snap);
    localStorage.setItem(KEY,JSON.stringify(list.slice(0,24)));
  }

  function readList(){
    let list=safeParse(localStorage.getItem(KEY),[]);
    return Array.isArray(list)?list:[];
  }

  function resolveItem(x){
    const live=getWalls().find(w=>String(w.id)===String(x.id));
    return live || x;
  }

  function render(){
    const box=document.getElementById('wfhRecentlyViewedGrid');
    if(!box) return;
    const list=readList().map(resolveItem).filter(x=>x && x.url);
    if(!list.length){
      box.innerHTML='<div class="wfh-empty">No recently viewed yet.</div>';
      return;
    }
    if(typeof card==='function'){
      box.innerHTML=list.slice(0,12).map(w=>card(w,true)).join('');
    }else{
      box.innerHTML=list.slice(0,12).map(w=>'<div class="card small" onclick="openViewer('+w.id+')"><img src="'+w.url+'"><span class="card-tag tag-premium">VIEWED</span><div class="card-stats"><span>'+w.title+'</span></div></div>').join('');
    }
  }

  function addById(id){
    const item=getWalls().find(w=>String(w.id)===String(id));
    if(item){
      saveItem(item);
      setTimeout(render,40);
      setTimeout(render,300);
    }
  }

  window.wfhRenderRecentlyViewed=render;
  window.wfhClearRecentlyViewed=function(){
    localStorage.removeItem(KEY);
    render();
    if(typeof toast==='function') toast('Recently viewed cleared');
  };

  function installWrapper(){
    if(typeof window.openViewer==='function' && !window.openViewer.__wfhRecentFixed){
      const oldOpen=window.openViewer;
      const wrapped=function(id){
        addById(id);
        const result=oldOpen.apply(this,arguments);
        setTimeout(function(){ addById(id); render(); },80);
        setTimeout(render,400);
        return result;
      };
      wrapped.__wfhRecentFixed=true;
      window.openViewer=wrapped;
    }
  }

  document.addEventListener('DOMContentLoaded',function(){
    installWrapper();
    render();
    setTimeout(function(){installWrapper();render();},600);
    setTimeout(function(){installWrapper();render();},1500);
  });

  // Also catch clicks directly on cards/slides/related as a backup.
  document.addEventListener('click',function(e){
    const el=e.target.closest('[onclick*="openViewer"]');
    if(!el) return;
    const oc=el.getAttribute('onclick') || '';
    const m=oc.match(/openViewer\(([^)]+)\)/);
    if(m){
      const id=String(m[1]).replace(/['"]/g,'').trim();
      setTimeout(function(){addById(id);render();},20);
    }
  },true);

  setInterval(function(){installWrapper();},1200);
})();

(function(){
  const FEATURE_KEY='wfhFeaturedIds';
  const OLD_FEATURE_KEY='wfhFeatured';
  const $id=(id)=>document.getElementById(id);
  const safeToast=(m)=>{try{toast(m)}catch(e){}};
  const esc=(v)=>String(v??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
  function uploadIds(){try{return (uploads||[]).map(u=>String(u.id))}catch(e){return[]}}
  function getFeatureIds(){
    let ids=[];
    try{let a=JSON.parse(localStorage.getItem(FEATURE_KEY)||'[]');if(Array.isArray(a))ids=ids.concat(a)}catch(e){}
    try{let b=JSON.parse(localStorage.getItem(OLD_FEATURE_KEY)||'[]');if(Array.isArray(b))ids=ids.concat(b)}catch(e){}
    try{(uploads||[]).filter(u=>u&&u.featured).forEach(u=>ids.push(u.id))}catch(e){}
    return [...new Set(ids.map(String))];
  }
  function saveFeatureIds(ids){
    ids=[...new Set((ids||[]).map(String))];
    localStorage.setItem(FEATURE_KEY,JSON.stringify(ids));
    localStorage.setItem(OLD_FEATURE_KEY,JSON.stringify(ids));
    try{(uploads||[]).forEach(u=>u.featured=ids.includes(String(u.id)));localStorage.setItem('wfhUploads',JSON.stringify(uploads||[]))}catch(e){}
  }
  function isFeature(id){return getFeatureIds().includes(String(id))}
  function walls(){try{return typeof allWalls==='function'?allWalls():[]}catch(e){return[]}}
  function ordered(){
    const up=uploadIds();
    return walls().slice().sort((a,b)=>{
      const au=up.includes(String(a.id))?1:0, bu=up.includes(String(b.id))?1:0;
      if(au!==bu) return bu-au;
      return (Number(b.createdAt||b.updatedAt||b.id)||0)-(Number(a.createdAt||a.updatedAt||a.id)||0);
    });
  }
  function vid(w){try{return isVideo(w)}catch(e){return String(w?.type)==='live'}}
  function media(w){try{return mediaHTML(w)}catch(e){return vid(w)?'<video src="'+esc(w.url)+'" muted loop playsinline></video>':'<img src="'+esc(w.url)+'">'}}
  function isUploaded(w){return uploadIds().includes(String(w.id)) || Number(w.id)>1000000000000}
  function badgeFor(w){
    if(isFeature(w.id) || w.type==='premium') return '<span class="wfh-clean-badge wfh-choice-badge">CHOICE</span>';
    if(isUploaded(w)) return '<span class="wfh-clean-badge">NEW</span>';
    return '';
  }
  window.card=function(w,small=false){
    const liked=Array.isArray(favs)&&favs.map(String).includes(String(w.id));
    return '<div class="card '+(small?'small ':'')+(vid(w)?'live':'')+'" onclick="openViewer('+JSON.stringify(w.id).replace(/"/g,'&quot;')+')">'+
      media(w)+badgeFor(w)+
      '<div class="card-stats"><span onclick="event.stopPropagation();toggleLike('+JSON.stringify(w.id).replace(/"/g,'&quot;')+',this)"><i class="fa-'+(liked?'solid heart-red':'regular')+' fa-heart"></i> <span class="like-count">'+(w.likes||0)+'</span></span><span><i class="fa-regular fa-eye"></i> '+(w.views||0)+'</span></div></div>';
  };
  window.toggleFeatured=function(id){
    let ids=getFeatureIds(); const sid=String(id);
    ids=ids.includes(sid)?ids.filter(x=>x!==sid):[sid,...ids];
    saveFeatureIds(ids);
    try{render()}catch(e){}
    try{renderAdmin()}catch(e){}
    try{wfhRenderFinalSections()}catch(e){}
    safeToast(ids.includes(sid)?'Added to Featured':'Removed from Featured');
  };
  window.renderAdmin=function(){
    const unlocked=localStorage.getItem('wfhAdmin')==='1';
    const lock=$id('adminLock'), panel=$id('adminPanel'), list=$id('adminList');
    if(lock)lock.style.display=unlocked?'none':'block';
    if(panel)panel.style.display=unlocked?'block':'none';
    if($id('adminUploads'))$id('adminUploads').textContent=(uploads||[]).length;
    if($id('adminFavs'))$id('adminFavs').textContent=(favs||[]).length;
    if($id('adminDowns'))$id('adminDowns').textContent=(downs||[]).length;
    if(!list)return;
    list.innerHTML=(uploads&&uploads.length)?uploads.map(u=>{
      const on=isFeature(u.id);
      return '<div class="row" onclick="openViewer('+JSON.stringify(u.id).replace(/"/g,'&quot;')+')">'+media(u)+'<div><b>'+esc(u.title||'Wallpaper')+'</b><p>'+(vid(u)?'Video':'Wallpaper')+' • '+esc(u.cat||'')+'</p></div>'+ 
      '<button class="btn wfh-feature-btn '+(on?'wfh-feature-on':'')+'" onclick="event.stopPropagation();toggleFeatured('+JSON.stringify(u.id).replace(/"/g,'&quot;')+')">'+(on?'Featured':'Feature')+'</button>'+ 
      '<button class="btn" onclick="event.stopPropagation();editUpload('+JSON.stringify(u.id).replace(/"/g,'&quot;')+')">Edit</button>'+ 
      '<button class="btn" onclick="event.stopPropagation();deleteUpload('+JSON.stringify(u.id).replace(/"/g,'&quot;')+')">Delete</button></div>';
    }).join(''):'<p style="color:var(--muted);text-align:center">No uploads yet</p>';
  };
  window.wfhRenderFinalSections=function(){
    const f=$id('wfhFeaturedGrid');
    if(f){
      const ids=getFeatureIds();
      const list=ordered().filter(w=>ids.includes(String(w.id))).slice(0,8);
      f.innerHTML=list.length?list.map(w=>card(w,true)).join(''):'<div class="wfh-empty-soft">No featured yet. Open Admin Dashboard and press Feature.</div>';
    }
    const v=$id('wfhLatestVideosGrid'); if(v){const l=ordered().filter(vid).slice(0,8);v.innerHTML=l.length?l.map(w=>card(w,true)).join(''):'<div class="wfh-empty-soft">No ringtones yet.</div>'}
  };
  window.addTrendingRanks=function(){};
  const oldPublish=window.publishItem;
  window.publishItem=function(){
    const before=(uploads||[]).length;
    const r=oldPublish?oldPublish.apply(this,arguments):undefined;
    setTimeout(function(){
      try{
        const newest=(uploads||[])[0];
        if(newest && (uploads||[]).length>=before){
          newest.createdAt=newest.createdAt||Date.now();
          localStorage.setItem('wfhUploads',JSON.stringify(uploads||[]));
        }
        render();
        wfhRenderFinalSections();
      }catch(e){}
    },120);
    return r;
  };
  window.render=function(){
    try{allWalls()}catch(e){}
    const list=ordered();
    const newest=list.slice(0,4);
    if($id('slider'))$id('slider').innerHTML=newest.map(w=>'<div class="slide" onclick="openViewer('+JSON.stringify(w.id).replace(/"/g,'&quot;')+')" style="background-image:url(\''+esc(w.url)+'\')"><div class="slide-content"><span class="tag">VIEW WALLPAPER</span><h2>'+esc(w.title||'Wallpaper')+'</h2><p>'+esc(w.cat||'New')+' wallpaper</p><button class="btn">View Wallpaper</button></div></div>').join('');
    if($id('dots'))$id('dots').innerHTML=newest.map((_,i)=>'<span class="'+(i===0?'active':'')+'"></span>').join('');
    if($id('homeTrending'))$id('homeTrending').innerHTML=list.slice().sort((a,b)=>((b.likes||0)+(b.downloads||0)+(b.views||0))-((a.likes||0)+(a.downloads||0)+(a.views||0))).slice(0,3).map(w=>card(w,true)).join('');
    if($id('homeCats'))$id('homeCats').innerHTML=categories.slice(0,3).map(cat).join('');
    if($id('newArrivals'))$id('newArrivals').innerHTML=list.slice(0,4).map(w=>card(w)).join('');
    if($id('exploreGrid'))$id('exploreGrid').innerHTML=list.map(w=>card(w)).join('');
    if($id('liveGrid'))$id('liveGrid').innerHTML=list.filter(vid).map(w=>card(w)).join('')||'<p style="color:var(--muted);grid-column:1/-1;text-align:center">No ringtones yet</p>';
    if($id('catGrid'))$id('catGrid').innerHTML=categories.map(cat).join('');
    if($id('trendGrid'))$id('trendGrid').innerHTML=list.slice().sort((a,b)=>((b.likes||0)+(b.downloads||0))-((a.likes||0)+(a.downloads||0))).slice(0,12).map(w=>card(w)).join('');
    if($id('newGrid'))$id('newGrid').innerHTML=list.slice(0,12).map(w=>card(w)).join('');
    if($id('editorGrid'))$id('editorGrid').innerHTML=list.filter(w=>isUploaded(w)||isFeature(w.id)||w.type==='premium').map(w=>card(w)).join('');
    if($id('mostGrid'))$id('mostGrid').innerHTML=list.slice().sort((a,b)=>(b.downloads||0)-(a.downloads||0)).map(w=>card(w)).join('');
    if($id('langList'))$id('langList').innerHTML=langs.map(l=>'<div class="lang" onclick="setLang(\''+l[0]+'\',this)"><span>'+l[1]+'</span><b>'+l[2]+'</b></div>').join('');
    try{renderFavs()}catch(e){} try{renderDowns()}catch(e){} try{renderAdmin()}catch(e){} try{wfhRenderTopMonth()}catch(e){} try{wfhRenderRecentlyViewed()}catch(e){} try{updateStats()}catch(e){} try{wfhRenderFinalSections()}catch(e){}
  };
  document.addEventListener('DOMContentLoaded',function(){setTimeout(function(){try{render()}catch(e){}},250);setTimeout(function(){try{render()}catch(e){}},1000)});
  setTimeout(function(){try{render()}catch(e){}},300);
})();

(function(){
  function q(id){return document.getElementById(id)}
  function all(){try{return typeof allWalls==='function'?allWalls().filter(Boolean):[]}catch(e){return[]}}
  function isAmoled(w){return String(w&&w.cat||'').toLowerCase()==='amoled' || /amoled/i.test(String(w&&w.title||''));}
  function amoled(){return all().filter(isAmoled).sort(function(a,b){return (Number(b.createdAt||b.id)||0)-(Number(a.createdAt||a.id)||0);});}
  function renderAmoledBoost(){
    var list=amoled();
    try{
      if(q('newArrivals')) q('newArrivals').innerHTML=list.slice(0,4).map(function(w){return card(w)}).join('');
      if(q('newGrid')) q('newGrid').innerHTML=list.slice(0,25).map(function(w){return card(w)}).join('');
      if(q('wfhRecentlyAddedGrid')) q('wfhRecentlyAddedGrid').innerHTML=list.slice(0,8).map(function(w){return card(w,true)}).join('');
      if(q('wfhAIGrid')) q('wfhAIGrid').innerHTML=list.slice(4,12).map(function(w){return card(w,true)}).join('');
      if(q('homeTrending')) q('homeTrending').innerHTML=list.slice(0,3).map(function(w){return card(w,true)}).join('');
      if(q('trendGrid')) q('trendGrid').innerHTML=list.slice(0,12).map(function(w){return card(w)}).join('');
      if(q('wfhWeeklyDownloadsGrid')) q('wfhWeeklyDownloadsGrid').innerHTML=list.slice(0,8).map(function(w){return card(w,true)}).join('');
      if(q('wfhRecentlyDownloadedGrid')) q('wfhRecentlyDownloadedGrid').innerHTML=list.slice(8,16).map(function(w){return card(w,true)}).join('');
      if(q('wfhWallpaperCount')) q('wfhWallpaperCount').textContent=all().length;
    }catch(e){}
  }
  var oldRender=window.render;
  window.render=function(){var r=oldRender?oldRender.apply(this,arguments):undefined;setTimeout(renderAmoledBoost,120);setTimeout(renderAmoledBoost,700);return r};
  document.addEventListener('DOMContentLoaded',function(){setTimeout(renderAmoledBoost,400);setTimeout(renderAmoledBoost,1200)});
  setTimeout(renderAmoledBoost,1000);
})();

(function(){
  const byId = id => document.getElementById(id);
  const safeToast = msg => { try{ if(typeof toast === 'function') toast(msg); }catch(e){} };
  const esc = s => String(s ?? '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
  const listWalls = () => { try{ return typeof allWalls === 'function' ? allWalls() : (Array.isArray(wallpapers) ? wallpapers : []); }catch(e){ return []; } };
  const isVid = w => {
    try{ if(typeof isVideo === 'function') return isVideo(w); }catch(e){}
    const u = String((w && w.url) || '').toLowerCase();
    return (w && w.type === 'live') || u.startsWith('data:video/') || /\.(mp4|webm|mov)(\?|#|$)/i.test(u) || u.includes('/video/upload/');
  };
  const setCurrent = item => {
    window.current = item;
    try{ current = item; }catch(e){}
  };

  function getFavs(){
    try{ return Array.isArray(favs) ? favs : JSON.parse(localStorage.getItem('wfhFavs') || '[]'); }
    catch(e){ return []; }
  }

  function ensureViewerTop(){
    const preview = byId('previewMedia');
    if(!preview) return;
    let top = preview.querySelector('.viewer-top');
    if(!top){
      top = document.createElement('div');
      top.className = 'viewer-top';
      preview.prepend(top);
    }
    top.innerHTML =
      '<button id="viewerBackBtn" type="button" aria-label="Back"><i class="fa-solid fa-chevron-left"></i></button>' +
      '<button id="viewerLikeBtn" type="button" aria-label="Like"><i id="viewerHeart" class="fa-regular fa-heart"></i></button>';

    byId('viewerBackBtn').onclick = function(e){
      e.preventDefault();
      e.stopPropagation();
      window.closeViewer();
    };
    byId('viewerLikeBtn').onclick = function(e){
      e.preventDefault();
      e.stopPropagation();
      try{ if(typeof likeCurrent === 'function') likeCurrent(); }catch(err){}
      updateHeart();
    };
  }

  function updateHeart(){
    const cur = window.current || (typeof current !== 'undefined' ? current : null);
    const heart = byId('viewerHeart');
    if(!heart || !cur) return;
    const liked = getFavs().some(x => String(x) === String(cur.id));
    heart.className = 'fa-' + (liked ? 'solid heart-red' : 'regular') + ' fa-heart';
  }

  function rememberViewed(item){
    try{
      const oldRecent = JSON.parse(localStorage.getItem('wfhRecentlyViewed') || '[]').filter(x => String(x) !== String(item.id));
      oldRecent.unshift(item.id);
      localStorage.setItem('wfhRecentlyViewed', JSON.stringify(oldRecent.slice(0,20)));

      const oldContinue = JSON.parse(localStorage.getItem('wfhContinueViewing') || '[]').filter(x => String(x) !== String(item.id));
      oldContinue.unshift(item.id);
      localStorage.setItem('wfhContinueViewing', JSON.stringify(oldContinue.slice(0,12)));
    }catch(e){}
  }

  window.closeViewer = function(){
    const viewer = byId('viewer');
    if(viewer){
      viewer.classList.remove('show');
      viewer.style.display = 'none';
    }
    const media = byId('previewMedia');
    if(media){
      media.querySelectorAll('video').forEach(v => { try{ v.pause(); }catch(e){} });
    }
  };

  window.openViewer = function(id){
    const item = listWalls().find(w => String(w.id) === String(id));
    if(!item){
      safeToast('Wallpaper not found');
      return false;
    }

    setCurrent(item);
    item.views = (item.views || 0) + 1;
    rememberViewed(item);

    const preview = byId('previewMedia');
    if(preview){
      preview.innerHTML = (isVid(item)
        ? '<video src="' + esc(item.url) + '" controls autoplay loop playsinline preload="metadata"></video>'
        : '<img src="' + esc(item.url) + '" alt="' + esc(item.title || 'Wallpaper') + '" loading="eager" decoding="async">');
      ensureViewerTop();
    }

    if(byId('vTitle')) byId('vTitle').textContent = item.title || 'Wallpaper';
    if(byId('vLikes')) byId('vLikes').textContent = item.likes || 0;
    if(byId('vViews')) byId('vViews').textContent = item.views || 0;
    if(byId('vDown')) byId('vDown').textContent = item.downloads || 0;
    if(byId('downloadBtn')) byId('downloadBtn').textContent = isVid(item) ? 'Download Ringtone' : 'Download Wallpaper';
    if(byId('shareBtn')) byId('shareBtn').textContent = isVid(item) ? 'Share Ringtone' : 'Share Wallpaper';
    updateHeart();

    const all = listWalls();
    const sameCat = all.filter(w => String(w.id) !== String(item.id) && String(w.cat || '') === String(item.cat || ''));
    const related = (sameCat.length ? sameCat : all.filter(w => String(w.id) !== String(item.id))).slice(0,10);
    if(byId('relatedTitle')) byId('relatedTitle').textContent = isVid(item) ? 'More Live Videos' : 'More Like This';
    if(byId('related')){
      byId('related').innerHTML = related.map(w => isVid(w)
        ? '<video data-wall-id="' + esc(w.id) + '" src="' + esc(w.url) + '" muted loop playsinline preload="metadata"></video>'
        : '<img data-wall-id="' + esc(w.id) + '" src="' + esc(w.url) + '" alt="' + esc(w.title || '') + '" loading="lazy" decoding="async">'
      ).join('');
    }

    try{ if(typeof renderComments === 'function') renderComments(); }catch(e){}

    const viewer = byId('viewer');
    if(viewer){
      viewer.style.display = 'block';
      viewer.classList.add('show');
      viewer.scrollTop = 0;
    }

    try{
      if(typeof renderRecentlyViewed === 'function') renderRecentlyViewed();
      if(typeof wfhRenderRecentlyViewed === 'function') wfhRenderRecentlyViewed();
      if(typeof wfhRenderContinueViewing === 'function') wfhRenderContinueViewing();
    }catch(e){}

    return false;
  };

  document.addEventListener('click', function(e){
    const media = e.target.closest && e.target.closest('#related [data-wall-id]');
    if(media){
      e.preventDefault();
      e.stopPropagation();
      window.openViewer(media.getAttribute('data-wall-id'));
    }
  }, true);

  document.addEventListener('DOMContentLoaded', ensureViewerTop);
  setTimeout(ensureViewerTop, 300);
})();

(function(){
  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  const all = () => { try { return typeof allWalls === 'function' ? allWalls() : (Array.isArray(wallpapers) ? wallpapers : []); } catch(e){ return []; } };
  const isVid = w => {
    const u = String((w && w.url) || '').toLowerCase();
    const t = String((w && w.type) || '').toLowerCase();
    return t === 'live' || t === 'video' || !!(w && w.isVideo) || /^data:video\//.test(u) || /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(u) || u.includes('/video/upload/');
  };
  const images = () => all().filter(w => w && !isVid(w));
  const videos = () => all().filter(w => w && isVid(w));

  function media(w){
    if(isVid(w)) return '<video src="'+esc(w.url)+'" muted loop playsinline preload="metadata"></video>';
    return '<img src="'+esc(w.url)+'" alt="'+esc(w.title||'Wallpaper')+'" loading="lazy" decoding="async">';
  }
  function card(w, small=false){
    const live = isVid(w);
    const label = live ? 'LIVE' : (w.type === 'premium' ? 'PREMIUM' : '4K');
    return '<div class="card '+(small?'small ':'')+(live?'live':'')+'" onclick="openViewer('+JSON.stringify(w.id).replace(/"/g,'&quot;')+')">'+
      media(w)+'<span class="card-tag '+(live?'tag-live':'tag-premium')+'">'+label+'</span>'+ 
      '<div class="card-stats"><span><i class="fa-regular fa-heart"></i> '+(w.likes||0)+'</span><span><i class="fa-regular fa-eye"></i> '+(w.views||0)+'</span></div></div>';
  }
  function rowCard(w){
    return '<div class="wfh-continue-card" onclick="openViewer('+JSON.stringify(w.id).replace(/"/g,'&quot;')+')">'+media(w)+'<b>'+esc(w.title||'Wallpaper')+'</b></div>';
  }
  function hero(w,label){
    if(!w) return '';
    if(isVid(w)) return '<div class="wfh-hero-bg wfh-featured-video" onclick="openViewer('+JSON.stringify(w.id).replace(/"/g,'&quot;')+')">'+media(w)+'<div class="wfh-hero-info"><b>'+esc(w.title||label)+'</b><span>'+label+' • Video</span></div></div>';
    return '<div class="wfh-hero-bg" onclick="openViewer('+JSON.stringify(w.id).replace(/"/g,'&quot;')+')" style="background-image:url(\''+String(w.url||'').replace(/'/g,"\\'")+'\')"><div class="wfh-hero-info"><b>'+esc(w.title||label)+'</b><span>'+label+' • Wallpaper</span></div></div>';
  }
  function fill(id, list, mode='card', small=false){
    const el=$(id); if(!el) return;
    if(!list.length){ el.innerHTML='<div class="wfh-empty">No items yet</div>'; return; }
    el.innerHTML = list.map(w => mode==='row' ? rowCard(w) : card(w, small)).join('');
  }
  function fixHomeAndWallpaperSections(){
    const imgs = images();
    const vids = videos();
    const byNew=[...imgs].sort((a,b)=>(b.createdAt||b.id||0)-(a.createdAt||a.id||0));
    const byTrend=[...imgs].sort((a,b)=>((b.likes||0)+(b.downloads||0)+(b.views||0))-((a.likes||0)+(a.downloads||0)+(a.views||0)));
    const byDown=[...imgs].sort((a,b)=>(b.downloads||0)-(a.downloads||0));

    const slider=$('slider'), dots=$('dots');
    if(slider){
      const slides=(imgs.filter(w=>w.type==='premium').length?imgs.filter(w=>w.type==='premium'):byNew).slice(0,4);
      slider.innerHTML=slides.map(w=>'<div class="slide" onclick="openViewer('+JSON.stringify(w.id).replace(/"/g,'&quot;')+')" style="background-image:url(\''+String(w.url||'').replace(/'/g,"\\'")+'\')"><div class="slide-content"><span class="tag">VIEW WALLPAPER</span><h2>'+esc(w.title||'Wallpaper')+'</h2><p>'+esc(w.cat||'Wallpaper')+' wallpaper</p><button class="btn">View Wallpaper</button></div></div>').join('');
      if(dots) dots.innerHTML=slides.map((_,i)=>'<span class="'+(i===0?'active':'')+'"></span>').join('');
    }

    fill('homeTrending', byTrend.slice(0,3), 'card', true);
    fill('newArrivals', byNew.slice(0,4));
    fill('exploreGrid', byNew);
    fill('trendGrid', byTrend.slice(0,20));
    fill('newGrid', byNew.slice(0,24));
    fill('editorGrid', imgs.filter(w=>w.type==='premium').slice(0,24));
    fill('mostGrid', byDown.slice(0,24));
    fill('topMonthGrid', byDown.slice(0,24));

    fill('liveGrid', vids, 'card');
    fill('wfhLatestVideosGrid', vids.slice(0,12), 'row');
    if($('wfhFeaturedVideoGrid')) $('wfhFeaturedVideoGrid').innerHTML = vids[0] ? hero(vids[0],'Featured Video') : '<div class="wfh-empty">No ringtones yet</div>';

    if($('wfhFeaturedGrid')) fill('wfhFeaturedGrid', byTrend.slice(0,10), 'row');
    if($('wfhDailyWallpaperGrid')) $('wfhDailyWallpaperGrid').innerHTML = byNew[0] ? hero(byNew[0],'Daily Wallpaper') : '<div class="wfh-empty">No wallpaper yet</div>';
    if($('wfhWeeklyWallpaperGrid')) $('wfhWeeklyWallpaperGrid').innerHTML = byTrend[0] ? hero(byTrend[0],'Wallpaper of the Week') : '<div class="wfh-empty">No wallpaper yet</div>';
    fill('wfhRecentlyDownloadedGrid', byDown.slice(0,10), 'row');
    fill('wfhWeeklyDownloadsGrid', byDown.slice(0,10), 'row');
    fill('wfhTopMonthHomeGrid', byDown.slice(0,10), 'row');
    fill('wfhNewTodayGrid', byNew.slice(0,10), 'row');
    fill('wfhRecentlyAddedGrid', byNew.slice(0,10), 'row');
    fill('wfhAIGrid', byTrend.slice(0,10), 'row');

    // Safety: any accidental video card inside wallpaper-only containers is removed.
    ['homeTrending','newArrivals','exploreGrid','trendGrid','newGrid','editorGrid','mostGrid','topMonthGrid','wfhFeaturedGrid','wfhDailyWallpaperGrid','wfhWeeklyWallpaperGrid','wfhRecentlyDownloadedGrid','wfhWeeklyDownloadsGrid','wfhTopMonthHomeGrid','wfhNewTodayGrid','wfhRecentlyAddedGrid','wfhAIGrid'].forEach(id=>{
      const box=$(id); if(!box) return;
      box.querySelectorAll('.card,.wfh-continue-card,.wfh-hero-bg,.row').forEach(el=>{ if(el.querySelector('video')) el.remove(); });
    });
  }

  function renderCommentsSafe(){ try{ if(typeof renderComments==='function') renderComments(); }catch(e){} }

  window.openViewer = function(id){
    const item = all().find(w => String(w.id) === String(id));
    if(!item){ try{ toast('Wallpaper not found'); }catch(e){} return false; }
    try{ current = item; }catch(e){} window.current = item;
    item.views = (item.views || 0) + 1;
    const video = isVid(item);
    const preview = $('previewMedia');
    if(preview){
      preview.innerHTML = '<div class="viewer-top"><button id="viewerBackBtn" type="button" aria-label="Back"><i class="fa-solid fa-chevron-left"></i></button><button id="viewerLikeBtn" type="button" aria-label="Like"><i id="viewerHeart" class="fa-regular fa-heart"></i></button></div>'+
        (video ? '<video src="'+esc(item.url)+'" controls autoplay loop playsinline preload="metadata"></video>' : '<img src="'+esc(item.url)+'" alt="'+esc(item.title||'Wallpaper')+'" loading="eager" decoding="async">');
      const b=$('viewerBackBtn'); if(b) b.onclick=function(e){e.preventDefault();e.stopPropagation(); closeViewer();};
      const l=$('viewerLikeBtn'); if(l) l.onclick=function(e){e.preventDefault();e.stopPropagation(); if(typeof likeCurrent==='function') likeCurrent();};
    }
    if($('vTitle')) $('vTitle').textContent = item.title || (video?'Video':'Wallpaper');
    if($('vLikes')) $('vLikes').textContent = item.likes || 0;
    if($('vViews')) $('vViews').textContent = item.views || 0;
    if($('vDown')) $('vDown').textContent = item.downloads || 0;
    const heart=$('viewerHeart');
    if(heart){ let liked=false; try{ liked=Array.isArray(favs)&&favs.includes(item.id); }catch(e){} heart.className='fa-'+(liked?'solid heart-red':'regular')+' fa-heart'; }
    if($('downloadBtn')) $('downloadBtn').textContent = video ? 'Download Ringtone' : 'Download Wallpaper';
    if($('shareBtn')) $('shareBtn').textContent = video ? 'Share Ringtone' : 'Share Wallpaper';
    const source = video ? videos() : images();
    const rel = source.filter(w => String(w.id)!==String(item.id)).sort((a,b)=>((b.cat===item.cat?1000:0)+(b.likes||0)+(b.downloads||0))-((a.cat===item.cat?1000:0)+(a.likes||0)+(a.downloads||0))).slice(0,10);
    if($('relatedTitle')) $('relatedTitle').textContent = video ? 'More Live Videos' : 'More Like This';
    if($('related')) $('related').innerHTML = rel.map(w => video ? '<video data-wall-id="'+esc(w.id)+'" src="'+esc(w.url)+'" muted loop playsinline preload="none"></video>' : '<img data-wall-id="'+esc(w.id)+'" src="'+esc(w.url)+'" alt="'+esc(w.title||'Wallpaper')+'" loading="lazy" decoding="async">').join('');
    renderCommentsSafe();
    const viewer=$('viewer'); if(viewer){ viewer.classList.add('show'); viewer.style.display='block'; viewer.scrollTop=0; }
    return false;
  };

  window.closeViewer = function(){ const v=$('viewer'); if(v){ v.classList.remove('show'); v.style.display='none'; } };
  document.addEventListener('click', function(e){
    const r=e.target.closest && e.target.closest('#related [data-wall-id]');
    if(r){ e.preventDefault(); e.stopPropagation(); window.openViewer(r.getAttribute('data-wall-id')); }
  }, true);

  const oldRender = window.render;
  window.render = function(){
    const out = oldRender ? oldRender.apply(this, arguments) : undefined;
    setTimeout(fixHomeAndWallpaperSections, 50);
    setTimeout(fixHomeAndWallpaperSections, 350);
    return out;
  };
  document.addEventListener('DOMContentLoaded', function(){ setTimeout(fixHomeAndWallpaperSections,150); setTimeout(fixHomeAndWallpaperSections,900); });
  setTimeout(fixHomeAndWallpaperSections,300);
})();

/* WFH AUTO HERO SLIDER - MOVING DOTS FIX */
let currentSlide = 0;
let sliderInterval = null;

function wfhSetHeroSlide(index) {
  const slider = document.getElementById('slider');
  const dotsBox = document.getElementById('dots');
  if (!slider || !dotsBox) return;

  const slides = Array.from(slider.children).filter(el => el.classList.contains('slide'));
  if (!slides.length) return;

  if (dotsBox.children.length !== slides.length) {
    dotsBox.innerHTML = slides.map((_, i) => `<span class="${i === 0 ? 'active' : ''}"></span>`).join('');
  }

  currentSlide = ((index % slides.length) + slides.length) % slides.length;
  slider.style.transform = `translateX(-${currentSlide * 100}%)`;

  dotsBox.querySelectorAll('span').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

function startHeroSlider() {
  const slider = document.getElementById('slider');
  if (!slider || !slider.children.length) return;

  clearInterval(sliderInterval);
  wfhSetHeroSlide(currentSlide);

  sliderInterval = setInterval(() => {
    wfhSetHeroSlide(currentSlide + 1);
  }, 3000);
}

/* restart after every render/update */
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(startHeroSlider, 300);
  setTimeout(startHeroSlider, 900);
});
setTimeout(startHeroSlider, 800);
setTimeout(startHeroSlider, 1800);

/* when render() changes wallpapers, restart slider and keep purple dot moving */
const wfhSliderObserver = new MutationObserver(() => {
  currentSlide = 0;
  setTimeout(startHeroSlider, 80);
});
setTimeout(() => {
  const slider = document.getElementById('slider');
  if (slider) wfhSliderObserver.observe(slider, { childList: true });
}, 500);

(function(){
  function q(id){return document.getElementById(id)}
  function detectVideo(u){return /\.(mp4|webm|mov)(\?|#|$)/i.test(String(u||'')) || String(u||'').includes('/video/upload/')}
  function refreshUrlPreview(){
    const url=(q('quickUrl')?.value||'').trim();
    const prev=q('uploadPreview');
    if(!prev) return;
    if(!url){prev.style.display='none';prev.innerHTML='';return;}
    prev.style.display='block';
    prev.innerHTML=detectVideo(url)?`<video src="${url}" controls playsinline muted></video>`:`<img src="${url}">`;
    if(q('quickType')) q('quickType').value=detectVideo(url)?'live':(q('quickType').value||'static');
  }
  document.addEventListener('DOMContentLoaded',function(){
    const u=q('quickUrl');
    if(u){u.addEventListener('input',refreshUrlPreview);u.addEventListener('change',refreshUrlPreview);}
    const f=q('quickFileInput'); if(f){f.removeAttribute('onchange');}
  });
})();

(function(){
  function q(id){return document.getElementById(id)}
  function safeToast(msg){try{ if(typeof toast==='function') toast(msg); }catch(e){}}
  function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;')}
  function isImageUrl(u){
    const s=String(u||'').toLowerCase();
    return /^data:image\//i.test(s) || /\.(jpg|jpeg|png|webp|gif|avif|bmp|svg)(\?|#|$)/i.test(s) || s.includes('/image/upload/');
  }
  function isVideoUrl(u){
    const s=String(u||'').toLowerCase();
    if(isImageUrl(s)) return false;
    return /^data:video\//i.test(s) || /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(s) || s.includes('/video/upload/');
  }
  function isDirectMedia(u){
    const s=String(u||'').trim();
    return isImageUrl(s) || isVideoUrl(s) || /^https?:\/\/res\.cloudinary\.com\//i.test(s) || /^https?:\/\/raw\.githubusercontent\.com\//i.test(s);
  }

  window.wfhIsImageUrl=isImageUrl;
  window.wfhIsVideoUrl=isVideoUrl;
  window.wfhIsDirectMedia=isDirectMedia;

  window.isVideo=function(w){
    const url=String((w&&w.url)||'');
    const type=String((w&&w.type)||'').toLowerCase();
    if(isImageUrl(url)) return false;
    return type==='live' || type==='video' || isVideoUrl(url);
  };
  window.mediaHTML=function(w){
    return window.isVideo(w)
      ? '<video src="'+esc(w.url)+'" muted loop playsinline preload="metadata"></video>'
      : '<img src="'+esc(w.url)+'" loading="lazy" onerror="this.style.opacity=.25">';
  };

  const oldSetUploadMode=window.setUploadMode;
  window.setUploadMode=function(mode){
    const out=oldSetUploadMode ? oldSetUploadMode.apply(this,arguments) : undefined;
    const input=q('quickUrl');
    if(input && input.placeholder) input.placeholder='Direct image URL or MP3 ringtone URL';
    return out;
  };

  function refreshPreview(){
    const input=q('quickUrl');
    const prev=q('uploadPreview');
    if(!input || !prev) return true;
    const url=(input.value||'').trim();
    if(!url){prev.style.display='none';prev.innerHTML='';return true;}
    prev.style.display='block';
    if(isVideoUrl(url)){
      prev.innerHTML='<video src="'+esc(url)+'" controls playsinline muted></video>';
      if(q('quickType')) q('quickType').value='live';
      try{ window.uploadMode='live'; }catch(e){}
    }else{
      prev.innerHTML='<img src="'+esc(url)+'" onerror="this.parentElement.innerHTML=\'<div style=&quot;padding:14px;color:#ff6b9a;font-weight:900&quot;>Image preview failed - check direct URL</div>\'">';
      if(q('quickType') && q('quickType').value==='live') q('quickType').value='static';
      try{ window.uploadMode='static'; }catch(e){}
    }
    return true;
  }

  const oldCheck=window.checkCloudinaryUrl;
  window.checkCloudinaryUrl=function(){
    const input=q('quickUrl');
    const box=q('cloudinaryUrlCheck');
    const url=(input&&input.value||'').trim();
    if(!url) return true;
    if(!/^https?:\/\//i.test(url)){
      if(box){box.className='wfh-url-check bad';box.textContent='❌ الرابط خاصو يبدأ بـ https://';}
      return false;
    }
    if(isDirectMedia(url)){
      if(box){box.className='wfh-url-check ok';box.textContent=isVideoUrl(url)?'✅ Direct video URL صحيح':'✅ Direct image URL صحيح';}
      return true;
    }
    return oldCheck ? oldCheck.apply(this,arguments) : true;
  };

  const oldPublish=window.publishItem;
  window.publishItem=function(){
    const input=q('quickUrl');
    const url=(input&&input.value||'').trim();
    if(url){
      if(!/^https?:\/\//i.test(url)){safeToast('الرابط خاصو يبدأ بـ https://');return;}
      if(!isDirectMedia(url)){safeToast('الرابط خاصو يكون صورة مباشرة أو فيديو مباشر');return;}
      if(isImageUrl(url)){
        if(q('quickType') && q('quickType').value==='live') q('quickType').value='static';
        try{ window.uploadMode='static'; }catch(e){}
      }
    }
    return oldPublish ? oldPublish.apply(this,arguments) : undefined;
  };

  document.addEventListener('DOMContentLoaded',function(){
    const input=q('quickUrl');
    if(input){
      input.placeholder='Direct image URL or MP3 ringtone URL';
      input.addEventListener('input',refreshPreview);
      input.addEventListener('change',refreshPreview);
    }
  });
  setTimeout(function(){const input=q('quickUrl'); if(input) input.placeholder='Direct image URL or MP3 ringtone URL';},500);
})();

(function(){
  const $ = id => document.getElementById(id);
  const all = () => { try { return typeof allWalls === 'function' ? allWalls().filter(Boolean) : []; } catch(e){ return []; } };
  const score = w => (Number(w.likes)||0) + (Number(w.downloads)||0) + (Number(w.views)||0);
  const newestTime = w => Number(w.createdAt || w.updatedAt || w.id || 0);
  function makeCard(w){
    try { return window.card(w,false); }
    catch(e){ return ''; }
  }
  function fillSameSizeSections(){
    const list = all();
    if(!list.length) return;
    const newest = list.slice().sort((a,b)=>newestTime(b)-newestTime(a));
    const trending = list.slice().sort((a,b)=>score(b)-score(a));

    if($('homeTrending')) $('homeTrending').innerHTML = trending.slice(0,4).map(makeCard).join('');
    if($('newArrivals')) $('newArrivals').innerHTML = newest.slice(0,4).map(makeCard).join('');
    if($('trendGrid')) $('trendGrid').innerHTML = trending.slice(0,24).map(makeCard).join('');
    if($('newGrid')) $('newGrid').innerHTML = newest.slice(0,24).map(makeCard).join('');
  }

  const oldRender = window.render;
  window.render = function(){
    const out = oldRender ? oldRender.apply(this, arguments) : undefined;
    setTimeout(fillSameSizeSections,120);
    setTimeout(fillSameSizeSections,650);
    return out;
  };
  document.addEventListener('DOMContentLoaded',function(){
    setTimeout(fillSameSizeSections,250);
    setTimeout(fillSameSizeSections,1000);
  });
  setTimeout(fillSameSizeSections,500);
})();

(function(){
  const SITE='https://wallflixhub.github.io/';
  const clean=s=>String(s||'').replace(/[_#]+/g,' ').replace(/\s+/g,' ').trim();
  const isVideoUrl=u=>/\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(String(u||'')) || String(u||'').includes('/video/upload/');
  const keywordTitle=(title,cat,type)=>{
    const base=clean(title)||'Premium mobile wallpaper';
    const category=clean(cat)||'4K';
    return `${base} - ${category} ${type==='video'?'live wallpaper video':'4K mobile wallpaper'} for Android and iPhone`;
  };
  function optimizeMedia(){
    document.querySelectorAll('img').forEach((img,i)=>{
      const src=img.getAttribute('src')||'';
      if(!img.getAttribute('alt') || img.getAttribute('alt').length<5){
        const card=img.closest('.card,.slide,.wfh-hero-bg,.row,.wfh-continue-card,#viewer');
        const txt=card ? (card.textContent||'') : '';
        img.alt=clean(txt).slice(0,80) || 'WallFlixHub 4K mobile wallpaper for Android and iPhone';
      }
      if(!img.closest('#previewMedia')) img.loading=img.loading||'lazy';
      img.decoding='async';
      img.referrerPolicy='no-referrer-when-downgrade';
      if(i===0 || img.closest('.slide')) img.fetchPriority='high';
      if(!img.width) img.setAttribute('width','450');
      if(!img.height) img.setAttribute('height','800');
    });
    document.querySelectorAll('video').forEach(v=>{
      v.preload=v.closest('#previewMedia')?'metadata':'none';
      v.setAttribute('playsinline','');
      if(!v.closest('#previewMedia')) v.muted=true;
    });
  }
  function updateSocialPreview(){
    try{
      const list=(typeof allWalls==='function'?allWalls():[]).filter(Boolean);
      const firstImg=list.find(w=>w && w.url && !isVideoUrl(w.url));
      if(!firstImg) return;
      const title=keywordTitle(firstImg.title, firstImg.cat, 'image');
      const desc='Download '+clean(firstImg.cat||'4K')+' wallpapers and live wallpapers on WallFlixHub. Fresh mobile backgrounds updated daily.';
      const set=(sel,attr,val)=>{const el=document.querySelector(sel); if(el) el.setAttribute(attr,val);};
      set('meta[property="og:image"]','content',firstImg.url);
      set('meta[name="twitter:image"]','content',firstImg.url);
      set('meta[property="og:image:alt"]','content',title);
      set('meta[property="og:description"]','content',desc);
      set('meta[name="twitter:description"]','content',desc);
    }catch(e){}
  }
  function addImageSchema(){
    try{
      const list=(typeof allWalls==='function'?allWalls():[]).filter(w=>w&&w.url&&!isVideoUrl(w.url)).slice(0,12);
      if(!list.length) return;
      let old=document.getElementById('wfh-image-gallery-schema'); if(old) old.remove();
      const data={"@context":"https://schema.org","@type":"ImageGallery","name":"WallFlixHub 4K Mobile Wallpapers","url":SITE,"image":list.map(w=>({"@type":"ImageObject","url":w.url,"name":clean(w.title)||'4K mobile wallpaper',"caption":keywordTitle(w.title,w.cat,'image'),"contentUrl":w.url}))};
      const sc=document.createElement('script'); sc.type='application/ld+json'; sc.id='wfh-image-gallery-schema'; sc.textContent=JSON.stringify(data); document.head.appendChild(sc);
    }catch(e){}
  }
  function addVideoSchema(){
    try{
      const list=(typeof allWalls==='function'?allWalls():[]).filter(w=>w&&w.url&&isVideoUrl(w.url)).slice(0,8);
      if(!list.length) return;
      let old=document.getElementById('wfh-video-schema'); if(old) old.remove();
      const data={"@context":"https://schema.org","@type":"ItemList","name":"WallFlixHub Live Wallpapers","itemListElement":list.map((w,i)=>({"@type":"ListItem","position":i+1,"item":{"@type":"VideoObject","name":clean(w.title)||'Live wallpaper video',"description":keywordTitle(w.title,w.cat,'video'),"contentUrl":w.url,"thumbnailUrl":w.poster||w.url,"uploadDate":new Date(w.createdAt||Date.now()).toISOString()}}))};
      const sc=document.createElement('script'); sc.type='application/ld+json'; sc.id='wfh-video-schema'; sc.textContent=JSON.stringify(data); document.head.appendChild(sc);
    }catch(e){}
  }
  function pinterestReady(){
    document.querySelectorAll('.card,.slide,.wfh-hero-bg').forEach(el=>{
      const img=el.querySelector('img'); if(!img) return;
      el.setAttribute('data-pin-description', img.alt || 'WallFlixHub 4K mobile wallpaper');
      el.setAttribute('data-pin-url', SITE);
      el.setAttribute('data-pin-media', img.currentSrc || img.src);
    });
  }
  function run(){ optimizeMedia(); updateSocialPreview(); addImageSchema(); addVideoSchema(); pinterestReady(); }
  document.addEventListener('DOMContentLoaded',()=>setTimeout(run,500));
  window.addEventListener('load',()=>setTimeout(run,900));
  const oldRender=window.render;
  if(typeof oldRender==='function'){
    window.render=function(){ const out=oldRender.apply(this,arguments); setTimeout(run,350); return out; };
  }
  window.wfhSeoRefresh=run;
})();

(function(){
  const $=id=>document.getElementById(id);
  const esc=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  const defaultRingtones=[
    {id:'ring_1',title:'Anime Bell Ringtone',cat:'Anime',url:"data:audio/wav;base64,UklGRoQiAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YWAiAAAAACgVyye1NUI9jz2XNiwp6Bb0Acvs7dmTy3DDd8LFyJfVaece/EERViQaM9A7cj3QN5grPBrLBbLwbN1Czv3EtMKqx0fTKuRS+FwNzSBYMCg6Fj3LOMstZR2KCZX0/uAX0b/GL8PPxjHRGOGh9HwJNB1yLU04fTyGOcQvYCAsDXD4nuQN1LPI5sMzxlXPNd4P8aYFjhlsKkE2qTsDOoMxKyOuEED8R+gi19bK1sTWxbTNg9ud7d4B4RVJJwg0nDpCOgYzwyUOFAAA9+tS2iXN/8W1xU/MA9lP6if+MBIOJKQxWTlEOk00KShJF64Dqe+Y3ZzPXcfRxSbLuNYp54T6fg6+IBov4TcLOlg1WSpcGkUHWvPx4DnS7sgoxjnKo9Qr5Pj20ApdHWwsNzaXOSc2UyxEHcQKBPdZ5PjUsMq5xofJxdJY4YfzKQfuGZ0pXTTqOLs2FS4AICYOpvrN59XXoMyBxxHJHtGz3jTwjQN2FrImVzIGOBQ3oC+NImkRPP5I683au86AyNXIsM8+3ALtAAD5Eq4jKDDtNjM38jDrJIoUwAHH7tzd/tCzydTIes752fPphPx5D5Ug0i2hNRg3DDIXJ4YXMgVH8v/gZtMXywrJfc3n1wvnHfn7C2kdWSslNMY27DIPKVsajQjD9TLk8NWqzHjJucwI1krkzvWBCC8avyh7Mj02lDPUKgcdzws4+XLnmNhrzhzKLcxd1LPhmvIRBeoWCSalMH81BDRlLIgf9Q6j/LvqXNtV0PPK2cvn0kjfhO+sAZ4TOiOnLo40PTTALdwh/BEAAAnuN95n0v3Lu8un0QvdjexY/k8QVCCDLGszPzTlLgIk4RRMA1rxJuGd1DfN1cuc0P3auukV+/8MWx07KhoyCzTVL/gloheFBqj0J+T01p/OI8zIzx/ZC+fn97IJVBrUJ5wwozOPML4nPhqnCfL3Nedq2TPQpMwpz3LXg+TR9GwGQBdQJfQuCDMTMVIpsRywDDT7Ter82/DRWM2/zvfVJOLW8S8DJBSyIiMtPDJjMbQq+x6cD2r+bO2l3tPTPc6Jzq7U8N/57gAAAxH+Hy4rQDF+MeMrGiFqEpIBj/Bj4drVT8+HzpjT59077OH83w03HRYpFjBmMeAsDCMXFagEsvM05ALYj9C4zrXSDNyf6dT5vgpfGt4mwi4cMakt0SSiF6sH0vYS50na+dEbzwXSXton59z2oAd6F4kkQy2iMEAuZyYHGpcK7Pn86avcitOuz4jR39jV5P3ziwSMFBsiniv3L6QuzidGHGkN/Pzu7CXfQtVv0DzRkNeq4jjxgAGXEZYf1SkfL9cuBSlcHiAQAADl77XhHdde0SLRcdao4JDuhP6fDv0c6ScbLtguDCpJILgS9QLd8lbkGdl30jnRgtXQ3gfsl/unC1Ma3iXtLKou4yoMIjEV2AXU9QjnMtu603/RxNQj3aDpvfixCJsXtiOWK00uiiujI4cXqAjH+MXpZ90k1fPRNdSj21vn+fXCBdkUdSEZKsItASwNJboZYAuz+4vstd+z1pXS1tNP2jvlTfPbAg8SHB95KAotSCxKJscb/w2U/ljvGOJk2GHTptMo2UDju/AAAEAPsBy3JiksYSxaJ64dgxBoASjyjeQ12ljUpNMv2G3hRu4z/XAMMhrXJB4rSyw8KG0f6RItBPj0E+cl3HbV0NNk18Pf7+t3+qEJpRfZIuwpCSzxKAMhMBXgBsX3pukv3rrWKdTG1kLeuOnO99cGDRXDIJYomyt4KW8iVhd/CYz6QuxS4CPYrNRV1uvcpOc79RMEbBKUHhwnAivSKbEjWhkGDEz95u6K4q3ZWtUS1r7bsuW/8lgBxg9SHIIlQCr/KcgkORt1DgAAj/HW5FfbL9b61b3a5eNd8Kv+HA3+GckjVykBKrQl8xzJEKcCOfQy5x7dLNcP1ufZPuIY7gz8cgqaF/QhSCjXKXQmhx4AEz4F4vac6QDfTdhN1jzZvuDw6335ywcqFQYgFSeEKQon9B8ZFcMHhvkR7Pvgktm21rzYZd/n6QL3KQWxEgAevyUHKXQnOCERFzMKJfyO7gvj99pG12bYNN7/5530jwIxEOUbSiRjKLQnVSLoGI0Muv4R8S/lfNz+1zvYLN055k/yAACtDbkZtyKYJ8onSSOdGs4OQwGW82TnHd7b2DrYTdyW5Bvwff0nC3wXCCGpJrcnFCQtHPUQvwMc9qfp2d/c2WHYltsY4wLuCfuiCDMVPx+XJXwntiSZHQATKgaf+PXrruH+2rHYCdu/4Qbsp/giBuASYB1kJBknLyXgHu0Ugwgd+03umONC3CfZpNqL4CjqWPanA4UQaxsRI5AmfyUBILsWyAqU/avwluWj3cLZZ9p+32roHvQ1ASQOZRmhIeIlqCX7IGkY9wwAAA3zpech34LaUtqX3s3m+/HO/sELThcWIBElqSXOIfUZDQ9gAnD1w+m54GTbZNrX3VLl8u90/F4JKhVyHh4khCV7Il8bCRGzBNP37etp4mjcndo93fnjA+4q+v0G+hK2HAsjOSUBI6Yc6xL1BjL6Ie4v5Ivd+trL3MTiMOzw96EEwxDmGtkhySRgI8kdrxQlCYv8XPAJ5svefNt+3LLheurK9UwChQ4DGYogNiSaI8keVRZBC9z+nPL15yjgINxY3Mbg4+i68wAAQwwQFyAfgSOuI6Mf3RdGDSEB3vTv6Z7h59xW3P3fbOfA8cD9AAoPFZ4dqiKdI1kgRBk0D1sDIff26yzjzd163FrfFebe7437vgcCEwUctSFnI+ogihoJEYcFYvkI7tDk0t7B3Nve3+QX7mn5fwXtEFcaoSAPI1chrxvDEqIHnvsh8Ijm898r3YDey+Nq7Ff3RgPQDpYYcR+UIp8hshxhFKsJ1P1B8lHoMOG23Ure2uLa6lj1FQGuDMUWKB74IcQhkh3jFaALAABk9Cnqh+Ji3jfeC+Jo6W7z7v6KCuUUxRw8IcUhUB5GF38NIQKI9g/s9eMt30feX+ET6Jrx0vxmCPoSTBtiIKQh6x6LGEcPNwSr+ADueOUW4Hre1eDe5t/vxPpEBgQRvxlrH2AhYx+wGfYQPQbL+vnvD+ca4c7ebuDJ5TzuxvgmBAcPHhhZHvwguB+1GowSMwjm/PrxuOg64kLfKuDU5LTs2fYPAgQNbRYtHXgg7B+aGwYUFwr6/v7zcepy49bfB+AA5Efr/vQAAP8KrhTpG9Uf/h9eHGUV5wsDAQX2N+zC5IfgBuBM4/bpOfP8/fcI4hKOGhUf7h8BHacWog0DAwz4CO4n5lbhJuC64sPoifED/PEGCxEfGTkevh+DHcwXRg/1BBH64++f50DiZeBI4q3n8e8Y+u4ELQ+eF0Idbx/lHdMY0xDYBhL8xfEq6UPjxOD34bbmcO48+O8CSA0LFjEcAR8mHrsZRhKrCA3+rPPE6mDkQeHG4d3lCu1y9vgAXwtqFAobdR5GHoQaoBNsCgAAl/Vr7JPl2+G14SPlvuu79Ar/cwm8EswZzR1HHi4b3hQaDOkBg/cf7tvmkeLE4YnkjeoX8yb9iAcEEXoYCh0pHrkbAhayDccDbfnc7zboYuPx4Q7kd+mJ8U/7ngVCDxUXLBztHSQcCBc1D5gFVfui8aPpTOQ84rHjf+gS8IX5uAN5DaAVNhuTHXEc8xehEFoHOP1t8yDrTuWk4nTjo+ey7sv32AGsCxwUKRodHZ8cwBj1EQwJFf889avsZuYp41Xj5eZr7SL2AADcCYsSBhmLHK8cbxkvE6wK6QAN90Luk+fI41TjROY97Iv0Mf4KCO4Q0BffG6EcAhpQFDkMswLe+OTv0+iB5HDjwOUq6wjzbPw5BkgPhxYZG3ccdhpWFbINcgSu+o3xJOpT5arjWuUx6pnxtPprBJsNLRU8Gi8czhpCFhYPIwZ6/D7zhus85v/jEeVT6UHwCvmiAugLxBNIGc0bCBsSF2MQxgdB/vP09ew752/k5uSR6ADvb/feADIKThI+GE8bJRvGF5gRWAkAAKr2ce5O6Pnk1+Tq59bt5fUk/3kIzRAhF7kaJhtfGLYS2Qq2AWP4+O906Zzl5ORg58TsbfRy/cEGQQ/yFQkaCxvbGLsTSAxjAxv6h/Gs6lfmDOXx5szrCPPL+woFrg2zFEMZ1Ro8GacUow0EBdH7HvPz6ynnUOWe5u3qt/Ew+lYDFQxkE2YYhRqBGXkV6Q6YBoL9uvRJ7RDoreVn5ijqfPCk+KcBdwoIEnUXGxqqGTEWGRAdCC3/Wfar7gvpJOZM5n3pV+8n9wAA1wigEHAWmBm4Gc4WNBGSCdAA+vcY8Bnqs+ZL5u3oSO669WH+NQcuD1oV/RisGVIXNhL2CmsCm/mO8TjrWedk5nfoUe1f9Mv8lQW0DTIUTBiFGboXIhNIDPwDO/sM82fsFeiX5hvocuwX80D79gMzDPwShRdGGQkY9ROGDYEF1/yP9KTt5ujk5trnq+vi8cL5XAKtCrkRqxbtGD0YrxSxDvgGb/4X9u3uyulI57Pn/erB8FL4xwAkCWoQvRV9GFcYURXHD2EIAACh90LwwerE56XnaOq27/D2O/+ZBxAPvRT2F1gY2hXHELoJiQEt+aDxyetW6LHn6+nB7p/1tf0OBq4NrhNYF0AYSRaxEQMLCQO3+gbz4Oz+6NXniOni7V/0OvyEBEQMjxKmFg8YoBaFEjoMfwRA/HP0Bu666RLoPuka7THzyvr+AtUKYxHhFccX3hZBE14N6QXE/eT1OO+J6mboDelq7BfyZ/l8AWIJKxAIFWgXAxfmE28ORgdD/1j3dfBr69Do9OjR6xDxEfgAAO0H6A4eFPMWEBdzFGwPlAi7AM74vfFd7FDp8+hP6x3wyvaM/ncGnA0lE2gWBRfpFFUQ1AkrAkT6DPNe7eXpCunm6j/vk/Ug/QEFSQwcEskV4hZGFScRAwuSA7n7YvRt7o7qOOmU6nfubPS++40D8AoGERcVqRaNFeURIAzvBCv9vvWK70nrfOlZ6sXtV/Nn+h4CkwnkD1MUWha7FYwSLA1ABpn+Hfex8Bbs1uk26intVfId+bMAMgi3Dn4T9RXTFR0TJQ6DBwAAf/jj8fPsReoq6qPsZfHg90//0AaBDZkSfBXUFZgTCw+5CGAB4fkd8+Dtyeo06jTsifCy9vL9bgVEDKUR7xS+FfwT3Q/gCbkCQ/te9NruX+tV6tvrwu+T9Z78DQQAC6QQTxSTFUkUmxD2CggEo/yk9eHvCOyL6pjrDu+E9FT7rgK3CZcPnhNSFYEUQxH9C00F//3v9vTwwezW6mzrcO6H8xX6VAFqCH8O3BL9FKIU1xHxDIUGV/89+BHyi+0261br5+2b8uP4AAAbB14NChKTFK0UVhLUDbEHpwCN+TbzZO6o61Xrc+3B8b73sv7LBTQMKhEXFKQUvxKkDtAI8gHc+mP0S+8u7GnrFO378Kf2bP19BAQLPRCJE4UUExNiD98JNAMq/Jb1PvDF7JPryuxH8J/1L/wvA88JRA/pElEUUhMLEOAKbAR2/c32PfFt7dDrluyn76b0+/rmAZUIQA45EgoUfBOhENALmgW+/gj4RvIl7iHsduwb777z0/mgAFkHMg16EbATkhMjEa8MvAYAAEb5WPPr7oTsbOyj7ujyt/hh/xwGHAysEEMTkhOREX0N0gc8AYP6cvS/7/rsdew/7iPyqPcp/t4E/wrSD8USfxPrETkO2ghxAsD7kfWg8IHtkuzw7W/xp/b4/KID3QnsDjYSWBMxEuMO1AmdA/z8tvaM8Rjuw+y07c/wtPXQ+2cCtQj6DZcRHhNiEnsPvwrABDT+3/eC8r/uBu2M7UHw0fSy+jEBiwf/DOkQ0RKAEv8PmwvZBWj/C/mB83TvXO147cbv/fOf+QAAXwb8Cy0QcxKKEnEQZgzmBpYAN/qJ9Dbww+147V7vOvOY+NX+MgXxCmQPBBKBEs8QIQ3mB74BZPuW9QXxOu6K7QnviPKe97D9BgThCY8OhBFmEhsRyw3aCN8CkPyp9t/xwu6v7cfu5/Gx9pT82wLLCLAN9RA4ElMRYw7ACfcDuf3B98TyWO/m7ZjuWPHT9YD7swGyB8cMVxD4EXkR6Q6XCgYF3/7b+LHz/e8u7nvu2vAD9Xf6kACXBtULqw+nEYwRXg9fCwoGAAD4+af0r/CI7nLub/BC9Hj5cv96BdwK8w5FEYwRwA8YDAMHGwEV+6P1bfHx7nruFfCR84X4Wf5dBNwJLw7UEHsRERDBDPAHMAIx/Kb2N/Jq75Tuzu/x8p73SP1BA9gIYQ1UEFgRTxBZDdAIPgNM/az3CvPy78DumO9h8sX2P/woAs8HiAzFDyQRfBDhDaMJQwRk/rb45/OH8Pzude/h8fn1PvsRAcQGpwspD98QlhBYDmgKPgV4/8P5zPQq8UnvY+9z8Tv1SPoAALYFvwqBDosQoBC+Dh4LLwaHAND6uPXY8aXvYu8W8Yz0XPn0/qkE0AnNDScQmBASD8YLFQeQAd77qvaR8hHwc+/K8OzzfPjt/ZsD2wgODbQPfxBWD14M8AeTAuv8ofdV84rwlO+O8FzzqPfu/I8C4wdGDDQPVhCJD+YMvgiOA/b9m/gi9BHxxe9k8Nzy4Pb3+4YB5wZ0C6cOHBCqD18NfwmBBP3+mPn39KXxBvBL8GvyJvYJ+4EA6AWcCg0O1A+7D8cNMgpqBQAAl/rT9UTyVvBC8AvyefUl+oH/6QS8CWgNfA+8Dx8O2ApJBv4Al/u29u/ytfBK8Lrx2vRL+YX+6gPXCLgMFw+sD2gObwseB/YBlvyd96PzIfFh8HrxSvR8+JD96wLuB/8LpA6ND6AO+AvnB+gCk/2J+GH0m/GI8ErxyfO596L87wEABz0LJA5eD8gOcgykCNIDjv53+Sf1IfK/8CrxV/MC97z79QARBnMKmA0hD+AO3AxUCbMEhv9o+vT1svID8Rrx9PJY9t/6AAAfBaIJAQ3VDugOOA34CYwFeQBa+8j2T/NW8RrxoPK79Qz6EP8tBMwIXwx7DuEOhA2OCloGZwFM/KH39fO28SnxXPIs9UP5JP48A/EHtAsVDsoOwA0WCx4HTwI8/X74pPQj8kbxJ/Kr9IT4QP1MAhIHAQuiDaUO7g2RC9cHMAMs/l/5XPWc8nLxAfI39NH3YvxeATAGRQojDXIODA79C4QICgQY/0L6G/Yh863x6/HS8yr3jftzAEwFgwmZDDEOGw5bDCUJ2wQAACb74Paw8/Xx4/F885D2wPqO/2cEuwgFDOMNHA6qDLkJowXkAAv8q/dJ9Eny6vE08wH2/Pms/oID7QdnC4gNDg7qDEEKYgbCAfD8e/jr9Kvy//H78oD1Q/nQ/Z4CHAfBCiAN8g0dDbsKFgebAtT9TvmV9RjzIvLQ8gz1lPj7/LwBRwYTCq4MyA1ADSgLvwdtA7X+JPpG9pDzUvKz8qb08Pct/NwAcAVeCTAMkQ1WDYgLXgg3BJP//Pr+9hL0kPKl8k30WPdn+wAAmASkCKkLTQ1dDdoL8Aj5BGwA1fu895702vKk8gL0y/aq+ij/vwPjBxgL/AxXDR4MdwmyBUIBrvx++DT1MPOx8sXzS/b1+Vb+5gIfB38KoAxDDVQM8QlhBhIChv1F+dH1kvPM8pbz1/VK+Yj9DwJXBt4JOQwiDX0MXwoHB9wCXP4O+nb2//P08nTzb/Wq+ML8OgGMBTYJxwv0DJgMwAqiB58DMP/a+iH3dfQo81/zFfUU+AL8ZwDABIcITAu5DKYMFAszCFoEAACn+9L39vRo81jzx/SJ90v7mv/zA9QHxwpzDKYMWwu4CA4FzAB0/Ij4f/W0817zh/QK95z6z/4lAxwHOgoiDJoMlQsxCbkFlAFB/UL5EPYL9HHzU/SW9vX5Cv5ZAmAGpQnFC4EMwgufCVoGVgIN/v/5qPZt9JHzLfQu9lj5S/2OAaEFCQleC1sM4gsBCvIGEgPX/r/6SPfZ9LzzE/TS9cX4kvzFAOAEZwjuCioM9QtXCoAHxwOe/4H77fdO9fPzBvSD9T344fsAAB4Evwd0Cu0L/AugCgQIdQRhAEP8l/jM9Tb0BvRA9b/3N/s//1wDEwfzCaUL9gvdCnwIGwUgAQb9RflR9oP0EfQJ9Uv3lfqC/pkCYgZpCVIL5AsOC+oIuQXbAcf99/ne9tv0KfTe9OP2/PnK/dgBrwXZCPYKxgszC0wJTQaQAof+rPpy9zz1TfTA9If2bPkY/RkB+QRCCJAKnQtLC6MJ2AY/A0X/YvsM+Kf1fPSt9Db25vhs/F0AQgSmByEKaQtXC+8JWgfnAwAAGvyq+Br2tfSn9PD1afjH+6T/igMFB6oJKgtYCy4K0QeIBLcA0vxO+ZX2+vSt9Lb19/cq++/+0gJfBisJ4QpMC2IKPgghBWoBiv30+Rf3SPW+9Ij1j/eV+j7+GwK3BaUIjgo2C4sKoQiyBRgCQf6e+qD3n/Xa9Gb1MvcJ+pP9ZQEMBRoIMQoUC6cK+Ag6BsEC9v5K+y74APYB9U/14PaF+e38sQBfBIgHzQnoCrkKRQm6BmMDqP/4+8L4afYy9UP1mPYK+U78AACxA/IGYAmxCr8KhwkwB/8DVwCm/Fv52vZu9UP1XPaZ+LX7U/8DA1cG6whxCrkKvgmcB5QEAwFU/ff5Uvez9U31K/Yy+CT7qf5VArkFcAgnCqkK6gn+ByEFqgEC/pf60PcC9mP1BfbV95v6BP6oARkF7gfUCY8KCgpWCKYFTAKu/jn7VPhZ9oL16fWC9xr6Zf38AHYEZwd4CWoKIAqkCCMG6QJZ/9z73vi59qz12fU596L5y/xTANED2wYVCTsKKwroCJcGgAMAAIH8bPkg9+D10/X69jL5N/yu/ywDSwaqCAIKKwohCQIHEASkACb9//mO9x322PXH9sz4qvsL/4cCtwU4CMEJIQpPCWQHmgRFAcv9lPoD+GP25/Wd9m/4Jftt/uMBIAXBB3YJDQp0CbwHGwXhAW/+Lft9+LL2AfZ+9hv4pvrT/UABhgRDByQJ7wmNCQsIlgV4AhH/x/v9+An3JPZq9tH3MPo//Z4A6wPBBskIxwmdCVAICAYKA7H/Y/yC+Wf3UPZf9pH3wvmw/AAATwM6BmgIlgmiCYsIcQaVA04A//wL+sz3hvZf9lv3Xfkn/GX/swKwBf8HXAmeCbwI0gYbBOgAm/2X+jf4xPZo9i/3APml+83+FwIiBZEHGgmPCeMIKweZBH4BN/4m+6n4Cvd79g33rfgq+zn+fAGSBB0H0Ah3CQEJegcRBQ8C0f63+x/5WfeY9vT2Yvi2+qr94gAABKMGfghWCRQJvweBBZwCav9K/Jv5rve+9ub2IfhK+iD9SgBsAyYGJAgsCR4J/AfpBSMDAADe/Bv6C/js9uH26ffm+Zv8tv/YAqQFxQf5CB4JLwhJBqUDkwBy/Z76bfgj9+X2u/eK+R38Jf9EAiAFXwe/CBUJWQigBiAEIwEG/iT71vhi9/P2lvc3+aX7l/6xAZgE9AZ8CAMJegjwBpQErwGY/qz7RPmo9wn3evfs+DT7Df4fAQ8EgwYyCOgIkQg2BwIFNwIq/zf8t/n29yn3Z/eq+Mr6h/2OAIQDDgbhB8QInwh0B2gFuQK6/8L8LvpK+FH3Xvdw+Gj6B/0AAPgClQWJB5gIowipB8cFNwNGAE79qPql+IH3XvdA+A36jfx1/2wCGQUsB2UInwjVBx4GrgPQANv9JvsF+bj3ZvcY+Lr5GPzt/uABmgTIBikIkgj4B20GIARWAWb+pvtr+ff3d/f692/5qvto/lQBGQRgBuYHfQgSCLQGiwTZAfH+KfzV+T74kffk9yz5Qvvo/csAlgP0BZ0HXwgkCPIG7wRXAnr/rPxE+or4s/fX9/H44fps/UMAEgODBU0HOQgtCCkHTAXQAgAAMf23+t343PfS97/4iPr1/L7/jQIPBfcGDAgtCFcHogVEA4QAtf0s+zb5DvjW95b4NfqE/Dv/CAKYBJwG1wclCHwH8QWzAwUBOv6l+5T5Rvji93T46vkY/Lz+hAEfBDwGmwcVCJkHOAYbBIIBvv4f/Pb5hfj391v4p/mz+0D+AQGjA9cFWQf8B64HdwZ9BPwBQP+b/F36y/gT+Ev4bPlU+8n9fwAnA24FEAfcB7oHrwbZBHECwf8Y/cj6Fvk2+EL4Ofn8+lb9AACpAgIFwga1B78H3gYuBeECPgCW/Tb7aPlh+EL4Dfmq+uj8g/8rApIEbgaGB7sHBgd8BU0DugAT/qf7vvmT+Er46vhg+oD8Cf+uASAEFQZRB68HJQfDBbIDMwGR/hr8GfrM+Fn4zvgc+h38kv4xAawDuAUVB5wHPQcCBhIEqAEN/478efoL+XD4uvjh+cD7H/62ADcDVgXTBoIHTAc7BmwEGQKI/wT93PpQ+Y74r/is+Wn7sP08AMAC8QSMBmAHVAdrBsAEhgIAAHv9Q/ua+bT4q/h/+Rj7Rv3F/0kCiQQ/BjcHVQeUBg0F7gJ2APL9rPvq+eD4rvha+c/64PxQ/9IBHgTtBQgHTQe2BlQFUQPqAGn+GPw++hL5ufg8+Yv6gPzd/lwBsQOXBdIGPwfQBpMFrgNaAd/+hvyW+kv5y/gm+U/6Jfxv/uYAQwM8BZYGKQfjBswFBgTHAVT/9fzy+on55PgX+Rr60PsE/nIA0wLeBFUGDAfuBv4FWQQwAsj/Zf1S+835BPkP+ez5gPud/QAAYwJ9BA8G6QbyBigGpQSVAjgA1v21+xb6K/kP+cX5N/s6/ZD/8gEZBMQFvwbuBkwG6wT1AqcARv4a/GT6WPkW+aX59frc/CP/gQGzA3QFjwbkBmgGKgVRAxMBt/6B/LX6i/kk+Yz5uPqE/Lj+EgFLAyAFWgbTBn0GYwWnA3wBJv/p/Av7w/k4+Xv5g/ow/FH+owDiAskEHwa7BosGlgX3A+EBlP9T/WT7AfpT+XD5VPri++39NQB4Am4E3gWdBpIGwQVCBEMCAAC+/cD7Q/p1+W35K/qa+479y/8NAhEEmQV4BpMG5gWIBKACagAo/h/8i/qc+XD5CvpY+zP9Yv+iAbEDUAVOBowGBAbHBPkC0gCT/n/81vrK+Xr57/kc+9z8/P44AVADAwUeBn8GHAYABU0DNwH9/uL8Jfv9+Yr52/nm+ov8mP7OAO0CsgToBWwGLQYzBZwDmAFm/0X9ePs0+qH5zvm2+j/8OP5mAIgCXQSuBVIGNwZfBeYD9gHN/6r9zvtx+r35x/mN+vj73P0AACQCBgRvBTIGOgaFBSoEUQIyAA/+Jvyz+uD5x/lq+rb7hP2c/74BrQMrBQ0GNwalBWkEpwKWAHT+gfz4+gj6zflN+nr7L/06/1oBUQPkBOIFLga/BaIE+QL3ANn+3fxB+zb62fk3+kT74Pza/vUA9AKZBLIFHgbRBdUERgNVAT3/O/2O+2j67Pkn+hT7lfx9/pIAlQJKBH0FCQbeBQIFjgOwAZ//mv3e+5/6BPoe+ur6T/wk/jAANgL5A0MF7gXkBSkF0gMHAgAA+v0w/Nv6Ivob+sb6D/zP/dH/1wGlAwUFzQXlBUoFEARbAl8AWf6F/Bv7Rvod+qj60/t9/XL/dwFQA8MEpwXfBWUFSASqArwAuf7c/F/7bvom+pD6nfsw/Rf/GAH4An4EfAXTBXoFfAT2AhYBGP80/ab7nPo1+n76bfvm/L3+uQCfAjUETAXCBYkFqQQ8A24Bdv+O/fD7zvpJ+nL6Qvui/Gf+XABFAuoDFwWrBZIF0QR+A8IB0//o/T38BPtj+mz6Hfti/BX+"},
    {id:'ring_2',title:'AMOLED Pulse Tone',cat:'AMOLED',url:"data:audio/wav;base64,UklGRoQiAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YWAiAAAAAPEYti3bOjM+MjcGJ2EQCvc3397MC8Ndw8TNg+B5+KgR4SdzN8c91DlFLF0Xmf4X5urRbsWywijKkNou8TsKjyFHM3Q8kTvGMOIdDAY77ZDXpMjwwmbHRNU56sYC1xprLkI6ZTx9NN0jSg2J9LfdnswVxIXFrtCz42f71xP1KD03UjxeNzYpOBTk+0XkSdEXxonE38yz3Tb0qAz6InQzXDtiOd4tvRovAyHrkdbryHHE4MlN2FDtaAWUHPkuiTmFOsYxwiBRCjDyYNyDzDvFuseU083mMv7dFd8p5TbGOuE0MyYuEVX5neLP0N/GccaWz8XgIPfvDjwkfDMpOig3/CquF3UAMOm71VTJB8ZfzEvbTfDlByceXy+yOJU4Dy+5HXYH/e8z243Mesb5yXPW0unbALoXoSpsNic5YDI7Iz4O6vYe4XvQxMdoyEvSxePs+Q4RVSVhM9445TQhKLQU3f1m5wzV3Mmwx+LOPN4w8z4Kkx+hL8A3lzZbLMEaugTw7S3auczQx0DMStnA7GMDcRk9K9Q1dDfcL1AgaQuj9MbfS9DDyG3K/tSz5pn8CBNIJiUzfTeaMk4l0hFm+8Plg9SDymvJZtEg4ff1cgzXIMAvtDaNNKop3RccAgnsTdkFzTvJjs4Y3JbvyQUAG7QrHzWyNVctdB2wCIHyld4+0NzJfMys147pJv/cFBUnyTIINkowhiIIDxH5RuQd1EXLNMvr0/TjoviDDvUhvC+QNXky/yYNFaD/SOqS2HHNusrg0NreVPINCGocCCxPNOIz0yqpGhQGgvCK3VLQC8uUzlPaVOyUAYsWvSdPMoA09i3JH1cM3vbv4tvTIswLzW7Wt+Yw+28Q7iKZL1Y0XjBcJFESQf2r6PzX+c1KzDXTkeH49C8Krx06LGczBTJSKO4XkwOn7qPchNBPzLPQ89wE7+IDFhhDKLkx6DKgKxkdvwnM9LzhudMXze7O7dhp6aL9ORLEI1cvCDM7LsAhrA8C+zLnh9eczunNi9U65IP3MAzQHkwsZjIdMNUlRRUwAe/s39vV0KbN19KK357xEQZ9GaYoCTFCMUopdxpBB93yrOC30yLO2dBn2wjs9v/gE3ck+C6oMRUsLx8dDeP43OU011jPls/g19Xm9PkPDs4fPyxRMS4uXiOvEuv+Wus920HRDs8A1RbiIvQhCMEa6ihBMI8v9ibkF90EDvG/39PTQs/N0tvdlO4tAmUVCCV/Ljgw6ympHKUK4/ap5ADXLNBO0TTaYOlL/M0PqyAVLCcwNyztIC0Qwvzm6bvayNGG0CrXluSO9hEK5BsOKWEv0i2kJGEVlAJg7/TeC9R00MfUSOAM8UcEyBZ5JewtuS7BJy8aRggC9Zfj69YW0RHTg9za64b+axFmIc8r7C47KoUewA23+pPoWtpn0gvSVNkJ5+H44gvlHBUpbS4LLFci7xJmANLtSN5e1LjRxdar4m/zRAYKGMwlQS0tLZclwhf+BUDzpuLy1hXS29TO3kPupgDpEgIibyugLTsoJxxnC8j4YecW2h3TndN+22/pHfuVDccdACllLT0qDyCPEFT+ZOy83cvUC9PG2AXlvfUkCC0ZASaALJYrbiNkFc8DnfHV4RXXJdOt1hLhmvCrAkcUfyL2KkYsOSbTGSUJ9/ZO5u/Z6dM51aXdxutA/SkPiR7QKEwsaSjOHUIOXPwW607dT9Vs1MjaU+f09+cJMBoaJqor9ilJIRQTuAEY8CLhUddH1IPYT+Pd8pUEhhXeImYq3yo3JIsX+AZC9Vrl5NnI1N3Wyd8N7kr/nxAtH4coIiuQJpYbCAyA+uXp/dzq1dnVytyV6Rb6jQsVGxcmwSpOKCgf1RC8/7HujOCm13jVXdqD5Q71ZQaoFiIjwSlsKTUiTxXiBKvzhOTz2brVidjn4UTwOgH3EbQfJyjqKbUkZhniCb740+jH3JrWUdfL3snrIPwXDdwb/CXHKZ8mDB2nDtf9Z+0T4BLYt9Y63K7nKvcZCKsXSiMHKfAnNSAiE+MCL/LL4xzavNY62v/jafIRAzMTHyCvJ6Uo2CJBF9AHF/fd56vcXdfR2Mng8O0U/oQOhxzHJb0o7CT4GooMDPw67LbflNgC2Bfezeky+bIJkxhZIzsoayY5HgIR+wDP8C7jW9rO1/DbEOZ99NAEUhRvICMnVCf7ICcV0gWL9QTnqdwy2FraxOII8PD/1g8WHXwlpCc0I+sYgApa+inrc98q2VjZ9N/i6yX7MQteGU8jXifgJEEc8g4r/4vvrOKx2u3YqN0Y6H/2dQZVFaUghCb5JR8fGRPqAxn0R+a/3BfZ6Nu55BHytQENEYsdHCV/Jnsh5xaHCMH4M+pJ39PZt9rP4entAv2WDA4aLSNxJk8jTxrxDHH9Yu5F4hzbGdpi3xfqbvgCCD0WwiDSJZYkRR0YERcCwvKk5ezcC9p83ajmCfRjAykS5h2nJE0lwB/tFKIGQfdY6Tjfjtof3Kfj5O/L/uANpBr2InUluSFjGAELz/tT7fbhm9tP2x3hDOxK+nUJCxfIIA8lKyNuGyQPWQCE8RvlLt0N2xLfkOjx9fkEKhMoHh8kEiQGHv0S0ATa9ZjoPd9Y243de+XQ8X0AEQ8hG6oibSQhIH8WIglE+l7swOEs3I/c1+L27RL80Qq/F7ggPSS6IZ0ZPw2y/l/wquSE3RzcrOBw6sj3eAYTFFMehSPNIk0cGRERA4v08OdZ3zLcAN9K567zGgIpEIUbSiJZI4ceoxRTB9H4g+uh4c7c2N2P5NTvx/0TDFsYkiBcI0Ug0BdpCx/9VO9S5O3dNd1G4kfsjfnhB+IUZx7aIoEhlhpCD2YBVPNh54nfGd134BPpffWiAykR0RvXIToi7RzREpcFdPfA6pfhgN0n30TmpvFo/z4N3hhYIG8izB4LFqEJo/th7hHkad5Y3uHjFO5A+zIJmRVlHiEiLyDjGHYN0P818unmzN8M3vLh1uo89xQFEBIIHFMhEyFTGwkR7QMu9hTqo+FB3nzg9Odq8/MAUQ5KGQsgdiFQHUwU6gc7+oXt5eP13oTfeuXX7+L8bAo4Fk8eWiHXHjUXuQtO/i7xiOYi4ArfbuOQ7Oz4cAbgEigcwCDkH7oZSw9UAv/0gOnD4Q/f1uGg6SH1bAJOD6AZrB9zINQblhJDBur4wezP45Dft+AR54/xcf6QC8EWJh6GIHwdjBUJCt/8PfA95ongEuDq5ELui/q3B5kTNBwdIK4eJRiaDc8A5vMD6fXh6d8z40bryvbRAzMQ4Bk9H2YfVxroEKwErfcT7M3jOuDw4aXoO/Pt/54MNBfqHaYfHRzpE2cIhPtj7wjmAeEj4Wfm6+8Z/OkIOxQtHG0fch2SFvQLXP/j8pvoOuLO4JPk5uxk+CIFAhEMGr4eUh7bGEQPJgOG9nzr3uPw4C7jNera9FYBlw2RF54dvB69Gk0S1QY++p7u5uWH4Tvi4ueK8Zf9BgrIFBIcsB4yHAUVWwr8/fXxSOiP4r3h8+V+7u/5Xga8ESQaMB42HWEXqw2xAXP1+eoB5LPhb+TA6232rgJ6DtoXQB3IHVwZuRBRBQv57+3Y5RziWuNb6R7zA/8OC0AV5hvnHe8afBPOCK78HfEJ6PTiteJV5w7wa/uHB2ESKRqVHRUc6hUcDE0AdfSM6jbkgeK05Ubt8/fyA0gPDxjUHM0c+xcuD90D7PdV7dzlveJ+5NDqp/ReAAIMpBWqGxQdqRn6EVAHcvtZ8N3nZ+O047XolfHX/JwI8RIcGu0c7xp2FJgK+/6M8zLqe+RZ4/vmxe5r+SUFARAyGFocyhubFqsNeALg9s/s8eVr46blQuwl9qgB4gz0FV0bOBxiGH4Q3wVJ+qnvxOfp47rkFOoS8zT+ngltE/4ZOxzFGQcTIQm6/bby6+nO5DnkQug98NX6RAanEEIY0hvBGj0VMwwkAej1XOwX5iPk0eav7Zf34AKuDTIWAhtUGxoXCg98BDP5De+853bkxuVx64b0gf+NCtYT0Bl9G5gYnRG1B4r88/G26TDlIeWK6a3xMPxSBzkRQRg+G7MZ4hPECuD/A/X8603m5eT/5xbv/PgIBGcOXRaZGmga0xWeDScDLviE7sXnEOXW5srs7/W9AGkLLRSTGbcaaRc4EFYGa/tE8ZTpoOUQ5tDqFfN+/U0IuREwGJ8aoRiKEmAJq/4w9K/rkeaw5S7pePBU+h4FDQ93FiQadhmNFDoM4QE89w7u3+e05ennIO5N9+oBMwxxFEcZ6Bk6FtoOBAVd+qfwgukc5gXnFex09Lz+NgkmEg8Y9hmMFzcRCAiG/W/zc+vj5oLmXurS8aD7JAagD4EWohl/GEkT4AqqAFz2qu0H6GLmAOlx76D4BwPqDKUU7xgSGQoVgw3AA2D5HPCA6aPm/udY7cr17P8OCoIS4BdEGXQW6Q+6BnH8wfJI60LnXOeO6yXz3vwYByIQexYWGYMXCBKPCYP/jfVW7T3oGOcZ6rzw6PkUBJANyBSJGDUY2xM0DIgCdPij743pNOf86JfuFfcMAdQKzRKjF4kYWxWgDnkFbPsk8i3rruc76LzscPQO/vwHkxBnFn8YhBbLEEgIaf7P9BTtgejX5zLrAvIj+xEFJA7bFBkYUxetEu0KXgGZ9zvvqenQ5/3p0u9X+B4CigsHE1kXxxdBFF4NQwR3+pjxIesk6CDp6e2z9TL/zwjzEEQW3xeCFZIPDAde/SL04ezR6J3oTOxB81P8/gWoDuAUnRdsFoIRrwlCAM724+7T6XToAOsJ8Y75IgMvDDITAxf+FicTIgwaA5L5HfEk66XoCeoT7+32RgCSCUMRFBY3F34UXQ7bBWL8hfO+7C3paOll7Xn0dv3bBhsP1hQXF4IVWRB5CDX/E/ab7gnqIOkE7DvyuvoWBMMMThOhFjAWDxLuCv0BvPix8DXrL+n16jrwHvhOAUQKgxHXFYgWeRMuDbQEdfv58qrslOk56n3uqvWM/qkHfw++FIkWlBQ0D04HNP5o9WLuTOrT6QrtZ/Pb+/wERw1bEzUWXRX3EMEJ7QD191bwU+vC6eTrXvFF+UcC5wq1EY8V0RV0EgUMmQOW+nzypOwF6g/rlO/T9pb/aAjTD5kU8hWkExIOKwZB/c30OO6a6ozqD+6N9PH80wW9DVsTvxWFFOIPnAjr/z73CfB961zq1ex88mL6MwN7C9gROxUWFW4R4gqJAsb5D/Kr7H/q6Oun8PP3kgAYCRgQaRRUFbIS9gwTBVz8QfQc7vPqSusU76z1+/2cBiMOTRNBFasT0A6AB/T+lvbL77Tr/urH7ZbzdfsSBAAM7RHdFFUUahDHCYQBBfmw8b7sAuvE7LjxC/mDAbkJTxAtFK8UwBHfCwUEhPvD8w3uVesO7Bfwxfb5/lcHeg4zE7oUzRLBDW0GCv789Zvv9eum67nuq/R+/OMEdgz1EXYUjxNoD7IIjABR+F/x3uyN66LtxfIZ+mYCTAp4EOYTBBTOEM0KAgO6+lTzDO7B69XsGPHV9+z/AwjEDg4TKxTuEbYMYwUt/XD1eO9B7FPsq++69Xz9pgXeDPERBhTGEmgOpQeg/6z3HfEJ7R7sgu7N8x/7PQPQCpUQlhNUE9wPwQkJAv758/IW7jXsn+0X8t740gCiCP8O3RKXEw4RsAtiBFz88/Ri75bsBu2d8ML2b/5cBjgN4BGOE/sRag2gBr/+FPfn8D/ttuxi79H0G/wHBEcLpBA8E6AS6w68CBsBTvmg8izusexs7hPz3/mtATMJLg+iEvwSLRCvCmsDmfuD9Fnv9Oy87Y3xxPdX/wQHhQ3FEQ8TLRFwDKQF6v2K9r/wf+1U7UPw0PUN/cUEsAuoENkS6BH8Db4HOACs+FnyTe407TvvC/TX+nwCtglRD14SXBJMD7MJfgLh+iD0W+9b7Xbue/K++DQAoAfFDZ4RiRJeEHoLsAQh/Q32o/DI7fbtJPHJ9vX9dgUMDKAQbxIsEQ8NxwZh/xf4IPJ47r3tC/D/9Mf7QAMtCmcPEBK3EWwOvAiaATf6yvNo78ntMu9m87H5BwEvCPkNbhH9EY0PiArFA2P8nfWS8Brune4D8rz31P4aBlwMjRD9EW8QJQzYBZT+jvfy8a7uS+7b8O/1rvz3A5cKcg+6EQ8RjQ3MB8EAmPmB84DvPu7x70/0nfrOAbEIIA41EWsRvQ6bCeICsfs59Y3wdO5H7+Hyqfio/7MGnwxwEIURrw8+C/AE0v0S99Dx7O7f7qzx2faL/aME9ApyD1wRYxCwDOMG8/8G+UTzou+57rHwNPWB+4sCJwk8DvIQ1hDsDbMICQIL++H0kvDW7vTvvfOQ+XEAPwfXDEoQBxHvDlsKEAQb/aL2uvEy73fvfPK/92D+RAVGC2cP9xC0D9ULAAYt/3/4EvPN7zrvcvEV9lz8PAORCU4OpxA8EB0N0Qc5AXH6lfSi8D7vpPCX9G/6MQHABwMNGhCDEC0OfAk5A2/8Pvau8YHvE/BK8574K//ZBYwLUg+MEAQP/QokBXP+BPjr8gHwwO8z8vH2MP3jA/AJVA5VEJ4PTwz0BnMA4flV9LvwrO9V8W71R/vnATUIJA3iD/sPbA2iCGoCzvvl9azx1++y8Bj0ePnt/2IGxws1DxoQUg4oClAEwv2V98/yPfBL8PXyyff7/X8EQwpRDvwP/g6CCx0Gt/9d+SD03vAh8AjyQfYY/JMCnwg7DaIPbw+rDMwHowE3+5f1tPEz8FPx4/RM+qQA4Qb3Cw4Pow+fDVcJgwMb/TD3vvKB8NnwtfOc+L3+EAWLCkQOnA9bDrgKTQUD/+T49fMI8Zrwu/IQ9+H8NAP+CEcNWg/fDusL/AblAKv6VfXG8Zbw9vGs9Rn7UwFVBxwM3w4oD+sMigi9An/81/a28szwavF19Gr5dv+XBckKLg43D7cN8AmDBFn+dfjV8zvxF/Fu89z3ov3LA1IJSg0MD0wOLAsxBjAAKvoc9eDx/vCb8nL23/v5Ab4HOAypDqgOOAzABwAC7fuI9rjyHvH+8TP1MvomABMG/AoQDswOEg0sCcEDuP0R+L7zdvGZ8SH0o/hc/lkEnAlEDbcOtw1vCmwFhP+y+e70A/Jr8UHzNfee/JUCHQhKDGsOJQ6FC/wGSgFk+0P2wvJ28ZXy7/X0+s8AhgYlC+kNXA5sDGsIBQMh/bj3sfO38R7y1PRl+Q7/3ATbCTUNXA4fDbQJrQTh/kX5yvQt8t3x6PP091b9KANyCFMMJg6fDdMKPAadAOb6CPbV8tPxLfOo9rH7bgHuBkULuw3oDcULrgdQApP8aPes8//xpvKF9SL6t/9WBREKHw38DYcM/Aj0A0b+4viv9F7yU/KO9LD4CP6xA7wIUwzbDRYNIwqCBfj/cfrX9fDyNfLG81/3ZvwFAkwHXAuGDXENHwv0BqMBDvwi97DzTPIw8zX22vpYAMYFPgoADZgN7QtHCEEDs/2I+Jz0l/LM8jT1Z/mx/jEE/ghKDIsNigx0Cc0EW/8F+q/1EvOc8mD0E/gW/ZICoQdpC0sN9gx5Cj8G/QCS++X2vfOf8rzz4vaM+/EALQZhCtoMLw1TC5UHlQIq/Tj4k/TV8kjz2fUZ+lT/qAQ2CToMNQ3+C8gIHQTG/qP5kfU88wfz+/TD+L79GAPtB28LCQ14DNUJjwVeACD7svbR8/fySfSO9zj8ggGLBnwKrQzCDLgK5gbwAan88feR9Bnzx/N99sf67v8WBWUJIwzbDHALHghzAzj+Svl69WzzdfOV9W/5YP6UAy8IbAvCDPkLMgnkBMj/tvqH9uzzVPPY9Db43/wLAuAGjgp6DFIMHgo8BlEBMfyz95j0Y/NI9B/3cPuBAHsFiwkEDHwM4Qp3B9ACs/35+Gz1ovPn8y/2GPr8/ggEaQhiC3YMdwuQCD4EOf9V+mX2DvS182f13PiA/YwCKweYCkEM4AuFCZUFuQDB+333pvSy88r0wPcU/AwB2AWpCd8LGgxSCtMGMgI2/bL4ZvXe81v0x/a8+pD/dASaCFELJQz0CvEHnQOx/v35S/Y29Bn09vV++Rr+BQNvB5sKAgxqC+0I8wQpAFn7UPe69AX0TvVe+LL8kQEsBsAJswu0C8IJMgabAcL8c/hn9R/00fRf91z7HADXBMMIOQvQC3AKVAcBAzD+rfk49mX0gPSF9h36rv52A6oHlgq/C/MKVghWBKD/+vor99b0XPTS9fn4S/0NAngGzgmCC0sLNAmVBQoBVfw8+G/1ZfRJ9fX39/uiADMF5AgaC3cL6wm6BmsCt/1l+S72mfTq9BP3uPo8/98D3QeKCncLewrBB70DHf+j+g739/S39Ff2kvne/YICvAbVCUsL4AqmCPwEfwDv+w34fvWv9ML1ifiN/CIBhgX+CPYKGgtnCSMG2wFG/SX5KvbS9Ff1ofdP+8T/QAQICHgKKgsBCi4HKgOh/lP6+PYf9RX13PYn+mv+8AL4BtUJEAtzChkIZwT8/5L75feT9f30PfYb+R79mgHRBRAJzAq7CuIIjwVQAdz87fgt9hD1xfUt+OL7RACaBCsIYAraCoYJnQabAiz+DPrq9kz1dvVg97r68/5WAywHzwnPCgQKjgfXA37/PPvG96/1T/W39qr5qv0LAhUGGwmcClkKXgj/BMwAefy9+Df2UvU09rj4cPy+AOwESAhCCoYKCwkPBhICv/3M+eL2ffXZ9eT3SPt0/7YDWQfCCYsKkwkEB0sDB//t+q33z/Wl9TP3N/ox/nYCUgYfCWgK9QnaB3IETQAe/JT4R/aY9aX2QPn6/DIBNwVdCB4KMAqQCIQFjgFY/ZP54fa09T72Z/jT+/D/DQR+B68JQwoiCXwGwwKW/qb6m/f29f31rvfB+rL+2QKHBh0JLwqPCVgH6QPW/8n7cfhc9uL1F/fH+X/9nwF7BWwI9QnWCRUI/AQPAff8Yfnm9u/1pPbo+Fr8ZQBeBJ0Hlwn4CbAI9wVAAiz+ZvqP9yH2V/Yo+Ef7Lv82A7UGFQnyCSgJ1wZkA2P/fPtW+Hf2L/aJ90v6//0GArcFdAjICXsJmgd3BJYAnvw2+fH2LfYM92j53PzUAKgEtQd5CakJPgh0BcMByP0t+or3Ufa09qL4yvul/4wD3AYICbIJvwhYBuQC9v41+0H4mPZ/9vv3zfp6/mcC7QV2CJYJHQkhB/UDIgBL/BL5Afdw9nX35/lb/T4B7ATHB1YJWAnLB/QESgFr/fr5i/eE9hL3G/lK/BQA3AP9BvUIbglWCNsFaAKQ/vX6Mvi99tL2bfhL+/H+wQIcBnIIYAm+CKkGeAO1///79fgX97X23/dj+tX9oQEoBdMHLwkECVoHdgTWABT9zvmR97z2cveT+cb8gAAkBBgH3AgnCewHYAXwAS/+vPoq+Ob2Jvff+Mf7Yv8VA0UGaQgnCV4IMgb+Ak3/ufvd+DL3/fZJ+N36Sv7/AV4F2AcECa8I6Ab8A2cAw/yp+Z339/bS9wn6Pv3lAGcELAe/CN0IggfnBH0B1f2J+if4FPd991D5QPzO/2MDaAZbCOoI/Qe8BYgC6v56+8z4UfdI97P4VPu7/lcCjgXZB9QIWAh4BoUD//94/In5rvc29zT4fvqx/UYBowQ7B54IkQgYB3EEDgGA/Vz6KfhF99X3wPm1/DQAqwOEBkgIqgibB0kFFgKN/kH7wPh195b3HfnJ+yf/qAK4BdMHoQj/BwkGEgOa/zT8cPnE93f3lvjw+iH+oAHaBEQHeAhDCK8G/gOkADH9Nfox+Hr3Lvgu+ib9lgDsA5sGMAhnCDkH1wSoATX+Dfu6+Jz35feG+Tr8j//0AtwFyQdrCKUHmwWiAjv/9ftc+d73u/f4+GD7jf71AQoFRwdOCPMHRgaOAz8A6PwU+j74sveI+Jz6lP3zACgErAYTCCII1wZoBD8B4/3g+rn4yPc1+O75qfzy/zsD+gW6BzEISwcvBTYC4f68+035/fcB+Fv5zvv0/kUCNQVGByEIogfeBSED4P+k/Pn5T/jt9+L4B/v//UoBXgS4BvMH2wd0BvwD2gCW/bj6vfj394f4VvoV/U8AewMTBqcH9QfwBsQEzgGM/on7RPkf+Er4vPk6/Ff/jwJZBUAH8QdPB3cFtwKE/2b84/lk+Cr4Pflw+2X+nAGPBL8GzweSBxMGkgN5AE79lvrF+Cn42vi8+n39qAC2AyYGjwe2B5UGXARpAT3+W/tA+UX4k/ge+qL8tv/TAnkFNQe9B/wGEgVQAi7/LvzS+X74aviZ+dj7yP7pAboEwAanB0cHsgUqAx0ADP15+tL4Xfgu+SD74v38AOwDNAZ0B3YHOgb1AwkB8v0z+0D5bvjf+H76CP0PABMDkwUmB4cHqAauBO0B3P77+8b5m/ir+PT5Pfwm/zIC4AS+BnwH+wZSBcYCxv/P/GH65PiV+IL5hPtD/kwBHQQ+BlUHMwffBZEDrACs/Q/7Rvmb+Cv53vpr/WQATQOpBRIHTwdUBkwEjQGO/s37v/m8+O/4Tvqg/IH/dQIABbYGTgevBvMEZQJy/5j8T/r5+M/41/nl+6H+lgFIBEIGMgfvBoUFMANUAGz98fpP+cr4ePk8+8v9tgCCA7kF+wYUB/8F6wMxAUb+pPu9+eH4NPmo+gD91/+zAhwFqwYdB2EGlQQHAiP/ZfxB+hL5Cvkr+kT8+/7cAW4EQwYMB6kGKwXRAgAAMP3Y+lz5/PjG+Zn7J/4CAbMDxQXgBtcGqwWNA9kAAv6A+7/5CPl6+QL7Xv0oAOwCMwWbBuoGEwY5BKwB2f43/Df6LvlI+YD6ofxS/x4CkAQ/BuMGYwbSBHUCsP/5/MT6bvkw+RT69fuB/ksB3gPMBcIGmQZWBTEDhADD/WH7xfky+cH5Wvu4/XYAIQNFBYgGtQbFBd4DVAGT/g78MvpO+Yf50/r8/KT/WgKsBDcGuAYbBnoEGwJk/8f8tPqC+Wb5Y/pO/Nb+jwEFBM8FoQZZBgMF1wI0AIn9R/vP+V/5Cfqx+xD+wABQA1MFcgZ+BnYFhgMAAVH+6vsx+nD5x/kn+1T98/+TAsUEKwaKBtMFJATFARz/mfyo+pv5nvmx+qb8Kf/OAScEzgV9BhgGsASAAuj/U/0x+9z5jvlR+gf8Zf4GAXwDXAVYBkUGKAUvA68AFP7K+zT6lvkJ+nn7qv09AMYC2AQbBloGigXPA3IB2f5w/KH6tvnY+f/6/Px4/wkCRATJBVcG1gVeBCwCn/8i/R/77vm/+Zr6W/y3/kgBogNiBTsGCwbaBNoCYgDb/a/7O/q++Uv6y/v+/YUA9gLoBAkGKAZCBXsDIQGZ/kz8nfrU+RL6TftP/cP/QAJdBMAFLgaUBQ0E2gFZ//T8EvsC+vH54/qu/AX/hQHFA2MFHAbQBYwEiAIYAKb9mPtF+uj5jvob/E7+yAAgA/ME8wX1BfkEKgPUAF3+LPye+vX5Tvqa+6D9CgBzAnIEtAUCBlEFvQOLARj/zPwJ+xn6Jvor+/78Uf+/AeMDYQX5BZMFQAQ4AtP/df2F+1P6FPrR+mr8nP4HAUcD+wTaBb8FsATaAosAJv4P/KL6GfqL+ub77/1PAKICgwSlBdUFDQVvAz4B2v6n/AP7NPpc+nT7Tf2Z//UB/QNbBdUFVgX0A+oBkP9J/XX7ZPpC+hT7uPzn/kMBagP/BL4FiQVoBIwCRADy/ff7qfo++sn6Mvw8/pAAzAKRBJIFpgXKBCID9QCg/ob8AftR+pP6vPua/d7/JgITBFIFrgUYBakDnwFR/yD9"},
    {id:'ring_3',title:'Gaming Alert Sound',cat:'Gaming',url:"data:audio/wav;base64,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"},
    {id:'ring_4',title:'Nature Soft Chime',cat:'Nature',url:"data:audio/wav;base64,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"},
    {id:'ring_5',title:'Cyber Neon Tone',cat:'Cyberpunk',url:"data:audio/wav;base64,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"},
    {id:'ring_6',title:'Notification Pop',cat:'Technology',url:"data:audio/wav;base64,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"}
  ];
  function isVideoItem(w){const u=String((w&&w.url)||'').toLowerCase();const t=String((w&&w.type)||'').toLowerCase();return t==='live'||t==='video'||/\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(u)||u.includes('/video/upload/');}
  function isRing(w){const u=String((w&&w.url)||'').toLowerCase();const t=String((w&&w.type)||'').toLowerCase();return t==='ringtone'||t==='audio'||/^data:audio\//.test(u)||/\.(mp3|m4a|wav|ogg|aac)(\?|#|$)/i.test(u);}
  function storedRingtones(){try{return JSON.parse(localStorage.getItem('wfhRingtones')||'[]')}catch(e){return []}}
  function allRingtones(){
    let extra=[];try{extra=(typeof allWalls==='function'?allWalls():[]).filter(isRing).map(x=>({...x,type:'ringtone'}));}catch(e){}
    return [...storedRingtones(),...extra,...defaultRingtones].filter((v,i,a)=>a.findIndex(x=>String(x.id)===String(v.id))===i);
  }
  function imagesOnly(){try{return (typeof allWalls==='function'?allWalls():[]).filter(w=>w&&!isVideoItem(w)&&!isRing(w));}catch(e){return []}}
  function ringCard(r){
    const id=esc(r.id), url=esc(r.url), title=esc(r.title||'Ringtone'), cat=esc(r.cat||'Ringtone');
    const dl=(title.replace(/[^a-z0-9_-]+/gi,'_')||'ringtone')+'.wav';
    const seed=String(r.id||title).split('').reduce((a,c)=>a+c.charCodeAt(0),0)%6;
    return `<div class="wfh-ringtone-card tone-${seed}" onclick="wfhPlayRingtone('${id}')">
      <div class="wfh-ringtone-bg"></div>
      <button class="wfh-ringtone-play" type="button" onclick="event.stopPropagation();wfhPlayRingtone('${id}')"><i class="fa-solid fa-play"></i></button>
      <div class="wfh-ringtone-info"><b>${title}</b><p>${cat} • ringtone</p></div>
      <div class="wfh-ringtone-side"><span><i class="fa-solid fa-download"></i> ${(r.downloads||Math.floor(3+seed*17))} K</span><a href="${url}" download="${dl}" onclick="event.stopPropagation()"><i class="fa-solid fa-download"></i></a><button type="button" onclick="event.stopPropagation();wfhLikeRingtone('${id}',this)"><i class="fa-regular fa-heart"></i></button></div>
      <audio preload="none" src="${url}"></audio>
    </div>`;
  }
  function wallpaperCard(w,small=false){return '<div class="card '+(small?'small':'')+'" onclick="openViewer('+JSON.stringify(w.id).replace(/"/g,'&quot;')+')"><img src="'+esc(w.url)+'" alt="'+esc(w.title||'Wallpaper')+'" loading="lazy" decoding="async"><span class="card-tag tag-premium">'+(w.type==='premium'?'PREMIUM':'4K')+'</span><div class="card-stats"><span><i class="fa-regular fa-heart"></i> '+(w.likes||0)+'</span><span><i class="fa-regular fa-eye"></i> '+(w.views||0)+'</span></div></div>'}
  window.wfhPlayRingtone=function(id){const r=allRingtones().find(x=>String(x.id)===String(id));if(!r)return;let a=new Audio(r.url);a.play().catch(()=>{})};
  function fillRingtones(){
    document.querySelectorAll('video').forEach(v=>v.remove());
    const rings=allRingtones();
    if($('liveGrid')) $('liveGrid').innerHTML=rings.map(ringCard).join('') || '<div class="wfh-empty">No ringtones yet</div>';
    if($('wfhLatestVideosGrid')) $('wfhLatestVideosGrid').innerHTML=rings.slice(0,8).map(ringCard).join('');
    if($('wfhFeaturedVideoGrid')) $('wfhFeaturedVideoGrid').innerHTML=rings[0]?ringCard(rings[0]):'<div class="wfh-empty">No ringtones yet</div>';
    if($('wfhVideoCount')) $('wfhVideoCount').textContent=rings.length;
    document.querySelectorAll('[onclick="go('live')"] span, [onclick="go('live',this)"] span').forEach(x=>x.textContent='Ringtones');
    document.querySelectorAll('[onclick="go('live')"] i, [onclick="go('live',this)"] i').forEach(i=>{i.className='fa-solid fa-music'});
    const liveTitle=document.querySelector('#live .section h3'); if(liveTitle) liveTitle.textContent='Ringtones';
    const exploreLink=document.querySelector('#explore .section a'); if(exploreLink) exploreLink.textContent='Ringtones';
    const imgs=imagesOnly();
    const containers=['homeTrending','newArrivals','exploreGrid','trendGrid','newGrid','editorGrid','mostGrid','topMonthGrid'];
    containers.forEach(id=>{const el=$(id); if(el&&el.querySelector('video')){const list=imgs.slice(0, id==='homeTrending'?3:24); el.innerHTML=list.map(w=>wallpaperCard(w,id==='homeTrending')).join('');}});
    try{let old=document.getElementById('wfh-video-schema'); if(old) old.remove();}catch(e){}
  }
  const oldRender=window.render;
  window.render=function(){const out=oldRender?oldRender.apply(this,arguments):undefined;setTimeout(fillRingtones,80);setTimeout(fillRingtones,500);return out;};
  const oldPublish=window.publishItem;
  window.publishItem=function(){
    const typeEl=$('quickType'), urlEl=$('quickUrl'), titleEl=$('quickTitle'), catEl=$('quickCat');
    const url=urlEl?urlEl.value.trim():''; const type=typeEl?typeEl.value:'';
    if(type==='ringtone'||/\.(mp3|m4a|wav|ogg|aac)(\?|#|$)/i.test(url)){
      if(!url){try{toast('Add ringtone URL')}catch(e){} return;}
      const rings=storedRingtones();
      rings.unshift({id:'ring_'+Date.now(),title:(titleEl&&titleEl.value.trim())||'New Ringtone',cat:(catEl&&catEl.value)||'Ringtone',url,type:'ringtone',createdAt:Date.now()});
      localStorage.setItem('wfhRingtones',JSON.stringify(rings));
      if(titleEl) titleEl.value=''; if(urlEl) urlEl.value=''; fillRingtones(); try{go('live');toast('Ringtone added')}catch(e){}
      return;
    }
    return oldPublish?oldPublish.apply(this,arguments):undefined;
  };
  function setupUploadRingtone(){
    if($('videoTab')){$('videoTab').innerHTML='<i class="fa-solid fa-music"></i> Ringtone';$('videoTab').onclick=function(){setUploadMode('ringtone')};}
    if($('quickType')&&!$('quickType').querySelector('option[value="ringtone"]')){$('quickType').insertAdjacentHTML('beforeend','<option value="ringtone">Ringtone Audio</option>');}
    const oldSet=window.setUploadMode;
    window.setUploadMode=function(mode){
      if(mode==='ringtone'){try{window.uploadMode='ringtone'}catch(e){} if($('wallTab'))$('wallTab').classList.remove('active'); if($('videoTab'))$('videoTab').classList.add('active'); if($('quickType'))$('quickType').value='ringtone'; if($('quickUrl'))$('quickUrl').placeholder='Direct MP3 / WAV ringtone URL'; if($('publishBtn'))$('publishBtn').innerHTML='<i class="fa-solid fa-music"></i> Publish Ringtone'; return;}
      return oldSet?oldSet.apply(this,arguments):undefined;
    };
  }
  document.addEventListener('DOMContentLoaded',()=>{setupUploadRingtone();setTimeout(fillRingtones,300);setTimeout(fillRingtones,1200);});
  setTimeout(()=>{setupUploadRingtone();fillRingtones();},500);
  setTimeout(fillRingtones,1800);
})();

(function(){
  'use strict';
  const DEFAULT_RINGTONES=[
    {id:'rt_1',title:'Let me love you',artist:'famous, song',url:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',downloads:'4 K'},
    {id:'rt_2',title:'Love',artist:'love, romant',url:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',downloads:'32 K'},
    {id:'rt_3',title:'Peter Cottontail',artist:'easter, witchhazel09',url:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',downloads:'28 K'},
    {id:'rt_4',title:'Titanic',artist:'amir, titanic',url:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',downloads:'9 K'},
    {id:'rt_5',title:'Nature',artist:'natural, nature',url:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',downloads:'130 K'},
    {id:'rt_6',title:'Anime Beat',artist:'anime, notification',url:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',downloads:'3 K'}
  ];
  const $=id=>document.getElementById(id);
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const isVideoUrl=u=>/\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(String(u||''))||String(u||'').includes('/video/upload/')||String(u||'').startsWith('data:video/');
  const isOldVideo=w=>String(w&&w.type).toLowerCase()==='live'||String(w&&w.type).toLowerCase()==='video'||isVideoUrl(w&&w.url);
  function ringtoneList(){
    let saved=[];try{saved=JSON.parse(localStorage.getItem('wfhRingtones')||'[]')||[]}catch(e){}
    saved=saved.filter(r=>r&&r.url&&!isVideoUrl(r.url)).map((r,i)=>({id:r.id||('user_rt_'+i),title:r.title||'New Ringtone',artist:r.cat||'WallFlixHub',url:r.url,downloads:r.downloads||'New'}));
    return [...saved,...DEFAULT_RINGTONES];
  }
  const oldAllWalls=window.allWalls;
  window.allWalls=function(){
    let arr=[];try{arr=oldAllWalls?oldAllWalls():((window.wallpapers||[]))}catch(e){arr=window.wallpapers||[]}
    arr=(arr||[]).filter(w=>w&&!isOldVideo(w));
    window.wallpapers=arr;
    return arr;
  };
  window.isVideo=function(){return false};
  window.mediaHTML=function(w){return '<img src="'+esc(w&&w.url)+'" loading="lazy" decoding="async">'};
  window.card=function(w,small){
    const favs=(()=>{try{return JSON.parse(localStorage.getItem('wfhFavs')||'[]')}catch(e){return []}})();
    const liked=favs.includes(w.id);
    return '<div class="card '+(small?'small':'')+'" onclick="openViewer('+JSON.stringify(w.id).replace(/"/g,'&quot;')+')"><img src="'+esc(w.url)+'" loading="lazy" decoding="async"><span class="card-tag tag-premium">'+(w.type==='premium'?'PREMIUM':'4K')+'</span><div class="card-stats"><span onclick="event.stopPropagation();toggleLike('+JSON.stringify(w.id).replace(/"/g,'&quot;')+',this)"><i class="fa-'+(liked?'solid heart-red':'regular')+' fa-heart"></i> <span class="like-count">'+(w.likes||0)+'</span></span><span><i class="fa-regular fa-eye"></i> '+(w.views||0)+'</span></div></div>';
  };
  function audioCard(r,i){
    return '<div class="wfh-audio-card tone-'+(i%6)+'" data-rt="'+esc(r.id)+'" onclick="wfhPlayRingtone('+JSON.stringify(r.id).replace(/"/g,'&quot;')+')"><button class="wfh-audio-play" type="button"><i class="fa-solid fa-play"></i></button><div class="wfh-audio-info"><b>'+esc(r.title)+'</b><p>'+esc(r.artist||'WallFlixHub ringtone')+'</p></div><div class="wfh-audio-side"><a onclick="event.stopPropagation()" href="'+esc(r.url)+'" download><i class="fa-solid fa-download"></i> '+esc(r.downloads||'')+'</a><button onclick="event.stopPropagation();wfhLikeRingtone(this)"><i class="fa-regular fa-heart"></i></button></div><audio preload="none" src="'+esc(r.url)+'"></audio></div>';
  }
  window.wfhLikeRingtone=function(btn){try{btn.innerHTML='<i class="fa-solid fa-heart"></i>'; if(window.toast)toast('Ringtone saved')}catch(e){}};
  window.wfhPlayRingtone=function(id){
    document.querySelectorAll('.wfh-audio-card').forEach(c=>{const a=c.querySelector('audio'),ic=c.querySelector('.wfh-audio-play i'); if(!a)return; if(c.dataset.rt===String(id)){ if(a.paused){document.querySelectorAll('.wfh-audio-card audio').forEach(x=>{if(x!==a)x.pause()}); a.play().catch(()=>{}); if(ic)ic.className='fa-solid fa-pause';}else{a.pause(); if(ic)ic.className='fa-solid fa-play';}} else {if(ic)ic.className='fa-solid fa-play';}});
  };
  function renderRingtones(){
    const list=ringtoneList();
    if($('liveGrid')) $('liveGrid').innerHTML=list.map(audioCard).join('');
    if($('wfhLatestVideosGrid')) $('wfhLatestVideosGrid').innerHTML=list.slice(0,8).map(audioCard).join('');
    if($('wfhFeaturedVideoGrid')) $('wfhFeaturedVideoGrid').innerHTML=audioCard(list[0],0);
  }
  function cleanVideos(){
    document.querySelectorAll('video,.card.live').forEach(el=>el.remove());
    document.querySelectorAll('.tag-live').forEach(el=>{el.textContent='RINGTONE';el.className='card-tag tag-premium'});
  }
  function renderWallpapers(){
    const walls=window.allWalls();
    if($('homeTrending')) $('homeTrending').innerHTML=walls.slice(0,3).map(w=>window.card(w,true)).join('');
    if($('newArrivals')) $('newArrivals').innerHTML=walls.slice(0,4).map(w=>window.card(w)).join('');
    if($('exploreGrid')) $('exploreGrid').innerHTML=walls.map(w=>window.card(w)).join('');
    if($('trendGrid')) $('trendGrid').innerHTML=[...walls].sort((a,b)=>((b.likes||0)+(b.downloads||0))-((a.likes||0)+(a.downloads||0))).slice(0,24).map(w=>window.card(w)).join('');
    if($('newGrid')) $('newGrid').innerHTML=walls.slice(0,24).map(w=>window.card(w)).join('');
    if($('mostGrid')) $('mostGrid').innerHTML=[...walls].sort((a,b)=>(b.downloads||0)-(a.downloads||0)).slice(0,24).map(w=>window.card(w)).join('');
  }
  const oldRender=window.render;
  window.render=function(){let out;try{out=oldRender?oldRender.apply(this,arguments):undefined}catch(e){} renderWallpapers(); renderRingtones(); setTimeout(cleanVideos,50); return out;};
  const oldOpen=window.openViewer;
  window.openViewer=function(id){
    const w=window.allWalls().find(x=>String(x.id)===String(id));
    if(!w){renderRingtones();return}
    return oldOpen?oldOpen.apply(this,arguments):undefined;
  };
  const oldPublish=window.publishItem;
  window.publishItem=function(){
    const type=$('quickType')?$('quickType').value:''; const url=$('quickUrl')?$('quickUrl').value.trim():'';
    if(type==='live'||type==='video'||type==='ringtone'||/\.(mp3|m4a|wav|ogg|aac)(\?|#|$)/i.test(url)){
      if(!url||isVideoUrl(url)){try{toast('دخل رابط MP3 ديال Sonnerie ماشي فيديو')}catch(e){} return;}
      const title=($('quickTitle')&&$('quickTitle').value.trim())||'New Ringtone';
      const cat=($('quickCat')&&$('quickCat').value)||'Ringtone';
      let saved=[];try{saved=JSON.parse(localStorage.getItem('wfhRingtones')||'[]')||[]}catch(e){}
      saved.unshift({id:'rt_'+Date.now(),title,cat,url,type:'ringtone',downloads:'New'});localStorage.setItem('wfhRingtones',JSON.stringify(saved));
      if($('quickTitle'))$('quickTitle').value=''; if($('quickUrl'))$('quickUrl').value=''; renderRingtones(); try{go('live');toast('Ringtone published')}catch(e){} return;
    }
    return oldPublish?oldPublish.apply(this,arguments):undefined;
  };
  function setup(){
    if($('videoTab')){$('videoTab').innerHTML='<i class="fa-solid fa-music"></i> Ringtone';$('videoTab').onclick=function(){ if($('quickType'))$('quickType').value='ringtone'; if($('quickUrl'))$('quickUrl').placeholder='Direct MP3 / WAV ringtone URL'; if($('publishBtn'))$('publishBtn').innerHTML='<i class="fa-solid fa-music"></i> Publish Ringtone'; this.classList.add('active'); $('wallTab')&&$('wallTab').classList.remove('active');};}
    if($('quickType')){[...$('quickType').options].forEach(o=>{if(o.value==='live'||o.value==='video')o.remove()}); if(!$('quickType').querySelector('option[value="ringtone"]'))$('quickType').insertAdjacentHTML('beforeend','<option value="ringtone">Ringtone Audio</option>');}
    renderWallpapers();renderRingtones();cleanVideos();
  }
  document.addEventListener('DOMContentLoaded',()=>{setup();setTimeout(setup,600);setTimeout(setup,1800)});
  setTimeout(setup,100);setTimeout(setup,1000);setTimeout(setup,2500);
})();

(function(){
  function cleanRingtoneBars(){
    try{
      var featured=document.getElementById('wfhFeaturedVideoGrid');
      if(featured){
        var sec=featured.previousElementSibling;
        if(sec && sec.classList && sec.classList.contains('section')) sec.remove();
        featured.remove();
      }
      var random=document.getElementById('wfhRandomVideoBtn');
      if(random) random.remove();
      document.querySelectorAll('.menu-row').forEach(function(row){
        var t=(row.textContent||'').trim();
        if(t==='Ringtones') row.remove();
      });
      var live=document.getElementById('live');
      if(live && !live.classList.contains('active')) live.style.display='';
      document.querySelectorAll('.section h3').forEach(function(h){
        if((h.textContent||'').trim()==='Ringtones') h.textContent='Latest Ringtones';
      });
    }catch(e){}
  }
  document.addEventListener('DOMContentLoaded', cleanRingtoneBars);
  setTimeout(cleanRingtoneBars,300);
  setTimeout(cleanRingtoneBars,1200);
  var oldGo=window.go;
  if(typeof oldGo==='function' && !oldGo.__wfhCleanRingtones){
    window.go=function(id,btn){
      var out=oldGo.apply(this,arguments);
      cleanRingtoneBars();
      return out;
    };
    window.go.__wfhCleanRingtones=true;
  }
})();

(function(){
  'use strict';
  var DEFAULT_RINGTONES=[
    {id:'rt_fix_1',title:'Let me love you',artist:'famous, song',url:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',downloads:'4 K'},
    {id:'rt_fix_2',title:'Love',artist:'love, romant',url:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',downloads:'32 K'},
    {id:'rt_fix_3',title:'Peter Cottontail',artist:'easter, witchhazel09',url:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',downloads:'28 K'},
    {id:'rt_fix_4',title:'Titanic',artist:'amir, titanic',url:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',downloads:'9 K'},
    {id:'rt_fix_5',title:'Nature',artist:'natural, nature',url:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',downloads:'130 K'},
    {id:'rt_fix_6',title:'Anime Beat',artist:'anime, notification',url:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',downloads:'3 K'}
  ];
  var $=function(id){return document.getElementById(id)};
  var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]})};
  var isVideo=function(u){return /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(String(u||'')) || String(u||'').indexOf('/video/upload/')>-1 || String(u||'').indexOf('data:video/')===0};
  function list(){
    var saved=[];
    try{saved=JSON.parse(localStorage.getItem('wfhRingtones')||'[]')||[]}catch(e){}
    saved=saved.filter(function(r){return r&&r.url&&!isVideo(r.url)}).map(function(r,i){return {id:r.id||('user_rt_fix_'+i),title:r.title||'New Ringtone',artist:r.artist||r.cat||'WallFlixHub',url:r.url,downloads:r.downloads||'New'}});
    var seen={};
    return saved.concat(DEFAULT_RINGTONES).filter(function(r){var k=String(r.id); if(seen[k]) return false; seen[k]=true; return true});
  }
  function card(r,i){
    return '<div class="wfh-audio-card tone-'+(i%6)+'" data-rt="'+esc(r.id)+'" onclick="wfhStablePlayRingtone(\''+esc(r.id)+'\')">'+
      '<button class="wfh-audio-play" type="button" onclick="event.stopPropagation();wfhStablePlayRingtone(\''+esc(r.id)+'\')"><i class="fa-solid fa-play"></i></button>'+
      '<div class="wfh-audio-info"><b>'+esc(r.title)+'</b><p>'+esc(r.artist)+'</p></div>'+
      '<div class="wfh-audio-side"><a onclick="event.stopPropagation()" href="'+esc(r.url)+'" download><i class="fa-solid fa-download"></i> '+esc(r.downloads)+'</a><button onclick="event.stopPropagation();this.innerHTML=\'<i class=&quot;fa-solid fa-heart&quot;></i>\'"><i class="fa-regular fa-heart"></i></button></div>'+
      '<audio preload="none" src="'+esc(r.url)+'"></audio></div>';
  }
  window.wfhStablePlayRingtone=function(id){
    document.querySelectorAll('.wfh-audio-card').forEach(function(c){
      var a=c.querySelector('audio'), ic=c.querySelector('.wfh-audio-play i'); if(!a)return;
      if(String(c.dataset.rt)===String(id)){
        if(a.paused){document.querySelectorAll('.wfh-audio-card audio').forEach(function(x){if(x!==a)x.pause()});a.play().catch(function(){}); if(ic)ic.className='fa-solid fa-pause'}
        else{a.pause(); if(ic)ic.className='fa-solid fa-play'}
      }else if(ic){ic.className='fa-solid fa-play'}
    });
  };
  window.wfhPlayRingtone=window.wfhStablePlayRingtone;
  function paint(){
    var rings=list();
    var html=rings.map(card).join('');
    var live=$('liveGrid');
    if(live && (!live.querySelector('.wfh-audio-card') || live.textContent.indexOf('No items yet')>-1 || live.children.length<rings.length)) live.innerHTML=html;
    var latest=$('wfhLatestVideosGrid');
    if(latest && (!latest.querySelector('.wfh-audio-card') || latest.textContent.indexOf('No items yet')>-1)) latest.innerHTML=rings.slice(0,8).map(card).join('');
    document.querySelectorAll('#liveGrid video,#wfhLatestVideosGrid video,#liveGrid .card.live,#wfhLatestVideosGrid .card.live').forEach(function(el){el.remove()});
  }
  var oldGo=window.go;
  window.go=function(id,btn){
    var out=oldGo?oldGo.apply(this,arguments):undefined;
    if(id==='live') setTimeout(function(){paint();var live=$('live'); if(live){live.classList.add('active');live.style.display='block'}},30);
    else setTimeout(paint,80);
    return out;
  };
  var oldRender=window.render;
  window.render=function(){var out;try{out=oldRender?oldRender.apply(this,arguments):undefined}catch(e){} setTimeout(paint,20);setTimeout(paint,250);return out};
  document.addEventListener('DOMContentLoaded',function(){paint();setTimeout(paint,300);setTimeout(paint,1200);});
  setTimeout(paint,50);setTimeout(paint,800);setTimeout(paint,2500);
  try{
    new MutationObserver(function(){paint()}).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){setInterval(paint,1200)}
})();

(function(){
  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  const cats = ['All','Anime','iPhone','Gaming','Notification','Alarm','Funny','Arabic'];

  function allItems(){
    try{
      if(typeof allWalls === 'function') return allWalls();
      if(Array.isArray(window.wallpapers)) return window.wallpapers.concat(Array.isArray(window.uploads)?window.uploads:[]);
      if(Array.isArray(window.uploads)) return window.uploads;
    }catch(e){}
    return [];
  }
  function isImageUrl(u){
    const s=String(u||'').toLowerCase();
    return /^data:image\//.test(s) || /\.(jpg|jpeg|png|webp|gif|avif|bmp|svg)(\?|#|$)/i.test(s) || s.includes('/image/upload/');
  }
  function isVideoFile(u){
    return /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(String(u||'').toLowerCase());
  }
  function isAudioFile(u){
    const s=String(u||'').toLowerCase();
    return /^data:audio\//.test(s) || /\.(mp3|wav|ogg|m4a|aac|flac|webm)(\?|#|$)/i.test(s);
  }
  function isRingtone(w){
    const u=String((w&&w.url)||'');
    const t=String((w&&w.type)||'').toLowerCase();
    if(isImageUrl(u) || isVideoFile(u)) return false;
    return t==='live' || t==='audio' || t==='ringtone' || isAudioFile(u) || u.toLowerCase().includes('/video/upload/');
  }
  function ringtoneList(){
    return allItems().filter(isRingtone).sort((a,b)=>(b.createdAt||b.createdAtMs||b.id||0)-(a.createdAt||a.createdAtMs||a.id||0));
  }
  function fmt(sec){
    sec = Number(sec||0);
    if(!isFinite(sec) || sec <= 0) return '--:--';
    const m = Math.floor(sec/60);
    const s = Math.floor(sec%60);
    return m + ':' + String(s).padStart(2,'0');
  }
  function wave(){
    return Array.from({length:18},(_,i)=>'<i style="--i:'+i+'"></i>').join('');
  }
  function playClick(id){
    return "event.stopPropagation();wfhToggleRingtone("+JSON.stringify(String(id)).replace(/"/g,'&quot;')+");";
  }
  function downloadClick(id){
    return "event.stopPropagation();wfhDownloadRingtone("+JSON.stringify(String(id)).replace(/"/g,'&quot;')+");";
  }
  function card(w){
    const cat = w.cat || 'Ringtone';
    return '<div class="wfh-ringtone-card" data-ring-id="'+esc(w.id)+'" onclick="openViewer('+JSON.stringify(w.id).replace(/"/g,'&quot;')+')">'+
      '<div class="wfh-ringtone-top"><div class="wfh-ringtone-icon"><i class="fa-solid fa-music"></i></div>'+
      '<button class="wfh-ringtone-play" onclick="'+playClick(w.id)+'"><i class="fa-solid fa-play"></i></button></div>'+
      '<div class="wfh-ringtone-title"><b>'+esc(w.title||'Ringtone')+'</b><span>'+esc(cat)+' • Mobile ringtone</span></div>'+
      '<div class="wfh-wave">'+wave()+'</div>'+
      '<div class="wfh-ringtone-meta"><span><i class="fa-regular fa-clock"></i> <b class="wfh-ring-duration" data-url="'+esc(w.url)+'">--:--</b></span>'+
      '<button class="wfh-ringtone-download" onclick="'+downloadClick(w.id)+'"><i class="fa-solid fa-download"></i> Download</button></div>'+
      '<audio preload="metadata" src="'+esc(w.url)+'"></audio></div>';
  }
  function rowCard(w){
    return '<div class="wfh-ringtone-card" data-ring-id="'+esc(w.id)+'" onclick="openViewer('+JSON.stringify(w.id).replace(/"/g,'&quot;')+')">'+
      '<div class="wfh-ringtone-top"><div class="wfh-ringtone-icon"><i class="fa-solid fa-music"></i></div>'+
      '<button class="wfh-ringtone-play" onclick="'+playClick(w.id)+'"><i class="fa-solid fa-play"></i></button></div>'+
      '<div class="wfh-ringtone-title"><b>'+esc(w.title||'Ringtone')+'</b><span>'+esc(w.cat||'Ringtone')+' • <b class="wfh-ring-duration" data-url="'+esc(w.url)+'">--:--</b></span></div>'+
      '<div class="wfh-wave">'+wave()+'</div>'+
      '<div class="wfh-ringtone-meta"><span>Tap to preview</span><button class="wfh-ringtone-download" onclick="'+downloadClick(w.id)+'"><i class="fa-solid fa-download"></i></button></div>'+
      '<audio preload="metadata" src="'+esc(w.url)+'"></audio></div>';
  }

  window.wfhActiveRingtoneCat = window.wfhActiveRingtoneCat || 'All';
  window.wfhSetRingtoneCat = function(cat){
    window.wfhActiveRingtoneCat = cat || 'All';
    renderRingtones();
  };

  function renderCats(){
    return '<div class="wfh-ringtone-cats">'+cats.map(c=>
      '<button class="'+(window.wfhActiveRingtoneCat===c?'active':'')+'" onclick="wfhSetRingtoneCat(\''+c+'\')">'+
      '<i class="fa-solid '+(c==='All'?'fa-layer-group':c==='iPhone'?'fa-mobile-screen':c==='Gaming'?'fa-gamepad':c==='Alarm'?'fa-bell':c==='Funny'?'fa-face-laugh':c==='Arabic'?'fa-star-and-crescent':'fa-music')+'"></i> '+c+'</button>'
    ).join('')+'</div>';
  }

  function applyDurations(){
    document.querySelectorAll('.wfh-ring-duration[data-url]').forEach(el=>{
      if(el.dataset.ready) return;
      el.dataset.ready = '1';
      const a = new Audio(el.getAttribute('data-url'));
      a.preload = 'metadata';
      a.addEventListener('loadedmetadata',()=>{ el.textContent = fmt(a.duration); },{once:true});
      a.addEventListener('error',()=>{ el.textContent = '--:--'; },{once:true});
    });
  }

  function renderRingtones(){
    const live = $('live');
    if(live && !live.dataset.ringProReady){
      live.dataset.ringProReady = '1';
      live.innerHTML = '<div class="back"><button onclick="go(\'home\')"><i class="fa-solid fa-chevron-left"></i></button><h2>Ringtones</h2><div></div></div>'+
        '<div class="wfh-ringtone-hero"><b><i class="fa-solid fa-music"></i> Premium Ringtones</b><span>Cloudinary MP3 ringtones with play preview, animated waveform, auto duration and direct download.</span></div>'+
        '<div id="wfhRingtoneCats"></div><div class="grid2" id="liveGrid"></div>';
    }
    const list = ringtoneList();
    const active = window.wfhActiveRingtoneCat || 'All';
    const filtered = active === 'All' ? list : list.filter(w => String(w.cat||'').toLowerCase() === active.toLowerCase() || String(w.title||'').toLowerCase().includes(active.toLowerCase()));
    if($('wfhRingtoneCats')) $('wfhRingtoneCats').innerHTML = renderCats();
    if($('liveGrid')) $('liveGrid').innerHTML = filtered.length ? filtered.map(card).join('') : '<div class="wfh-empty">No ringtones in this category yet</div>';
    if($('wfhLatestVideosGrid')) $('wfhLatestVideosGrid').innerHTML = list.slice(0,8).map(rowCard).join('') || '<div class="wfh-empty">No ringtones yet</div>';
    const counter = $('wfhVideoCount'); if(counter) counter.textContent = list.length;
    applyDurations();
  }

  window.wfhToggleRingtone = function(id){
    const card = document.querySelector('.wfh-ringtone-card[data-ring-id="'+CSS.escape(String(id))+'"]');
    if(!card) return;
    document.querySelectorAll('.wfh-ringtone-card').forEach(c=>{
      if(c!==card){
        c.classList.remove('playing');
        const a=c.querySelector('audio'); if(a){try{a.pause(); a.currentTime=0;}catch(e){}}
        const ic=c.querySelector('.wfh-ringtone-play i'); if(ic) ic.className='fa-solid fa-play';
      }
    });
    const audio = card.querySelector('audio');
    const icon = card.querySelector('.wfh-ringtone-play i');
    if(!audio) return;
    if(audio.paused){
      audio.play().then(()=>{
        card.classList.add('playing');
        if(icon) icon.className='fa-solid fa-pause';
      }).catch(()=>{try{toast('Audio preview blocked');}catch(e){}});
    }else{
      audio.pause();
      card.classList.remove('playing');
      if(icon) icon.className='fa-solid fa-play';
    }
    audio.onended = function(){
      card.classList.remove('playing');
      if(icon) icon.className='fa-solid fa-play';
    };
  };

  window.wfhDownloadRingtone = function(id){
    const item = ringtoneList().find(w => String(w.id) === String(id)) || allItems().find(w => String(w.id) === String(id));
    if(!item || !item.url) return;
    try{ item.downloads = (item.downloads||0)+1; }catch(e){}
    const a = document.createElement('a');
    a.href = item.url;
    a.download = (item.title || 'wallflixhub-ringtone').replace(/[^\w\-]+/g,'_') + '.mp3';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    a.remove();
    try{toast('Ringtone download started');}catch(e){}
  };

  const oldOpenViewer = window.openViewer;
  window.openViewer = function(id){
    const item = allItems().find(w => String(w.id) === String(id));
    if(item && isRingtone(item)){
      try{ window.current = item; current = item; }catch(e){ window.current = item; }
      item.views = (item.views||0)+1;
      const preview = $('previewMedia');
      if(preview){
        preview.classList.add('wfh-ringtone-viewer');
        preview.innerHTML = '<div class="viewer-top"><button id="viewerBackBtn" type="button"><i class="fa-solid fa-chevron-left"></i></button><button id="viewerLikeBtn" type="button"><i id="viewerHeart" class="fa-regular fa-heart"></i></button></div>'+
          '<div class="wfh-ringtone-player"><div class="wfh-big-note"><i class="fa-solid fa-music"></i></div><h3>'+esc(item.title||'Ringtone')+'</h3><p style="font-size:12px;color:#cfcfe8;margin-top:6px">'+esc(item.cat||'Ringtone')+' • WallFlixHub Audio</p><div class="wfh-wave">'+wave()+'</div><audio src="'+esc(item.url)+'" controls autoplay preload="metadata"></audio></div>';
        const back=$('viewerBackBtn'); if(back) back.onclick=function(e){e.preventDefault(); closeViewer();};
        const like=$('viewerLikeBtn'); if(like) like.onclick=function(e){e.preventDefault(); if(typeof likeCurrent==='function') likeCurrent();};
      }
      if($('vTitle')) $('vTitle').textContent = item.title || 'Ringtone';
      if($('vLikes')) $('vLikes').textContent = item.likes || 0;
      if($('vViews')) $('vViews').textContent = item.views || 0;
      if($('vDown')) $('vDown').textContent = item.downloads || 0;
      if($('downloadBtn')) $('downloadBtn').textContent = 'Download Ringtone';
      if($('shareBtn')) $('shareBtn').textContent = 'Share Ringtone';
      if($('relatedTitle')) $('relatedTitle').textContent = 'More Ringtones';
      const rel = ringtoneList().filter(w=>String(w.id)!==String(id)).slice(0,10);
      if($('related')) $('related').innerHTML = rel.map(rowCard).join('');
      const viewer=$('viewer'); if(viewer){viewer.style.display='block';viewer.classList.add('show');viewer.scrollTop=0;}
      applyDurations();
      return false;
    }
    if($('previewMedia')) $('previewMedia').classList.remove('wfh-ringtone-viewer');
    return oldOpenViewer ? oldOpenViewer.apply(this,arguments) : false;
  };

  const oldDownload = window.downloadCurrent;
  window.downloadCurrent = function(){
    const cur = window.current || (typeof current !== 'undefined' ? current : null);
    if(cur && isRingtone(cur)) return window.wfhDownloadRingtone(cur.id);
    return oldDownload ? oldDownload.apply(this,arguments) : undefined;
  };

  const oldShare = window.shareCurrent;
  window.shareCurrent = function(){
    const cur = window.current || (typeof current !== 'undefined' ? current : null);
    if(cur && isRingtone(cur)){
      const data = {title:cur.title||'WallFlixHub Ringtone', text:'Listen to this ringtone on WallFlixHub', url:cur.url};
      if(navigator.share) return navigator.share(data).catch(()=>{});
      navigator.clipboard && navigator.clipboard.writeText(cur.url);
      try{toast('Ringtone link copied');}catch(e){}
      return;
    }
    return oldShare ? oldShare.apply(this,arguments) : undefined;
  };

  const oldRender = window.render;
  window.render = function(){
    const out = oldRender ? oldRender.apply(this,arguments) : undefined;
    setTimeout(renderRingtones,80);
    setTimeout(renderRingtones,500);
    return out;
  };

  function improvePublishForm(){
    const quickCat = $('quickCat');
    if(quickCat && !quickCat.dataset.ringCats){
      quickCat.dataset.ringCats = '1';
      ['iPhone','Notification','Alarm','Funny','Arabic'].forEach(c=>{
        if(!Array.from(quickCat.options).some(o=>o.value===c || o.text===c)){
          const opt=document.createElement('option'); opt.value=c; opt.textContent=c; quickCat.appendChild(opt);
        }
      });
    }
    const quickType = $('quickType');
    if(quickType){
      Array.from(quickType.options).forEach(o=>{ if(o.value==='live') o.textContent='Ringtone Audio'; });
    }
    const videoTab = $('videoTab'); if(videoTab) videoTab.innerHTML = '<i class="fa-solid fa-music"></i> Ringtone';
    const input = $('quickUrl'); if(input) input.placeholder = 'Cloudinary MP3 ringtone URL or image URL';
  }

  document.addEventListener('DOMContentLoaded',function(){
    improvePublishForm();
    renderRingtones();
    setTimeout(renderRingtones,600);
    setTimeout(renderRingtones,1600);
  });
  setTimeout(function(){improvePublishForm(); renderRingtones();},400);
  setTimeout(renderRingtones,1800);
  /* Rendering is restarted after publish/render; no constant observer to keep the page light. */
})();

(function(){
  let activeAudio = null;
  let activeCard = null;

  function getIcon(card){
    return card ? card.querySelector('.wfh-ringtone-play i,.wfh-audio-play i') : null;
  }

  function setCardState(card, playing){
    if(!card) return;
    card.classList.toggle('playing', !!playing);
    const icon = getIcon(card);
    if(icon) icon.className = playing ? 'fa-solid fa-pause' : 'fa-solid fa-play';
  }

  function resetOtherCards(keepCard){
    document.querySelectorAll('.wfh-ringtone-card,.wfh-audio-card').forEach(function(card){
      if(card === keepCard) return;
      setCardState(card, false);
      const audio = card.querySelector('audio');
      if(audio && audio !== activeAudio){
        try{ audio.pause(); audio.currentTime = 0; }catch(e){}
      }
    });
  }

  function findClickedCard(id, btn){
    if(btn && btn.closest) {
      const direct = btn.closest('.wfh-ringtone-card,.wfh-audio-card');
      if(direct) return direct;
    }
    try{
      const ev = window.event;
      if(ev && ev.target && ev.target.closest){
        const fromEvent = ev.target.closest('.wfh-ringtone-card,.wfh-audio-card');
        if(fromEvent) return fromEvent;
      }
    }catch(e){}
    const selector = '.wfh-ringtone-card[data-ring-id="'+(window.CSS&&CSS.escape?CSS.escape(String(id)):String(id).replace(/"/g,'\\"'))+'"],.wfh-audio-card[data-rt="'+(window.CSS&&CSS.escape?CSS.escape(String(id)):String(id).replace(/"/g,'\\"'))+'"]';
    const cards = Array.from(document.querySelectorAll(selector));
    return cards.find(function(c){ return c.offsetParent !== null; }) || cards[0] || null;
  }

  window.wfhToggleRingtone = function(id, btn){
    const card = findClickedCard(id, btn);
    if(!card) return false;

    const audio = card.querySelector('audio');
    if(!audio) return false;

    if(activeAudio && activeAudio !== audio){
      try{ activeAudio.pause(); activeAudio.currentTime = 0; }catch(e){}
      setCardState(activeCard, false);
    }

    resetOtherCards(card);

    if(!audio.paused){
      audio.pause();
      setCardState(card, false);
      activeAudio = null;
      activeCard = null;
      return false;
    }

    activeAudio = audio;
    activeCard = card;

    const playPromise = audio.play();
    if(playPromise && playPromise.then){
      playPromise.then(function(){
        setCardState(card, true);
      }).catch(function(){
        setCardState(card, false);
        activeAudio = null;
        activeCard = null;
        try{ if(typeof toast === 'function') toast('Tap Play again'); }catch(e){}
      });
    }else{
      setCardState(card, true);
    }

    audio.onpause = function(){
      if(activeAudio === audio && audio.paused){
        setCardState(card, false);
      }
    };
    audio.onended = function(){
      setCardState(card, false);
      if(activeAudio === audio){
        activeAudio = null;
        activeCard = null;
      }
    };
    return false;
  };

  window.wfhStablePlayRingtone = window.wfhToggleRingtone;
  window.wfhPlayRingtone = window.wfhToggleRingtone;

  document.addEventListener('click', function(e){
    const btn = e.target.closest && e.target.closest('.wfh-ringtone-play,.wfh-audio-play');
    if(!btn) return;
    const card = btn.closest('.wfh-ringtone-card,.wfh-audio-card');
    if(!card) return;
    const id = card.getAttribute('data-ring-id') || card.getAttribute('data-rt');
    if(!id) return;
    e.preventDefault();
    e.stopPropagation();
    if(e.stopImmediatePropagation) e.stopImmediatePropagation();
    window.wfhToggleRingtone(id, btn);
  }, true);

  document.addEventListener('visibilitychange', function(){
    if(document.hidden && activeAudio){
      try{ activeAudio.pause(); }catch(e){}
      setCardState(activeCard, false);
    }
  });
})();

function go(screenId, btn=null) {
    // hide all screens
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    // show selected
    const target = document.getElementById(screenId);
    if(target){
        target.classList.add('active');
    }

    // update URL hash for GitHub Pages compatibility
    window.location.hash = screenId;

    // update bottom nav active state if button passed
    if(btn){
        document.querySelectorAll('.bottom-nav .nav').forEach(n=>n.classList.remove('active'));
        btn.classList.add('active');
    }
}

window.addEventListener('load', () => {
    const hash = window.location.hash.replace('#','');
    if(hash && document.getElementById(hash)){
        go(hash);
    } else {
        go('home');
    }
});

// Centralized AdSense initializer (cleaned from repeated inline push blocks)
(function initWfhAds(){
  function pushAds(){
    document.querySelectorAll('ins.adsbygoogle').forEach(function(ad){
      if(ad.dataset.wfhAdsPushed) return;
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); ad.dataset.wfhAdsPushed='1'; } catch(e) {}
    });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', pushAds);
  else pushAds();
})();

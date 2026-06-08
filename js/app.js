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


function sendContactForm()

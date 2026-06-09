import { getApps, getApp, initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getMessaging, getToken, onMessage, isSupported } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-messaging.js";
import { getFirestore, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const WFH_VAPID_KEY = "BEVgfGzeUr4KKnudr0nDy82i6mOsq_WrFbCiQ8ws7Dfe-LO8KqL6PmT-RQ97TsJILhtW9FxC8ORtFUDWyZ951YM";
const WFH_FIREBASE_CONFIG = {
  apiKey:"AIzaSyDLv0FWvThD7h6EnHMb-l9Tn0pfOLfbvGE",
  authDomain:"wallflixhub.firebaseapp.com",
  databaseURL:"https://wallflixhub-default-rtdb.europe-west1.firebasedatabase.app",
  projectId:"wallflixhub",
  storageBucket:"wallflixhub.firebasestorage.app",
  messagingSenderId:"621224536171",
  appId:"1:621224536171:web:f48f9a44609741fb63692e",
  measurementId:"G-BYR8JH0QTM"
};

(function(){
  let messagingInstance = null;

  function toastMsg(msg){
    try{
      if(typeof toast === "function") toast(msg);
      else {
        const t=document.getElementById("toast");
        if(t){
          t.textContent=msg;
          t.classList.add("show");
          setTimeout(()=>t.classList.remove("show"),2200);
        }
      }
    }catch(e){}
  }

  function setStatus(msg,type){
    const box=document.getElementById("pushStatusText");
    if(!box) return;
    box.textContent=msg;
    box.className="wfh-push-status "+(type||"");
  }

  function ensurePushUI(){
    const syncForm=document.querySelector("#sync .form");
    if(syncForm && !document.getElementById("enablePushBtn")){
      const btn=document.createElement("button");
      btn.id="enablePushBtn";
      btn.className="btn";
      btn.style.cssText="width:100%;margin-bottom:10px";
      btn.innerHTML='<i class="fa-regular fa-bell"></i> Enable Push Notifications';
      btn.onclick=window.enablePushNotifications;

      const restoreBtn=syncForm.querySelector("button[onclick*='restoreFromFirebase']");
      if(restoreBtn) restoreBtn.insertAdjacentElement("afterend",btn);
      else syncForm.appendChild(btn);

      const st=document.createElement("div");
      st.id="pushStatusText";
      st.className="wfh-push-status";
      st.textContent=localStorage.getItem("wfhFcmToken") ? "Push Notifications: Enabled" : "Push Notifications: Not enabled";
      btn.insertAdjacentElement("afterend",st);
    }

    const notifList=document.getElementById("notifList");
    if(notifList && !document.getElementById("notifEnablePushRow")){
      const row=document.createElement("div");
      row.id="notifEnablePushRow";
      row.className="row";
      row.onclick=window.enablePushNotifications;
      row.innerHTML='<i class="fa-regular fa-bell" style="color:var(--glow);font-size:23px"></i><div><b>Enable Push Notifications</b><p>Receive new wallpaper alerts</p></div>';
      notifList.prepend(row);
    }
  }

  async function getFirebaseApp(){
    return getApps().length ? getApp() : initializeApp(WFH_FIREBASE_CONFIG);
  }

  async function registerSW(){
    if(!("serviceWorker" in navigator)) throw new Error("Service Worker not supported");
    const reg = await navigator.serviceWorker.register("./firebase-messaging-sw.js", {scope:"./"});
    await navigator.serviceWorker.ready;
    return reg;
  }

  async function saveToken(token){
    try{
      const app=await getFirebaseApp();
      const db=window.fbDb || getFirestore(app);
      const user=window.fbUser || (typeof fbUser !== "undefined" ? fbUser : null);
      const id=user ? String(user.uid) : "anonymous_" + token.slice(0,18);
      await setDoc(doc(db,"pushTokens",id),{
        token,
        uid:user ? user.uid : null,
        email:user ? (user.email || "") : "",
        platform:navigator.userAgent,
        updatedAt:serverTimestamp()
      },{merge:true});
    }catch(e){
      console.warn("FCM token save skipped:", e);
    }
  }

  window.enablePushNotifications = async function(){
    try{
      ensurePushUI();

      const supported = await isSupported().catch(()=>false);
      if(!supported){
        setStatus("Push غير مدعوم فهاد المتصفح", "bad");
        toastMsg("Push not supported");
        return;
      }

      if(!("Notification" in window)){
        setStatus("Notifications غير مدعومة", "bad");
        toastMsg("Notifications not supported");
        return;
      }

      setStatus("Requesting permission...", "");
      const permission = await Notification.requestPermission();

      if(permission !== "granted"){
        setStatus("Notifications permission refused", "bad");
        toastMsg("Notifications refused");
        return;
      }

      setStatus("Registering firebase-messaging-sw.js...", "");
      const swReg = await registerSW();

      const app=await getFirebaseApp();
      messagingInstance=getMessaging(app);

      setStatus("Generating FCM token...", "");
      const token = await getToken(messagingInstance,{
        vapidKey: WFH_VAPID_KEY,
        serviceWorkerRegistration: swReg
      });

      if(!token){
        setStatus("FCM Token not generated", "bad");
        toastMsg("Token not generated");
        return;
      }

      localStorage.setItem("wfhFcmToken", token);
      await saveToken(token);

      setStatus("Push Notifications: Enabled", "ok");
      toastMsg("Notifications Enabled");

      try{
        onMessage(messagingInstance,(payload)=>{
          const title = payload?.notification?.title || "WallFlixHub";
          const body = payload?.notification?.body || "New wallpaper available";
          toastMsg(title + " - " + body);
          if(document.visibilityState === "visible" && Notification.permission === "granted"){
            new Notification(title, {
              body,
              icon:"./logo.png",
              badge:"./logo.png"
            });
          }
        });
      }catch(e){}
    }catch(e){
      console.error("Push setup failed:", e);
      const msg=String(e && (e.message || e.code) || "Push failed");
      setStatus("Push failed: " + msg.slice(0,80), "bad");
      toastMsg("Push setup failed");
    }
  };

  document.addEventListener("DOMContentLoaded",ensurePushUI);
  setTimeout(ensurePushUI,600);
  setTimeout(ensurePushUI,1600);
  setTimeout(()=>{
    if(localStorage.getItem("wfhFcmToken")) setStatus("Push Notifications: Enabled","ok");
  },2200);
})();

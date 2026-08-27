window.SleepingPets=window.SleepingPets||{};
(function(SP){
 const W=520,H=360;
 const statics=["sleeping.png","light.png","restless.png","one-eye.png","head-up.png","awake.png"];
 const cache={};
 const path=f=>"assets/images/pug/"+f;

 function load(file){
   const src=path(file);
   if(cache[src]) return cache[src];
   const img=new Image();
   const promise=new Promise((resolve,reject)=>{
     img.onload=()=>resolve(img);
     img.onerror=reject;
   });
   img.src=src;
   cache[src]={img,promise};
   return cache[src];
 }

 SP.preloadPetAssets=function(){
   statics.forEach(load);
   ["transition-0-1-sheet.png","transition-1-2-sheet.png","transition-2-3-sheet.png",
    "transition-3-4-sheet.png","transition-4-5-sheet.png"].forEach(load);
 };

 SP.getUI=function(){
   const q=s=>document.querySelector(s);
   const ui={
     bankCoins:q("#bankCoins"),runCoins:q("#runCoins"),combo:q("#combo"),
     multiplier:q("#multiplier"),timer:q("#timer"),wakePercent:q("#wakePercent"),
     wakeFill:q("#wakeFill"),petImage:q("#petImage"),itemLayer:q("#itemLayer"),
     message:q("#message"),bankButton:q("#bankButton"),pauseButton:q("#pauseButton"),
     playfield:q("#playfield"),overlay:q("#overlay"),overlayTitle:q("#overlayTitle"),
     overlayText:q("#overlayText"),overlayButton:q("#overlayButton")
   };
   ui.petCtx=ui.petImage.getContext("2d");
   ui.petCtx.imageSmoothingEnabled=true;
   return ui;
 };

 SP.petBand=w=>w>=100?5:w>=80?4:w>=60?3:w>=40?2:w>=20?1:0;

 SP.drawStaticPet=function(ui,band){
   load(statics[band]).promise.then(img=>{
     ui.petCtx.clearRect(0,0,W,H);
     ui.petCtx.drawImage(img,0,0,W,H);
   }).catch(()=>{});
 };

 function drawSheetFrame(ui,img,index){
   ui.petCtx.clearRect(0,0,W,H);
   ui.petCtx.drawImage(img,0,index*H,W,H,0,0,W,H);
 }

 SP.playSheet=function(state,ui,from,to,done){
   state.animatingPet=true;
   load(`transition-${from}-${to}-sheet.png`).promise.then(img=>{
     const fps=30,count=30,frameMs=1000/fps;
     let start=null,last=-1;
     function tick(ts){
       if(start===null) start=ts;
       const i=Math.min(count-1,Math.floor((ts-start)/frameMs));
       if(i!==last){drawSheetFrame(ui,img,i);last=i;}
       if(i<count-1){
         state.petAnimRAF=requestAnimationFrame(tick);
       }else{
         state.petAnimRAF=null;
         state.animatingPet=false;
         SP.drawStaticPet(ui,to);
         if(done) done();
       }
     }
     state.petAnimRAF=requestAnimationFrame(tick);
   }).catch(()=>{
     state.animatingPet=false;
     SP.drawStaticPet(ui,to);
     if(done) done();
   });
 };

 SP.runTransitionQueue=function(state,ui){
   if(state.animatingPet || state.visualPetBand===state.targetPetBand) return;
   if(state.targetPetBand<state.visualPetBand){
     state.visualPetBand=state.targetPetBand;
     SP.drawStaticPet(ui,state.visualPetBand);
     return;
   }
   const from=state.visualPetBand,to=from+1;
   SP.playSheet(state,ui,from,to,()=>{
     state.visualPetBand=to;
     SP.runTransitionQueue(state,ui);
   });
 };

 SP.render=function(state,ui){
   ui.bankCoins.textContent=Math.floor(state.bankCoins);
   ui.runCoins.textContent=Math.floor(state.runCoins)+" 🪙";
   ui.combo.textContent=state.combo;
   ui.multiplier.textContent=state.multiplier;
   ui.timer.textContent=Math.max(0,state.timer).toFixed(1);

   const w=Math.max(0,Math.min(100,state.wake));
   ui.wakePercent.textContent=Math.round(w)+"%";
   ui.wakeFill.style.transform=`scaleX(${w/100})`;
   ui.wakeFill.style.background=w<40?"#74c95c":w<70?"#f0a43b":"#ee5959";

   state.targetPetBand=SP.petBand(state.wake);
   SP.runTransitionQueue(state,ui);
 };

 SP.setMessage=(ui,t)=>ui.message.textContent=t;
 SP.showOverlay=function(ui,title,text,button){
   ui.overlayTitle.textContent=title;
   ui.overlayText.textContent=text;
   ui.overlayButton.textContent=button;
   ui.overlay.classList.remove("hidden");
 };
 SP.hideOverlay=ui=>ui.overlay.classList.add("hidden");
})(SleepingPets);

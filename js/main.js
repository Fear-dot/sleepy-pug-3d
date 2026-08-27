window.addEventListener("DOMContentLoaded",function(){
 const SP=SleepingPets,C=SP.CONFIG,state=SP.createState(),ui=SP.getUI();
 function updateMultiplier(){state.multiplier=Math.min(C.maxMultiplier,1+Math.floor(state.combo/C.comboStep))}
 function resetRun(){
  if(state.petAnimRAF){cancelAnimationFrame(state.petAnimRAF);state.petAnimRAF=null;}
  Object.assign(state,{runCoins:0,combo:0,multiplier:1,wake:0,timer:C.startingTimer,elapsed:0,spawnAccumulator:0,gameOver:false,paused:false,lastFrame:performance.now(),visualPetBand:0,targetPetBand:0,animatingPet:false,petAnimRAF:null});
  ui.petImage.src="assets/images/pug/sleeping.png";ui.petImage.dataset.band="0";
  SP.clearItems(ui);SP.hideOverlay(ui);SP.setMessage(ui,"Gold/Blau anklicken. Rot und Fehlklicks wecken ihn!");SP.drawStaticPet(ui,0);
  SP.render(state,ui);
 }
 function lose(reason){
  if(state.gameOver)return;
  state.gameOver=true;state.paused=true;state.runCoins=0;state.wake=100;SP.clearItems(ui);
  SP.render(state,ui);
  setTimeout(()=>SP.showOverlay(ui,"Der Mops ist wach!",reason+" Die komplette Rundenbeute ist verloren.","Neue Runde"),5200);
 }
 function check(){if(state.timer<=0)lose("Die 15 Sekunden sind abgelaufen.");else if(state.wake>=100)lose("Er wurde zu unruhig.")}
 function onItemResult(result,type){
  if(state.paused||state.gameOver)return;
  if(result==="clicked"){
   if(type==="bad"){state.combo=0;state.multiplier=1;state.wake+=C.badClickWakePenalty;SP.setMessage(ui,"FALSCH! Das war ein lauter Gegenstand.");}
   else{
    const base=type==="rare"?C.rareReward:C.goodReward;state.runCoins+=base*state.multiplier;state.combo++;updateMultiplier();state.timer=C.startingTimer;
    state.wake=Math.max(0,state.wake-(type==="rare"?C.rareWakeRelief:C.goodWakeRelief));
    SP.setMessage(ui,type==="rare"?"Selten! Starke Belohnung.":"Sauber erwischt.");
   }
  }else if(type!=="bad"){state.combo=0;state.multiplier=1;state.wake+=C.missWakePenalty;SP.setMessage(ui,"Zu langsam – er wird unruhig.");}
  check();SP.render(state,ui);
 }
 function spawnDelay(){return Math.max(C.minSpawnDelay,C.startingSpawnDelay-state.elapsed*C.spawnAccelerationPerSecond)}
 function loop(now){
  const dt=Math.min(.05,(now-state.lastFrame)/1000);state.lastFrame=now;
  if(!state.paused&&!state.gameOver){
   state.elapsed+=dt;state.timer-=dt;state.wake+=C.passiveWakePerSecond*dt;state.spawnAccumulator+=dt*1000;
   const d=spawnDelay();while(state.spawnAccumulator>=d){state.spawnAccumulator-=d;SP.spawnItem(state,ui,onItemResult)}
   check();SP.render(state,ui);
  }
  requestAnimationFrame(loop);
 }

 // Fehlklick: any click in the actual playfield that isn't a valid item wakes the pug immediately.
 ui.playfield.addEventListener("click",function(e){
  if(state.paused||state.gameOver)return;
  if(e.target.closest(".game-item"))return;
  SP.setMessage(ui,"FEHLKLICK! Du hast den Mops geweckt.");
  lose("Ein Fehlklick hat ihn geweckt.");
 });

 ui.bankButton.addEventListener("click",function(){
  if(state.gameOver||state.runCoins<=0)return;
  const secured=Math.floor(state.runCoins);state.bankCoins+=secured;SP.persistBank(state);state.paused=true;SP.clearItems(ui);SP.render(state,ui);
  SP.showOverlay(ui,"Beute gesichert!",secured+" Münzen wurden gespeichert.","Neue Runde");
 });
 ui.pauseButton.addEventListener("click",function(){if(state.gameOver)return;state.paused=true;SP.clearItems(ui);SP.showOverlay(ui,"Pause","Das Spiel ist pausiert.","Weiter")});
 ui.overlayButton.addEventListener("click",function(){if(state.gameOver||ui.overlayTitle.textContent.includes("gesichert"))return resetRun();state.paused=false;state.lastFrame=performance.now();SP.hideOverlay(ui)});
 resetRun();requestAnimationFrame(loop);
});

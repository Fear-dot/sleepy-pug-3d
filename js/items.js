window.SleepingPets=window.SleepingPets||{};
(function(SP){
 const pick=a=>a[Math.floor(Math.random()*a.length)];
 const clamp=(a,v,b)=>Math.max(a,Math.min(v,b));
 SP.spawnItem=function(state,ui,onResult){
  const C=SP.CONFIG,danger=clamp(0,state.elapsed/65,1),badChance=C.badItemChanceStart+(C.badItemChanceMax-C.badItemChanceStart)*danger;
  const r=Math.random();let type="good";if(r<badChance)type="bad";else if(r<badChance+C.rareItemChance)type="rare";
  const el=document.createElement("button");el.className="game-item "+type;el.type="button";el.dataset.gameItem="1";
  el.textContent=type==="good"?pick(SP.GOOD_ICONS):type==="rare"?pick(SP.RARE_ICONS):pick(SP.BAD_ICONS);

  const b=ui.itemLayer.getBoundingClientRect(),pad=80;
  const maxX=Math.max(pad,b.width-pad),maxY=Math.max(180,b.height*.47);
  el.style.left=(pad+Math.random()*Math.max(20,maxX-pad))+"px";
  el.style.top=(90+Math.random()*Math.max(20,maxY-150))+"px";
  ui.itemLayer.appendChild(el);

  let done=false;
  const finish=result=>{if(done)return;done=true;clearTimeout(to);el.remove();onResult(result,type)};
  el.addEventListener("click",e=>{e.stopPropagation();finish("clicked")});
  const lifetime=Math.max(C.itemLifetimeMin,C.itemLifetimeMax-state.elapsed*11);
  const to=setTimeout(()=>finish("missed"),lifetime);
 };
 SP.clearItems=ui=>ui.itemLayer.innerHTML="";
})(SleepingPets);

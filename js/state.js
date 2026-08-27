window.SleepingPets=window.SleepingPets||{};
SleepingPets.createState=function(){return{
 bankCoins:Number(localStorage.getItem("sleepingPets.bankCoins")||0),
 runCoins:0,combo:0,multiplier:1,wake:0,timer:15,elapsed:0,paused:false,gameOver:false,
 lastFrame:performance.now(),spawnAccumulator:0,
 visualPetBand:0,targetPetBand:0,animatingPet:false,petAnimRAF:null
}};
SleepingPets.persistBank=s=>localStorage.setItem("sleepingPets.bankCoins",String(s.bankCoins));

'use strict';

window.addEventListener('load', function (){
  var head = document.querySelector('#head');
  head.innerHTML = "started";
  // WebI2C Initialized
  navigator.requestI2CAccess().then(function(i2cAccess) {
    head.innerHTML = "initializing...";
    var port = i2cAccess.ports.get(0);
    var disp = new OledDisplay(port);
    disp.initQ();
    disp.clearDisplayQ();
    disp.playSequence().then(function(){
      head.innerHTML = "drawing text...";
      disp.drawStringQ(0,0,"hello");
      disp.drawStringQ(1,0,"Real");
      disp.drawStringQ(2,0,"World");
      disp.playSequence().then(function(){
        head.innerHTML = "completed";
      })
    })
  }).catch(function(e){
    console.error('I2C bus error!', e);
    head.innerHTML = e;
  });
}, false);
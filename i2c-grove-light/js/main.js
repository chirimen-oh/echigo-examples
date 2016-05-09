'use strict';

window.addEventListener('load', function (){
  var head = document.querySelector('#head');
  
  // WebI2C Initialized
  navigator.requestI2CAccess()
    .then(function(i2cAccess){
      var port = i2cAccess.ports.get(0);
      var grovelight = new GROVELIGHT(port,0x29);
      grovelight.init().then(function(){
        setInterval(function(){
          grovelight.read().then(function(value){
            console.log('value:', value);
            head.innerHTML = value ? value : head.innerHTML;
          });
        },1000);
      })
    }).catch(e=> console.error('error', e));
}, false);
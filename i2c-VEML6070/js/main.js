'use strict';

window.addEventListener('load', function (){
  var head = document.querySelector('#head');
  
  // WebI2C Initialized
  navigator.requestI2CAccess()
    .then(function(i2cAccess){
      var port = i2cAccess.ports.get(0);
      var veml6070 = new VEML6070(port, 0x38);
      setInterval(function(){
        veml6070.read().then(function(value){
          console.log('value2:', value);
          head.innerHTML = value ? value : head.innerHTML;
        });
      },1000);
    }).catch(e=> console.error('error', e));
}, false);
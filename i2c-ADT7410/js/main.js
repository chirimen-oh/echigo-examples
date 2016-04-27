'use strict';

window.addEventListener('load', function (){
  var head = document.querySelector('#head');
  
  // WebI2C Initialized
  navigator.requestI2CAccess()
    .then(function(i2cAccess){
      return i2cAccess.ports;
    }).then(function(ports){
      return ports.get(0);
    }).then(function(port){
      var adt7410 = new ADT7410(port,0x48);
      setInterval(function(){
        adt7410.read().then(function(value){
          console.log('value:', value);
          head.innerHTML = value ? value : head.innerHTML;
        });
      },1000);
    }).catch(e=> console.error('error', e));
}, false);
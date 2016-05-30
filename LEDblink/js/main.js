'use strict';

window.addEventListener('load', function (){

// WebGPIO LED Blink
  navigator.requestGPIOAccess()
    .then(gpioAccess=>{
      var port = gpioAccess.ports.get(198);
      var v = 0;
      return port.export("out").then(()=>{
        setInterval(function(){
          v = v ? 0 : 1;
          port.write(v);
        },1000);
      });
  });
}, false);

'use strict';

window.addEventListener('load', function (){

// WebGPIO push button
  navigator.requestGPIOAccess().then(
    function(gpioAccess) {
        console.log("GPIO ready!");
        return gpioAccess;
    }).then(gpio=>{
      var port = gpio.ports.get(199);
      port.export("in").then(()=>{
        setInterval(()=>{
          port.read().then( (value)=>{
            console.log("gpio= "+value);
          });
        },1000);
      });
  }).catch(error=>{
    console.log("Failed to get GPIO access catch: " + error.message);
  });
}, false);

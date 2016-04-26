'use strict';

window.addEventListener('load', function (){

// WebGPIO push button
  navigator.requestGPIOAccess().then(
    function(gpioAccess) {
        console.log("GPIO ready!");
        return gpioAccess;
    }).then(gpio=>{
      var ledPort = gpio.ports.get(198);
      var buttonPort = gpio.ports.get(199);
      return Promise.all([
        ledPort.export("out"),
        buttonPort.export("in")
      ]).then(()=>{
        buttonPort.onchange = function(v){
          console.log("button is pushed!");
          v = v ? 0 : 1;
          ledPort.write(v);
        }
      });
  }).catch(error=>{
    console.log("Failed to get GPIO access catch: " + error.message);
  });
}, false);

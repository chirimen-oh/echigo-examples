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
      var pcs9685 = new PCA9685(port,0x40);
      var angle = 90;
      console.log("angle"+angle);
      pcs9685.init().then(function(){
        console.log("init");
        setInterval(function(){
          angle = (angle<0) ? 90 : -90;
          console.log("angle"+angle);
          pcs9685.setServo(0,angle).then(function(){
            console.log('value:', angle);
            head.innerHTML = angle;
          });
        },1000);
      });
      
    }).catch(e=> console.error('error', e));
}, false);
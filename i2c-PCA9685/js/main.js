'use strict';

window.addEventListener('load', function (){
  var head = document.querySelector('#head');
  
  // WebI2C Initialized
  navigator.requestI2CAccess()
    .then(function(i2cAccess){
      var port = i2cAccess.ports.get(0);
      var pcs9685 = new PCA9685(port,0x40);
      var angle = 90;
      console.log("angle"+angle);
      //servo setting for sg90
      pcs9685.init(0.00050,0.00240,180).then(function(){
        console.log("init");
        setInterval(function(){
          angle = (angle<=10) ? 170 : 10;
          console.log("angle"+angle);
          pcs9685.setServo(0,angle).then(function(){
            console.log('value:', angle);
            head.innerHTML = angle;
          });
        },1000);
      });
      
    }).catch(e=> console.error('error', e));
}, false);
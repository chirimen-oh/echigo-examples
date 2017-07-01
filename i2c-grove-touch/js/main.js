'use strict';

var _deviceAddress=0x5a;
var _i2cPort;

window.addEventListener('load', function (){
  function Sleep(millisec) {
    var start = new Date();
    while(new Date() - start < millisec);
  }

  navigator.requestI2CAccess().then(
    function(i2cAccess) {
      _i2cPort = i2cAccess.ports.get(0);
      
      
      GroveTouch.init(_i2cPort,_deviceAddress).then(function(){
        setInterval(function(){
          GroveTouch.read(_i2cPort,_deviceAddress).then(ch => {
            console.log(ch);
            document.getElementById("debug").innerHTML = JSON.stringify(ch);
          });
        },1000);
      });
      
    },
    function(error) {
      console.log(error.message);
    }
  );
}, false);

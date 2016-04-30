'use strict';

window.addEventListener('load', function (){
  var head1 = document.querySelector('#head1');
  var head2 = document.querySelector('#head2');
  
  // WebI2C Initialized
  navigator.requestI2CAccess()
    .then(function(i2cAccess){
      var port = i2cAccess.ports.get(0);
      var srf02 = new SRF02(port,0x70);
      var adt7410 = new ADT7410(port,0x48);
      setInterval(function(){
        srf02.read().then(function(value){
          console.log('value:', value);
          head1.innerHTML = value ? value : head1.innerHTML;
          adt7410.read().then(function(value){
            console.log('value:', value);
            head2.innerHTML = value ? value : head2.innerHTML;
          })
        });
      },1000);
    }).catch(e=> console.error('error', e));
}, false);
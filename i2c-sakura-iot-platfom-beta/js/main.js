window.addEventListener("load", function() {
  console.log("Hello sakura iot platfom beta World");
  var head = document.querySelector('#head');

  // WebI2C Initialized
  navigator.requestI2CAccess()
    .then(function(i2cAccess){
      var port = i2cAccess.ports.get(0);
/*
      var adt7410 = new ADT7410(port,0x48);
      setInterval(function(){
        adt7410.read().then(function(value){
          console.log('value:', value);
          head.innerHTML = value ? value : head.innerHTML;
        });
      },1000);
*/
    }).catch(e=> console.error('error', e));
});

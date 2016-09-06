var VEML6070 = function(i2cPort,slaveAddress){
  this.i2cPort = i2cPort;
  this.slaveAddress = slaveAddress;
};

VEML6070.prototype = {
  sleep: function(ms, generator){
    setTimeout(function(){generator.next()}, ms);
  },
  read: function(){
    var self = this;
    return new Promise(function(resolve, reject){
      self.i2cPort.open(self.slaveAddress)
      .then(function(i2cSlave){
        var thread = (function* () {

          // Start
          // Refresh rate:
          // 0x06 = 0x01<<2 + 0x02
          // 0x1 for 1T
          i2cSlave.write8(0x00, 0x06);
          yield self.sleep(500, thread);
          
          // get UV value
          Promise.all([
            i2cSlave.read8(0x39, true),
            i2cSlave.read8(0x38, true),
          ]).then(function(v){
            var temp = ((v[0] << 8) + v[1])/128.0;
            resolve(temp);
          }).catch(reject);
        })();
        thread.next();
      });
    });  
  }
};
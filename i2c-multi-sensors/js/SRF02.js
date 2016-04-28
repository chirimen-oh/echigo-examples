var SRF02 = function(i2cPort,slaveAddress){
  this.i2cPort = i2cPort;
  this.slaveAddress = slaveAddress;
};

SRF02.prototype = {
  sleep: function(ms, generator){
    setTimeout(function(){generator.next()}, ms);
  },
  read: function(){
    var self = this;
    return new Promise(function(resolve, reject){
      self.i2cPort.open(self.slaveAddress)
      .then(function(i2cSlave){
        var thread = (function* () {

          i2cSlave.write8(0x00, 0x00);
          yield self.sleep(1, thread);
          i2cSlave.write8(0x00, 0x51);
          yield self.sleep(70, thread);

          // get distance value
          Promise.all([
            i2cSlave.read8(0x02, true),
            i2cSlave.read8(0x03, true),
          ]).then(function(v){
            var dist = ((v[0] << 8) + v[1]);
            resolve(dist);
          }).catch(reject);
        })();

        thread.next();
      });
    });  
  }
};
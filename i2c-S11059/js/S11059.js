var S11059 = function(i2cSlave) {
  this.i2cSlave = i2cSlave;
}

S11059.prototype = {
  init: function() {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.i2cSlave.write8(0x00, 0x83)
      .then(function() {
        return self.i2cSlave.write8(0x00, 0x03);
      })
      .then(function() {
        return self.sleep(500);
      }).then(function() {
        resolve();
      }).catch(function(reason) {
        reject(reason);
      });
    });
  },

  sleep: function(ms, generator) {
    return new Promise(function(resolve, reject) {
      setTimeout(function(){
        resolve();
      }, ms);
    });
  },

  getValue: function(registerAddress) {
    return this.i2cSlave.read8(registerAddress);
  },

  compose: function(high, low) {
    return (high << 8 & 0xff) + (low & 0xff);
  },

  read: function() {
    var self = this;
    return new Promise(function(resolve, reject) {
      Promise.all([
        self.getValue(0x03),
        self.getValue(0x04),
        self.getValue(0x05),
        self.getValue(0x06),
        self.getValue(0x07),
        self.getValue(0x08)
      ])
      .then(function(values) {
        var red = self.compose(values[0], values[1]);
        var green = self.compose(values[2], values[3]);
        var blue = self.compose(values[4], values[5]);
        resolve([red, green, blue]);
      }).catch (function(reason) {
        reject(reason);
      });
    });
  }
}

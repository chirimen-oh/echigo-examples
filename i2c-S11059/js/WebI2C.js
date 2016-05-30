// webI2C
//
// WebI2C*1 Wrapper for mozI2c
// 1:https://rawgit.com/browserobo/WebI2C/master/index.html
//
// Original code: Masashi Honma
// Align current spec: Satoru Takagi

"use strict";

navigator.requestI2CAccess = function() {
  return new Promise(function(resolve, reject) {
    if (navigator.mozI2c) {
      var i2cAccess = new I2CAccess()
      resolve(i2cAccess);
    } else {
      reject({"message": "mozI2c not supported"});
    }
  });
}

function I2CAccess() {
}

I2CAccess.prototype = {
  usedDevices: [],
  open: function(portNumber) {
    return new Promise(function(resolve, reject) {
      if (this.usedDevices[portNumber]) {
        reject("already open"); //already open
      } else {
        navigator.mozI2c.open(portNumber);
        var i2cport = new I2CPort(portNumber);
        this.usedDevices[portNumber] = i2cport;
        resolve(i2cport);
      }
    }.bind(this));
  } ,
  // Propery, it shoud be return the result of 'i2cdetect -l'
  ports: {0:0, 1:1, 2:2 , 3:4 } ,
  unexportAll: function() {
    console.log("not yet supported....")
  }
};

function I2CPort(portNumber) {
  this.init(portNumber);
}

I2CPort.prototype = {
  init: function(portNumber) {
    this.portNumber = portNumber;
    this.usedDevices = [];
  },

  open: function(deviceAddress) {
    var self = this;
    return new Promise(function(resolve,reject) {
      if (self.usedDevices[deviceAddress]) {
        reject("already open"); //already open
      } else {
        self.usedDevices[deviceAddress]= new I2CSlaveDevice(deviceAddress, this.portNumber);
        resolve(self.usedDevices[deviceAddress]);
      }
    }.bind(this));
  }
};

function I2CSlaveDevice(deviceAddress, portNumber) {
  this.init(deviceAddress , portNumber);
}

I2CSlaveDevice.prototype = {
  init: function(deviceAddress , portNumber) {
    this.deviceAddress = deviceAddress;
    this.portNumber = portNumber;
  },

  close: function() {
    console.log("currently do nothing..");
  },

  read8: function(command) {
    return new Promise(function(resolve, reject) {
      navigator.mozI2c.setDeviceAddress(this.portNumber, this.deviceAddress);
      resolve(navigator.mozI2c.read(this.portNumber, command, true));
    }.bind(this));
  },

  read16: function(command) {
    return new Promise(function(resolve, reject) {
      navigator.mozI2c.setDeviceAddress(this.portNumber, this.deviceAddress);
      resolve(navigator.mozI2c.read(this.portNumber, command, false));
    }.bind(this));
  },

  write8: function(command, value) {
    return new Promise(function(resolve, reject) {
      navigator.mozI2c.setDeviceAddress(this.portNumber, this.deviceAddress);
      navigator.mozI2c.write(this.portNumber, command, value, true);
      resolve(value);
    }.bind(this));
  },

  write16: function(command, value) {
    return new Promise(function(resolve, reject) {
      navigator.mozI2c.setDeviceAddress(this.portNumber, this.deviceAddress);
      navigator.mozI2c.write(this.portNumber, command, value, false);
      resolve(value);
    }.bind(this));
  }
}

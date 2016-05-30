"use strict";

var Main = {
  init: function() {
    navigator.requestI2CAccess().then(function(i2cAccess) {
      return i2cAccess.open(0);
    }).then(function(i2cPort) {
      return i2cPort.open(0x2a);
    }).then(function(i2cSlave) {
      Main.s11059 = new S11059(i2cSlave);
      return Main.s11059.init();
    }).then(function() {
      Main.start();
    }).catch(function(reason) {
      console.log("ERROR:" + reason);
    });
  },

  start: function() {
    Main.read();
  },

  read: function() {
    Main.s11059.read().then(function(values) {
      var red = values[0];
      var green = values[1];
      var blue = values[2];
      console.log("red:" + red + " green:" + green + " blue:" + blue);
      document.getElementById("red").textContent = red;
      document.getElementById("green").textContent = green;
      document.getElementById("blue").textContent = blue;
      setTimeout(Main.read, 100);
    }).catch(function(reason) {
      console.log("READ ERROR:" + reason);
    });
  }
}

window.addEventListener("DOMContentLoaded", function() {
  Main.init();
}, false);

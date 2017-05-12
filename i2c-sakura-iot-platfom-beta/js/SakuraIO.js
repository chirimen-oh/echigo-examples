const SAKURAIO_SLAVE_ADDR = 0x4F;

const MODE_IDLE = 0x00;
const MODE_WRITE = 0x01;
const MODE_READ = 0x02;

let mode;

var SakuraIO = function(i2cPort,slaveAddress) {
  this.i2cPort = i2cPort;
  this.slaveAddress = slaveAddress;
};

SakuraIO.prototype = {
  begin: function() {
    this.mode = this.MODE_IDLE;
  },
  end: function() {
    switch(this.mode){
      case this.MODE_WRITE:
        break;
      case this.MODE_READ:
        break;
    }

    this.mode = this.MODE_IDLE;
  },
  sendByte: function(data) {
    if(this.mode != this.MODE_WRITE){
    }
  },
  startReceive: function(length) {
    this.mode = this.MODE_READ;
  },
  receiveByte: function(stop) {
    let ret = 0;
    if(stop){
      this.mode = this.MODE_IDLE;
    }
    return ret;
  }
};

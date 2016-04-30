var PCA9685 = function(i2cPort,slaveAddress){
  this.i2cPort = i2cPort;
  this.slaveAddress = slaveAddress;
};

PCA9685.prototype = {
  sleep: function(ms, generator){
    setTimeout(function(){generator.next()}, ms);
  },
  init: function(noSetZero){
    var self = this;
    return new Promise(function(resolve, reject){
      self.i2cPort.open(self.slaveAddress)
      .then(function(i2cSlave){
        var thread = (function* () {

          i2cSlave.write8(0x00,0x00);
          yield self.sleep(10, thread);
          i2cSlave.write8(0x01,0x04);
          yield self.sleep(10, thread);

          i2cSlave.write8(0x00,0x10);
          yield self.sleep(10, thread);
          i2cSlave.write8(0xfe,0x64);
          yield self.sleep(10, thread);
          i2cSlave.write8(0x00,0x00);
          yield self.sleep(10, thread);
          i2cSlave.write8(0x06,0x00);
          yield self.sleep(10, thread);
          i2cSlave.write8(0x07,0x00);
          yield self.sleep(300, thread);


          if ( !noSetZero ){
            for ( var servoPort = 0 ; servoPort < 16 ; servoPort ++ ){
              self.setServo(servoPort , 0 ).then(
                function(){
                  resolve();
                },
                function(){
                  reject();
                }
              );
            }
          }

        })();

        thread.next();
      });
    });  
  },
  setServo: function(servoPort,angle){
    console.log(servoPort,angle)
    var self = this;

    var portStart = 8;
    var portInterval = 4;
    
    var center = 0.001500; // sec ( 1500 micro sec)
    var range  = 0.000600; // sec ( 600 micro sec) a bit large?
    var angleRange = 90.0;
    
    if ( angle > angleRange){
      angle = angleRange;
    } else if ( angle < -angleRange ){
      angle = - angleRange;
    }
        
    var freq = 61; // Hz
    var tickSec = ( 1 / freq ) / 4096; // 1bit resolution( sec )
    var centerTick = center / tickSec;
    var rangeTick = range / tickSec;
        
    var gain = rangeTick / angleRange; // [tick / angle]
        
    var ticks = Math.round(centerTick + gain * angle);
    /*
    var minPulse = 0.0005;
    var maxPulse = 0.0024;
    pulseRange = maxPulse - minPulse;
    angleRange = 180;
    var pulse = minPulse + angle / angleRange * pulseRange;
    var ticks = Math.round(pulse / tickSec);
    */
        
    var tickH = (( ticks >> 8 ) & 0x0f);
    var tickL = (ticks & 0xff);



    return new Promise(function(resolve, reject){
      self.i2cPort.open(self.slaveAddress)
      .then(function(i2cSlave){
        var thread = (function* () {
          var pwm = Math.round(portStart + servoPort * portInterval);
          i2cSlave.write8( Math.round(portStart + servoPort * portInterval + 1), tickH);
          //i2cSlave.write8( pwm + 1, tickH);
          yield self.sleep(1, thread);
          i2cSlave.write8( Math.round(portStart + servoPort * portInterval), tickL);
          //i2cSlave.write8( pwm, tickL);

          resolve();

        })();

        thread.next();
      });
    });  
  }
};
# CHIRIMEN programing sample collection

## Cording style
English

* Sample codes should be fullfilled the below cording style.

https://developer.mozilla.org/en-US/docs/Mozilla/Developer_guide/Coding_Style

~~* Don't include the polyfill codes such as webgpio.js and webi2c.js.~~

> comment on Feb 16, 2017 
> These examples has included polyfills the version of conforming to [release CMN2015-1_B2GOS-20170301](https://github.com/chirimen-oh/release/releases/tag/CMN2015-1_B2GOS-20170301).
> So, Don't try `bower install` in this version.

日本語

* サンプルコードは基本的に以下のコード規約に従ってください。

https://developer.mozilla.org/ja/docs/Mozilla/Developer_Guide/Mozilla_Coding_Style_Guide

~~* webgpio.js、webi2c.jsなどpolyfillのスクリプトはサンプルコードに含めないでください。~~

> 2017.02.16 コメント 
> このサンプルには CHIRIMEN release CMN2015-1_B2GOS-20170301に適合するPolyfillが既に含まれています。
> このため`bower install`は実施しないでください。

## Description
 
### LEDblink

It blinks an LED.

Please see also: http://qiita.com/kotakagi/items/3a4f7865ab784cd88cdd

### button

It blinks on an LED when push a button.

Please see also: http://fabble.cc/chirimenedu/chirimenpushbutton

### i2c-ADT7410

It reads a temperture sensor (ADT7410).

Please see also: http://qiita.com/kotakagi/items/56bba849295cf4c81d39#_reference-045b2acb9c1ec2f498df

### i2c-SRF02

It reads a distance sensor (SRF02).

Please see also: http://qiita.com/kotakagi/items/56bba849295cf4c81d39#_reference-045b2acb9c1ec2f498df

### i2c-grove-light

It reads a light sensor (Grove Digital Light Sensor).

Please see also: http://qiita.com/kotakagi/items/56bba849295cf4c81d39#_reference-045b2acb9c1ec2f498df

### i2c-grove-accelerometer

It reads an accelerometer sensor (Grove Digital Accelerometer Sensor).

Please see also: http://qiita.com/kotakagi/items/56bba849295cf4c81d39#_reference-045b2acb9c1ec2f498df

### i2c-PCA9685

It controls servo motors using servo driver(PCA9685).

Please see also: http://fabble.cc/chirimenedu/chirimenservo

### i2c-veml6070

It controls a UV sensor(VEML6070).

Please see also: http://fabble.cc/kohichi000000/chirimen-veml6070

### i2c-multi-sensors

It serially reads two sensors (temperture and distance) value.

### i2c-S11059

It reads a color sensor (S11059).

### i2c-PAJ7620-Gesture

It reads a gesture sensor (PAJ7620U2) ([Grove Gesture v1](http://wiki.seeedstudio.com/wiki/Grove_-_Gesture_v1.0)).

Please see also: http://fabble.cc/tadfmac/chirimen-i2c-paj7620-gesture

### i2c-grove-oledDisplay

It controls a [Grove OLED Display](http://wiki.seeedstudio.com/wiki/Grove_-_OLED_Display_128*64)

Please see also: http://fabble.cc/tadfmac/chirimen-oled-display

##LICENSE
Copyright (c) 2016 CHIRIMEN Open Hardware

Licensed under the MIT License

// Common
const CMD_GET_CONNECTION_STATUS = 0x01;       // OK
const CMD_GET_SIGNAL_QUALITY = 0x02;          // OK
const CMD_GET_DATETIME = 0x03;                // OK
const CMD_ECHO_BACK = 0x0f;                   // OK

// IO
const CMD_READ_ADC= 0x10;                     // OK

// Transmit
const CMD_TX_ENQUEUE = 0x20;                  // OK
const CMD_TX_SENDIMMED = 0x21;                // OK
const CMD_TX_LENGTH = 0x22;                   // OK
const CMD_TX_CLEAR = 0x23;                    // OK
const CMD_TX_SEND = 0x24;                     // OK
const CMD_TX_STAT = 0x25;                     // OK

// Receive
const CMD_RX_DEQUEUE = 0x30;                  // OK
const CMD_RX_PEEK = 0x31;                     // OK
const CMD_RX_LENGTH = 0x32;                   // OK
const CMD_RX_CLEAR = 0x33;                    // OK

// File Download
const CMD_START_FILE_DOWNLOAD = 0x40;         // OK
const CMD_GET_FILE_METADATA = 0x41;           // OK
const CMD_GET_FILE_DOWNLOAD_STATUS = 0x42;    // OK
const CMD_CANCEL_FILE_DOWNLOAD = 0x43;        // OK
const CMD_GET_FILE_DATA = 0x44;               // OK

// Operation
const CMD_GET_PRODUCT_ID = 0xA0;              // OK
const CMD_GET_UNIQUE_ID = 0xA1;               // OK
const CMD_GET_FIRMWARE_VERSION = 0xA2;        // OK
const CMD_UNLOCK = 0xA8;                      // OK
const CMD_UPDATE_FIRMWARE = 0xA9;             // OK
const CMD_GET_UPDATE_FIRMWARE_STATUS = 0xAA;  // OK
const CMD_SOFTWARE_RESET = 0xAF;              // OK


// Response
const CMD_ERROR_NONE = 0x01;
const CMD_ERROR_PARITY = 0x02;
const CMD_ERROR_MISSING = 0x03;
const CMD_ERROR_INVALID_SYNTAX = 0x04;
const CMD_ERROR_RUNTIME = 0x05;
const CMD_ERROR_LOCKED = 0x06;
const CMD_ERROR_BUSY = 0x07;


// FileStatus
const FILE_STATUS_ERROR = 0x01;
const FILE_STATUS_INVALID_REQUEST = 0x02;
const FILE_STATUS_NOTFOUND = 0x81;
const FILE_STATUS_SERVER_ERROR = 0x82;
const FILE_STATUS_INVALID_DATA = 0x83;


const SAKURAIO_SLAVE_ADDR = 0x4F;

const MODE_IDLE = 0x00;
const MODE_WRITE = 0x01;
const MODE_READ = 0x02;

var mode;

var sakuraIO = function(i2cPort,slaveAddress) {
  this.i2cPort = i2cPort;
  this.slaveAddress = slaveAddress;
};

sakuraIO.prototype = {
  executeCommand: function(cmd, requestLength, request, responseLength, response) {
    var parity = 0x00;
    var result = 0x00;
    var reservedResponseLength, tmpResponse, receivedResponseLength;

    console.log("executeCommand");

    this.begin();

    // request
    this.sendByte(cmd);
    this.sendByte(requestLength);
    parity = cmd ^ requestLength;
    for (let i=0; i<requestLength; i++) {
      parity ^= request[i];
      this.sendByte(request[i]);
    }
    this.sendByte(parity);
    //this.finishSending();

    reservedResponseLength = 0;
    if (responseLength != NULL) {
      reservedResponseLength = responseLength;
    }

    delay(10);

    // response
    this.startReceive(reservedResponseLength+3);
    result = this.receiveByte();
    if (result != CMD_ERROR_NONE) {
      console.log("Invalid status");
      this.end();
      return result;
    }
    receivedResponseLength = this.receiveByte();
    if (responseLength != NULL) {
      responseLength = receivedResponseLength;
    }

    parity = result ^ receivedResponseLength;
    for (let i=0; i<receivedResponseLength; i++) {
      tmpResponse = this.receiveByte();
      parity ^= tmpResponse;
      if (response != NULL && i<reservedResponseLength) {
        response[i] = tmpResponse;
      }
    }

    console.log("Parity");

    let p = this.receiveByte();

    parity ^= p;
    console.log("Parity=");
    console.log(p);
    if (parity != 0x00) {
      result = this.CMD_ERROR_PARITY;
      console.log("Invalid parity");
    } else {
      console.log("Success");
    }

    //this.finishReceiving();

    this.end();
    return result;
  },
  /* Common Commands */
  getConnectionStatus: function() {
    var responseLength = 1;
//    var response[1] = 0x00;
    var response = [0x00, 0x00];
    if (executeCommand(CMD_GET_CONNECTION_STATUS, 0, NULL, responseLength, response) != CMD_ERROR_NONE) {
      return 0x7F;
    }
    return response[0];
  },
  getSignalQuality: function() {
    var responseLength = 1;
    var response[1] = 0x00;

    if (executeCommand(CMD_GET_SIGNAL_QUALITY, 0, NULL, &responseLength, response) != CMD_ERROR_NONE) {
      return 0x00;
    }
    return response[0];
  },
  getUnixtime: function() {
    var responseLength = 8;
    let response[8] = {0x00};
    if (executeCommand(CMD_GET_DATETIME, 0, NULL, &responseLength, response) != CMD_ERROR_NONE) {
      return 0x00;
    }
    return *((let *)response);
  },
  echoback: function(length, data, *response) {
    var responseLength = length;
    if (executeCommand(CMD_ECHO_BACK, length, data, &responseLength, response) != CMD_ERROR_NONE) {
      return 0x00;
    }
    return responseLength;
  },
  /* IO Commands */
  getADC: function(let channel) {
    let request[1] = {channel};
    let response[2] = {0x00};
    var responseLength = sizeof(response);
    if (executeCommand(CMD_READ_ADC, 1, request, &responseLength, response) != CMD_ERROR_NONE) {
      return 0xffff;
    }
    return *((uint16_t *)response);
  },
  /* TX Commands */
  enqueueTxRaw: function(ch, type, length, data, offset) {
    let request[18] = {0x00};
    let requestLength = 10;
    request[0] = ch;
    request[1] = type;
    for (let i=0;i<length;i++) {
      request[2+i] = data[i];
    }
    if (offset != 0) {
      requestLength = 18;
      for (let i=0;i<8;i++) {
        request[10+i] = (offset)[i];
      }
    }
    return executeCommand(CMD_TX_ENQUEUE, requestLength, request, NULL, NULL);
  },
  enqueueTx: function(ch, value, offset) {
    return enqueueTxRaw(ch, 'i', 4, value, offset);
  },
  getTxQueueLength: function(available, queued) {
    let response[2] = {0x00};
    var responseLength = 2;
    let ret = executeCommand(CMD_TX_LENGTH, 0, NULL, &responseLength, response);
    available = response[0];
    queued = response[1];
    return ret;
  },
  clearTx: function() {
    return executeCommand(CMD_TX_CLEAR, 0, NULL, NULL, NULL);
  },
  send: function() {
    return executeCommand(CMD_TX_SEND, 0, NULL, NULL, NULL);
  },
  getTxStatus: function(*queue, *immediate) {
    let response[2] = {0x00};
    var responseLength = 2;
    let ret = executeCommand(CMD_TX_STAT, 0, NULL, &responseLength, response);
    *queue = response[0];
    *immediate = response[1];
    return ret;
  },
  /* RX Commands */
  dequeueRx: function(ch, type, value, offset) {
    let response[18] = {0x00};
    var responseLength = 18;
    let ret = executeCommand(CMD_RX_DEQUEUE, 0, NULL, &responseLength, response);
    if (ret != CMD_ERROR_NONE) {
      return ret;
    }

    ch = response[0];
    type = response[1];
    for (let i=0; i<8; i++) {
      value[i] = response[2+i];
    }
    for (let i=0; i<8; i++) {
      ((let *)offset)[i] = response[10+i];
    }

    return ret;
  },
  peekRx: function(ch, type, value, offset) {
    let response[18] = {0x00};
    var responseLength = 18;
    let ret = executeCommand(CMD_RX_PEEK, 0, NULL, &responseLength, response);
    if (ret != CMD_ERROR_NONE) {
      return ret;
    }

    ch = response[0];
    type = response[1];
    for (let i=0; i<8; i++) {
      value[i] = response[2+i];
    }
    for (let i=0; i<8; i++) {
      ((let *)offset)[i] = response[10+i];
    }

    return ret;
  },
  getRxQueueLength: function(available, queued) {
    let response[2] = {0x00};
    var responseLength = 2;
    let ret = executeCommand(CMD_RX_LENGTH, 0, NULL, &responseLength, response);
    available = response[0];
    queued = response[1];
    return ret;
  },
  clearRx: function() {
    return executeCommand(CMD_RX_CLEAR, 0, NULL, NULL, NULL);
  },
  /* File command */
  startFileDownload: function(fileId) {
    return executeCommand(CMD_START_FILE_DOWNLOAD, 2, fileId, NULL, NULL);
  },
  cancelFileDownload: function() {
    return executeCommand(CMD_CANCEL_FILE_DOWNLOAD, 0, NULL, NULL, NULL);
  },
  getFileMetaData: function(*status, *totalSize, *timestamp, *crc) {
    let response[17] = {0x00};
    var responseLength = 17;
    let ret = executeCommand(CMD_GET_FILE_METADATA, 0, NULL, &responseLength, response);
    *status = response[0];
    *totalSize = *(let *)(response+1);
    *timestamp = *(let *)(response+5);
    *crc = *(let *)(response+13);
    return ret;
  },
  getFileDownloadStatus: function(*status, *currentSize) {
    let response[5] = {0x00};
    var responseLength = 5;
    let ret = executeCommand(CMD_GET_FILE_DOWNLOAD_STATUS, 0, NULL, &responseLength, response);
    *status = response[0];
    *currentSize = *(let *)(response+1);
    return ret;
  },
  getFileData: function(size, data) {
    return executeCommand(CMD_GET_FILE_DATA, 1, size, size, data);
  },
  /* Operation command */
  getProductID: function() {
    let response[2] = {0x00};
    var responseLength = 2;
    let ret = executeCommand(CMD_GET_PRODUCT_ID, 0, NULL, &responseLength, response);
    if (ret != CMD_ERROR_NONE) {
      return 0x00;
    }
    return *((uint16_t *)response);
  },
  getUniqueID: function(data) {
    let response[11] = {0x00};
    var responseLength = 10;
    let ret = executeCommand(CMD_GET_UNIQUE_ID, 0, NULL, &responseLength, response);
    if (ret != CMD_ERROR_NONE) {
      return ret;
    }
    for (let i=0; i<responseLength; i++) {
      data[i] = (char)response[i];
    }
    data[responseLength] = 0x00;
    return ret;
  },
  getFirmwareVersion: function(data) {
    let response[33] = {0x00};
    var responseLength = 32;
    let ret = executeCommand(CMD_GET_FIRMWARE_VERSION, 0, NULL, &responseLength, response);
    if (ret != CMD_ERROR_NONE) {
      return ret;
    }
    for (let i=0; i<responseLength; i++) {
      data[i] = (char)response[i];
    }
    data[responseLength] = 0x00;
    return ret;
  },
  unlock: function() {
    let request[4] = {0x53, 0x6B, 0x72, 0x61};
    return executeCommand(CMD_UNLOCK, 4, request, NULL, NULL);
  },
  updateFirmware: function() {
    return executeCommand(CMD_UPDATE_FIRMWARE, 0, 0, NULL, NULL);
  },
  getFirmwareUpdateStatus: function() {
    var response[1] = 0x00;
    var responseLength = 1;
    if (executeCommand(CMD_GET_UPDATE_FIRMWARE_STATUS, 0, 0, &responseLength, response) != CMD_ERROR_NONE) {
        return 0xff;
    }
    return response[0];
  },
  reset: function() {
    return executeCommand(CMD_SOFTWARE_RESET, 0, 0, NULL, NULL);
  },
  begin: function() {
    this.mode = this.MODE_IDLE;
  },
  end: function() {
    switch(this.mode) {
      case this.MODE_WRITE:
        break;
      case this.MODE_READ:
        break;
    }

    this.mode = this.MODE_IDLE;
  },
  sendByte: function(data) {
    if (this.mode != this.MODE_WRITE) {
    }
  },
  startReceive: function(length) {
    this.mode = this.MODE_READ;
  },
  receiveByte: function(stop) {
    let ret = 0;
    if (stop) {
      this.mode = this.MODE_IDLE;
    }
    return ret;
  },
  read: function() {

  },
  write: function() {

  }
};

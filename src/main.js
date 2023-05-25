const crc = require('crc');

var dataLength = 0; // 수신 받은 데이터의 길이

var indexSession = 0; // 수신 받은 데이터의 세션
var indexReceiver = 0; // 수신 받은 데이터의 세션 내 위치

var startBlock = []; // 수신 받은 데이터 블럭
var headerBlock = []; // 수신 받은 데이터 블럭
var dataBlock = []; // 수신 받은 데이터 블럭
var crc16Block = []; // 수신 받은 CRC16 블럭

var crc16Received = 0; // CRC16 수신 결과
var crc16Calculated = 0; // CRC16 계산 결과

var jsonBodyReceived = undefined; // 수신 받은 JSON Body

// 바이트 배열을 16진수 문자열로 변경
const convertByteArrayToHexString = (data) => {
  let strHexArray = '';
  let strHex;

  if (typeof data == 'object' && data.length > 1) {
    for (let i = 0; i < data.length; i++) {
      strHex = data[i].toString(16).toUpperCase();
      strHexArray += ' ';
      if (strHex.length == 1) {
        strHexArray += '0';
      }
      strHexArray += strHex;
    }
    strHexArray = strHexArray.substr(1, strHexArray.length - 1);
  } else {
    strHexArray = data.toString();
  }

  return strHexArray;
}

// 장치로부터 받은 데이터 배열 처리
const receiveFromDevice = (dataArray) => {
  //console.log(`BASE - receiverForDevice() - Length : ${dataArray.length}`, dataArray);

  if (dataArray == undefined || dataArray.length == 0) {
    return;
  }

  // 버퍼로부터 데이터를 읽어 하나의 완성된 데이터 블럭으로 변환
  console.log(`dataArray.length: ${dataArray.length}`);
  for (let i = 0; i < dataArray.length; i++) {
    const data = dataArray[i];

    let flagContinue = true;
    let flagSessionNext = false;
    let flagComplete = false;

    console.log(`i: ${i}, data: ${data.toString(16).toUpperCase()} / ${data}, indexSession: ${indexSession}, indexReceiver: ${indexReceiver}`);
    switch (indexSession) {
      case 0: // Start Code
        {
          startBlock.push(data);

          if (startBlock.length > 2) {
            startBlock.shift();
          }

          if (startBlock.length == 2 &&
            startBlock[0] == 0x0A &&
            startBlock[1] == 0x55) {
            flagSessionNext = true;
            headerBlock = [];
          }
        }
        break;

      case 1: // Header
        {
          headerBlock.push(data);

          if (indexReceiver == 3) {
            const header = new Uint8Array(headerBlock);
            const view = new DataView(header.buffer);
            dataLength = view.getUint32(0, true) - 2 - 4 - 2;
            dataBlock = []; // 수신 받은 데이터 블럭
            flagSessionNext = true;

            console.log(`dataLength: ${dataLength}`);
          }
        }
        break;

      case 2: // Data
        {
          dataBlock.push(data);

          if (indexReceiver == (dataLength - 1)) {
            crc16Block = []; // 수신 받은 데이터 블럭
            flagSessionNext = true;
          }
        }
        break;

      case 3: // CRC16
        {
          crc16Block.push(data);

          if (indexReceiver == 1) {
            flagComplete = true;
          }
        }
        break;

      default:
        {
          flagContinue = false;
        }
        break;
    }

    // 데이터 전송 완료 처리
    if (flagComplete) {
      const crc16 = new Uint8Array(crc16Block);
      const view = new DataView(crc16.buffer);
      crc16Received = view.getUint16(0, true);

      const startCodeArray = new Uint8Array([0x0a, 0x55]); // 2바이트 시작 코드
      const headerArray = new Uint8Array(headerBlock);
      const bodyArray = new Uint8Array(dataBlock);
      crc16Calculated = crc.crc16ccitt(Buffer.concat([startCodeArray, headerArray, bodyArray]));

      console.log(`BASE - Receiver - CRC16 - Calculated : ${crc16Calculated.toString(16).toUpperCase()}, Received : ${crc16Received.toString(16).toUpperCase()}`);
      if (crc16Calculated == crc16Received) {
        jsonBodyReceived = JSON.parse(new TextDecoder().decode(bodyArray.buffer));
        timeReceive = (new Date()).getTime();
      }

      flagContinue = false;
    }

    // 데이터 처리 결과에 따라 인덱스 변수 처리
    if (flagContinue) {
      if (flagSessionNext) {
        indexSession++;
        indexReceiver = 0;
      } else {
        indexReceiver++;
      }
    } else {
      indexSession = 0; // 수신 받는 데이터의 세션
      indexReceiver = 0; // 수신 받는 데이터의 세션 내 위치
    }
  }
}


/*
let strJsonOriginal = `
  {
    "dataType": "SENSOR",
    "param":
      [
        {
          "id": "motion",
          "desc": "동작",
          "value": "Ready"
        },
        {
          "id": "sensor1",
          "desc": "1번 센서",
          "value": 10
        },
        {
          "id": "sensor2",
          "desc": "2번 센서",
          "value": 20
        }
      ]
  }`;
  // */

//*
let strJsonOriginal = `
  {
    "dataType": "SENSOR",
    "param":
      [
        {
          "id": "motion",
          "desc": "1번 센서",
          "value": "Move"
        },
        {
          "id": "sensor1",
          "desc": "1번 센서",
          "value": 10
        },
        {
          "id": "sensor2",
          "desc": "2번 센서",
          "value": 20
        }
      ]
  }`;
// */

let jsonBody = JSON.parse(strJsonOriginal);
let strJson = JSON.stringify(jsonBody);

console.log(strJson);


const startCode = new Uint8Array([0x0a, 0x55]); // 2바이트 시작 코드
const jsonBytes = new TextEncoder().encode(JSON.stringify(jsonBody)); // JSON을 바이트 형태로 변환
const packetLength = 2 + 4 + jsonBytes.length + 2; // Start Code + Header(length 4 byte) + Data + CRC16
const packetLengthBytes = new Uint8Array(new Uint32Array([packetLength]).buffer); // 패킷 길이를 4바이트 빅엔디안으로 변환
const crc16 = crc.crc16ccitt(Buffer.concat([startCode, packetLengthBytes, jsonBytes]));
const crc16Bytes = new Uint8Array(new Uint16Array([crc16]).buffer); // CRC16을 2바이트 빅엔디안으로 변환

console.log(`packetLength: ${packetLength} / jsonBytes.length: ${jsonBytes.length} / crc16: ${crc16}`);


const packet = new Uint8Array(packetLength);
packet.set(startCode, 0);
packet.set(packetLengthBytes, 2);
packet.set(jsonBytes, 6);
packet.set(crc16Bytes, packetLength - 2);

// 결과 출력
console.log(convertByteArrayToHexString(packet));


receiveFromDevice(packet);


let strJson2 = JSON.stringify(jsonBodyReceived);
console.log(strJson2);


if (jsonBodyReceived != undefined &&
  jsonBodyReceived.dataType != undefined &&
  jsonBodyReceived.dataType == 'SENSOR' &&
  jsonBodyReceived.param != undefined &&
  jsonBodyReceived.param.length > 0) {
  jsonBodyReceived.param.forEach((sensor) => {
    //handler.write(sensor.id, sensor.value);
    console.log(`id: ${sensor.id}, value: ${sensor.value}`);
  });
}

const connect = document.getElementById('connect');
const disconnect = document.getElementById('disconnect');
const mode = document.getElementById('mode');
const fan = document.getElementById('fan');

const upArrow = document.getElementById('upArrow');
const downArrow = document.getElementById('downArrow');
const rightArrow = document.getElementById('rightArrow');
const leftArrow = document.getElementById('leftArrow');
const stopMotion = document.getElementById('stop')

const modeMonitor = document.getElementById('modeMonitor');
const fanMonitor = document.getElementById('fanMonitor');
const obstaclesEncountered = document.getElementById('obstaclesEncountered');



var lineChartData = [
  {
    label: "Series 1",
    values: []
  }
];

let terminal = new BluetoothTerminal();

window.automaticMode = false;
window.obstaclesEncountered = 0;

function modeChange() {
  if (mode.value == "Automatic") {
    window.automaticMode = true;
  } else if (mode.value == "Manual") {
    window.automaticMode = false;
  }
}

function getTimeValue() {
  var dateBuffer = new Date();
  var Time = dateBuffer.getTime()/3600 - 10000;
  return Time;
}

window.setInterval(function() {
  terminal.receive = function(data) {
    terminal.send('z');
   var centimeters = parseFloat(data.substring(1,4))/10;
   var modeReceiver = data.substring(0,1);
   var fanReceiver = data.substring(4,5);
   var newLineChartData = [{time: getTimeValue(), y:centimeters}];
   var obstaclesReceiver = data.substring(5);
   console.log(data);
   lineChartInstance.push(newLineChartData);
    if (modeReceiver == "A") {
      modeMonitor.innerHTML = "AUTOMATIC";
      modeMonitor.style.color = "green";
    } else {
      modeMonitor.innerHTML = "MANUAL"
      modeMonitor.style.color = "red";
    }

    if (fanReceiver == "I") {
      fanMonitor.innerHTML = "ON";
      fanMonitor.style.color = "green";
    } else {
      fanMonitor.innerHTML = "OFF"
      fanMonitor.style.color = "red";
    }
    obstaclesEncountered.innerHTML = obstaclesReceiver;
};
},1000);

var lineChartInstance = $('#lineChart').epoch({
  type: 'time.line',
  data: lineChartData,
  axes: ['bottom', 'left']
});

// Request the device for connection and get its name after successful connection.
connect.addEventListener("click", connectDevice);
function connectDevice() {
  terminal.connect().then(() => {
    alert(terminal.getDeviceName() + ' is connected!');
  });
}

// Disconnect from the connected device.
  disconnect.addEventListener("click", disconnectDevice);
  function disconnectDevice() {
    terminal.disconnect();
  }

//automatic operation
window.setInterval(function() {
  if (window.automaticMode == true) {
    terminal.send('p');
  }
},1000);

//manual operation
  upArrow.addEventListener("click", moveForward);
  function moveForward() {
    if (window.automaticMode == false) {
      terminal.send('e');
      setTimeout(function(){  terminal.send('a'); }, 100);
    }
  }
  downArrow.addEventListener("click", moveBackward);
  function moveBackward() {
    if (window.automaticMode ==false) {
      terminal.send('e');
      setTimeout(function(){  terminal.send('b'); }, 100);
    }
  }
  rightArrow.addEventListener("click", turnRight);
  function turnRight() {
    if (window.automaticMode == false) {
      terminal.send('e');
      setTimeout(function(){  terminal.send('c'); }, 100);
    }
  }
  leftArrow.addEventListener("click", turnLeft);
  function turnLeft() {
    if (window.automaticMode == false) {
      terminal.send('e');
      setTimeout(function(){  terminal.send('d'); }, 100);
    }
  }
  stopMotion.addEventListener("click", stopMovement);
  function stopMovement() {
    terminal.send('e');
    window.automaticMode = false;
  }
  window.fanStatus = false;
  fan.addEventListener("click", turnOnFan);
  function turnOnFan() {
    if (window.fanStatus == false) {
      terminal.send('f');
      fan.innerHTML = "Vaccuum Off";
      window.fanStatus = true;
    } else {
      terminal.send('g');
      window.fanStatus = false;
      fan.innerHTML = "Vaccuum On";
    }
  }

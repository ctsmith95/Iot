

function Iot(){
  this.xmlHttp = new XMLHttpRequest();
  this.sensors = [];
  this.sensor = null;

  this.initialize = function(){
      //Get all sensors
      //Load all the sensors

      //Just testing
      this.sensor = new Sensor("Node06",["value"],this.xmlHttp);
      this.xmlHttp.open('GET',"http://pi:8086/db/Iot/series?u=root&p=root&q=list series",false);
      this.xmlHttp.send(null);
      var data = this.xmlHttp.responseText;
      data = data.substring(1,data.length-1);// removes outer brackets preventing parsing
      //need to get a json handle on data
      jData = JSON.parse(data);
      sensorNames = data.points;
      //iterate over pair of sensor names and create sensor object 

  };

}
iot = new Iot();
iot.initialize();
$(document).ready(function () {

  $('#read').click(function(){
    console.log(iot.sensor.getCurrValue());
  });
});

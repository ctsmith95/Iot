

function Iot(){
  this.xmlHttp = new XMLHttpRequest();
  this.sensors = [];
  this.tempSensors = [];

  this.initialize = function(){
      //Get all sensors
      //Load all the sensors

      //Just testing
      this.xmlHttp.open('GET',"http://pi:8086/db/Iot/series?u=root&p=root&q=list series",false);
      this.xmlHttp.send(null);
      var data = this.xmlHttp.responseText;
      data = data.substring(1,data.length-1);// removes outer brackets preventing parsing
      //need to get a json handle on data
      jData = JSON.parse(data);
      var length = jData.points.length;
      for(var i = 0; i<length; i++){
        this.sensors.push(jData.points[i][1]);
        if(/Temperature/.test(this.sensors[i])){
          this.tempSensors.push(jData.points[i][1]);
     }

      }
      var instance = this;
      $('#data-view').load('templates/dataView.html',function(){
        var startData = instance.getPoint("value",instance.tempSensors[0]),
            temperature = startData.points[0][2],
            tempTime =  startData.points[0][0],
            sensorNumber = instance.tempSensors[0].match(/(\d+)/)[0],
            motionData = instance.getPoint("value","Motion"+sensorNumber),
            status = motionData.points[0][2],
            statusTime = motionData.points[0][0],
            batteryData = instance.getPoint("value","Battery"+sensorNumber),
            batteryAmount = batteryData.points[0][2],
            batteryTime = batteryData.points[0][0],
            mostRecent = Math.max(parseFloat(tempTime),parseFloat(statusTime),parseFloat(batteryTime)),
            updateTime = new Date(mostRecent);
        updateTime = updateTime.toString();

        $('#temp').text(temperature+"°C");
        if(status === 0){

          $('#status').text("Status: Clear");
        }
        else{
          $('#status').text("Status: Object Detected.");
        }
        $('#battery').text("Battery:"+batteryAmount+"%");
        $('#updated').text("Last Updated: "+updateTime);
      });


      $('#data-list').on('click','.sensor',function(event){

        var startData = instance.getPoint("value",event.target.dataset.name),
            temperature = startData.points[0][2],
            tempTime =  startData.points[0][0],
            sensorNumber = event.target.dataset.name.match(/(\d+)/)[0],
            motionData = instance.getPoint("value","Motion"+sensorNumber),
            status = motionData.points[0][2],
            statusTime = motionData.points[0][0],
            batteryData = instance.getPoint("value","Battery"+sensorNumber),
            batteryAmount = batteryData.points[0][2],
            batteryTime = batteryData.points[0][0],
            mostRecent = Math.max(parseFloat(tempTime),parseFloat(statusTime),parseFloat(batteryTime)),
            updateTime = new Date(mostRecent);
        updateTime = updateTime.toString();

        $('#temp').text(temperature+"°C");
        if(status === 0){
          $('#status').text("Status: Clear");
        }
        else{
          $('#status').text("Status: Object Detected.");
        }
        $('#battery').text("Battery:"+batteryAmount+"%");
        $('#updated').text("Last Updated: "+updateTime);
      });


      //iterate over pair of sensor names and create sensor object

  };

  this.generateSensorList = function(){
    var length = this.sensors.length;
    for (var i = 0; i<length; i++){


        if(/Temperature/.test(this.sensors[i])){
        $('#data-list').append('<a class = "list-group-item sensor" data-name="'+this.sensors[i]+'">'+this.sensors[i]+'</a>');
     }
    }
  };

  this.generateDataView = function(){

  };
  this.getPoint = function(fieldName,seriesName){
    this.xmlHttp.open('GET',"http://pi:8086/db/Iot/series?u=root&p=root&q=select "+fieldName+" from "+seriesName,false);
    this.xmlHttp.send(null);
    var data = this.xmlHttp.responseText;
    data = data.substring(1,data.length-1);// removes outer brackets preventing parsing
    //need to get a json handle on data
    jData = JSON.parse(data);
    return jData;
  };
}
iot = new Iot();
iot.initialize();
iot.generateSensorList();
iot.generateDataView();

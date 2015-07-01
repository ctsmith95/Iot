

function Iot(){
  this.xmlHttp = new XMLHttpRequest();
  this.sensors = [];
  this.tempSensors = [];
  this.default = "inspect";
  this.inspectView = null;
  this.tableView = null;
  this.graphView = null;
  this.reView = null;

  this.initialize = function(){
      //Load all the sensor names
      this.xmlHttp.open('GET',"http://pi:8086/db/Iot/series?u=root&p=root&q=list series",false);
      this.xmlHttp.send(null);
      var data = this.xmlHttp.responseText;
      data = data.substring(1,data.length-1);// removes outer brackets preventing parsing

      //need to get a json handle on data
      jData = JSON.parse(data);
      var length = jData.points.length;
      for(var i = 0; i<length; i++){
        this.sensors.push(jData.points[i][1]);

        if (/Temperature/.test(this.sensors[i])){ // Check whether it is a temperature sensor or motion sensor
          this.tempSensors.push(jData.points[i][1]);
     }

   }
      //iterate over pair of sensor names and create sensor object
      this.loadDefault();

  };

  this.loadDefault = function(){
    this.loadView(this.default);
  };

  //Pass a string to viewType to setup a certain type of view
  this.loadView = function(viewType){
    switch(viewType){
      case "inspect":
        this.loadInspect();
        break;
      case "table":
        this.loadTable();
        break;
      case "graph":
        this.loadGraph();
        break;
      case "review":
        this.loadReview();
        break;
    }

  };

  this.loadInspect = function(){
    var instance = this;
    $('#data-view').load('templates/dataView.html',function(){
      instance.updateLoadView(instance.tempSensors[0]);
    });
    $('#data-list').on('click','.sensor',function(event){
        instance.updateLoadView(event.target.dataset.name);
    });

  };

  this.updateLoadView = function(sensorName){
    var instance = this,
        startData = instance.getPoint("value",sensorName),
        temperature = startData.points[0][2],
        tempTime =  startData.points[0][0],
        sensorNumber = sensorName.match(/(\d+)/)[0],
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
  };

  this.loadTable = function(){

  };
  this.loadGraph = function(){

  };
  this.loadReview = function(){
  };


  this.generateSensorList = function(){
    var length = this.sensors.length;
    for (var i = 0; i<length; i++){
      if(/Temperature/.test(this.sensors[i])){
        $('#data-list').append('<a class = "list-group-item sensor" data-name="'+this.sensors[i]+'">'+ '<input type="checkbox" aria-label="..." class = "data-check">  '+this.sensors[i]+'</a>');
     }
    }
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

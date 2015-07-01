

function Iot(){
  this.xmlHttp = new XMLHttpRequest();
  this.sensors = [];
  this.tempSensors = [];
  this.default = "inspect";
  this.inspectView = null;
  this.tableView = null;
  this.graphView = null;
  this.reView = null;
  this.selectedNode = null;
  this.currentView = null;
  var instance = this;

  this.initialize = function(){
    //hides all the views before initializing
    this.hideAllViews();


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


    //Loads the default view given by this.default
    this.loadDefault();

    //Setup Navbar to load different views
    var instance = this;
    $('.navbutton').click(function(event){
      instance.loadView($(this).attr('id'));
    });




  };

  this.hideAllViews = function(){
    $('.sense-view').hide("fast");
    $("#temperature-table").hide();
    $('#motion-table').hide();
  };
  this.loadDefault = function(){
    this.loadView(this.default);
  };

  //Pass a string to viewType to setup a certain type of view
  this.loadView = function(viewType){
    $('#data-list').unbind();
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
    //var instance = this;
    if (this.currentView == "inspect"){
      return;
    }
    this.hideAllViews();
    $('#inspect-view').show(function(){
    if (instance.selectedNode === null){
      instance.selectedNode = instance.tempSensors[0];
      instance.updateInspectView(instance.tempSensors[0]);
    }
    else{
      instance.updateInspectView(instance.selectedNode);
    }
    instance.currentView = "inspect";
    });
    $('#data-list').on('click','.sensor',function(event){
        instance.selectedNode = event.target.dataset.name;
        instance.updateInspectView(event.target.dataset.name);
    });


  };


  this.updateInspectView = function(sensorName){

    var startData = instance.getPoint("value",sensorName),
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

    $('#name').text("Sensor: "+sensorName);
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
    if (this.currentView == "table"){
      return;
    }
    this.hideAllViews();
    $('#table-view').show(function(){
      if (instance.selectedNode === null){
        instance.selectedNode = instance.tempSensors[0];
        instance.updateTableView(instance.tempSensors[0]);
      }
      else{
        instance.updateTableView(instance.selectedNode);
      }
    });
    $('#data-list').on('click','.sensor',function(event){
        instance.selectedNode = event.target.dataset.name;
        instance.updateTableView(event.target.dataset.name);
    });
    this.currentView = "table";

  };


//TODO clean this up!!!
  this.updateTableView = function(sensorName) {
    var allDataRaw = instance.getData("value",instance.selectedNode),
        allData = [],
        allMotionRaw = instance.getData("value","Motion"+instance.getSensorNumber(instance.selectedNode)),
        allMotion = [];

    //parse only needed pieces of data (time and temperature)
    allDataRaw.forEach(function(element, index, array) {
      var time = new Date(element[0]);
      var temp = [time, element[2]];
      allData.push(temp);
    });


    allMotionRaw.forEach(function(element, index, array) {
      var yesOrNo;
      if (element[2] === 0) {
        yesOrNo = 'Object Detected';
      }
      else {
        yesOrNo = 'Clear';
      }
      var time = new Date(element[0]);
      var temp = [time, yesOrNo];
      allMotion.push(temp);
    });
    //tablename is temp, ""2 is motion
    $('#tableName').text(sensorName);
    $('#tableName2').text("Motion"+instance.getSensorNumber(instance.selectedNode));

    //clear existing table (if there is one)
    $('#temperature-table').html('<thead><tr><th>Time</th><th>Temperature</th></tr></thead>');

    //populate table with values
    allData.forEach(function(element, index, array) {
      $('#temperature-table').append('<tr id = "table-element"><td>' + element[0] + '</td><td>' + element[1] + '</td></tr>');
    });


    $('#temperature-table').show();




    $('#motion-table').html('<thead><tr><th>Time</th><th>Motion Status</th></tr></thead>');

    //populate table with values
    allMotion.forEach(function(element, index, array) {
      $('#motion-table').append('<tr id = "table-element"><td>' + element[0] + '</td><td>' + element[1] + '</td></tr>');
    });


    $('#motion-table').show();



  };

  this.loadGraph = function(){
    if (this.currentView == "graph"){
      return;
    }
    this.hideAllViews();
    $('#graph-view').show(function(){

    });
    this.currentView = "graph";



  };

  //NOTE this will need to get resolved on the rebase
  this.getSensorNumber = function(sensor) {
    return sensor.match(/(\d+)/)[0];
  };

  this.loadReview = function(){
    if (this.currentView == "review"){
      return;
    }
    this.hideAllViews();
    $('#review-view').show(function(){

  });
  this.currentView = "review";

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
  this.getData = function(fieldName,seriesName){
    var jdata = this.getPoint(fieldName,seriesName);
    var length = jdata.points.length;
    var data = [];
    for(var i = 0; i<length;i++){
      data.push(jdata.points[i]);

    }
    return data;
  };
}
iot = new Iot();
iot.initialize();
iot.generateSensorList();



function Sensor(name,fieldValues,xmlHttp){
  this.xmlHttp = xmlHttp;
  this.sensorName = name;
  this.sensorFields = fieldValues.join(",");
  this.sensorValues = [];
  this.currentValue = null;

  this.getCurrValue = function(){
    this.poll();
    if(this.sensorValues.length === 0){
      console.error("No values to get...");
    }
    else{
    this.currentValue = this.sensorValues[0];
    return this.currentValue;
    }

  };

  this.getValues = function(){
    this.poll();
    if(this.sensorValues.length === 0){
      console.error("No values to get...");
    }
    else{
      return this.sensorValues();
    }
  };

  this.poll = function(){
    var query = "select "+this.sensorFields+" from "+this.sensorName;
    this.xmlHttp.open('GET',"http://pi:8086/db/Iot/series?u=root&p=root&q="+query,false);
    this.xmlHttp.send(null);
    var data = this.xmlHttp.responseText;
    data = data.substring(1,data.length-1);// removes outer brackets preventing parsing
    //need to get a json handle on data
    jData = JSON.parse(data);
    this.sensorValues = jData.points;
    this.currentValue = this.sensorValues[0];

  };


}

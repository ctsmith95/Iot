
function Analytics(sensorList,dataRetriever){
  this.sensors = sensorList;
  this.dataRetriever = dataRetriever;

  this.mode = "descending";



  this.getAverages = function(){
    var averages = [];
    var length = this.sensors.length;
    for(var i = 0;i < length; i++){
      averages.push([this.sensors[i],this.getAverage(this.dataRetriever(this.sensors[i]))]);
    }
    var temp;
    for(var j = 1;j < length; j++){
       k = j-1;
      temp = averages[j][1];
      while(averages[j][1] > averages[k][1] && k >= 0){
        averages[i] = averages[j];
      }
    }


  };
  this.getAverage = function(sensorData){
    var length = sensorData.points.length;
    var total = 0;
    for(var i = 0; i < length; i++){
      total += parseInt(sensorData.points[i][2]);
    }
    return total/length;
  };




}

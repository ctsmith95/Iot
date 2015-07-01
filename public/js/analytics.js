
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
    for(var i = 1;i < length; i++){
      j = i-1;
      temp = averages[i][1];
      while(averages[i][1] > averages[j][1] && j >= 0){
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

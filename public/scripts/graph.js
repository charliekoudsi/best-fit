var ctx = document.getElementById("myChart").getContext('2d');
var xLabel = {
  display: true,
  labelString: "x-axis",
  fontColor: "red",
  fontFamily: "system-ui",
  fontSize: 14
};
var yLabel = {
  display: true,
  labelString: "y-axis",
  fontColor: "red",
  fontFamily: "system-ui",
  fontSize: 14
}

var myChart = new Chart(ctx, {
  type: 'scatter',
  options: {
    scales: {
      xAxes: [{
        type: 'linear',
        position: 'bottom',
        ticks: {
          max: 10,
          min: -10,
          stepSize: 1,
        },
        scaleLabel: xLabel
      }],
      yAxes: [{
        type: 'linear',
        ticks: {
          max: 10,
          min: -10,
          stepSize: 1,
          callback: function(value, index, values) {
            if (value % 1 === 0) {
              return value;
            } else {
              return;
            }
          }
        },
        scaleLabel: yLabel
      }]
    }
  }
});


function getMin(list, axis) {
  var points = list.datasets[0].data;
  var min = list.datasets[0].data[0][axis];
  for (var i = 1; i < points.length; i++) {
    if (list.datasets[0].data[i][axis] < min) {
      min = list.datasets[0].data[i][axis];
    }
  }
  return min;
}

function getMax(list, axis) {
  var points = list.datasets[0].data;
  var max = list.datasets[0].data[0][axis];
  for (var i = 1; i < points.length; i++) {
    if (list.datasets[0].data[i][axis] > max) {
      max = list.datasets[0].data[i][axis];
    }
  }
  return max;
}

function calcMean(list) {
  var xTotal = 0;
  var yTotal = 0;
  for (var i = 0; i < list.length; i++) {
    xTotal += list[i][0];
    yTotal += list[i][1];
  }
  var xBar = xTotal / list.length;
  var yBar = yTotal / list.length;
  return [xBar, yBar];
}

function calcDeviation(list) {
  var data = list.datasets[0].data
  var averages = calcMean(list);
  var sx = 0;
  var sy = 0;
  var xDiff = 0;
  var yDiff = 0;
  for (var i = 0; i < list.length; i++) {
    xDiff += (list[i][0] - averages[0]) * (list[i][0] - averages[0]);
    yDiff += (list[i][1] - averages[1]) * (list[i][1] - averages[1]);
  }
  sx = xDiff / (list.length - 1);
  sy = yDiff / (list.length - 1);
  sx = Math.sqrt(sx);
  sy = Math.sqrt(sy);
  return [sx, sy];
}

deviation = calcDeviation(data)

Chart.pluginService.register({
  beforeInit: function(chart) {
    // We get the chart data
    var data = chart.config.data;
    var f = data.datasets[0].function;

    // For every dataset ...
    for (var i = 0; i < data.datasets.length; i++) {

      // For every label ...
      for (var j = 0; j < data.datasets[0].data.length; j++) {

        // We get the dataset's function and calculate the value
        var fct = data.datasets[i].function,
          x = data.datasets[0].data[j].x,
          x = fct(x);
        // Then we add the value to the dataset data
        data.datasets[i].data[j].x = x;
      }
    }
  }
});



var myChart = new Chart(ctx, {
  type: 'scatter',
  responsive: false,
  showXLabels: 5,
  data: data,
  options: {
    scales: {
      xAxes: [{
        type: 'linear',
        position: 'bottom',
        ticks: {
          max: 20,
          min: -5,
          stepSize: 5,
        },
        scaleLabel: {
          display: true,
          labelString: "x-axis",
          fontColor: "red",
          fontFamily: "system-ui",
          fontSize: 14
        }
      }],
      yAxes: [{
        type: 'linear',
        ticks: {
          max: 100,
          min: -10,
          stepSize: 1,
          maxTicksLimit: 5,
          callback: function(value, index, values) {
            if (value % 10 === 0) {
              return value;
            } else {
              return;
            }
          }
        },
        scaleLabel: {
          display: true,
          labelString: "y-axis",
          fontColor: "red",
          fontFamily: "system-ui",
          fontSize: 14
        }
      }]
    }
  }
});

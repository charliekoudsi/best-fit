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

function getMin(list, axis) {
  var min = list[0][axis];
  for (var i = 1; i < list.length; i++) {
    if (list[i][axis] < min) {
      min = list[i][axis];
    }
  }
  return min;
}

var l = [{
    x: 1,
    y: 1
  },
  {
    x: 2,
    y: 2,
  },
  {
    x: 3,
    y: 4
  }
]

function getMax(list, axis) {
  var max = list[0][axis];
  for (var i = 1; i < list.length; i++) {
    if (list[i][axis] > max) {
      max = list[i][axis];
    }
  }
  return max;
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

var dataPoints = 3;
$("button.btn-primary").click(function() {
  dataPoints++;
  var xLabel = "x" + dataPoints;
  var yLabel = "y" + dataPoints;
  var newPoint = `
      <div class="form-row">
        <label class = "col-4 col-form-label">Data Point ` + dataPoints + `:</label>
        <div class="col-4">
          <label class="sr-only" for="` + xLabel + `">x-value</label>
          <input type="text" class="form-control mb-2 mb-sm-0" id="` + xLabel + `" placeholder="x-value">
        </div>
        <div class="col-4">
          <label class="sr-only" for="` + yLabel + `">y-value</label>
          <input type="text" class="form-control mb-2 mb-sm-0" id="` + yLabel + `" placeholder="y-value">
        </div>
      </div>`
  $("#firstButtons").before(newPoint);
});

function calcMean(list) {
  var xTotal = 0;
  var yTotal = 0;
  for (var i = 0; i < list.length; i++) {
    xTotal += list[i].x;
    yTotal += list[i].y;
  }
  var xBar = xTotal / list.length;
  var yBar = yTotal / list.length;
  return [xBar, yBar];
}

function calcDeviation(list) {
  var averages = calcMean(list);
  var sx = 0;
  var sy = 0;
  var xDiff = 0;
  var yDiff = 0;
  for (var i = 0; i < list.length; i++) {
    xDiff += (list[i].x - averages[0]) * (list[i].x - averages[0]);
    yDiff += (list[i].y - averages[1]) * (list[i].y - averages[1]);
  }
  sx = xDiff / (list.length - 1);
  sy = yDiff / (list.length - 1);
  sx = Math.sqrt(sx);
  sy = Math.sqrt(sy);
  return [sx, sy];
}

$("button.btn-success").click(function() {
  var numDataPoints = $(".form-row .col-4:nth-child(2) input").length;
  var dataPoints = [];
  for (var i = 1; i <= numDataPoints; i++) {
    var point = {
      x: parseFloat($("#x" + i).val()),
      y: parseFloat($("#y" + i).val())
    }
    dataPoints.push(point);
  }
  var xMax = getMax(dataPoints, "x");
  var xMin = getMin(dataPoints, "x");
  var yMax = getMax(dataPoints, "y");
  var yMin = getMin(dataPoints, "y");
  var deviations = calcDeviation(dataPoints);
  var data = {
    datasets: [{
      label: 'Data',
      backgroundColor: "black",
      pointBackgroundColor: "black",
      showLine: false,
      showXLabels: 5,
      fill: false,
      data: dataPoints,
      borderColor: "black",
    }]
  };
  myChart = new Chart(ctx, {
    type: "scatter",
    options: {
      scales: {
        xAxes: [{
          type: 'linear',
          position: 'bottom',
          ticks: {
            max: xMax + deviations[0],
            min: xMin - deviations[0],
            stepSize: 1,
          },
          scaleLabel: xLabel
        }],
        yAxes: [{
          type: 'linear',
          ticks: {
            max: yMax + deviations[1],
            min: yMin - deviations[1],
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
    },
    data: data
  })
});

$("button.btn-danger").click(function() {
  var numDataPoints = $(".form-row .col-4:nth-child(2) input").length;
  var dataPoints = [];
  for (var i = 1; i <= numDataPoints; i++) {
    var point = {
      x: parseFloat($("#x" + i).val()),
      y: parseFloat($("#y" + i).val())
    }
    dataPoints.push(point);
  }
  var line = calcLine(dataPoints);
  console.log(line);

  console.log(bestFitData);
  var deviations = calcDeviation(dataPoints);
  var xMax = getMax(dataPoints, "x") + deviations[0];
  console.log(xMax);
  var xMin = getMin(dataPoints, "x") - deviations[0];
  var yMax = getMax(dataPoints, "y") + deviations[1];
  var yMin = getMin(dataPoints, "y") - deviations[1];
  var bestFitData = [
    {
      x: xMin,
      y: xMin * line[0] + line[1]
    },
    {
      x: xMax,
      y: xMax * line[0] + line[1]
    }
  ]
  var data = {
    datasets: [{
      label: 'Data',
      backgroundColor: "black",
      pointBackgroundColor: "black",
      showLine: false,
      showXLabels: 5,
      fill: false,
      data: dataPoints,
      borderColor: "black",
    }, {
      label: "Best Fit Line",
      backgroundColor: "red",
      pointBackgroundColor: "red",
      borderColor: "red",
      showLine: true,
      fill: false,
      data: bestFitData
    }]
  };
  myChart = new Chart(ctx, {
    type: "scatter",
    options: {
      scales: {
        xAxes: [{
          type: 'linear',
          position: 'bottom',
          ticks: {
            max: xMax,
            min: xMin,
            stepSize: xMax / 10,
          },
          scaleLabel: xLabel
        }],
        yAxes: [{
          type: 'linear',
          ticks: {
            max: yMax,
            min: yMin,
            stepSize: yMax / 10,
          },
          scaleLabel: yLabel
        }]
      }
    },
    data: data
  })
})

function calcCorr(list) {
  var averages = calcMean(list);
  var deviations = calcDeviation(list);
  var zx = [];
  var zy = [];
  for (var i = 0; i < list.length; i++) {
    var zxi = (list[i].x - averages[0]) / deviations[0];
    zx.push(zxi);
    var zyi = (list[i].y - averages[1]) / deviations[1];
    zy.push(zyi);
  }
  var zxzy = 0;
  for (var i = 0; i < zx.length; i++) {
    zxzy += zx[i] * zy[i];
  }
  return Math.abs(zxzy / (list.length - 1));
}

function square(list) {
  var linearized = [];
  for (var i = 0; i < list.length; i++) {
    linearized.push([list[i].x * list[i].x, list[i].y]);
  }
  return linearized;
}

function inverse(list) {
  var linearized = [];
  for (var i = 0; i < list.length; i++) {
    if (list[i][0] == 0) {
      linearized.push([0, list[i].y]);
    } else {
      linearized.push([1 / list[i].x, list[i].y]);
    }
  }
  return linearized;
}

function root(list) {
  var linearized = [];
  for (var i = 0; i < list.length; i++) {
    linearized.push([Math.sqrt(list[i].x), list[i].y]);
  }
  return linearized;
}

function linearize(list) {
  var squared = square(list);
  var inversed = inverse(list);
  var rooted = root(list);
  var sqR = calcCorr(squared);
  var invR = calcCorr(inversed);
  var rtR = calcCorr(rooted);
  var counter = findMax(sqR, invR, rtR);
  if (counter === 0) {
    list = squared;
  } else if (counter === 1) {
    console.log();
    list = inversed;
  } else {
    list = rooted;
  }
  console.log(list);
  return list;
}

function findMax(a, b, c) {
  var counter;
  if (a > b) {
    max = a;
    counter = 0;
  } else {
    max = b;
    counter = 1;
  }
  if (c > max) {
    counter = 2;
  }
  return counter;
}


function calcLine(list) {
  var xy = 0;
  var x = 0;
  var y = 0;
  var x2 = 0;
  for (var i = 0; i < list.length; i++) {
    xy += list[i].x * list[i].y;
    x += list[i].x;
    y += list[i].y;
    x2 += (list[i].x * list[i].x);
  }
  var num = list.length * xy - x * y;
  var denom = list.length * x2 - x * x;
  var m = num / denom;
  var b = (y - m * x) / list.length;
  return [m, b]
}

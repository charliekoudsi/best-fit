var ctx = document.getElementById("myChart").getContext('2d');
var plotted = 0;
var xLabel = {
  display: true,
  labelString: "x-axis",
  fontColor: "red",
  fontFamily: "system-ui",
  fontSize: 16
};
var yLabel = {
  display: true,
  labelString: "y-axis",
  fontColor: "red",
  fontFamily: "system-ui",
  fontSize: 16
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
    x: 4,
    y: 2,
  },
  {
    x: 9,
    y: 3
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
    xTotal += list[i]["x"];
    yTotal += list[i]["y"];
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
    xDiff += (list[i]["x"] - averages[0]) * (list[i]["x"] - averages[0]);
    yDiff += (list[i]["y"] - averages[1]) * (list[i]["y"] - averages[1]);
  }
  sx = xDiff / (list.length - 1);
  sy = yDiff / (list.length - 1);
  sx = Math.sqrt(sx);
  sy = Math.sqrt(sy);
  return [sx, sy];
}

$("button.btn-success").click(function() {
  var alerted = false;
  if (plotted === 1) {
    myChart.data.datasets.forEach((dataset) => {
      dataset.data.pop();
    });
    myChart.update();
  }
  plotted = 1;
  var numDataPoints = $(".form-row .col-4:nth-child(2) input").length;
  var dataPoints = [];
  for (var i = 1; i <= numDataPoints; i++) {
    var point = {
      x: parseFloat($("#x" + i).val()),
      y: parseFloat($("#y" + i).val())
    }
    if (isNaN(point.x) && !isNaN(point.y)) {
      alert("Missing x-value for Data Point " + i);
      alerted = true;
    }
    if (!isNaN(point.x) && !isNaN(point.y)) {
        dataPoints.push(point);
    }
  }
  if (dataPoints.length < 3) {
    alert("You must provide at least 3 data points");
    alerted = true;
  }
  if (alerted === false) {
    var deviations = calcDeviation(dataPoints);
    var xMax = getMax(dataPoints, "x") + deviations[0];
    var xMin = getMin(dataPoints, "x") - deviations[0];
    var yMax = getMax(dataPoints, "y") + deviations[1];
    var yMin = getMin(dataPoints, "y") - deviations[1];
    var data = {
      datasets: [{
        label: 'Data',
        backgroundColor: "black",
        pointBackgroundColor: "black",
        showLine: false,
        fill: false,
        data: dataPoints,
        borderColor: "black",
      }]
    };
    myChart.config.data = data;
    myChart.config.options.scales.xAxes[0].ticks.max = xMax;
    myChart.config.options.scales.xAxes[0].ticks.min = xMin;
    myChart.config.options.scales.xAxes[0].ticks.stepSize = (xMax - xMin) / 10;
    myChart.config.options.scales.yAxes[0].ticks.max = yMax;
    myChart.config.options.scales.yAxes[0].ticks.min = yMin;
    myChart.config.options.scales.yAxes[0].ticks.stepSize = (yMax - yMin) / 10;
    myChart.update();
  }
});

$("button.btn-danger").click(function() {
  if (plotted === 0) {
    alert("You must first plot the data")
  } else {
    myChart.data.datasets.forEach((dataset) => {
      dataset.data.pop();
    });
    myChart.update();
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
    var deviations = calcDeviation(dataPoints);
    var xMax = getMax(dataPoints, "x") + deviations[0];
    var xMin = getMin(dataPoints, "x") - deviations[0];
    var yMax = getMax(dataPoints, "y") + deviations[1];
    var yMin = getMin(dataPoints, "y") - deviations[1];
    var r = calcCorr(dataPoints);
    var operation = "+";
    if (line[1] < 0) {
      operation = "-";
    }
    var bestFitData = [{
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
          label: "Data",
          backgroundColor: "black",
          pointBackgroundColor: "black",
          borderColor: "black",
          showLine: false,
          fill: false,
          data: dataPoints
        },
        {
          label: "Best Fit Line",
          backgroundColor: "red",
          pointBackgroundColor: "red",
          pointRadius: 0,
          borderColor: "red",
          showLine: true,
          fill: false,
          data: bestFitData
        }
      ]
    };
    myChart.config.data = data;
    myChart.config.options.scales.xAxes[0].ticks.max = xMax;
    myChart.config.options.scales.xAxes[0].ticks.min = xMin;
    myChart.config.options.scales.xAxes[0].ticks.stepSize = (xMax - xMin) / 10;
    myChart.config.options.scales.yAxes[0].ticks.max = yMax;
    myChart.config.options.scales.yAxes[0].ticks.min = yMin;
    myChart.config.options.scales.yAxes[0].ticks.stepSize = (yMax - yMin) / 10;
    myChart.update();
    $(".col-12 h4").text("Unlinearized Best Fit Line");
    $("#bestFitLabel").text("Best Fit Equation:");
    if (line[1] !== 0) {
      $("#bestFitEquation").text("y = " + line[0] + "x " + operation + " " + Math.abs(line[1]));
    } else {
      $("#bestFitEquation").text("y = " + line[0] + "x");
    }
    $("#rLabel").text("Correlation (r):");
    $("#rValue").text("r = " + r);
  }
})

$("button.btn-warning").click(function() {
  if (plotted === 0) {
    alert("You must first plot the data")
  } else {
    myChart.data.datasets.forEach((dataset) => {
      dataset.data.pop();
    });
    myChart.update();
    var numDataPoints = $(".form-row .col-4:nth-child(2) input").length;
    var dataPoints = [];
    for (var i = 1; i <= numDataPoints; i++) {
      var point = {
        x: parseFloat($("#x" + i).val()),
        y: parseFloat($("#y" + i).val())
      }
      dataPoints.push(point);
    }
    var linearized = linearize(dataPoints);
    printed = linearized[1];
    linearized = linearized[0];
    var line = calcLine(linearized);
    var deviations = calcDeviation(linearized);
    var xMax = getMax(linearized, "x") + deviations[0];
    var xMin = getMin(linearized, "x") - deviations[0];
    var yMax = getMax(linearized, "y") + deviations[1];
    var yMin = getMin(linearized, "y") - deviations[1];
    var r = calcCorr(linearized);
    var operation = "+";
    if (line[1] < 0) {
      operation = "-";
    }
    var bestFitData = [{
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
          label: "Linearized Data",
          backgroundColor: "black",
          pointBackgroundColor: "black",
          borderColor: "black",
          showLine: false,
          fill: false,
          data: linearized
        },
        {
          label: "Linearized Best Fit",
          backgroundColor: "red",
          pointBackgroundColor: "red",
          pointRadius: 0,
          borderColor: "red",
          showLine: true,
          fill: false,
          data: bestFitData
        }
      ]
    };
    myChart.config.data = data;
    myChart.config.options.scales.xAxes[0].ticks.max = xMax;
    myChart.config.options.scales.xAxes[0].ticks.min = xMin;
    myChart.config.options.scales.xAxes[0].ticks.stepSize = (xMax - xMin) / 10;
    myChart.config.options.scales.yAxes[0].ticks.max = yMax;
    myChart.config.options.scales.yAxes[0].ticks.min = yMin;
    myChart.config.options.scales.yAxes[0].ticks.stepSize = (yMax - yMin) / 10;
    myChart.update();
    $(".col-12 h4").text("Linearized Best Fit Line");
    $("#bestFitLabel").text("Best Fit Equation:");
    if (line[1] !== 0) {
      $("#bestFitEquation").html("y = " + line[0] + printed + " " + operation + " " + Math.abs(line[1]));
    } else {
      $("#bestFitEquation").html("y = " + line[0] + printed);
    }
    $("#rLabel").text("Correlation (r):");
    $("#rValue").text("r = " + r);
  }
})

function calcCorr(list) {
  var averages = calcMean(list);
  var deviations = calcDeviation(list);
  var zx = [];
  var zy = [];
  for (var i = 0; i < list.length; i++) {
    var zxi = (list[i]["x"] - averages[0]) / deviations[0];
    zx.push(zxi);
    var zyi = (list[i]["y"] - averages[1]) / deviations[1];
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
    linearized.push({
      x: list[i]["x"] * list[i]["x"],
      y: list[i]["y"]
    });
  }
  return linearized;
}

function inverse(list) {
  var linearized = [];
  for (var i = 0; i < list.length; i++) {
    if (list[i][0] == 0) {
      linearized.push({
        x: 0,
        y: list[i].y
      });
    } else {
      linearized.push({
        x: 1 / list[i].x,
        y: list[i].y
      });
    }
  }
  return linearized;
}

function root(list) {
  var linearized = [];
  for (var i = 0; i < list.length; i++) {
    linearized.push({
      x: Math.sqrt(list[i].x),
      y: list[i].y
    });
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
  var printed = "";
  if (counter === 0) {
    list = squared;
    printed = "x<sup>2</sup>";
  } else if (counter === 1) {
    list = inversed;
    printed = "<sup>1</sup>&frasl;<sub>x</sub>";
  } else {
    list = rooted;
    printed = "&#8730;x";
  }
  console.log(list);
  return [list,printed];
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

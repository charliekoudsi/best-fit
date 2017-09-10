var dataPoints = 3;
$("button").click(function() {
  console.log("hi")
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
  $("form").append(newPoint);
});

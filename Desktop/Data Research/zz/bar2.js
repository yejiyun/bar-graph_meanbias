

function draw(order) {
  document.getElementById("myGraph").innerHTML = '';

  var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = 450 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom

  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
      .range([0, height]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("top");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var svg = d3.select("#myGraph").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      // .attr("transform", "translate (500,500) rotate(180)");

  // svg.append("g")
  //   .attr("transform", "rotate(45 50 50)");


  var barWidth = 30;
  var barMargin = 10;

  svg.append("rect")
    .attr({
      class: "overlay",
      width: width,
      height: height
    })
    .style('fill', 'white');
  
svg.on('click', function clicked(d, i) {
      if (d3.event.defaultPrevented) return // dragged

      var line = svg.selectAll('line')
      var yPos = d3.mouse(this)[1]

      y.invert(height - yPos);

      if (line && line.length && (line[0].length > 0)) {
        svg.selectAll('line').remove()
      }

      svg.append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', yPos)
        .attr('y2', yPos)
        .style('stroke', '#000');

      console.log(y.invert(yPos));

      window.results[order] = y.invert(yPos);
    }
  );

  d3.json("barMinus2.json",  function(error, data) {
    x.domain(data.map(function(d){ return d.values}))
    y.domain([0, -15]);

    svg.append("g")
      .attr("class", "x axis")
      // .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

    console.log(data.length);
    console.log(order);

    if (data.length <= order) {
      console.save(window.results);
      alert("수고하셨습니다");
      return;
    }
      
    var allRects = svg.selectAll("rect")
        .data(data[order].values)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d, i) {
          return (barWidth + barMargin) * i;
        })
        .attr("width", barWidth)
        .attr("y", function(d) { 
          return y(0);
        })
        .attr("height", function(d) { return y(d.values) });
  })
}





function dragged(d) {
	d[0] = d3.event.x, d[1] = d3.event.y;
	if (this.nextLine) this.parentLine.appendChild(this);
	d3.select(this).attr("transform", "translate(" + d + ")");
}





function type(d) {
  d.values = +d.values
  return d
}

//load nextData with duration

var inter = setInterval(function(){
            nextData();
}, 2000);


// draw graph in another new window
window.results = {};
window.order = 0;

function nextData() { 
  window.order++;
  draw(window.order);
}

draw(window.order);



(function(console){
    console.save = function(data){
    var filename = 'console.json';

    if(typeof data === "object"){
      data = JSON.stringify(data, undefined, 4)
    }

    var blob = new Blob([data], {type: 'text/json'}),
      e    = document.createEvent('MouseEvents'),
      a    = document.createElement('a')

    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    a.dispatchEvent(e)
}})(console)


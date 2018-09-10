

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




  // svg.append("circle")
  //   .attr({
  //     width: width,
  //     height: height
  //   })
  //   .style('fill', 'blue');
  





  d3.json("dot1.json",  function(error, data) {
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
    
  var circleMargin = 30;
  var circleWidth = 2.5;


    var allCircles = svg.selectAll(".circle")
        .data(data[order].values)
        .enter()
        .append("circle")
        .attr("class", "circle")
        .attr("r", 5);
        //cx is the x position value of the center of the circle
    allCircles.attr("cx", function(d, i) {
          return (circleWidth + circleMargin) * i;
        })
        //.attr("width", Width)
        //cy is the y position value of the center of each circle
        .attr("cy", function(d) { return y(d.values)
        })
        //.attr("height", function(d) { return y(d.values) });
        .style("fill", "blue");
  })
}


//x(width + margin) * i;






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


// 그래프 설정 변수
const colorsArray = ['#E3E3E3','#6D6D6D'];

// 전역 변수들
let result = []; // 이 변수에 사용자가 선택한 값들을 저장

const margin = {top: 20, right: 20, bottom: 30, left: 40};
const width = 450 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;  

//Set up scales
const xScale = d3.scale.ordinal()
    .domain(d3.range(8))
    .rangeRoundBands([0, width], 0.05);

const yScale = d3.scale.linear()
    .domain([0, 35])
    .range([0, 300]);

function draw(){    
    const svg = d3.select("#myGraph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("transform", "translate (75,600) rotate(-90)");

    svg.append("rect")
        .attr({
          class: "overlay",
          width: width,
          height: height
        })
        .style('fill', 'white');
    
    svg.on('click', function clicked(d, i) {
        svg.selectAll('line.choose')
            .remove();
        
        const line = svg.selectAll('line');
        const yPos = d3.mouse(this)[1];
        
        svg.append('line')
            .attr('class', 'choose')
            .attr('x1', 0)
            .attr('x2', width)
            .attr('y1', yPos)
            .attr('y2', yPos)
            .style('stroke', '#000');
    });
    
    // set up axis
    const xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("top");

    const yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("right");

    svg.append("g")
        .attr("class", "xAxis")
        .call(xAxis);

    svg.append("g")
        .attr("class", "yAxis")
        .call(yAxis);

    // 초기 데이터
    const data = [
        [
            {x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 3, y: 0}, 
            {x: 4, y: 0}, {x: 5, y: 0}, {x: 6, y: 0}, {x: 7, y: 0} 
        ], 
        [
            {x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 3, y: 0}, 
            {x: 4, y: 0}, {x: 5, y: 0}, {x: 6, y: 0}, {x: 7, y: 0} 
        ]
    ];
    
    const stack = d3.layout.stack();
    
    const colors = function(i){
        return colorsArray[i];
    };
    
    dataset = stack(data);
    
    // Add a group for each row of data
    const groups = svg.selectAll("g.rectGroups")
        .data(dataset)
        .enter()
        .append("g")
        .attr('class', 'rectGroups')
        .style("fill", function(d, i) { return colors(i); });

    // Add a rect for each data value
    //y0는 기준값으로 카테고리의 이전 값을 모두 합한 값과 같다.
    const rects = groups.selectAll("rect")
        .data(function (d) {
            return d;
        })
        .enter()
        .append("rect")
        .attr("x", function (d, i) {
            return xScale(i);
        })
        .attr("y", function (d) {
            return yScale(d.y0);
        })
        .attr("height", function (d) {
            return yScale(d.y);
        })
        .attr("width", xScale.rangeBand());
}

function update(dataset){
    const svg = d3.select("#myGraph");
    const stack = d3.layout.stack();

    dataset = stack(dataset);
    
    const groups = svg.selectAll("g.rectGroups")
        .data(dataset)

    const rects = groups.selectAll("rect")
        .data(function (d) {
            return d;
        })
        .attr("x", function (d, i) {
            return xScale(i)
        })
        .attr("y", function (d) {
            return yScale(d.y0);
        })
        .attr("height", function (d) {
            return yScale(d.y);
        })
        .attr("width", xScale.rangeBand());
}

// 사용자가 선택한 라인의 위치와 스케일로 변환된 값을 저장
// key: 저장할 때 사용한 데이터의 키 값
// yValue: 라인의 y 높이
// yScale: Scale로 y 높이를 값으로 변환한 값
function record(key){
    const svg = d3.select("#myGraph");
    const mouseYScale = d3.scale.linear()
        .domain([0, 300])
        .range([0, 35]);
    
    const line = svg.select('line.choose')[0][0];
    
    let yScale;
    let yValue;
    if (line === null){
        yScale = null;
        yValue = null;
    }else{
        yScale = mouseYScale(line.attributes.y1.value);
        yValue = line.attributes.y1.value;
    }
    
    result.push({key: key, yScale: parseFloat(yScale), yValue: parseFloat(yValue)});
    
    svg.selectAll('line.choose')
        .remove();
}

function start(){
    d3.select('#start-button').style('display', 'none');
    
    draw();

    let i = 0;
    let onGoing = true;
    let lastKey = undefined;
    d3.json("./stacked1.json", function(error, data) {
        lastKey = data[i].key;
        update(data[i].value);
        i++;

        setInterval(() => {
            if(onGoing === true){
                if(typeof data[i] === "object"){
                    record(lastKey);
                    
                    lastKey = data[i].key
                    update(data[i].value);
                    i++;
                }else{
                    record(lastKey);
                    
                    d3.select('#save-button').style('display', 'block');
                    d3.select('#myGraph').style('display', 'none');
                    onGoing = false;
                }
            }
            
        }, 4000);
    });
}

function saveData(){
    const filename = 'data.json';

    data = JSON.stringify(result);

    const blob = new Blob([data], {type: 'text/json'});
    const e = document.createEvent('MouseEvents');
    const a = document.createElement('a');

    a.download = filename;
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':');
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e);
}


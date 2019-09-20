var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// MAKES THE THE SPIDER CHART
function buildSpider(){
    data = [{
        type: 'scatterpolar',
        r: [1, 2, 1, 4],
        theta: ['Cat','Child','Dog', 'Home Alone', "Cat"],
        fill: 'toself'
      }]
      
      layout = {
        polar: {
          radialaxis: {
            visible: true,
            range: [0, 5]
          }
        },
        showlegend: true
      }
      
      Plotly.plot("chart", data, layout)
};
buildSpider();  

// var toolTip = d3.tip()
//     .attr("class", "tooltip")
//     .offset([80, -60])
//     .html("<p> Tool tip spider chart</p> <div id='tipDiv'></div>")
//     });

// chartGroup.call(toolTip);

// circlesGroup.on("click", function(data) {
//     toolTip.show(data, this);
//   })
//     // onmouseout event
//     .on("mouseout", function(data, index) {
//       toolTip.hide(data);
//     });
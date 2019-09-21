//
// // Load data from hours-of-tv-watched.csv
// d3.csv("assets/data/pets.csv", function(error, factData) {
//   if (error) throw error;
//
//   //Cast the data type from string to integer
//   factData.forEach(function(data) {
//     data.cat = +data.cat;
//     data.dog = +data.dog;
//     data.child = +data.child;
//     data.home_alone = +data.home_alone;
//     data.pet_age = +data.pet_age;
//   });
//
//   console.log(factData);
//
//   var data = [{
//     type: "sunburst",
//     labels:  ["Dogs", "Female", "Male", "Foster", "Shelter", "Foster", "Shelter"],
//     parents: ["",     "Dogs",   "Dogs", "Female", "Female",  "Male",   "Male"],
//     values:  [20,     10,       10,     8,         2,         5,        5],
//     outsidetextfont: {size: 20, color: "#377eb8"},
//     leaf: {opacity: 0.4},
//     marker: {line: {width: 2}},
//   }];
//
//   var layout = {
//     margin: {l: 0, r: 0, b: 0, t: 0},
//     width: 500,
//     height: 500
//   };
//
//
//   Plotly.newPlot('sunBurst', data, layout);
//
//
// });

//------------------------------------
//Spider chart
//------------------------------------
//When call draw the spider chard on the div with the ID
function buildSpider(){
    data = [{
        type: 'scatterpolar',
        r: [1, 2, 1, 4, 1],
        theta: ['Cat','Child','Dog', 'Home Alone', "Cat"],
        fill: 'toself'
      }]

      layout = {
        title:"Dog",
        polar: {
          // domain: {
          //   x: [0, 0.46],
          //   y: [0.56, 1]
          // },
          radialaxis: {
            visible: true,
            range: [0, 5]
          }
        },
        showlegend: false
      }

      Plotly.plot("tipDiv", data, layout)
};

//------------------------------------
// Tool Tip
//------------------------------------
function updateToolTip(Data, hexPathGroup) {

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return("<div id='tipDiv' class='ToolTipSpider'></div>")
    });

  hexPathGroup.call(toolTip);
  //On click
  hexPathGroup.on("click", function(data) {
    toolTip.show();
    buildSpider()
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return hexPathGroup;
}

var colorScale = d3.scaleLinear()
    .range(["#00a6ca","#90eb9d", "#ffff8c","#f29e2e","#e76818"]);

var min=0;
var max=5;
var random = Math.floor(Math.random() * (+max - +min)) + +min;

var margin = {
    top: 50,
    right: 20,
    bottom: 20,
    left: 50
},
width = 850,
height = 350;

//The number of columns and rows of the heatmap
var MapColumns = 30, MapRows = 20;

//The maximum radius the hexagons can have to still fit the screen
var hexRadius = d3.min([width/((MapColumns + 0.5) * Math.sqrt(3)),
    height/((MapRows + 1/3) * 1.5)]);

//Calculate the center positions of each hexagon
var points = [];
for (var i = 0; i < MapRows; i++) {
    for (var j = 0; j < MapColumns; j++) {
        points.push([hexRadius * j * 1.75, hexRadius * i * 1.5]);
    }//for j
}//for i

//Create SVG element
var svg = d3.select(".feo").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Set the hexagon radius
var hexbin = d3.hexbin().radius(hexRadius);


//console.log(hexbin(points));
var cart = [];
hexBinPoints = hexbin(points);
hexBinPoints.forEach(function (x) {
  cart.push({"hexObj":x,"color":colorScale.range()[Math.floor(Math.random() * (+max - +min)) + +min]});
});

console.log(cart);

//Draw the hexagons
var hexCount = svg.append("g");

var hexaClass = hexCount.selectAll(".hexagon")
    //.data(hexbin(points))
    .data(cart)
    .enter()

var hexaPath = hexaClass.append("path")
    .attr("class", "hexagon")
    .attr("d", function (d) {
        return "M" + d.hexObj.x + "," + d.hexObj.y + hexbin.hexagon();
    })
    .attr("stroke", "white")
    .attr("stroke-width", "1px")
    .style("fill",  function (d,i) {
                      console.log(d.color);
                      return d.color;
                    }
    );

updateToolTip("s",hexaPath);

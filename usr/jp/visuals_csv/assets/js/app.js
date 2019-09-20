
// Load data from hours-of-tv-watched.csv
d3.csv("assets/data/pets.csv", function(error, factData) {
  if (error) throw error;

  //Cast the data type from string to integer
  factData.forEach(function(data) {
    data.cat = +data.cat;
    data.dog = +data.dog;
    data.child = +data.child;
    data.home_alone = +data.home_alone;
    data.pet_age = +data.pet_age;
  });

  console.log(factData);

  var data = [{
    type: "sunburst",
    labels:  ["Dogs", "Female", "Male", "Foster", "Shelter", "Foster", "Shelter"],
    parents: ["",     "Dogs",   "Dogs", "Female", "Female",  "Male",   "Male"],
    values:  [20,     10,       10,     8,         2,         5,        5],
    outsidetextfont: {size: 20, color: "#377eb8"},
    leaf: {opacity: 0.4},
    marker: {line: {width: 2}},
  }];

  var layout = {
    margin: {l: 0, r: 0, b: 0, t: 0},
    width: 500,
    height: 500
  };


  Plotly.newPlot('sunBurst', data, layout);


});

//A color scale
var colorScale = d3.scaleLinear()
    .range(["#2c7bb6", "#00a6ca","#00ccbc","#90eb9d","#ffff8c",
            "#f9d057","#f29e2e","#e76818","#d7191c"]);


var min=0;
var max=8;
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

//--------------------------------------------------------------------------------
//Linear Grad
//--------------------------------------------------------------------------------
//Append a defs (for definition) element to your SVG
var defs = svg.append("defs");

//Append a linearGradient element to the defs and give it a unique id
var linearGradient = defs.append("linearGradient").attr("id", "linear-gradient");



//Append multiple color stops by using D3's data/enter step
linearGradient.selectAll("stop")
    .data( colorScale.range() )
    .enter().append("stop")
    .attr("offset", function(d,i) { console.log(i/(colorScale.range().length-1)); return i/(colorScale.range().length-1); })
    .attr("stop-color", function(d) { return d; });
//--------------------------------------------------------------------------------

//Set the hexagon radius
var hexbin = d3.hexbin().radius(hexRadius);

//Draw the hexagons
svg.append("g")
    .selectAll(".hexagon")
    .data(hexbin(points))
    .enter().append("path")
    .attr("class", "hexagon")
    .attr("d", function (d) {
        return "M" + d.x + "," + d.y + hexbin.hexagon();
    })
    .attr("stroke", "white")
    .attr("stroke-width", "1px")
    // .style("fill", "teal");
    .style("fill",  function (d,i) {
                      console.log("d=%d i =%d",d,i);
                      //return color[i];
                      //return "teal";
                      console.log();
                      return colorScale.range()[Math.floor(Math.random() * (+max - +min)) + +min];
                      //return("url(#linear-gradient)");
                    }
    );

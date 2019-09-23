//---------------------------------------------
//Globals definition
//---------------------------------------------
const apa_url = "http://127.0.0.1:5000/apa_api";

// var colorScale = ["#e76818","#f29e2e", "#ffff8c","#90eb9d","#00a6ca"];
var colorScale = ["#FF5733","#FFC300", "#DAF7A6","#7DCEA0 ","#58D68D"];

var margin = {
    top: 40,
    right: 0,
    bottom: 0,
    left: 20
},
width = 700,
height = 350;
//---------------------------------------------

//When call draw the spider chard on the div with the ID
function buildSpider(dataObj){
  	Plotly.purge("spyderDraw");
    data = [{
        type: 'scatterpolar',
        r: [dataObj.stats.cat, dataObj.stats.child, dataObj.stats.dog, dataObj.stats.homealone, dataObj.stats.cat],
        theta: ['Cat','Child','Dog', 'Home Alone', "Cat"],
        fill: 'toself',
        name: "How good it gets with"
      }]

      var sheHe = "he is in";
      if("Female" === dataObj.sex ){
        sheHe = "she is in";
      }

      sheHe += (" " + dataObj.location)

      //Define the title
      var newName = dataObj.name;
      if(dataObj.sex != undefined){
        newName = dataObj.name + " (" + dataObj.sex + " "+
                  dataObj.age.years +"Y "+ dataObj.age.month + "M ) " +
                  sheHe;
      }

      // "age":{"years":years,"month":month},

      layout = {
        title:newName,
        polar: {
          radialaxis: {
            visible: true,
            range: [0, 5]
          }
        },
        showlegend: true
      }

      // Plotly.plot("tipDiv", data, layout)
      Plotly.plot("spyderDraw", data, layout);
};

//Fuction used to calculate the color base on the average stats and the age
function get_color(data){
  if(data.pet_age < 0.5){
    //If dog is less than 6 months more likelly to get
    //adopted
    return colorScale[colorScale.length-1];
  } else {
    //get an average of the stats
    var colorIndexArray = 0;
    colorIndexArray += data.cat;
    colorIndexArray += data.dog;
    colorIndexArray += data.child;
    colorIndexArray += data.homealone;
    //Get the index
    var index = Math.ceil(colorIndexArray/4)-1
    if(index < 0){
      index = 0;
    }
    //Return the propper color scale
    return colorScale[index];
  }
}

//Function responsible to proccess the data amd write the images for honeycomb
function process_apa_data(factData){

  //The number of columns and rows of the heatmap
  //Iterate ove rthe the same proportion of hexagons to get the layout
  //This wont work for less thatn 2 items for the type of data twe are analysing
  //this condition will never happen
  var i = 2;
  var total = 0;

  while(total < factData.length){
    total = i * (i + Math.round(i/2));
    i++;
  }
  var MapRows = i;
  var MapColumns = (i + Math.round(i/2));

  console.log("Data length: %d",factData.length);
  console.log("y:%d",MapRows);
  console.log("x:%d",MapColumns);
  console.log(factData);

  //We found the porper size to create a rectangle for the amount of data now
  //lets calculate the color by averaging the the stats

  var petData = [];

  factData.forEach(function(data) {
    var years = Math.floor(data.pet_age);
    var month = Math.round((data.pet_age - years) * 12);
    petData.push({"hexColor":get_color(data),
                  "name":data.pet_name,
                  "sex":data.pet_sex,
                  "age":{"years":years,"month":month},
                  "location":data.pet_location,
                  "stats":{"cat":data.cat,"dog":data.dog,"child":data.child,"homealone":data.homealone}
                });
  });

  //Pad the data for missing data to complete the square
  for (let i = 0; i < ((MapRows * MapColumns) - factData.length); ++i) {
    petData.push({"hexColor":"white",
                  "name":"",
                  "sex":"",
                  "stats":{"cat":0,"dog":0,"child":0,"home_alone":0}
                  });
  }
  //Build the new object and return
  return {"honneyComb":{"x":MapColumns,"y":MapRows},"petData":petData};
}


// Tool Tip
//This function is responsible to draw an spider chart on click
function updateToolTip(hexPathGroup) {

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return("<div id='tipDiv' class='ToolTipSpider2'></div>")
    });

  hexPathGroup.call(toolTip);

  //On click
  hexPathGroup.on("click", function(data) {
    toolTip.show();
    console.log(data);
    buildSpider(data.data);
  }).on("mouseout", function(data, index) {
      toolTip.hide(data);
  });
  return hexPathGroup;
}

//Fuction usid to initilize data at the begining
function init(){
  buildSpider({"name":"Click in any hexagon to see the stats",
              "stats":{"cat":0,"child":0,"dog":0,"homealone":0}});
}

//This in my main function
d3.json(apa_url).then(function(data) {

  //Init empy data:
  init();

  //Process the data
  var plotObj = process_apa_data(data);
  console.log(plotObj);

  //The maximum radius the hexagons can have to still fit the screen
  var hexRadius = d3.min([width/((plotObj.honneyComb.x + 0.5) * Math.sqrt(3)),
      height/((plotObj.honneyComb.y + 1/3) * 1.5)]);

  //Calculate the center positions of each hexagon
  var points = [];
  for (var i = 0; i < plotObj.honneyComb.y; i++) {
      for (var j = 0; j < plotObj.honneyComb.x; j++) {
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


  console.log(plotObj.petData[0]["hexColor"]);

  //console.log(hexbin(points));
  var cart = [];
  hexBinPoints = hexbin(points);

  console.log(hexBinPoints.length);
  console.log(plotObj.petData.length);

  var hexIndex = 0;
  hexBinPoints.forEach(function (x) {
    cart.push({"hexObj":x,"data":plotObj.petData[hexIndex]});
    hexIndex += 1;
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
                        return d.data.hexColor;
                      }
      );

  updateToolTip(hexaPath);
});

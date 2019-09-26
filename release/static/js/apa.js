//---------------------------------------------
//Globals definition
//---------------------------------------------
const apa_url = "http://127.0.0.1:5000/apa_api";

var colorScale = ["#F1948A","#F0B27A", "#F7DC6F","#73C6B6","#82E0AA"];

var margin = {
    top: 40,
    right: 0,
    bottom: 0,
    left: 20
},
width = 700,
height = 350;
//---------------------------------------------

//--------------------------------------------------------------------------------
//Linear Grad
//--------------------------------------------------------------------------------

//Gradient scale
var colorGrad = d3.scaleLinear()
    .range(["#F1948A","#F0B27A", "#F7DC6F","#73C6B6","#82E0AA"]);
//--------------------------------------------------------------------------------

//****************************************************************************
//*                         Sun Burst Drawing                                *
//****************************************************************************
//Function used for ploting the Sun-Burst data
function plotSunBurst(apaData){
  var data = [{
    type: "sunburst",
    labels: [ "Dogs",
              "Female",
              "Male",
              "Foster",
              "TLAC",
              "Foster",
              "TLAC",
              "Puppy",
              "Puppy",
              "Puppy",
              "Puppy"],
    ids:    [ "Dogs",
              "Female",
              "Male",
              "Female - Foster",
              "Female - TLAC",
              "Male - Foster",
              "Male - TLAC",
              "Male - Foster - Puppy",
              "Male - TLAC - Puppy",
              "Female - Foster - Puppy",
              "Female - TLAC - Puppy"],
    parents:[ "",
              "Dogs",
              "Dogs",
              "Female",
              "Female",
              "Male",
              "Male",
              "Male - Foster",
              "Male - TLAC",
              "Female - Foster",
              "Female - TLAC"],
    values: [ apaData.dogs.total,
              apaData.dogs.female.total,
              apaData.dogs.male.total,
              apaData.dogs.female.foster.total,
              apaData.dogs.female.tlac.total,
              apaData.dogs.male.foster.total,
              apaData.dogs.male.tlac.total,
              apaData.dogs.male.foster.puppy.total,
              apaData.dogs.male.tlac.puppy.total,
              apaData.dogs.female.foster.puppy.total,
              apaData.dogs.female.tlac.puppy.total],
    outsidetextfont: {size: 20, color: "#377eb8"},
    insidetextfont: {size: 15, color: "#FDFEFE"},
    leaf: {opacity: .9},
    marker: {line: {width: 2}, colors:[ '#FDFEFE',
                                        '#D7BDE2',
                                        '#85C1E9',
                                        '#A2D9CE',
                                        '#F5B7B1',
                                        '#A2D9CE',
                                        '#F5B7B1',
                                        '#A9DFBF',
                                        '#E6B0AA',
                                        '#A9DFBF',
                                        '#E6B0AA']},
    branchvalues: 'total'
  }];

  var layout = {
    margin: {l: 0, r: 0, b: 0, t: 0},
    width: 500,
    height: 500
  };
  Plotly.newPlot('sunBurst', data, layout);
}

//Function used to init the data for drawing
function newSunBurstData(){
  sunBurstData =
  {"dogs":
    {
      "total":0,
      "female":{
              "total":0,
              "foster":{
                      "total":0,
                      "puppy":{"total":0}
                      },
              "tlac":{
                      "total":0,
                      "puppy":{"total":0}
                     },
              },
      "male": {
              "total":0,
              "foster":{
                      "total":0,
                      "puppy":{"total":0}
                      },
              "tlac":{
                      "total":0,
                      "puppy":{"total":0}
                     },
              }
    }
  };
  return sunBurstData;
}

//Function used to update the sun burst data
function updateSunBurst(apaData,entryData){
  //Update the total value
  apaData.dogs.total+=1;
  //Sex categorization
  if(entryData.pet_sex === "Male"){
    //Update Male data
    apaData.dogs.male.total+=1;
    var dogPtr = apaData.dogs.male;
  } else {
    //Update Female data
    apaData.dogs.female.total+=1;
    var dogPtr = apaData.dogs.female;
  }
  //Update foster vs TLAC
  if(entryData.pet_location === "TLAC"){
    //TLAC update
    dogPtr.tlac.total+=1;
    var varPuppyPtr = dogPtr.tlac.puppy;
  } else {
    //Foster update
    dogPtr.foster.total+=1;
    var varPuppyPtr = dogPtr.foster.puppy;
  }
  //Uodate puppy
  if(entryData.pet_age  <= 0.5 ){
    varPuppyPtr.total+=1;
  }
}

//function used to log the sunburst data to be ploted
function logSunBurstData(apaData) {
  console.log("Dogs: %d",apaData.dogs.total);
  console.log("|\tFemale: %d",apaData.dogs.female.total);
  console.log("|\t|\tFoster: %d",apaData.dogs.female.foster.total);
  console.log("|\t|\t|\tPuppy: %d",apaData.dogs.female.foster.puppy.total);
  console.log("|\t|\tTLAC: %d",apaData.dogs.female.tlac.total);
  console.log("|\t|\t|\tPuppy: %d",apaData.dogs.female.tlac.puppy.total);

  console.log("|\tMale: %d",apaData.dogs.male.total);
  console.log("|\t|\tFoster: %d",apaData.dogs.male.foster.total);
  console.log("|\t|\t|\tPuppy: %d",apaData.dogs.male.foster.puppy.total);
  console.log("|\t|\tTLAC: %d",apaData.dogs.male.tlac.total);
  console.log("|\t|\t|\tPuppy: %d",apaData.dogs.male.tlac.puppy.total);
}
//****************************************************************************
//*                             Line chart Chart                                 *
//****************************************************************************
function buildLineAge(dogAgeMale,dogAgeFemale){
  trace1 = {
    type: 'scatter',
    x: dogAgeMale.ageRange,
    y: dogAgeMale.ageCount,
    mode: 'lines',
    name: 'Male count',
    line: {
      color: '#AED6F1',
      width: 4
    }
  };

  trace2 = {
    type: 'scatter',
    x: dogAgeFemale.ageRange,
    y: dogAgeFemale.ageCount,
    mode: 'lines',
    name: 'Female count',
    line: {
      color: '#F5B7B1',
      width: 4
    }
  };

  var layout = {
    width: 600,
    height: 500,
    xaxis: {
        title: 'Dog age(years)'
    },
    yaxis: {
        title: 'Dog count',
    }
  };

  var data = [trace1, trace2];

  Plotly.newPlot('agePlot', data, layout);
}

//****************************************************************************
//*                             Spyder Chart                                 *color: '#85C1E9',
//****************************************************************************
//Function used to build the spider chart
function buildSpider(dataObj){
  	Plotly.purge("spyderDraw");
    data = [{
        type: 'scatterpolar',
        r: [dataObj.stats.cat, dataObj.stats.child, dataObj.stats.dog, dataObj.stats.homealone, dataObj.stats.cat],
        theta: ['Cat','Child','Dog', 'Home Alone', "Cat"],
        fill: 'toself',
        name: "Gets along with",
        line: {
          color: '#73C6B6',
          width: 4
        }
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
      Plotly.plot("spyderDraw", data, layout);
};
//****************************************************************************

//Function to dra the legend for the honeycomb
function drawHoneyCombLegend(){
  //Make an SVG Container
  var svgContainer = d3.select(".legendFeo").append("svg")
                                      .attr("width", width)
                                      .attr("height", 80);

  //Append a defs (for definition) element to your SVG
  var defs = svgContainer.append("defs");

  //Append a linearGradient element to the defs and give it a unique id
  var linearGradient = defs.append("linearGradient").attr("id", "linear-gradient");

  var recGradSize = 320;

  //Append multiple color stops by using D3's data/enter step
  linearGradient.selectAll("stop")
      .data( colorGrad.range() )
      .enter().append("stop")
      .attr("offset", function(d,i) { console.log(i/(colorGrad.range().length-1)); return i/(colorGrad.range().length-1); })
      .attr("stop-color", function(d) { return d; });

  //Line with the gradient
  var rectangle = svgContainer.append("rect")
                              .attr("x", width/6 + 26)
                              .attr("y", 0)
                              .attr("width", recGradSize)
                              .attr("height", 15)
                              .attr("fill","url(#linear-gradient)");

  //Add the text to the label hard to be adopted
  var svgTextH = svgContainer.append("text")
                            .attr("x",0)
                            .attr("y",13)
                            .attr("font-size","16px")
                            .attr("fill","#99A3A4")
                            .attr("font-family","sans-serif")
                            .text("Hard to be adopted");

  //Add the text to the label hard to be adopted
  var svgTextE = svgContainer.append("text")
                            .attr("x",recGradSize + 150)
                            .attr("y",13)
                            .attr("font-size","16px")
                            .attr("fill","#99A3A4")
                            .attr("font-family","sans-serif")
                            .text("Easy to be adopted");

}

//Fuction used to calculate the color base on the average stats and the age
function get_color(data){
  if(data.pet_age <= 0.5){
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

  //We found the porper size to create a rectangle for the amount of data now
  //lets calculate the color by averaging the the stats

  //[*] Used to store hxagon data
  var petData = [];
  //[*] SunBurst adata stored
  sunBurstData = newSunBurstData();
  //[*] Dog age apaData
  var dogAgeMale = {"dogAge":[],"ageRange":[],"ageCount":[]};
  var dogAgeFemale = {"dogAge":[],"ageRange":[],"ageCount":[]};
  var dogIndex = 0;

  //This is the loop used to iterate the data, this is used to collet all info
  //to avoid multiple iterations of the data
  factData.forEach(function(data) {
    //Data collection for hex data
    var years = Math.floor(data.pet_age);
    var month = Math.round((data.pet_age - years) * 12);
    petData.push({"hexColor":get_color(data),
                  "name":data.pet_name,
                  "sex":data.pet_sex,
                  "age":{"years":years,"month":month},
                  "location":data.pet_location,
                  "stats":{"cat":data.cat,"dog":data.dog,"child":data.child,"homealone":data.homealone}
                });

    //Data collection for plotting the sunburt
    updateSunBurst(sunBurstData,data);
    //Data colection for line chart
    if(data.pet_sex === "Male"){
      dogAgeMale.dogAge.push(data.pet_age);
    } else {
      dogAgeFemale.dogAge.push(data.pet_age);
    }
  });

  //Get the round  maximun age
  var maxAgeMale = Math.round(Math.max(...dogAgeMale.dogAge));
  var maxAgeFemale = Math.round(Math.max(...dogAgeFemale.dogAge));

  //Create a list is ages
  dogIndex = 0;
  for (; dogIndex < maxAgeMale; dogIndex++) {
    dogAgeMale.ageRange.push(dogIndex);
    dogAgeMale.ageCount.push(0);
  }
  dogIndex = 0;
  for (; dogIndex < maxAgeFemale; dogIndex++) {
    dogAgeFemale.ageRange.push(dogIndex);
    dogAgeFemale.ageCount.push(0);
  }

  //Iterate the dog age inex and append the count to it
  dogAgeMale.dogAge.forEach(function(age) {
    dogAgeMale.ageCount[Math.round(age)]+=1;
  });

  dogAgeFemale.dogAge.forEach(function(age) {
    dogAgeFemale.ageCount[Math.round(age)]+=1;
  });

  //Log data for debug
  logSunBurstData(sunBurstData);
  //console.log(Math.max(...dogAgeMale.dogAge));//dogAge

  //Plot the sun burst data
  plotSunBurst(sunBurstData);
  //Plot the age
  buildLineAge(dogAgeMale,dogAgeFemale);

  //****************************************************************************
  //*                      Hexagon Ploting Drawing                             *
  //****************************************************************************
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
    buildSpider(data.data);
  }).on("mouseout", function(data, index) {
      toolTip.hide(data);
  }).on("mouseover", function(d) {
    //ToDo: Add lighter color here
    console.log(data);
  });
  return hexPathGroup;
}

//Fuction used to initilize data at the begining
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

  //console.log(hexbin(points));
  var cart = [];
  hexBinPoints = hexbin(points);

  //binding the data for the hexagon
  var hexIndex = 0;
  hexBinPoints.forEach(function (x) {
    cart.push({"hexObj":x,"data":plotObj.petData[hexIndex]});
    hexIndex += 1;
  });

  //Here is where the drawing happens
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

  //Tooltip update
  updateToolTip(hexaPath);
  //Draw the legend
  drawHoneyCombLegend();
  //****************************************************************************
});

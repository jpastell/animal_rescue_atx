console.log("Test map");
const apa_url = "http://127.0.0.1:5000/strays_api";

//This in my main function
d3.json(apa_url).then(function(geoData) {
  // geoData.forEach(function(data) {
  //   console.log(data);
  // });

  console.log(geoData);

  // Define streetmap layer
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  // Define darkmap layer
  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  //Array that holds all curcles
  var myCircleArray = new Array();

  // Loop through the cities array and create one marker for each earthquake object
  for (var i = 0; i < geoData.length; i++) {

    var coordinatesRef = geoData[i];
    var coordinates = [coordinatesRef["lon"],coordinatesRef["lat"]];
    console.log(coordinates);

    looksLike = coordinatesRef["LooksLike"];
    address = coordinatesRef["addresses"];

    color = "#F5B041";

    // Add circles to map
    var myCircle = L.circle(coordinates, {
      fillOpacity: 0.75,
      color: color,
      fillColor: color,
      // Adjust radius
      radius: (700)
    }).bindPopup("<h1>" + address + "</h1> <hr> <h3>Looks like: " + looksLike + "</h3>");
    //Add the cricle to the array
    myCircleArray.push(myCircle);
  }

  //Create the layer for the circles
  var strays = L.layerGroup(myCircleArray);
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Strays : strays
  };

  // Add the layer to the map
  var myMap = L.map("map", {
    center: [30.2672, -97.7431],
    zoom: 11,
    layers: [streetmap,strays]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps,overlayMaps, {
     collapsed: false
  }).addTo(myMap);

});

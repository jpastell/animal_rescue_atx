function drawMap() {
  const map = L.map("map-id", {
    center: [30.2672, -97.7431],
    zoom: 12,
  });

  L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY  // Your API key goes here
  }).addTo(map);

  const coords = Object.values(data).map(row => row);
  coords.forEach(coord => L.marker(coord).addTo(map));
}

drawMap();
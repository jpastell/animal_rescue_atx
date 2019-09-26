//File used for enabling only

const apa_url = "http://127.0.0.1:5000/apa_api";
// const shelter_url = "http://127.0.0.1:5000/shelter_api";
const strays_url = "http://127.0.0.1:5000/strays_api";

// Fetch the JSON data and console log it
d3.json(apa_url).then(function(data) {
  console.log(data);
});

// Promise Pending
const dataPromise_1 = d3.json(apa_url);
console.log("Data Promise: ", dataPromise_1);

// // Fetch the JSON data and console log it
// d3.json(shelter_url).then(function(data) {
//   console.log(data);
// });

// // Promise Pending
// const dataPromise_2 = d3.json(shelter_url);
// console.log("Data Promise: ", dataPromise_2);

// Fetch the JSON data and console log it
d3.json(strays_url).then(function(data) {
  console.log(data);
});

// Promise Pending
const dataPromise_3 = d3.json(strays_url);
console.log("Data Promise: ", dataPromise_3);

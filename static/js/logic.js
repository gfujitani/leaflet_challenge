// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)} <br> Mag:${(feature.properties.mag)} <br> Depth: ${feature.geometry.coordinates[2]}</p>`);
  }


  function markerColors(depth){
    if (depth >90){
        return "#008000"}

    if (depth >70){
        return "#00FF00"
    }

    if (depth>50){
        return "##808000"
    }
    if (depth >30){
        return "#FFFF00"
    }

    if (depth>10){
        return "#800000"
    }

    return "#FF0000"
  }
    
  var earthquakes = L.geoJSON(earthquakeData,{
      pointToLayer: function (feature, layer) {
          return L.circleMarker(layer, {
             radius: feature.properties.mag * 4,
             fillOpacity:0.85,
             color: markerColors(feature.geometry.coordinates[2])  })},

            onEachFeature: onEachFeature})
  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
   

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });


  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend =L.control({
      position:"bottomright"});

legend.onAdd = function(myMap){
    var div=L.DomUtil.create("div", "Maplegend");
    div.innerHTML += "<h3>Depth</h3>";
    div.innerHTML += '<i style="background: #008000"></i><span>>90</span><br>';
    div.innerHTML += '<i style="background: #00FF00"></i><span>>90-70</span><br>';
    div.innerHTML += '<i style="background: #808000"></i><span>70-50</span><br>';
    div.innerHTML += '<i style="background: #FFFF00"></i><span>50-30</span><br>';
    div.innerHTML += '<i style="background: #800000"></i><span>30-10</span><br>';
    div.innerHTML += '<i style="background: #FF0000"></i><span><10</span><br>';
    return div;

}
    legend.addTo(myMap)
  
}
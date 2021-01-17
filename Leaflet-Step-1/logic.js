// Declare Colors
var colors = ['#6aff00', '#ddff00', '#ffdd00', '#ff9900', '#ff4500', '#FF0000'] 

// Magnitude Amplifier
function markerSize(mag) {
  return mag*15000;
}
// Epoch to time zone of user
function EpochToCurrent(Epoch) {
  return new Date(Epoch);
}
// Sets Color of marker
function setColor(depth){
  if (depth >= 90) {
    return colors[5];
  } else if (depth >= 70) {
    return colors[4];
  } else if (depth >= 50) {
    return colors[3];
  } else if (depth >= 30) {
    return colors[2];
  } else if (depth >= 10) {
    return colors[1];
  }else {
    return colors[0];
  }
}

///////////////////////////////////////////
// Initializing Map and adding it to div //
///////////////////////////////////////////

var myMap = L.map("map", {
  center: [20, -10],
  zoom: 3
});

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

///////////////////////////////////////
// Run through data and plot markers //
///////////////////////////////////////

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(myResp) {
  for (let j = 0; j < myResp.features.length; j++) {
    let location = [myResp.features[j].geometry.coordinates[1], myResp.features[j].geometry.coordinates[0]];
    L.circle(location, {
      fillOpacity: 0.75,
      fillColor:  setColor(myResp.features[j].geometry.coordinates[2]),
      weight: 0,
      radius: markerSize(myResp.features[j].properties.mag)
    }).bindPopup('<p><b>' + myResp.features[j].properties.place + '</b><br><b>Magnitude: </b>'+ myResp.features[j].properties.mag+'<br><b>Time: </b>' + EpochToCurrent(myResp.features[j].properties.time) + '</p>').addTo(myMap);
  }
});

///////////////////////////
// Create and add legend //
///////////////////////////

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
  let div = L.DomUtil.create('div', 'info legend'), grades = [-10, 10, 30, 50, 70, 90];
  for (let i = 0; i < grades.length; i++) {
    div.innerHTML += '<i style="background:' + colors[i] + '"></i> ' + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }
 
  return div;
};
legend.addTo(myMap);

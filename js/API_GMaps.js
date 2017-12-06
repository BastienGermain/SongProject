const APIKEY = "AIzaSyDNaCN1rRf2iAAhFmgT0tQ2LIzNf6UM5ws";
let uluru = {lat: 0.0, lng: 0.0};
let map;

function findAdresse(adresse) {
  uluru.lat = adresse[0];
  uluru.lng = adresse[1];

  var marker = new google.maps.Marker({
    position: uluru,
  });
  marker.setMap(map);
  map.setCenter(uluru);

}

var src = "https://maps.googleapis.com/maps/api/js?key="+APIKEY+"&callback="+initMap.name;
var script = $("<script async defer>");
script.get(0).src = src;

$(document).ready(function() {
  $("#result").append(script);
});



function initMap() {
        map = new google.maps.Map($('#result').get(0), {
          zoom: 4
        });

}

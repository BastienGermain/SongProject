const APICODE = "AIzaSyDNaCN1rRf2iAAhFmgT0tQ2LIzNf6UM5ws";

let uluru = {lat: 0.0, lng: 0.0};

function findAdresse(adresse) {
  uluru.lat = adresse.geometry.coordinates[0];
  uluru.lng = adresse.geometry.coordinates[1];

  var src="https://maps.googleapis.com/maps/api/js?key="+APICODE+"&callback="+initMap.name;

  var script = $("<script async defer></script");
  script.src = src;

  $('#result').append(script);

}

function initMap() {
        var map = new google.maps.Map($('#result').get(0), {
          zoom: 4,
          center: uluru
        });
        var marker = new google.maps.Marker({
          position: uluru,
          map: map
        });
}

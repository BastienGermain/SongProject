const APICODE = "AIzaSyDNaCN1rRf2iAAhFmgT0tQ2LIzNf6UM5ws";

let uluru = {lat: 0.0, lng: 0.0};

function findAdresse(adresse) {
  uluru.lat = adresse.geometry.coordinates[0];
  uluru.lng = adresse.geometry.coordinates[1];

  async defer
      src="https://maps.googleapis.com/maps/api/js?key="+APICODE+"&callback="+initMap.name;
}

function initMap() {
        var map = new google.maps.Map(document.getElementById('result'), {
          zoom: 4,
          center: uluru
        });
        var marker = new google.maps.Marker({
          position: uluru,
          map: map
        });
}

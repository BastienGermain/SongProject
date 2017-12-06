let uluru = {lat: 0.0, lng: 0.0};

function findAdresse(adresse) {
  uluru.lat = adresse[0];
  uluru.lng = adresse[1];
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

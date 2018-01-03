const APIKEY = "AIzaSyDNaCN1rRf2iAAhFmgT0tQ2LIzNf6UM5ws";
let coord = {lat: 0.0, lng: 0.0};
let map;

function centerMap(adresse){
  coord.lat = adresse[0] || adresse.lat();
  coord.lng = adresse[1] || adresse.lng();

  map.setCenter(coord);
}

var infoArray = []; // Tableau regroupant toutes les bulles d'infos

function findAdresse(adresse, nom_musee, horaires, adresse_musee, site_web) {
  coord.lat = adresse[0] || adresse.lat();
  coord.lng = adresse[1] || adresse.lng();

  var contentString = '<h1 style="font-size: 40px;">' + nom_musee + '</h1>' +
  '<p style="font-size: 20px;">Horaires : ' + horaires + '</p>' + 
  '<p style="font-size: 20px;">Adresse : ' + adresse_musee + '</p>' + 
  '<a href="http://' + site_web + '">Visiter le site</a>'; 

  var infowindow = new google.maps.InfoWindow({
    content: contentString
  });

  infoArray.push(infowindow);

  var marker = new google.maps.Marker({
    position: coord
  });
  marker.setMap(map);

  marker.addListener('click', function(e) {
    // ferme toutes les autres bulles d'infos quand une nouvelle s'ouvre
    for (var i = 0; i < infoArray.length; i++) {  
         infoArray[i].close();
    }
    infowindow.open(map, marker);
  });

  // ferme la bulle au click sur la map
  google.maps.event.addListener(map, 'click', function() {
      infowindow.close();
  });
  
}

var src = "https://maps.googleapis.com/maps/api/js?key="+APIKEY+"&callback="+initMap.name;
var script = $("<script async defer>");
script.get(0).src = src;

$(document).ready(function() {
  $("#result").append(script);
});



function initMap() {
    map = new google.maps.Map($('#result').get(0), {
      zoom: 12,
      center: coord,
      styles : [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.business",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dadada"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c9c9c9"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  }
]
    });
}

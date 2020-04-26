var map, infoWindow;
var _marker = null;
var _circle = null;
var circleStyle = {
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    radius: 1000 //meters
  };


function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 41.5330915, lng: 2.4332249},	
    zoom: 15
    });

    var geocoder = new google.maps.Geocoder();

    document.getElementById('buscar').addEventListener('click', function() {
        geocodeAddress(geocoder, map);
    });

    document.getElementById('autogeoloc').addEventListener('click', function() {
        geolocalization(map);
    });

    document.getElementById('address').addEventListener("keyup", function(event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
          // Cancel the default action, if needed
          event.preventDefault();
          geocodeAddress(geocoder, map);
        }
      });


    map.addListener('click', function(event) {
        addMarkerWithCircle(event.latLng, map);
    });

    infoWindow = new google.maps.InfoWindow;
}

function addMarkerWithCircle(location, map) {
    deleteMarker();
    addMarker(location, map);

    deleteCircle();
    addCircle(location, map);
}

function deleteMarker()
{
    if (_marker) {
        _marker.setMap(null);
    }
}

function deleteCircle() {
    if (_circle) {
        _circle.setMap(null);
    }
}

function addMarker(location, map) {
    _marker = new google.maps.Marker({
        position: location,
        map: map
    });
}

function addCircle(location, map)
{
    _circle = new google.maps.Circle({
        strokeColor: circleStyle.strokeColor,
        strokeOpacity: circleStyle.strokeOpacity,
        strokeWeight: circleStyle.strokeWeight,
        fillColor: circleStyle.fillColor,
        fillOpacity: circleStyle.fillOpacity,
        map: map,
        center: location,
        radius: circleStyle.radius
        });
    google.maps.event.addListener(_circle, "click", function(event){
      google.maps.event.trigger(map, 
                                'click', 
                                {
                                  latLng: new google.maps.LatLng(event.latLng.lat(),event.latLng.lng())
                                });
  });
}

function geolocalization(map)
{
  // Try HTML5 geolocation.
  if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    var location = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };

    map.setCenter(location);

    addMarkerWithCircle(location, map);
  
    }, function() {
        handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
}

function geocodeAddress(geocoder, resultsMap) {
    var address = document.getElementById('address').value;
    geocoder.geocode({'address': address}, function(results, status) {
    if (status === 'OK') {
        resultsMap.setCenter(results[0].geometry.location);

        addMarkerWithCircle(results[0].geometry.location, resultsMap);
    } 
    else {
        alert('No hemos podido encontrar la dirección: ' + status);
    }
    });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                        'Error: El servicio de geolocalización ha fallado.':
                        'Error: Tú navegador no soporta la geolocalización');
    infoWindow.open(map);
}
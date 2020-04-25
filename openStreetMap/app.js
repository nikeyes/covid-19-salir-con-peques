var marker = null;
var circle = null;
var circleOptions = {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 1000
};

var latLon = {lat: 41.53984, lon: 2.44488};
var map = L.map('map').setView(latLon, 15);

map.on('click',function(e) {
    addMarkerWithCircle(e.latlng, map);
});


document.getElementById('autogeoloc').addEventListener('click', function() {
    geolocalization(map);
});

var geocoder = L.Control.geocoder({
    defaultMarkGeocode: false,
    collapsed: false,
    placeholder: "Buscar..."
    })
    .on('markgeocode', function(e) {
        addMarkerWithCircle(e.geocode.center,map);
        map.setView(e.geocode.center);
    })
    .addTo(map);
    


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);

    L.control.scale().addTo(map);

    var popup = L.popup();

    function addMarkerWithCircle(latLon, map){
        deleteMarker();
        addMarker(latLon, map);
        deleteCircle();
        addCircle(latLon, map);
    }

    function addMarker(latLon, map)
    {
        marker = L.marker(latLon);
        marker.addTo(map);
    }

    function addCircle(latLon, map)
    {
        circle = L.circle(latLon, {
            color: circleOptions.color,
            fillColor: circleOptions.fillColor,
            fillOpacity: circleOptions.fillOpacity,
            radius: circleOptions.radius
        }).addTo(map);
    }

    function deleteMarker()
    {
        if (marker) {
            map.removeLayer(marker);
        };
    }

    function deleteCircle()
    {
        if (circle) {
            map.removeLayer(circle);
        };
    }

    
function geolocalization(map) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var latLng = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            addMarkerWithCircle(latLng, map);

            map.setView(latLng);
        }, function() {
            geolocationErrorOccurred(true, popup, map.getCenter());
        });
    } else {
        //No browser support geolocation service
        geolocationErrorOccurred(false, popup, map.getCenter());
    }

    function geolocationErrorOccurred(geolocationSupported, popup, latLng) {
        popup.setLatLng(latLng);
        popup.setContent(geolocationSupported ?
                '<b>Error:</b> El servicio de geolocalización ha fallado.':
                '<b>Error:</b> Tú navegador no soporta la geolocalización.');
        popup.openOn(map);
    }
}

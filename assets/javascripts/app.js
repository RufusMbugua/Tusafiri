App = Ember.Application.create();

App.Router.map(function() {
    this.resource('contacts');
    this.resource('booking');
});

$(document).ready(function(){
    var place_source;
    $('a').click(function(){
        initialize();
    });
    function initialize() {
        var styles=[
            {
                "featureType": "road",
                "stylers": [
                    { "hue": "#00aaff" },
                    { "saturation": -70 },
                    { "visibility": "on" }
                ]
            },{
                "featureType": "landscape.natural",
                "stylers": [
                    { "visibility": "off" }
                ]
            },{
                "featureType": "poi",
                "stylers": [
                    { "visibility": "on" },
                    { "hue": "#0088ff" }
                ]
            },{
                "featureType": "water",
                "stylers": [
                    { "visibility": "on" },
                    { "saturation": 54 },
                    { "hue": "#0066ff" }
                ]
            },{
            }
        ]

        var styledMap = new google.maps.StyledMapType(styles,
                                                      {name: "Travel Map"});

        var mapOptions = {
            center: new google.maps.LatLng(-1.2833, 36.8167),
            zoom: 13,
            mapTypeControlOptions: {
                mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
            }
        };

        var map = new google.maps.Map($('.map')[0],
                                      mapOptions);

        map.mapTypes.set('map_style', styledMap);
        map.setMapTypeId('map_style');

        //Intialize the Path Array
        var path = new google.maps.MVCArray();

        //Intialize the Direction Service
        var service = new google.maps.DirectionsService();
        //Set the Path Stroke Color
        var poly = new google.maps.Polyline({ map: map, strokeColor: '#4986E7' });

var source =(document.getElementById('source'));

            var autocomplete_source = new google.maps.places.Autocomplete(source);
            var destination =(document.getElementById('destination'));

            var autocomplete_destination = new google.maps.places.Autocomplete(destination);


        autocomplete_source.bindTo('bounds', map);
        autocomplete_destination.bindTo('bounds', map);

        var infowindow = new google.maps.InfoWindow();
        var marker = new google.maps.Marker({
            map: map,
            anchorPoint: new google.maps.Point(0, -29)
        });

        google.maps.event.addListener(autocomplete_source, 'place_changed', function() {

            place_source = autocomplete_source.getPlace();
            if (!place_source.geometry) {
                return;
            }

            // If the place has a geometry, then present it on a map.
            if (place_source.geometry.viewport) {
                map.fitBounds(place_source.geometry.viewport);
            } else {
                map.setCenter(place_source.geometry.location);
                map.setZoom(17);  // Why 17? Because it looks good.
            }
            marker.setIcon(/** @type {google.maps.Icon} */({
                url: place_source.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(35, 35)
            }));
            marker.setPosition(place_source.geometry.location);
            marker.setVisible(true);

            var address = '';
            if (place_source.address_components) {
                address = [
                    (place_source.address_components[0] && place_source.address_components[0].short_name || ''),
                    (place_source.address_components[1] && place_source.address_components[1].short_name || ''),
                    (place_source.address_components[2] && place_source.address_components[2].short_name || '')
                ].join(' ');
            }

            infowindow.setContent('<div><strong>' + place_source.name + '</strong><br>' + address);
            infowindow.open(map, marker);
        });

        google.maps.event.addListener(autocomplete_destination, 'place_changed', function() {
            infowindow.close();
            marker.setVisible(false);
            var place = autocomplete_destination.getPlace();
            if (!place.geometry) {
                return;
            }

            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(17);  // Why 17? Because it looks good.
            }
            marker.setIcon(/** @type {google.maps.Icon} */({
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(35, 35)
            }));
            marker.setPosition(place.geometry.location);
            marker.setVisible(true);

            var address = '';
            if (place.address_components) {
                address = [
                    (place.address_components[0] && place.address_components[0].short_name || ''),
                    (place.address_components[1] && place.address_components[1].short_name || ''),
                    (place.address_components[2] && place.address_components[2].short_name || '')
                ].join(' ');
            }

            infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
            infowindow.open(map, marker);


        });

        setupClickListener('changetype-all', []);
        setupClickListener('changetype-establishment', ['establishment']);
        setupClickListener('changetype-geocode', ['geocode']);
    }

    google.maps.event.addDomListener(window, 'load', initialize);


});

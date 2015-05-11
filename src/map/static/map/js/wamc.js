// Building a Javascript Module according to the principles outlined here: http://yuiblog.com/blog/2007/06/12/module-pattern/
var WAMC = {};

WAMC.settings = function () {
	return {
		// default setting is that user is not mobile
		USER_IS_MOBILE: false,
		init: function() {
			if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            	this.USER_IS_MOBILE = true;
        	}
			// console.log("Settings for WAMC");
		}
	};
}();

WAMC.loader = function () {
	return {
		init: function() {
    		if (google) {
                // Load Modules
                WAMC.settings.init();
                WAMC.directionsManager.init();
                WAMC.locationServices.init();
                WAMC.displayManager.init();
                WAMC.mapManager.init();
                WAMC.markerManager.init();
                WAMC.controlManager.init();
                WAMC.infoBoxManager.init();
                google.maps.event.addListenerOnce(WAMC.mapManager.map, 'tilesloaded', function(){
                    document.getElementById('loadingmask').style.display = "none";
                });
            }
		}
	};
}();

WAMC.markerManager = function () {
	"use strict";

	var icons;

	//TODO load this from JSON
	icons = {
		start: new google.maps.MarkerImage(
		// URL
		'static/map/images/start.png',
			// (width,height)
			new google.maps.Size( 18, 32 ),
			// The origin point (x,y)
			new google.maps.Point( 0, 0 ),
			// The anchor point (x,y)
			new google.maps.Point( 9, 32 )
		),
		end: new google.maps.MarkerImage(
			// URL
			'static/map/images/end.png',
			// (width,height)
			new google.maps.Size( 18, 32 ),
			// The origin point (x,y)
			new google.maps.Point( 0, 0 ),
			// The anchor point (x,y)
			new google.maps.Point( 9, 32 )
		),
		unselected: new google.maps.MarkerImage(
			// URL
			'static/map/images/unselected_marker.png',
			// (width,height)
			new google.maps.Size( 36, 63 ),
			// The origin point (x,y)
			new google.maps.Point( 0, 0 ),
			// The anchor point (x,y)
			new google.maps.Point( 18, 63 )
		),
		selected: new google.maps.MarkerImage(
			// URL
			'static/map/images/selected_marker.png',
			// (width,height)
			new google.maps.Size( 50, 87 ),
			// The origin point (x,y)
			new google.maps.Point( 0, 0 ),
			// The anchor point (x,y)
			new google.maps.Point( 25, 87 )
		),
		current: new google.maps.MarkerImage(
			// URL
			'static/map/images/current_marker.png',
			// (width,height)
			new google.maps.Size( 51, 65 ),
			// The origin point (x,y)
			new google.maps.Point( 0, 0 ),
			// The anchor point (x,y)
			new google.maps.Point(11, 11 )
		)
	};

	return {
		markers: new Array(),
		makeMarker: function(position, icon_kind, title) {
			var marker, icon_selection;
			icon_selection = icons[icon_kind];
			marker = new google.maps.Marker({
				position: position,
				map: WAMC.mapManager.map,
				icon: icon_selection,
				title: title
			});
			this.markers.push(marker);
			return marker;
		},
		setMarkerPosition: function (marker, position) {
			marker.setPosition(position);
		},
		setMap: function (map) {
			for (var i = 0; i < this.markers.length; i++) {
				this.markers[i].setMap(map);
			}
		},
		showMarkers: function () {
			this.setMap(WAMC.mapManager.map);
		},
		clearMarkers: function () {
			this.setMap(null);
		},
		removeAllMarkers: function () {
			this.clearMarkers();
			this.markers = new Array();
		},
		// Public function for getting icon
		getIcon: function (icon_kind) {
			return icons[icon_kind];
		},
		init: function() {
			// console.log("loaded markerManager");
		}
	};
}();

WAMC.locationServices = function () {
	"use strict";

	var setCurrentLocationMarker, watchCurrentLocation, displayAndWatchCurrentLocation,
	panToCurrentLocation, ne_bound, sw_bound, bounds, geo_options, location_button;

	ne_bound = new google.maps.LatLng(41.799562,-87.587342);
	sw_bound = new google.maps.LatLng(41.780332,-87.605882);
	bounds = new google.maps.LatLngBounds(sw_bound, ne_bound);

	setCurrentLocationMarker = function setCurrentLocationMarker(pos) {
		var user_location, currentLocationMarker;
		// Get User's location from "pos" callback passed from geolocation
		WAMC.locationServices.current_location = new google.maps.LatLng(
			pos.coords.latitude,
			pos.coords.longitude
		);
		// Set the User's Current Location and Make a Marker
		WAMC.locationServices.current_location_marker = WAMC.markerManager.makeMarker(
			WAMC.locationServices.current_location, "current", "Current Location");
	};

	displayAndWatchCurrentLocation = function displayAndWatchCurrentLocation(position) {
		if (bounds.contains(new google.maps.LatLng(position.coords.latitude,
				position.coords.longitude)) == true)
		{
			setCurrentLocationMarker(position);
			watchCurrentLocation();
			WAMC.locationServices.LOCATION_SERVICES_ENABLED = true;
		} else {
			console.log("not tracking location (outside of bounds)");
		}
	};

	watchCurrentLocation = function watchCurrentLocation() {
		var positionTimer;
		positionTimer = navigator.geolocation.watchPosition(
		    function (pos) {
		        WAMC.locationServices.current_location = new google.maps.LatLng(
                    pos.coords.latitude,
                    pos.coords.longitude
                );
    		    WAMC.markerManager.setMarkerPosition(WAMC.locationServices.current_location_marker, WAMC.locationServices.current_location);
		    },
		    function (err) {
    		    console.log(err);
		    },
		    {
                enableHighAccuracy: true,
                maximumAge: 2
            }
		);
	};

	panToCurrentLocation = function panToCurrentLocation() {
		WAMC.mapManager.panToMarker(WAMC.locationServices.current_location_marker);
	};

	return {
		current_location: null,
		current_location_marker: null,
		LOCATION_SERVICES_ENABLED: false,
		panToCurrentLocation: function() {
			panToCurrentLocation();
		},
        init: function() {
        	// if (WAMC.settings.USER_IS_MOBILE) {
                if (navigator.geolocation) {
                	navigator.geolocation.getCurrentPosition(
                		displayAndWatchCurrentLocation, null, geo_options
                	);
                }
            // }
        	// console.log("loaded locationServices");
        }
    };

}();

WAMC.infoBoxManager = function () {
	var theInfoBox;

	// Requires InfoBox.js
	theInfoBox = new InfoBox({
		content: '',
		boxClass: "stop-info-box",
		maxWidth: 0,
		closeBoxURL: "",
		disableAutoPan: true,
		// Pixel offset is assuming width: 130px and padding: 10px
		// for the stop-info-box class
		pixelOffset: new google.maps.Size(-85, 10)
	});

	return {
        updateInfoBox: function (marker, duration) {
        	var box_context;
			//Close previous ClickInfoBox
			theInfoBox.close();

			if (WAMC.locationServices.LOCATION_SERVICES_ENABLED == true) {
				box_content = marker.title + "<br />" + duration
			} else {
				box_content = marker.title
			}

            theInfoBox.setContent(box_content);
            theInfoBox.open(WAMC.mapManager.map, marker);
        },
		init: function() {
			// console.log("Loaded infoBoxManager");
		}
	};
}();

WAMC.mapManager = function () {
    "use strict";

    var panToMarker, offsetLatlng, MY_MAPTYPE_ID, mapOptions,
    featureOpts, styledMapOptions;

    MY_MAPTYPE_ID = 'custom_style';

    mapOptions = {
        center: new google.maps.LatLng(41.789583,-87.599651),
		zoom: 18,
		zoomControl: false,
		mapTypeControlOptions: {
		    mapTypeIds: [google.maps.MapTypeId.SATELLITE, MY_MAPTYPE_ID]
		},
		panControl: false,
		// mapTypeControl: false,
		scaleControl: false,
		streetViewControl: false,
		overviewMapControl: false,
		disableDoubleClickZoom: true,
		mapTypeId: MY_MAPTYPE_ID
    };

    //TODO get from JSON
    featureOpts = [
		{
		    featureType: 'building',
		    "stylers": [
		    	// { "color": "#cbcbbe" },
		    	{ "weight": "1" },
		    	{ "visibility": "on" },
		    ]
		},
		{
		    featureType: 'transit',
		    elementType: 'all',
		    "stylers": [
		    	{ "visibility": "off" },
		    ]
		},
		{
		    featureType: "poi",
		    elementType: "labels",
		    stylers: [
		    	{ "visibility": "off" },
		    ]		  
		},
		{
		    featureType: "poi",
		    elementType: "geometry",
		    "stylers": [
		    	// { "color": "#e7e8e5" },
		    	{ "strokeColor": "ff00ff"},
		    ]
		},
		{
		    featureType: 'poi',
		    elementType: "labels.text.stroke",
		    "stylers": [
		    	{ "visibility": "off" },
		    ]
		},
		{
		    featureType: 'all',
		    elementType: 'labels.text.stroke',
		    "stylers": [
		    	{ "visibility": "off" },
		    ]
		},
		{
		    featureType: "all",
		    elementType: "labels.text",
		    "stylers": [
		    	{ "visibility": "off" },
		    ]
		},
		{
		    featureType: 'road.highway',
		    "stylers": [
		    	// { "color": "#666666" },
		    ]
		},
		{
		    featureType: 'road.arterial',
		    "stylers": [
		    	// { "color": "#999999" },
		    ]
		},
		{
		    featureType: "road.local",
		    "stylers": [
		    	// { "color": "#ffffff" },
		    	{ "weight": "2.75" },
		    ]
		},
		{
		    featureType: "water",
		    "stylers": [
		    	{ "color": "#87b0c3" },
		    ]
		}
	];

	styledMapOptions = {
        name: 'Footpaths'
    };

    panToMarker = function (marker) {
		WAMC.mapManager.map.panTo(marker.position);
	};
    
    return {
    	map: null,
    	increaseZoom: function () {
    		this.map.setZoom(this.map.getZoom()+1);
    	},
    	decreaseZoom: function () {
    		this.map.setZoom(this.map.getZoom()-1);
    	},
    	panToMarker: function (marker) {
    		panToMarker(marker);
    	},
        init: function() {
        	this.map = new google.maps.Map(document.getElementById("map-canvas"),
            mapOptions);
            var customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);
            this.map.mapTypes.set(MY_MAPTYPE_ID, customMapType);
            this.map.setTilt(45);
            // console.log("loaded mapManager");
        }
    };
}();

WAMC.directionsManager = function () {
	var directionsDisplay, directionsService, calcRoute;

	directionsService = new google.maps.DirectionsService();
	directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});		

	calcRoute = function calcRoute(marker, classes_array) {
		var start, end, waypoints, request, calcRoute, newDirection;

		// START
		// If user is using location services, use their current location
		// as the start position. If not, use the campus center.
		if (WAMC.locationServices.LOCATION_SERVICES_ENABLED == true) {
			start = WAMC.locationServices.current_location;
		} else {
			start = new google.maps.LatLng(41.789583,-87.599651);
		}

		//END
		// pop() takes the last item
		// and removes it from the array
		// end = classes_array[classes_array.length - 1].position;
		end = classes_array.pop().position;

		//WAYPOINTS
		// the remainder of the array
		waypoints = new Array();
		for (var i = 0; i < classes_array.length; i++) {
			waypoints.push({
          		location:classes_array[i].position,
          		stopover:true
          	});
		}

		request = {
			origin: start,
			destination: end,
			waypoints: waypoints,
			travelMode: google.maps.TravelMode.WALKING
		};

		directionsService.route(request, function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				// Give infoBox the marker and the duration
				WAMC.infoBoxManager.updateInfoBox(marker, response.routes[0].legs[0].duration.text)
      			directionsDisplay.setDirections(response);
    		}
		});

		directionsDisplay.setMap(WAMC.mapManager.map);
	};

	newDirection = function newDirection(response) {
		// Remove old markers
		WAMC.directionsManager.removeAllDirectionsMarkers();

		// Set new Marker
		var marker, places;
		marker = WAMC.markerManager.makeMarker(
			new google.maps.LatLng(response.lat, response.lng),
			"selected",
			response.name
		);
		WAMC.directionsManager.direction_markers.push(marker);

		// Place marker in Array for directionsManager
		places = new Array();
		places.push(marker);

		$( "#search_bar" ).val(response.name);
		calcRoute(marker, places);
	};

	return {
		direction_markers: new Array(),
		newDirection: function(response) {
			newDirection(response);
		},
		removeAllDirectionsMarkers: function () {
			for (var i = 0; i < this.direction_markers.length; i++) {
				this.direction_markers[i].setMap(null);
			}
			this.direction_markers = new Array();
		},
		init: function() {
// 			console.log("loaded directionsManager");
		}
	};
}();

WAMC.controlManager = function () {
	var addClickEvents;

	addClickEvents = function addClickEvents() {
		var increase_zoom_button, decrease_zoom_button, location_button;

		increase_zoom_button = document.getElementById("inc-zoom-btn");
		decrease_zoom_button = document.getElementById("dec-zoom-btn");
		location_button = document.getElementById("cur-loc-btn");

		increase_zoom_button.onclick = function () {
			WAMC.mapManager.increaseZoom();
		};
		decrease_zoom_button.onclick = function () {
			WAMC.mapManager.decreaseZoom();
		};
		location_button.onclick = function () {
			try {
				WAMC.locationServices.panToCurrentLocation();
			}
			catch (error) {
				alert("Please enable Location Services");
			}
		};
		$("#search_bar").on('click', function() {
			$( "#search_bar" ).val("");
		});
		// When form is "submitted", prevent
		// actual submission and perform jQuery
		$("form").on('submit', function(e) {
			var query;

			e.preventDefault();
			e.returnValue = false;

			query = $("#search_bar").val();

			// Google Analytics Tracking for queries
			if (ga) { ga('send', 'event', 'query', 'search', query) }

			$.ajax({
				type: "GET",
				url: "tags/",
				data: {'tag': query},
				success: function(response){
					WAMC.directionsManager.newDirection(response);
					$( "#search_bar" ).blur();
				},
				error: function(xhr, ajaxOptions, thrownError){
					// $( "#search_bar" ).effect("shake",
					// 	{times:1});
					$( "#search_bar" ).effect( "shake" );
					$( "#search_bar" ).val("");
				}
			});
			
			// alert("Your search for: \"" + query + "\" was useless.");
		});
	};

	return {
		init: function() {
			addClickEvents();
			//console.log("loaded controlManager");
		}
	};

}();

WAMC.displayManager = function () {

	return {
		init: function() {
// 			console.log("loaded displayManager");
		}
	};
}();

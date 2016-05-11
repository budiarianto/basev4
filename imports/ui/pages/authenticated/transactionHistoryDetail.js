var mapAttr = {};
var markers = {};

Meteor.startup(function() {
	mapAttr = Modules.client.googleMapClass;
	
	  GoogleMaps.load({
		  key: mapAttr.key,
		  libraries: mapAttr.libraries  // also accepts an array if you need more than one
	  });
	});

Template.transactionHistoryDetail.onRendered(function() {
	this.autorun(function () {
	    if (GoogleMaps.loaded()) {
	     // $("input").geocomplete();
	  }
	});
});

Template.transactionHistoryDetail.helpers({
	mapOptions: function() {
	    var latLng = Geolocation.latLng();
	    // Initialize the map once we have the latLng.
	    if (GoogleMaps.loaded() && latLng) {
	    	
	      return {
	        center: new google.maps.LatLng(latLng.lat, latLng.lng),
	        zoom: mapAttr.MAP_ZOOM
	      };
	    }
	  }
});

Template.transactionHistoryDetail.events({
    'click #buttonRequest':function(){
        $('#buttonRequest').hide();
        $('#buttonFinish').show();
        $('#sentOrderGreeting').show();
    }
});

Template.transactionHistoryDetail.onCreated(function() {
	
	GoogleMaps.ready('map', function(map) {
		//var latLng = Geolocation.latLng();
		var latLng = {};
		latLng.lat = -6.228011;
		latLng.lng = 106.819758;
		
		//set image for marker
		var imageUrl = {
			    url: mapAttr.MARKER_IMAGE_GREEN, // url
			    scaledSize: new google.maps.Size(mapAttr.MARKER_SIZE_X, mapAttr.MARKER_SIZE_Y), // scaled size
			    origin: new google.maps.Point(mapAttr.MARKER_POINT_X, mapAttr.MARKER_POINT_Y), // origin
			    anchor: new google.maps.Point(mapAttr.MARKER_ANCHOR_X, mapAttr.MARKER_ANCHOR_Y) // anchor
			};
		
	    var marker = new google.maps.Marker({
	      position: new google.maps.LatLng(latLng.lat, latLng.lng),
	      animation: google.maps.Animation.DROP,
	      map: map.instance,
	      icon:imageUrl,
	      draggable: true,
	      id: 'from'
	    });
	    
	    markers['from'] = marker;
	    
	    //buat demo purpose
	    var newLocation = {};
	    newLocation.lat = -6.226262;
	    newLocation.lng = 106.826184;
	    
	    createMarkerTo(newLocation);
	    
	});
});

function createMarkerTo(location){
	var imageUrl = {
			url: mapAttr.MARKER_IMAGE_RED, // url
			scaledSize: new google.maps.Size(mapAttr.MARKER_SIZE_X, mapAttr.MARKER_SIZE_Y), // scaled size
		    origin: new google.maps.Point(mapAttr.MARKER_POINT_X, mapAttr.MARKER_POINT_Y), // origin
		    anchor: new google.maps.Point(mapAttr.MARKER_ANCHOR_X, mapAttr.MARKER_ANCHOR_Y) // anchor
	};	
	var marker = new google.maps.Marker({
	      position: new google.maps.LatLng(location.lat, location.lng),
	      animation: google.maps.Animation.DROP,
	      map:GoogleMaps.maps.map.instance,
	      icon:imageUrl,
	      draggable: true,
	      id: 'to'
	});
	       
}


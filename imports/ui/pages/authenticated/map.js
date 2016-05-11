var mapAttr = {};
var markers = {};

Meteor.startup(function() {
	mapAttr = Modules.client.googleMapClass;
	
	GoogleMaps.load({
		  key: mapAttr.key,
		  libraries: mapAttr.libraries  // also accepts an array if you need more than one
	});
});


Template.map.onDestroyed(function () {
	
	  var _deleteMarkers = Modules.client.deleteMarkers(markers, function(error){
		  if(error)
			  throw new Meteor.Error(error.reason);
	  });
	
	  Session.keys = {};
});

Template.map.onRendered(function() {
	this.autorun(function () {
	    if (GoogleMaps.loaded()) {
	      $("input").geocomplete()
	      .bind("geocode:result", function(event, result){
	    	  var currentTarget = event.target.id;
	    	  var address = result.formatted_address;

	    	  Meteor.call('getLocation', address, (error, result)=>{
		  			if(error)
		  				Bert.alert(error, 'warning');
		  			
		  			var newLocation = {};
		  			newLocation.lat = result[0].latitude;
		  			newLocation.lng = result[0].longitude;
		  			//set location as center
		  			GoogleMaps.maps.map.instance.setCenter(new google.maps.LatLng(newLocation.lat, newLocation.lng));
		  			if(currentTarget==="pickup")
		  				markers['from'].setPosition(newLocation);
		  			else{
		  				
		  				if(!markers['to']){
		  					createMarkerTo(newLocation);
			  			}
			  				
		  				markers['to'].setPosition(newLocation);
		  				
		  			}
		  				
		  		});
		  });
	  }
	});
});

Template.map.helpers({
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

Template.map.events({
	'click #pickup': function(event) {
		Session.set('input_id', '#pickup');
		Session.set('marker_id', 'from');
	},
	'click #destination': function() {
		Session.set('input_id', '#destination');
		Session.set('marker_id', 'to');
	}
});

Template.map.onCreated(function() {
	
	
	
	GoogleMaps.ready('map', function(map) {
		//set image for marker
		var imageUrl = {
			    url: mapAttr.MARKER_IMAGE_GREEN, // url
			    scaledSize: new google.maps.Size(mapAttr.MARKER_SIZE_X, mapAttr.MARKER_SIZE_Y), // scaled size
			    origin: new google.maps.Point(mapAttr.MARKER_POINT_X, mapAttr.MARKER_POINT_Y), // origin
			    anchor: new google.maps.Point(mapAttr.MARKER_ANCHOR_X, mapAttr.MARKER_ANCHOR_Y) // anchor
			};
		
		var latLng = Geolocation.latLng();
	    var marker = new google.maps.Marker({
	      position: new google.maps.LatLng(latLng.lat, latLng.lng),
	      animation: google.maps.Animation.DROP,
	      map: map.instance,
	      icon:imageUrl,
	      draggable: true,
	      id: 'from'
	    });
	    
	    markers['from'] = marker;
	    
	    Meteor.call('getAddress', latLng, (error, result)=>{
    		if(error)
    			Meteor.Error(error);
    		
    		$('#pickup').val(result[0].formattedAddress);
    		
    		Session.set('input_id', '#pickup');
    		Session.set('marker_id', 'from');
    		
    		google.maps.event.addListener(marker, 'dragend', function(event) {
                //Markers.update(marker.id, { $set: { lat: event.latLng.lat(), lng: event.latLng.lng() }});

            	var input = '#pickup';
            	
            	if(marker.id=="to")
            		input = '#destination';
            	
            	var latLng = {};
            	latLng.lat = event.latLng.lat();
            	latLng.lng = event.latLng.lng();
            	
            	Meteor.call('getAddress', latLng, (error, results)=>{
            		if(error)
            			Bert.alert(error, 'warning');
            			
            		$(input).val(results[0].formattedAddress);
            		
            	});
            });
    		
    		 google.maps.event.addListener(map.instance, 'click', function(event) {
    	        	
    	        	var input = Session.get('input_id');
    	        	
    	        	// Using callback
    	        	var latLng = {};
    	        	latLng.lat = event.latLng.lat();
    	        	latLng.lng = event.latLng.lng();
    	        	
//    	        	console.log('clicked marker id: ', Session.get('marker_id'));
//    	        	console.log('input is: ', Session.get('input_id'));
//    	        	console.log('session marker: ', Session.get('marker'));
    	        	
    	        	if(Session.get('marker_id')=="to"){
    	        			
    	        			if(!markers['to']){
    	        				createMarkerTo(latLng);
    	        			}
    	        	}
    	        	
    	        	
    	        	
    	        	markers[Session.get('marker_id')].setPosition(latLng);
    	        	
    	        	Meteor.call('getAddress', latLng, (error, results)=>{
    	        		if(error)
    	        			Bert.alert(error, 'warning');
    	        			
    	        		$(input).val(results[0].formattedAddress);
    	        		
    	        	});
    	        
    	        });
    		
    	});
	    
       

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
	
	google.maps.event.addListener(marker, 'dragend', function(event) {
       var input = '#pickup';
    	
    	if(marker.id=="to")
    		input = '#destination';
    	
    	var latLng = {};
    	latLng.lat = event.latLng.lat();
    	latLng.lng = event.latLng.lng();
    	
    	Meteor.call('getAddress', latLng, (error, results)=>{
    		if(error)
    			Bert.alert(error, 'warning');
    			
    		$(input).val(results[0].formattedAddress);
    		
    	});
    });
	
	markers['to'] = marker;
}
//var markers = {};
//
//Markers.find().observe({  
//  added: function(document) {
//    // Create a marker for this document
//    var marker = new google.maps.Marker({
//      draggable: true,
//      animation: google.maps.Animation.DROP,
//      position: new google.maps.LatLng(document.lat, document.lng),
//      map: map.instance,
//      // We store the document _id on the marker in order 
//      // to update the document within the 'dragend' event below.
//      id: document._id
//    });
//
//    // This listener lets us drag markers on the map and update their corresponding document.
//    google.maps.event.addListener(marker, 'dragend', function(event) {
//      Markers.update(marker.id, { $set: { lat: event.latLng.lat(), lng: event.latLng.lng() }});
//    });
//
//    // Store this marker instance within the markers object.
//    markers[document._id] = marker;
//  },
//  changed: function(newDocument, oldDocument) {
//    markers[newDocument._id].setPosition({ lat: newDocument.lat, lng: newDocument.lng });
//  },
//  removed: function(oldDocument) {
//    // Remove the marker from the map
//    markers[oldDocument._id].setMap(null);
//
//    // Clear the event listener
//    google.maps.event.clearInstanceListeners(
//      markers[oldDocument._id]);
//
//    // Remove the reference to this marker instance
//    delete markers[oldDocument._id];
//  }
//});
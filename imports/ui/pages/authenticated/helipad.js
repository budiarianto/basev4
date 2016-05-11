var mapAttr = {};
var markers = {};

Meteor.startup(function() {
	mapAttr = Modules.client.googleMapClass;

	GoogleMaps.load({
		  key: mapAttr.key,
		  libraries: mapAttr.libraries  // also accepts an array if you need more than one
	});
});

Template.helipad.onDestroyed(function () {
  var _deleteMarkers = Modules.client.deleteMarkers(markers, function(error){
	  if(error)
		  throw new Meteor.Error(error.reason);
  });
  Session.keys = {};
});

Template.helipad.onRendered(function() {
	var template = Template.instance();
	
	
	Tracker.autorun(function(){
			//set radio button
			$('#active').prop('checked', true);
			var id = FlowRouter.getParam('id');
			if(id){
					Meteor.subscribe( 'helipad', id.toString());
			}
		
		Meteor.subscribe( 'cities');
		
	    if (GoogleMaps.loaded()) {
		      $("#location").geocomplete()
		      .bind("geocode:result", function(helipad, result){
		    	  var currentTarget = helipad.target.id;
		    	  var address = result.formatted_address;

		    	  Meteor.call('getLocation', address, (error, result)=>{
			  			if(error)
			  				Bert.alert(error, 'warning');

			  			var newLocation = {};
			  			newLocation.lat = result[0].latitude;
			  			newLocation.lng = result[0].longitude;
			  			
			  			newLocation.country 	= result[0].country;
			  			newLocation.placeId 	= result[0].extra.googlePlaceId;
			  			newLocation.street 		= result[0].streetName;
			  			newLocation.zip 		= result[0].zipcode;

			  			newLocation.level1long 		= result[0].administrativeLevels.level1long;
			  			newLocation.level2long 		= result[0].administrativeLevels.level2long;
			  			newLocation.level3long 		= result[0].administrativeLevels.level3long;
			  			newLocation.level4long 		= result[0].administrativeLevels.level4long;
			  			
			  			//set latitude & longitude
			  			$('#latitude').val(newLocation.lat);
			  			$('#longitude').val(newLocation.lng);

			  			$('#country').val(newLocation.country);
			  			$('#placeId').val(newLocation.placeId);
			  			$('#street').val(newLocation.street);
			  			$('#zip').val(newLocation.zip);

			  			$('#level1long').val(newLocation.level1long);
			  			$('#level2long').val(newLocation.level2long);
			  			$('#level3long').val(newLocation.level3long);
			  			$('#level4long').val(newLocation.level4long);
			  			
			  			//set location as center
			  			GoogleMaps.maps.map.instance.setCenter(new google.maps.LatLng(newLocation.lat, newLocation.lng));
			  			markers['from'].setPosition(newLocation);

			  		});
			  });
		  }
	});

	Meteor.setTimeout(function(){
		var params = {};
		params.id = FlowRouter.getParam('id');
		
		//console.log('params.id', params.id);
		Modules.client.createNewHelipad( { form: "#helipadForm", template: template, params } );
		
		$('#helipadStartDate').datetimepicker({
			format: 'DD/MM/YYYY'
		});
		$('#helipadEndDate').datetimepicker({
			format: 'DD/MM/YYYY'
		});
		$('#helipadStartTime').datetimepicker({
			format: 'HH:mm'
		});
		$('#helipadEndTime').datetimepicker({
			format: 'HH:mm'
		});
	}, 1000);
});

Template.helipad.helpers({
	mapOptions: function() {
	    var latLng = Geolocation.latLng();
	    // Initialize the map once we have the latLng.
	    if (GoogleMaps.loaded() && latLng) {

	      return {
	        center: new google.maps.LatLng(latLng.lat, latLng.lng),
	        zoom: mapAttr.MAP_ZOOM
	      };
	    }
	},
	helipad(){
		return Helipad.findOne({});
	},
	_id(){
		return FlowRouter.getParam('id').toString();
	},
	judul(){
		var id=FlowRouter.getParam('id');
		if(id)
			return "Edit Helipad";
		else
			return "Create New Helipad";
	},
	cities(){
		return City.find({}).fetch();
	},
	isLoading(){
		return Session.get('loading');
	}
});

Template.helipad.events({
	'click #location': function(event) {
		Session.set('input_id', '#location');
		Session.set('marker_id', 'from');
	},
	'change .latlng': function(event) {
		var latLng = {};
		latLng.lat = parseFloat($('#latitude').val());
		latLng.lng = parseFloat($('#longitude').val());
		// console.log('start call get address');
		Session.set('loading', true);
		Meteor.call('getAddress', latLng, (error, result)=>{
	  		if(error){
	  			Bert.alert(error, 'warning');
	  		}else{
	  			
	  			if(result){
		  			
		  			$('#location').val(result[0].formattedAddress);
					$('#country').val(result[0].country);
					$('#placeId').val(result[0].extra.googlePlaceId);
					$('#street').val(result[0].streetName);
					$('#zip').val(result[0].zipcode);

					$('#level1long').val(result[0].administrativeLevels.level1long);
					$('#level2long').val(result[0].administrativeLevels.level2long);
					$('#level3long').val(result[0].administrativeLevels.level3long);
					$('#level4long').val(result[0].administrativeLevels.level4long);
					
					Session.set('input_id', '#location');
					Session.set('marker_id', 'from');
			  		
			  		GoogleMaps.maps.map.instance.setCenter(latLng);
					markers['from'].setPosition(latLng);
				}
	  			
	  		}
	  		Session.set('loading', false);
	  		
	 });
	},
	'submit form': function(event) {
		event.preventDefault();
	},
	'click #cancel': (e)=>{
		e.preventDefault();
		window.history.back();
	}
});

Template.helipad.onCreated(function() {
	//console.log('on onCreated');

	Session.set('defaultLocation', 'default');
	//set helipad status
	Session.set('helipadStatus', 'new');

//	Meteor.call('cityList', 'indonesia', function(error, result){
//		if(!error){
//			//console.log('city list of indonesia : ', result);
//			Session.set('city', result);
//		}
//	});
	
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

        var data = Helipad.findOne({});

        if(data){

   			if(data.location){
  				latLng.lat = data.location.lat;
  				latLng.lng = data.location.lng;
  				
  				//set latitude & longitude
  				$('#latitude').val(latLng.lat);
    			$('#longitude').val(latLng.lng);
    			$('#location').val(data.location.fullAddress);
    			$('#country').val(data.location.country);
	  			$('#placeId').val(data.location.placeId);
	  			$('#street').val(data.location.street);
	  			$('#zip').val(data.location.zip);

	  			if(data.location.administrativeLevels){
	  				$('#level1long').val(data.location.administrativeLevels.level1long);
		  			$('#level2long').val(data.location.administrativeLevels.level2long);
		  			$('#level3long').val(data.location.administrativeLevels.level3long);
		  			$('#level4long').val(data.location.administrativeLevels.level4long);
	  			}
	  			
	  			GoogleMaps.maps.map.instance.setCenter(latLng);
        		markers['from'].setPosition(latLng);
		  	}


        }

	    Meteor.call('getAddress', latLng, (error, result)=>{
    		if(error)
    			Meteor.Error(error);

    	   $('#location').val(result[0].formattedAddress);
  		 	//set latitude & longitude
			$('#latitude').val(latLng.lat);
			$('#longitude').val(latLng.lng);
	
  			$('#country').val(result[0].country);
  			$('#placeId').val(result[0].extra.googlePlaceId);
  			$('#street').val(result[0].streetName);
  			$('#zip').val(result[0].zipcode);

  			$('#level1long').val(result[0].administrativeLevels.level1long);
  			$('#level2long').val(result[0].administrativeLevels.level2long);
  			$('#level3long').val(result[0].administrativeLevels.level3long);
  			$('#level4long').val(result[0].administrativeLevels.level4long);
  			
    		Session.set('input_id', '#location');
    		Session.set('marker_id', 'from');

    		google.maps.event.addListener(marker, 'dragend', function(event) {

               	var input = '#location';
            	var latLng = {};
            	latLng.lat = event.latLng.lat();
            	latLng.lng = event.latLng.lng();
            	//set latitude & longitude
      			$('#latitude').val(event.latLng.lat());
      			$('#longitude').val(event.latLng.lng());

            	Meteor.call('getAddress', latLng, (error, result)=>{
            		if(error)
            			Bert.alert(error, 'warning');

            		$(input).val(result[0].formattedAddress);

            		$('#country').val(result[0].country);
          			$('#placeId').val(result[0].extra.googlePlaceId);
          			$('#street').val(result[0].streetName);
          			$('#zip').val(result[0].zipcode);

          			$('#level1long').val(result[0].administrativeLevels.level1long);
          			$('#level2long').val(result[0].administrativeLevels.level2long);
          			$('#level3long').val(result[0].administrativeLevels.level3long);
          			$('#level4long').val(result[0].administrativeLevels.level4long);
          			
            	});
            });

    		 google.maps.event.addListener(map.instance, 'click', function(event) {

    	        	var input = Session.get('input_id');

    	        	// Using callback
    	        	var latLng = {};
    	        	latLng.lat = event.latLng.lat();
    	        	latLng.lng = event.latLng.lng();

    	        	//set latitude & longitude
	      			$('#latitude').val(latLng.lat);
	      			$('#longitude').val(latLng.lng);

    	        	markers[Session.get('marker_id')].setPosition(latLng);

    	        	Meteor.call('getAddress', latLng, (error, result)=>{
    	        		if(error)
    	        			Bert.alert(error, 'warning');

    	        		$(input).val(result[0].formattedAddress);
    	        		
    	        		$('#country').val(result[0].country);
              			$('#placeId').val(result[0].extra.googlePlaceId);
              			$('#street').val(result[0].streetName);
              			$('#zip').val(result[0].zipcode);

              			$('#level1long').val(result[0].administrativeLevels.level1long);
              			$('#level2long').val(result[0].administrativeLevels.level2long);
              			$('#level3long').val(result[0].administrativeLevels.level3long);
              			$('#level4long').val(result[0].administrativeLevels.level4long);

    	        	});

    	        });

    	});

	});
});
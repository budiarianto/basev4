var mapAttr = {};
var markers = {};

Meteor.startup(function() {
	mapAttr = Modules.client.googleMapClass;

	GoogleMaps.load({
		  key: mapAttr.key,
		  libraries: mapAttr.libraries  // also accepts an array if you need more than one
	});
});

Template.event.onDestroyed(function () {
  var _deleteMarkers = Modules.client.deleteMarkers(markers, function(error){
	  if(error)
		  throw new Meteor.Error(error.reason);
  });
  Session.keys = {};
});

Template.event.onRendered(function() {
	var template = Template.instance();

	Tracker.autorun(function(){

		  if (GoogleMaps.loaded()) {
		      $("#location").geocomplete()
		      .bind("geocode:result", function(event, result){
		    	  var currentTarget = event.target.id;
		    	  var address = result.formatted_address;

		    	  Meteor.call('getLocation', address, (error, result)=>{
			  			if(error)
			  				Bert.alert(error, 'warning');

			  			var newLocation = {};
			  			newLocation.lat = result[0].latitude;
			  			newLocation.lng = result[0].longitude;
			  			//set latitude & longitude
			  			$('#latitude').val(newLocation.lat);
			  			$('#longitude').val(newLocation.lng);
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
		Modules.client.updateNewEvent( { form: "#eventForm", template: template, params } );

		$('#eventStartDate').datetimepicker({
			format: 'DD/MM/YYYY'
		});
		$('#eventEndDate').datetimepicker({
			format: 'DD/MM/YYYY'
		});
		$('#eventStartTime').datetimepicker({
			format: 'LT'
		});
		$('#eventEndTime').datetimepicker({
			format: 'LT'
		});
	}, 1000);
});

Template.event.helpers({
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
	videoId: ()=>{
		return Session.get('videoId');
	},
	event(){
		return Event.findOne({});
	},
	youtubeId(){
		var youtubeId = Session.get('youtubeId');
		if(youtubeId && youtubeId!='undefined')
			return youtubeId;
	},
	_id: ()=>{
		return FlowRouter.getParam('id').toString();
	}
});

Template.event.events({
	'click #location': function(event) {
		Session.set('input_id', '#location');
		Session.set('marker_id', 'from');
	},
	'submit form': function(event) {
		event.preventDefault();
	},
	'click .btn-img-event': function(event) {
		event.preventDefault();
		$("input[type=file]").click();
	},
	'change #videoId': (event)=>{
		Session.set('youtubeId', event.target.value.trim());
	},
	'click #cancel': ()=>{
		Session.set('eventStatus', 'canceled');
		var id = FlowRouter.getParam('id');
		Meteor.call('cancelCreateEvent', id, (error, result)=>{
			if(error)
				Bert.alert(error, 'warning');
			else
				FlowRouter.go('/heliTour');
		});
	}
});

Template.event.onCreated(function() {
	//console.log('on onCreated');

	Session.set('defaultLocation', 'default');

	var id = FlowRouter.getParam('id');
	this.autorun(function (computation) {
		Meteor.subscribe( 'event', id );
	});

	//set event status
	Session.set('eventStatus', 'new');

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

        var data = Event.findOne({});

        if(data){

  		  if(data.videoId){
  				Session.set('youtubeId', data.videoId);
  			}else{
  				Session.set('youtubeId', 'undefined');
  			}

  			if(data.location){
  				latLng.lat = data.location.lat;
  				latLng.lng = data.location.lng;

  				//set latitude & longitude
        			$('#latitude').val(latLng.lat);
        			$('#longitude').val(latLng.lng);

        			$('#location').val(data.location.fullAddress);

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

    	        	//set latitude & longitude
	      			$('#latitude').val(latLng.lat);
	      			$('#longitude').val(latLng.lng);

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



Template.imgEvent.onRendered(() => {
	var owl = $(".owl-carousel").owlCarousel({
		items : 1
	});
	var owlItemLen = $(owl).find('.owl-item').length;
	cropInit(owlItemLen);
});

Template.imgEvent.events({
	'click .btn-cancel': function() {
		$('.img-container').addClass('hidden');
		$('.btn-cancel, .btn-rotate, .btn-crop').addClass('btn-none');
		$('.btn-upload-text').text('Add Image Event');
		$('.btn-crop').removeClass('disabled');
	},
	'click .delete': function(event) {
		var target = $(event.target).closest('.active').index();
		$('.owl-carousel').data('owlCarousel').removeItem(target);
	}
});

function cropInit(items) {
	if (items) {
		$('.img-container').addClass('hidden');
	}

	// var console = window.console || { log: function () {} };
	var $image = $('#image');
	var $dataX = $('#dataX');
	var $dataY = $('#dataY');
	var $dataHeight = $('#dataHeight');
	var $dataWidth = $('#dataWidth');
	var $dataRotate = $('#dataRotate');
	var $dataScaleX = $('#dataScaleX');
	var $dataScaleY = $('#dataScaleY');
	var options = {
	    viewMode: 1,
	    dragMode: 'move',
	    aspectRatio: 16 / 6,
	    guides: false,
	    highlight: false,
	    // autoCropArea: 1,
	    cropBoxMovable: false,
	    cropBoxResizable: false,
	    toggleDragModeOnDblclick: false,
	    crop: function (e) {
				$dataX.val(Math.round(e.x));
				$dataY.val(Math.round(e.y));
				$dataHeight.val(Math.round(e.height));
				$dataWidth.val(Math.round(e.width));
				$dataRotate.val(e.rotate);
				$dataScaleX.val(e.scaleX);
				$dataScaleY.val(e.scaleY);
			}
	};

	// Cropper
	$image.on({
		'build.cropper': function (e) {
			// console.log(e.type);
		},
		'built.cropper': function (e) {
			// console.log(e.type);
		},
		'cropstart.cropper': function (e) {
			// console.log(e.type, e.action);
		},
		'cropmove.cropper': function (e) {
			// console.log(e.type, e.action);
		},
		'cropend.cropper': function (e) {
			// console.log(e.type, e.action);
		},
		'crop.cropper': function (e) {
			// console.log(e.type, e.x, e.y, e.width, e.height, e.rotate, e.scaleX, e.scaleY);
		},
		'zoom.cropper': function (e) {
			// console.log(e.type, e.ratio);
		}
	}).cropper(options);

	$('.btn-rotate, .btn-crop').addClass('btn-none');

	// Buttons
	if (!$.isFunction(document.createElement('canvas').getContext)) {
		$('button[data-method="getCroppedCanvas"]').prop('disabled', true);
	}

	if (typeof document.createElement('cropper').style.transition === 'undefined') {
		$('button[data-method="rotate"]').prop('disabled', true);
		$('button[data-method="scale"]').prop('disabled', true);
	}

	// Methods
	$('.crop-acts').on('click', '[data-method]', function () {
		var $this = $(this);
		var data = $this.data();
		var $target;
		var result;

		if ($this.prop('disabled') || $this.hasClass('disabled')) {
			return;
		}

		if ($image.data('cropper') && data.method) {
			data = $.extend({}, data); // Clone a new one

			if (typeof data.target !== 'undefined') {
				$target = $(data.target);

				if (typeof data.option === 'undefined') {
					try {
						data.option = JSON.parse($target.val());
					} catch (e) {
						// console.log(e.message);
					}
				}
			}

			result = $image.cropper(data.method, data.option, data.secondOption);

			switch (data.method) {
				case 'scaleX':
				case 'scaleY':
					$(this).data('option', -data.option);
					break;

				case 'getCroppedCanvas':
					if (result) {
						cropIt(data, result);
					}
					break;
			}

			if ($.isPlainObject(result) && $target) {
				try {
					$target.val(JSON.stringify(result));
				} catch (e) {
					// console.log(e.message);
				}
			}

		}
	});

	// Import image
	var $inputImage = $('#inputImgEvent');
	var URL = window.URL || window.webkitURL;
	var blobURL, dataURL;

	if (URL) {
		$inputImage.change(function() {
			var files = this.files;
			var file;
			var opts = {};

			if (!$image.data('cropper')) {
				return;
			}

			if (files && files.length) {
				file = files[0];

				if (/^image\/\w+$/.test(file.type)) {
					loadImage.parseMetaData(file, function(data) {
						if (data.exif && data.exif.get('Orientation') > 1) {
							opts.orientation = data.exif.get('Orientation');
							loadImage(file, function(canvas) {
								dataURL = canvas.toDataURL();
								$image.one('built.cropper', function () {
									URL.revokeObjectURL(dataURL);
								}).cropper('reset').cropper('replace', dataURL);
								$inputImage.val('');
							}, opts);
						} else {
							blobURL = URL.createObjectURL(file);
							$image.one('built.cropper', function () {
								URL.revokeObjectURL(blobURL);
							}).cropper('reset').cropper('replace', blobURL);
							$inputImage.val('');
						}
					});
					cropSet(file);
				} else {
					window.alert('Please choose an image file.');
				}
			}
		});
	} else {
		$inputImage.prop('disabled', true).parent().addClass('disabled');
	}
}

function cropSet(file) {
	$('.img-container').removeClass('hidden');
	$('.btn-cancel, .btn-rotate, .btn-crop').removeClass('btn-none');
	$('.btn-upload-text').text('Change Image');

	var opts = $('.btn-crop').data('option');
	    opts.type = file.type;
	    opts.name = Meteor.userId();

	$('.btn-crop').data('option', opts);
}

function cropIt(data, canvas) {
	$('.btn-upload, .btn-crop, .btn-cancel').addClass('disabled');
	$('.btn-disable').click();
	$('.cropper-loading').removeClass('hidden');

	var content,
			paramMap = {};
	    paramMap = data.option;
	    paramMap.name = paramMap.name;
	    paramMap.base64 = canvas.toDataURL();
	    paramMap.timestamp = new Date().getTime();

	var datas = new FormData();

	datas.append('public_id', paramMap.name + '_' + paramMap.timestamp);
	datas.append('file', paramMap.base64);
	datas.append('timestamp', paramMap.timestamp);
	datas.append('api_key', '133869293735318');
	datas.append('upload_preset', 'wsa-event');

	$.ajax({
		method: 'POST',
		url: 'https://api.cloudinary.com/v1_1/bisnispages/image/upload',
		data: datas,
		processData: false,
		contentType: false
	})
	.done(function(response) {
		var oldUrl = Meteor.user().profile.backgroundImgUrl;
		var media = {};
		media.refType = 'Event';
		media.refId = Meteor.userId();
		media.cloudType = 'Cloudinary';
		media.cloudId = response.public_id;
		media.type = 'Event.Image';
		media.status = 'Active';
		media.mimeType = response.resource_type + '/' + response.format;
		media.size = response.bytes;
		media.url = response.secure_url;

		// Element Manipulation After Success Upload to Cloudinary
		var content = "<div class=\"item\"><img src=\"" + media.url + "\"><span class=\"delete\"></span></div>";
		$('.owl-carousel').data('owlCarousel').addItem(content);
		$('.btn-upload, .btn-crop, .btn-cancel').removeClass('disabled');
		$('.btn-enable').click();
		$('.btn-cancel').click();
		$('.cropper-loading').addClass('hidden');

		// Save To Database
		/* Meteor.call('user_upload_media', media, function(error, response) {
			if (error) {
				Bert.alert(error.error.message, 'error');
			} else {
				Meteor.call('user_update_profile_background', Meteor.userId(), media.url, function(error, response) {
					if (error) {
						Bert.alert(error.error.message, 'error');
					} else {
						Session.set('showChangeProfileImage', false);
						Session.set('showChangeProfileBackground', false);
						Session.set('showProfileCard', true);
					}
				});
			}
		});

		var options 	= {};
		options.refType = "Event";
		options.refId 	= media.refId;
		options.cloudId = response.public_id;
		options.type 	= "Event.Image";
		options.url 	= oldUrl;

		Modules.client.deleteMedia(options, function(error) {
			if (error) {
				throw new Meteor.Error(error);
			}
		}); */
	})
	.fail(function(response, status) {
		Bert.alert('Upload Fail', 'error')
		console.log(response, status);
	});
}

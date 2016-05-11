Template.fare.onDestroyed(function () {
  Session.keys = {};
});

Template.fare.onRendered(function() {
	var template = Template.instance();
	
	
	Tracker.autorun(function(){
		Meteor.subscribe('routes');
		Meteor.subscribe('helipads');
		Meteor.subscribe('cities');
	});

	Meteor.setTimeout(function(){
		//console.log('params.id', params.id);
		Modules.client.createNewFare( { form: "#fareForm", template: template} );
		$('#fareStartTime').datetimepicker({
			format: 'HH:mm'
		});
		$('.collapse').collapse('hide');
		
	}, 1000);
});

Template.fare.helpers({
	judul(){
			return "Create New Fare";
	},
	cities(){
		return City.find({}).fetch();
	},
	departureLocation(){
		var city = Session.get('departureCity');
		var departure = Helipad.find({'location.city': city},{sort:{'_id': 1}}).fetch();
		//console.log('departure', departure);
		return departure;
	},
	destinationLocation(){
		var city = Session.get('destinationCity');
		var departureLocation = $('#departureLocation').val();
		return Helipad.find({'location.city': city, _id: {$ne: departureLocation}},{sort:{'_id': 1}}).fetch();
	}
});

Template.fare.events({
	'submit form': function(event) {
		event.preventDefault();
	},
	'click #cancel': (e)=>{
		e.preventDefault();
		window.history.back();
	},
	'change #departureCity': function(event) {
		//console.log('this', $(this));
		event.preventDefault();
		var city = $('#departureCity').val();
		//console.log('departureCity', city);
		Session.set('departureCity', city);
		var destinationLocation = Helipad.find({'location.city': city});
		if(destinationLocation){
//			$('#destinationCityCollapse').collapse('show');
			$('#departureCollapse').collapse('show');
		}
		else{
			$('#departureCollapse').collapse('hide');
//			$('#destinationCityCollapse').collapse('hide');	
		}
		
	},
	'change #destinationCity': function(event) {
		//console.log('this', $(this));
		event.preventDefault();
		var city = $('#destinationCity').val();
		//console.log('destinationCity', city);
		Session.set('destinationCity', city);
		var destinationLocation = Helipad.find({'location.city': city});
		if(destinationLocation)
			$('#destinationCollapse').collapse('show');
		else
			$('#destinationCollapse').collapse('hide');
	}
});

Template.fare.onCreated(function() {
	Meteor.call('cityList', 'indonesia', function(error, result){
		if(!error){
			Session.set('city', result);
		}
	});
});
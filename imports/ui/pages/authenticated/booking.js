Template.booking.onDestroyed(function () {
  Session.keys = {};
});

Template.booking.onCreated(function () {
	Session.keys = {};
});

Template.booking.onRendered(function() {
	var template = Template.instance();
	Tracker.autorun(function(){	
		Meteor.subscribe('members');
		Meteor.subscribe('cities');
		Meteor.subscribe('fares');
		Meteor.subscribe('helipads');
	});

	Meteor.setTimeout(function(){
		Modules.client.createNewBooking( { form: "#bookingForm", template: template} );
		
		$('#flightDate').datetimepicker({
			format: 'DD/MM/YYYY HH:mm'
		});
//		$('#flightTime').datetimepicker({
//			format: 'HH:mm'
//		});
		$('.collapse').collapse('hide');
		
		$(".modal").on("shown.bs.modal", function()  { // any time a modal is shown
			    var urlReplace = "#" + $(this).prop('id'); // make the hash the id of the modal shown
			    history.pushState(null, null, urlReplace); // push state that hash into the url
		});

		  // If a pushstate has previously happened and the back button is clicked, hide any modals.
		$(window).on('popstate', function() { 
		    $(".modal").modal('hide');
		});
			  
	}, 1000);
});

Template.booking.helpers({
	booking(){
		return Booking.findOne({});
	},
	departureCity(){
//		var routes = City.find({},{sort:{'sequence': 1}}).fetch();
//		return routes;

		var fare = Fare.find({status: 'Active'}).fetch();
		
		var fareCity = _.pluck(fare, 'departureCity');
		var departureCity = _.uniq(fareCity);
		
		return City.find({city: { $in: departureCity }},{sort:{'sequence': 1}}).fetch();
	},
	departureLocation(){
		var city = Session.get('departureCity');
		return Helipad.find({'location.city': city},{sort:{'_id': 1}}).fetch();
	},
	destinationCity(){
		var city = Session.get('departureCity');
		var departureId = Session.get('departureId'); 
		var fare = {};
		if(departureId)
			fare = Fare.find({'departureCity': city, 'departureId': departureId}).fetch();
		else
			fare = Fare.find({'departureCity': city}).fetch();
		
		var arrivalCity = _.pluck(fare, 'arrivalCity');
		var destinationCity = _.uniq(arrivalCity);
		
		return City.find({city: { $in: destinationCity }},{sort:{'sequence': 1}}).fetch();
		
	},
	destinationLocation(){
		var arrivalCity = Session.get('destinationCity');
		var departureCity = Session.get('departureCity');
		var departureId = Session.get('departureId'); 
		var data = Fare.find({'departureCity': departureCity,'arrivalCity': arrivalCity,'departureId': departureId},{sort:{'_id': 1}}).fetch();
		return data;
	},
	amountString(){
		var departureCity = Session.get('departureCity');
		var departureId = Session.get('departureId'); 
		var arrivalCity = Session.get('destinationCity');
		var arrivalId = Session.get('destinationId'); 
		
		if(departureCity && departureId && arrivalCity && arrivalId){
			var data = Fare.findOne({'departureCity': departureCity,'arrivalCity': arrivalCity,'departureId': departureId, 'arrivalId': arrivalId});
			//console.log('fare amount: ', data);
			if(data){
				Session.set('amount', data.price);
				return accounting.formatNumber(data.price);
			}else{
				Session.set('amount', 0);
				return 0;
			}
		}else{
			Session.set('amount', 0);
			return 0;
		}
	},
	amount(){
		return parseFloat(Session.get('amount'));
	},
	judul(){
			return "Create New Book";
	}
});

Template.booking.events({
	'submit form': function(event) {
		event.preventDefault();
	},
	'change #departureCity': function(event) {
		event.preventDefault();
		var city = $('#departureCity').val();
		Session.set('departureCity', city);
		var destinationLocation = Helipad.find({'location.city': city});
		if(destinationLocation){
			$('#departureCollapse').collapse('show');
		}
		else{
			$('#departureCollapse').collapse('hide');
		}
		
	},
	'change #departureLocation': function(event) {
		event.preventDefault();
		var departureId = $('#departureLocation').val();
		Session.set('departureId', departureId);
	},
	'change #destinationLocation': function(event) {
		event.preventDefault();
		var destinationId = $('#destinationLocation').val();
		Session.set('destinationId', destinationId);
	},
	'change #destinationCity': function(event) {
		event.preventDefault();
		var city = $('#destinationCity').val();
		Session.set('destinationCity', city);
		var destinationLocation = Helipad.find({'location.city': city});
		if(destinationLocation)
			$('#destinationCollapse').collapse('show');
		else
			$('#destinationCollapse').collapse('hide');
	},
	'click #cancel': (e)=>{
		e.preventDefault();
		window.history.back();
	}
});

Template.booking.onCreated(function() {
	
});
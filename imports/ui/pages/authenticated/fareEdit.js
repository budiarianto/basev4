Template.fareEdit.onDestroyed(function () {
  Session.keys = {};
});

Template.fareEdit.onRendered(function() {
	var template = Template.instance();
	
	
	Tracker.autorun(function(){
			
			Meteor.subscribe('cities');
			Meteor.subscribe('helipads');
			var id = FlowRouter.getParam('id');
			if(id){
				Meteor.subscribe( 'fare', id);
			}
	});

	Meteor.setTimeout(function(){
		var params = {};
		params.id = FlowRouter.getParam('id');
		//console.log('params.id', params.id);
		Modules.client.updateFare( { form: "#fareForm", template: template, params: params} );
		$('#fareStartTime').datetimepicker({
			format: 'HH:mm'
		});
		
		$('.collapse').collapse('hide');
		
		var fare = Fare.findOne({});
		if(fare){
			//set city on session
			Session.set('departureCity', fare.departureCity);
			Session.set('destinationCity', fare.arrivalCity);
			
			//set city
			$("#departureCity").val(fare.departureCity);
			$("#destinationCity").val(fare.arrivalCity);
			//set Location
			$("#departureLocation").val(fare.departureId);
			$("#destinationLocation").val(fare.arrivalId);
			
			Meteor.setTimeout(function(){
				//set Location
				$("#departureLocation").val(fare.departureId);
				$("#destinationLocation").val(fare.arrivalId);
				
				$('#departureCollapse').collapse('show');
				$('#destinationCollapse').collapse('show');
				
			}, 1000);
		}
		
	}, 1000);
});

Template.fareEdit.helpers({
	fare(){
		return Fare.findOne({});
	},
	judul(){
			return "Edit Fare";
	},
	priceString(){
		//console.log('this.price', this.price);
		return accounting.formatNumber(this.price);
	},
	dt(){
		var tm = moment(new Date(this.airTime.toString())).format('HH:mm');
		//console.log('tm', tm);
		return tm;
	},
	isActive(){
		if(this.status=="Active")
			return 'checked';
	},
	isCity(){
		if(this.routeType=="City")
			return 'checked';
	},
	cities(){
		return City.find({}).fetch();
	},
	departureLocation(){
		var city = Session.get('departureCity');
		var departure = Helipad.find({'location.city': city},{sort:{'_id': 1}}).fetch();
		return departure;
	},
	destinationLocation(){
		var city = Session.get('destinationCity');
		var destinationLocation = $('#departureLocation').val();
		var destination = Helipad.find({'location.city': city, _id: {$ne: destinationLocation}},{sort:{'_id': 1}}).fetch();
		return destination;
	}
});

Template.fareEdit.events({
	'submit form': function(event) {
		event.preventDefault();
	},
	'click #save': function(event) {
		event.preventDefault();
		$('#fareForm').submit();
	},
	'click #cancel': (e)=>{
		e.preventDefault();
		window.history.back();
	},
	'click #delete': (e)=>{
		e.preventDefault();
		var id = FlowRouter.getParam('id');
		Meteor.call('removeFare', id, function(error){
			if(error)
				Bert.alert(error.reason, 'warning');
			
			FlowRouter.go('/fareList');
		});
		
	},
	'change #departureCity': function(event) {
		//console.log('this', $(this));
		event.preventDefault();
		var city = $('#departureCity').val();
		//console.log('departureCity', city);
		Session.set('departureCity', city);
		var destinationLocation = Helipad.find({'location.city': city});
		if(destinationLocation){
			$('#departureCollapse').collapse('show');
		}
		else{
			$('#departureCollapse').collapse('hide');
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

Template.formAddRoute.events({
	'submit form': function(event) {
		event.preventDefault();
		var id = FlowRouter.getParam('id');
		
		var departure 	= event.target.departure.value;
		var arrival 	= event.target.arrival.value;
		
		if(departure && departure!="undefined" && arrival && arrival!="undefined"){
			Meteor.call('addFareRoutes', id, departure, arrival, function(error){
				if(error)
					Bert.alert(error.reason, 'warning');
				
				$('#formAddRoute').collapse('toggle');
			});
		}
		
	
	}
	
});

Template.formAddRoute.helpers({
	city(){
		return Session.get('city');
	}
});

Template.routeData.events({
	'click .deleteRoute': function(event) {
		//event.preventDefault();
		var id = FlowRouter.getParam('id');
		//console.log('event target', event.target);
		var departure 	= this.departure;
		var arrival 	= this.arrival;
		
		if(departure && departure!="undefined" && arrival && arrival!="undefined"){
			Meteor.call('removeFareRoutes', id, departure, arrival, function(error, result){
				if(error)
					Bert.alert(error.reason, 'warning');
			});
		}
	}
});

Template.fareEdit.onCreated(function() {
	Meteor.call('cityList', 'indonesia', function(error, result){
		if(!error){
			Session.set('city', result);
		}
	});
});
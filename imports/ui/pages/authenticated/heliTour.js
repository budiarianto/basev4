Template.heliTour.onDestroyed(function() {
	
});

Template.heliTour.onRendered(function() {
	
});

Template.heliTour.helpers({
	eventList(){
		var eventList = Event.find({status: 'Active'}, {sort: {startDate: 1}}).fetch();
		console.log(eventList);
		return eventList;
	},
	manifestCount(){
		//console.log(this);
		return Manifest.find({eventId: this._id}).count();
	},
	imgUrl(){
	//	console.log(this);
		if(this && this.images){
			var img = this.images.imgUrl;
			
			if(img)
				return img;
			
		}
		
		return "/images/default-2.png"
		
	},
	dt(){
		//console.log('coba',this);
		var dt={};
		
		if(this){
			
			if(this.startDate)
				dt.startDate = moment(this.startDate.toISOString()).format('DD/MM/YYYY');
			if(this.thruDate)
				dt.thruDate = moment(this.thruDate.toISOString()).format('DD/MM/YYYY');
			if(this.startTime)
				dt.startTime = moment(this.startTime.toISOString()).format('HH:mm');
			if(this.thruTime)
				dt.thruTime = moment(this.thruTime.toISOString()).format('HH:mm');
			
			return dt;
			
		}

	}
});

Template.heliTour.events({
	'click #createEvent': function(event) {
		Meteor.call('createEvent', function(error, result){
			FlowRouter.go('/event/'+result);
		});
	},
	'click form': function(event) {
		event.preventDefault();
		//run search
		
	}
});

Template.heliTour.onCreated(function() {
	var id = FlowRouter.getParam('id');
	this.autorun(function (computation) {
		Meteor.subscribe( 'manifests');
		Meteor.subscribe( 'events');
	});
});
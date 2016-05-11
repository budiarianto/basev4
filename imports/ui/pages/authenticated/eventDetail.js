Template.eventDetail.onCreated(function() {
	var id = FlowRouter.getParam('id');
	this.autorun(function () {
		Meteor.subscribe( 'event', id);
		
	});
});
Template.eventDetail.onRendered(function() {
	Meteor.setTimeout(function(){
		$(".owl-carousel").owlCarousel({
			items : 1,
			video: true,
			merge: true,
			videoWidth : 360,
			videoHeight: 360,
		});
		
		var data = Event.findOne({});
		if(data){
			console.log(data);
			console.log('data.descriptions', data.descriptions);
			console.log('data.details', data.details);
			if(data.descriptions)
				$('.descriptions').html(data.descriptions);

			if(data.details)
				$('.details').html(data.details);
		}
		$(document).scrollTop(0);
		
	}, 1000);

});

Template.eventDetail.helpers({
	_event(){
		var data = Event.findOne({});
		return data;
	},
	dateTime(){
		
		var data = Event.findOne({});
		
		var dt={};
		
		if(data){
			if(data.startDate)
				dt.startDate = moment(data.startDate.toLocaleDateString()).format('DD/MM/YYYY');
			
			if(data.thruDate)
				dt.thruDate = moment(data.thruDate.toLocaleDateString()).format('DD/MM/YYYY');
			
			if(data.startTime)
				dt.startTime = moment(data.startTime.toString()).format('HH:mm');
				
			if(data.thruTime)
				dt.thruTime = moment(data.thruTime.toString()).format('HH:mm');
		}
		
		return dt;
		
	},
	eventId(){
		var id = FlowRouter.getParam('id');
		return id;
	}
});
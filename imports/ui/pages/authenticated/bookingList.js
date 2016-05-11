Template.bookingList.onCreated(function(){
	this.autorun(function(){
		Meteor.subscribe('bookings');
	});
	Session.keys = {};
});

Template.bookingList.onDestroyed(function () {
	  Session.keys = {};
});

Template.bookingList.onRendered(function(){
	$('#fromDate').datetimepicker({
		format: "DD/MM/YYYY"
	});
	$('#thruDate').datetimepicker({
		format: "DD/MM/YYYY"
	});
	
});

Template.bookingList.helpers({
	bookings(){
		var status = Session.get('status');
		var fromDate = Session.get('fromDate');
		var thruDate = Session.get('thruDate');
		var keyword = Session.get('keyword');
		var data = {};
		var conditions = [];
		
		var afterDate = new Date(thruDate);
		afterDate.setDate(afterDate.getDate() + 1);
		
		conditions.push({'status': {$ne: 'Canceled'}});
		conditions.push({'status': {$ne: 'Refund'}});
		conditions.push({'status': {$ne: 'Closed'}});
		
		if(status && status!="undefined"){
			conditions.push({'status': status});
		}
		
		if(fromDate && fromDate!="undefined"){
			conditions.push({flightDate: {$gte: new Date(fromDate)}});
		}

		if(thruDate && thruDate!="undefined"){
			conditions.push({flightDate: {$lte: afterDate}});
		}

		if(keyword && keyword!="undefined"){
			conditions.push({$or: [{'bookingCode': {$regex: keyword, $options: 'i'}},{'billingInfo.fullName': {$regex: keyword, $options: 'i'}},{'departureLocation': {$regex: keyword, $options: 'i'}},{'destinationLocation': {$regex: keyword, $options: 'i'}}]});
		}

		$("#tableBooking").trigger("destroy");
		data = Booking.find({$and: conditions},{sort: {'flightDate': 1, 'flightTime': 1}}).fetch();
		Session.set('bookings', data);
		Meteor.setTimeout(function(){
			$("#tableBooking").tablesorter({
				 sortList: [[4,0],[5,0]],
				 sortMultiSortKey: 'altKey',
				 headers: {
			            4: { sorter: "myDateFormat" }
			        }
			});
		}, 1000);
		return data;
		
	},
	subTotal(){
		var data 		= Session.get('bookings'); //Booking.find({$and: [{status: {$ne: 'Canceled'}},{status: {$ne: 'Closed'}}]},{sort: {'flightDate': 1, 'flightTime': 1}}).fetch();
		var amount 		= _.pluck(data,'fare');
		var subTotal 	= _.reduce(amount, function(subTotal, num){ return subTotal + num; }, 0)
		return accounting.formatNumber(subTotal);
	}
});

Template.BookingData.helpers({
	isOpen(){
		if(this && this.status=="Open")
		return true;
	},
	isWaiting(){
		if(this && this.status=="Waiting Confirmation")
			return true;
	},
	isConfirmed(){
		if(this && this.status=="Confirmed")
			return true;
	},
	isClosed(){
		if(this && this.status=="Closed")
			return true;
	},
	isPaid(){
		if(this && this.status=="Paid")
			return true;
	},
	priceString(){
		return accounting.formatNumber(this.fare);
	},
	bookDateString(){
		return moment(new Date(this.createdDate.toString())).format('DD/MM/YYYY');;
	},
	flightDateString(){
		return moment(new Date(this.flightDate.toString())).format('DD/MM/YYYY');;
	},
	flightTimeString(){
		return  moment(new Date(this.flightTime.toString())).format('HH:mm');;
	}
	
});
Template.bookingList.events({
	'click tr': function(event) {
		if(this._id)
		FlowRouter.go('/bookingEdit/'+this._id)
	},
	'change .bookingStatus': function(event) {
		var status = event.currentTarget.value;
		if(status){
			Session.set('status', status);
		}else{
			Session.set('status', false);
		}
	},
	'change #keyword': function(event) {
		var keyword = event.currentTarget.value;
		if(keyword){
			Session.set('keyword', keyword);
		}else{
			Session.set('keyword', false);
			//$("table").trigger('update', [true]);
		}
	},
	'blur #fromDate': function(event) {
		var fromDate = $('#fromDate').data("DateTimePicker").date();
		if(fromDate && fromDate.toISOString()){
			Session.set('fromDate', fromDate.toISOString());
		}else{
			Session.set('fromDate', false);
		}
	},
	'blur #thruDate': function(event) {
		var thruDate = $('#thruDate').data("DateTimePicker").date();
		if(thruDate && thruDate.toISOString()){
			Session.set('thruDate', thruDate.toISOString());
		}else{
			Session.set('thruDate', false);
		}
	}
});
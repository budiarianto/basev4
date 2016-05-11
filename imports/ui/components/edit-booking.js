import React from 'react';

Template.bookingEdit.onDestroyed(function () {
  Session.keys = {};
});

Template.formAddPassengers.onRendered(function() {
	var template = Template.instance();
	 $('#frmAddRoute').validate({
		 errorPlacement: function(error, element) {
				//console.log('element.prop("name")', element.prop("name"));
				var elementName = element.prop("name") ;
		    	switch (elementName ) {
		        case 'birthDate':
		        	var errElement = template.find("[id = birthDate]");
		           error.insertAfter($(errElement));
		            break;
		        default:
		        	error.insertAfter(element);
		    	}
		},
	    rules: {
	    	fname:{
	    		required: true
	    	},
	    	birthDate:{
	    		required: true
	    	},
	    	prefix:{
	    		required: true,
	    		notEqual: "undefined"
	    	}
	    },
	    submitHandler(template) {
	    	var id = FlowRouter.getParam('id');
			var manifest = {};
			
			var prefix = template.prefix.value;
			if(prefix && prefix=="undefined")
				prefix ="";
			
			manifest.prefix 		= prefix;
			manifest.fullName 		= template.fname.value;
			manifest.birthDate		= stringToDate(template.birthDate.value, "DD/MM/YYYY", "/");
			Meteor.call('addBookingManifest', id, manifest, function(error){
				if(error)
					Bert.alert(error.reason, 'warning');
				
				$('#formAddPassengers').collapse('toggle');
				template.reset();
			});
	    }
	    	
	 });
});
Template.bookingEdit.onRendered(function() {
	var template = Template.instance();
	Tracker.autorun(function(){	
		var id = FlowRouter.getParam('id');
		if(id)
			Meteor.subscribe('booking', id);
		
		Meteor.subscribe('members');
		Meteor.subscribe('cities');
		Meteor.subscribe('fares');
		Meteor.subscribe('helipads');
	});

	Meteor.setTimeout(function(){
		var params = {};
		params.id = FlowRouter.getParam('id');
		
		Modules.client.updateNewBooking( { form: "#bookingForm", template: template, params: params} );
		Modules.client.trfPayment( { form: "#frmTransferPayment", template: template, params: params} );
		
		$('#flightDate').datetimepicker({
			format: 'DD/MM/YYYY HH:mm'
		});
		$('#birthDate').datetimepicker({
			format: 'DD/MM/YYYY'
		});

		$('.collapse').collapse('hide');
		$('#departureCollapse').collapse('show');
		$('#destinationCollapse').collapse('show');
		
		var booking = Booking.findOne({});
		if(booking){
			//console.log('booking find one', booking);
			Session.set('departureCity', booking.departureCity);
			Session.set('destinationCity', booking.destinationCity);
			Session.set('departureId', booking.departureLocationId);
			Session.set('destinationId', booking.destinationLocationId);
			Session.set('pax', booking.pax);
			Session.set('amount', booking.fare);
			
			Session.set('payment', 0);
			
			var qrText = booking.bookingCode+";"+((booking.billingInfo && booking.billingInfo.fullName)?booking.billingInfo.fullName:'guest')+";"+moment(new Date(booking.flightDate.toString())).format('DD/MM/YYYY')+";";
			qrText+=moment(new Date(booking.flightTime.toString())).format('HH:mm')+";"+booking.pax+"pax;"+booking.departureLocation+";";
			qrText+=booking.destinationLocation+";"+booking.notes;
			
			//jQuery('#qrcode').qrcode("this plugin is great");
			jQuery('.qrcodeTable').qrcode({
				height:	120,
				width:	120,
				render	: "table",
				text	: qrText
			});	
			
			
		}
		
		$(".modal").on("shown.bs.modal", function()  { // any time a modal is shown
		    var urlReplace = "#" + $(this).prop('id'); // make the hash the id of the modal shown
		    history.pushState(null, null, urlReplace); // push state that hash into the url
		});
	
		  // If a pushstate has previously happened and the back button is clicked, hide any modals.
		$(window).on('popstate', function() { 
		    $(".modal").modal('hide');
		});
		
	}, 1000);
	
	Meteor.setTimeout(function(){
		
		var departureCity = Session.get('departureCity');
		var departureId = Session.get('departureId'); 
		var arrivalCity = Session.get('destinationCity');
		var arrivalId = Session.get('destinationId'); 
		
		//set combobox
		$("#departureCity").val(departureCity);
		$("#destinationCity").val(arrivalCity);
		$("#departureLocation").val(departureId);
		$("#destinationLocation").val(arrivalId);
		
		Session.set('hideLoading', true);
	
	}, 1500);
});

Template.bookingEdit.events({
	'submit form': function(event) {
		event.preventDefault();
	},
	'change #departureCity': function(event) {
		//event.preventDefault();
		var city = $('#departureCity').val();
		Session.set('departureCity', city);
		var departureLocation = Helipad.find({'location.city': city});
		if(departureLocation){
			$('#departureCollapse').collapse('show');
		}
		else{
			$('#departureCollapse').collapse('hide');
		}
		var currDepartureId = Session.get('currDepartureId');
		$("#departureLocation").val(currDepartureId);
		setFarePrice();
	},
	'change #destinationCity': function(event) {
		//event.preventDefault();
		var city = $('#destinationCity').val();
		Session.set('destinationCity', city);
		var destinationLocation = Helipad.find({'location.city': city});
		if(destinationLocation)
			$('#destinationCollapse').collapse('show');
		else
			$('#destinationCollapse').collapse('hide');
		
		var currDestinationId = Session.get('currDestinationId');
		$("#destinationLocation").val(currDestinationId);
		setFarePrice();
		
	},
	'change #departureLocation': function(event) {
		event.preventDefault();
		var departureId = $('#departureLocation').val();
		Session.set('departureId', departureId);
		setFarePrice();
	},
	'change #destinationLocation': function(event) {
		event.preventDefault();
		var destinationId = $('#destinationLocation').val();
		Session.set('destinationId', destinationId);
		setFarePrice();
	},
	'change #pax': function(event) {
		event.preventDefault();
		var pax = $('#pax').val();
		Session.set('pax', pax);
	},
	'click #cancel': (e)=>{
		e.preventDefault();
		var lastPage = "/bookingList";
		var booking = Booking.findOne({});
		if(booking){
			if(booking.status=="Closed" || booking.status=="Cancel" || booking.status=="Refund"){
				var calledFrom = FlowRouter.getParam('reconcile');
				if(calledFrom && calledFrom=="reconcile"){
					//lastPage = '/reconcile';
					 window.history.back();
					 return false;
				}else{
					lastPage = '/historyList';
				}
			}
				
		}
		
		FlowRouter.go(lastPage);
	},
	'click #closeTransaction': (e)=>{
		Session.set('cancelCreditCard', false);
		Session.set('refund', false);
	},
	'click #refundTransaction': (e)=>{
		Session.set('cancelCreditCard', false);
		Session.set('refund', true);
	},
	'click #captureCreditCard': (e)=>{
		Session.set('cancelCreditCard', false);
		Session.set('refund', false);
	},
	'click #cancelCreditCard': (e)=>{
		Session.set('cancelCreditCard', true);
		Session.set('refund', false);
	},
	'click #closeTransfer'(){
		Meteor.call('closeTransaction', this._id, function(error, result){
			if(error)
				Bert.alert(error.reason, 'danger');
			else{
				Bert.alert('Booking collection closed successfully !', 'success');
			}
		});
	}
});

Template.bookingEdit.helpers({
	hideLoading(){
		return Session.get('hideLoading');
	},
	booking(){
		return Booking.findOne({});
	},
	departureCity(){
//		var departureCity = City.find({},{sort:{'sequence': 1}}).fetch();
//		return departureCity;
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
		var fare = Fare.find({'departureCity': city}).fetch();
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
		return accounting.formatNumber(Session.get('amount'));
	},
	amount(){
		return parseFloat(Session.get('amount'));
	},
	judul(){
			return "Edit Booking - "+this.bookingCode;
	},
	flightDateString(){
		var dt = new Date(this.flightDate.toString());
		return moment(dt).format('DD/MM/YYYY HH:mm');
	},
	isConfirmed(){
		if(this.status=="Confirmed")
			return true;
	},
	isPaid(){
		if(this.status=="Paid" || this.status=="Closed")
			return true;
	},
	isCanceled(){
		if(this.status=="Canceled" || this.status=="Refund")
			return true;
	},
	isClosed(){
		if(this.status=="Closed")
			return true;
	},
	isReadonly(){
		if(this.status=="Closed" || this.status=="Paid" || this.status=="Canceled" || this.status=="Refund" || this.status=="Confirmed")
			return "disabled";
	},	
	showAddManifestButton(event){
		var book = Booking.findOne({});
		var manifest = book.manifest;
		var pax = parseInt(Session.get('pax'));
		
		if(manifest){
			if(manifest.length<pax)
				return true;
		}else{
			return true;
		}
		
	},
	ccPayment(){
		if(this.payment && this.payment.paymentType=="Credit Card"){
			return true;
		}

	}
});

Template.formAddPassengers.events({
	'submit form': function(event) {
		event.preventDefault();
	}
	
});

Template.closeModal.events({
	'click .closeTransaction': function(event) {
		Meteor.call('closeTransaction', this._id, function(error, result){
			if(error)
				Bert.alert(error.reason, 'danger');
			else{
				Bert.alert('Booking transaction has been closed !', 'success');
			}
			$(this).dialog("close");
		});
	},
	'click .refundTransaction': function(event) {
		Meteor.call('refundTransaction', this._id, function(error, result){
			if(error)
				Bert.alert(error.reason, 'danger');
			else{
				Bert.alert('Booking transaction has been refund !', 'success');
			}
			$(this).dialog("close");
			
		});
	},
	'click #closeCreditCard': function(event) {
		 var $transaction_data = {
		         	'transaction_id'    : this.payment.vtTransactionId, 
		      		 'amount'   : this.payment.totalPayment
		 }
		 var _id = this._id;
		 var orderId = this.bookingCode;
		 var transactionId = this.payment.vtTransactionId;
		 
		 Meteor.call('veritrans_capture', Veritrans, $transaction_data, function(error, response){
			 
			 if(response && response.data)
				 
				  var fieldSet = {};
			  	  fieldSet.responseData = response.data;
				  
			  	  Meteor.call('updateBookingPaymentData', _id, fieldSet, function(error, result){
					  if(error)
						  Bert.alert(error, 'danger');
				  });
			 
				 if(response.data && response.data.transaction_id){
					  Meteor.call('capturePayment', _id, function(error){
						  if(!error){
							  Bert.alert('Booking transaction has been paid', 'success');
						  }else{
							  Bert.alert(error, 'danger');
						  }
						 
					  });
				  }else{
				  
					    $transaction_data = {
								'transaction_id'    : transactionId, 
								'order_id'    : orderId
						};
					    
					    syncPaymentStatus(_id, $transaction_data);
				  }
				  //close modal.
				  $(this).dialog("close");
		 });
		 
		
		 
	},
	'click #cancelCreditCard': function(event) {
		$transaction_data = {
				'order_id'    : this.bookingCode,
				'transaction_id'    : this.payment.vtTransactionId
		};
		//define id ! 
		var _id = this._id;
		
		Meteor.call('veritrans_cancel', Veritrans, $transaction_data, function(error, response){
			if(response && response.data && response.data.transaction_id){
				Meteor.call('cancelPayment', _id, function(error){
					if(!error){
						Bert.alert('Booking transaction has been canceled successfully', 'success');
					}else{
						Bert.alert(error, 'danger');
					}
					
				});
			}else{
				//sync payment status with credit card due to clash between veritrans and whitesky
				syncPaymentStatus(_id, $transaction_data);
			}
			
			$(this).dialog("close");
		});
	}

});

Template.closeModal.helpers({
	isTransfered(){
		if(this.payment && this.payment.paymentType && this.payment.paymentType=="Transfer")
			return true;
	},
	isCanceled(){
		return Session.get('cancelCreditCard');
	},
	isRefund(){
		var refund = Session.get('refund');
		if(refund)
			return refund;
	},
	isPaid(){
		if(this.status && this.status=="Paid")
			return true;
	}

});

Template.deleteModal.events({
	'click .deleteBooking': function(event) {
		Meteor.call('removeBooking', this._id, function(error, result){
			if(error){
				Bert.alert(error.reason, 'danger');
			}else{
				Bert.alert('Booking collection deleted successfully !', 'success');
				FlowRouter.go('/bookingList');
			}
			
		});
			
		$('body').removeClass('modal-open');
		$('.modal-backdrop').remove();
	}

});

Template.manifestData.events({
	'click .deleteManifest': function(event) {
		//event.preventDefault();
		$(event.currentTarget).prop('disabled', true);
		var id = FlowRouter.getParam('id');
		var manifest = {};
		manifest.prefix 		= this.prefix;
		manifest.fullName 		= this.fullName;
		//manifest.lastName 		= this.lastName;
		manifest.birthDate		= this.birthDate;
		
		Meteor.call('removeManifest', id, manifest, function(error, result){
			if(error)
				Bert.alert(error.reason, 'warning');
			$(event.currentTarget).prop('disabled', false);
		});
		
	}
});

Template.manifestData.helpers({
	birthDateString(){
		var dt = new Date(this.birthDate.toString());
		var tm = moment(dt).format('DD/MM/YYYY');
		return tm;
	},
	showDelete(){
		//console.log('status',Template.bookingEdit);
		var status = Template.bookingEdit.__helpers.get('booking')().status;//get status from bookingEdit Template
		if(status=="Open" || status=="Waiting")
			return true;
	}

});

Template.memberModal.events({
	'click tr'() {
		$('#userId').val(this.userId);
		$('input[name=fullName]').val(this.fullname);
		$('#memberModal').modal('hide');
	}
	
});

Template.memberModal.helpers({
	memberClientList() {
		var dataMember = Member.find(
			{
				$and:[
					{ 'memberType': 'client' }
					// ,
					//{ 'memberStatus': 'Active' }
					// { 'userId': {$ne:Meteor.userId()} }
				]
			}, {sort: {createdDate: -1}}).fetch();
		return dataMember;
	}
	
});

Template.paymentModal.events({
	'click #ccButton'(event) {
		$('#formTransferPayment').collapse('hide');
		$('#totalPayment').val(parseFloat(Session.get('payment')));
	},
	'click #trfButton'(event) {
		$('#formCCPayment').collapse('hide');
		$('#totalPayment').val(parseFloat(Session.get('payment')));
	}
	
});

Template.paymentModal.helpers({
	booking(){
		return Booking.findOne({});
	}
});

function stringToDate(_date,_format,_delimiter)
{
            var formatLowerCase=_format.toLowerCase();
            var formatItems=formatLowerCase.split(_delimiter);
            var dateItems=_date.split(_delimiter);
            var monthIndex=formatItems.indexOf("mm");
            var dayIndex=formatItems.indexOf("dd");
            var yearIndex=formatItems.indexOf("yyyy");
            var month=parseInt(dateItems[monthIndex]);
            month-=1;
            var formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
            return formatedDate;
}

function setFarePrice(){
	
	var departureCity = Session.get('departureCity');
	var departureId = Session.get('departureId'); 
	var arrivalCity = Session.get('destinationCity');
	var arrivalId = Session.get('destinationId'); 
	var amount = 0;
	
	if(departureCity && departureId && arrivalCity && arrivalId){
		var data = Fare.findOne({'departureCity': departureCity,'arrivalCity': arrivalCity,'departureId': departureId, 'arrivalId': arrivalId});
		if(data){
			amount = data.price;
		}
	}
	
	Session.set('amount', amount);
	
}

function syncPaymentStatus(_id, $transaction_data){
	Meteor.call('veritrans_status', Veritrans, $transaction_data, function(error, result){
		if(result && result.data){
			var fieldSet = {};
		  	  fieldSet.responseData = result.data;
			  Meteor.call('updateBookingPaymentData', _id, fieldSet, function(error){
				  if(error)
					  Bert.alert(error, 'danger');
			  });
			  
			if(result.data.transaction_status=="capture" || result.data.transaction_status=="success" || result.data.transaction_status=="settlement"){
				Meteor.call('capturePayment', _id, function(error){
					  if(!error){
						 Bert.alert('Booking transaction has been paid', 'success');
					  }else{
						  Bert.alert(error, 'danger');
					  }
				});
			}else if(result.data.transaction_status=="cancel"){
				Meteor.call('cancelPayment', _id, function(error){
					  if(!error){
						  Bert.alert('Booking transaction has been canceled', 'success');
					  }else{
						  Bert.alert(error, 'danger');
					  }
				});
			}
			
		}
		
	});
}

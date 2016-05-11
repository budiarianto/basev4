Template.reconcile.onCreated(function() {
	this.autorun(function(){
		Template.instance().subscribe('bookings');
		Template.instance().subscribe( 'settlement' );
	});
	Session.keys = {};
});

Template.reconcile.onDestroyed(function() {
	Session.keys = {};
});


Template.reconcile.onRendered(function() {
	//close popover on body click
	$(document).on("click", ".popover .close" , function(){
		$(this).parents(".popover").popover('hide');
    });
	
	Meteor.setTimeout(function(){
		$('#fromDate').datetimepicker({
			format: "DD/MM/YYYY",
			date: new Date()
		});
		$('#thruDate').datetimepicker({
			format: "DD/MM/YYYY",
			date: new Date()
		});
		
		var fromDate = $('#fromDate').data("DateTimePicker").date();
		var thruDate = $('#thruDate').data("DateTimePicker").date();
		
		Session.set('fromDate', fromDate.toISOString());
		Session.set('thruDate', thruDate.toISOString());
	}, 1000);
	
});


Template.reconcile.helpers({
	'reconcileList': function() {
		
		var status = Session.get('status');
		var fromDate = Session.get('fromDate');
		var thruDate = Session.get('thruDate');
		var keyword = Session.get('keyword');
		
		var afterDate = new Date(thruDate);
		afterDate.setDate(afterDate.getDate() + 1);
		
		if(fromDate){
			var conditions = [];
			
			conditions.push({'status': {$ne: 'Open'}});
			conditions.push({'status': {$ne: 'Waiting'}});
			conditions.push({'status': {$ne: 'Confirmed'}});
			conditions.push({'status': {$ne: 'Cancel'}});
			conditions.push({'payment.paymentType': {$ne: 'Transfer'}});
			
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
				conditions.push({$or: [{'bookingCode': {$regex: keyword, $options: 'i'}},{'billingInfo.fullName': {$regex: keyword, $options: 'i'}}]});
			}
	
			console.log('conditions', conditions);
			var data = Booking.find({
				 $and:conditions
			}, {sort: {createdDate: -1}}).fetch();
			
			$("#tableReconcile").trigger("destroy");
			data = Booking.find({$and: conditions},{sort: {'flightDate': 1, 'flightTime': 1}}).fetch();
			Meteor.setTimeout(function(){
				$("#tableReconcile").tablesorter({
					 sortList: [[4,0]],
					 sortMultiSortKey: 'altKey',
					 headers: {
				            4: { sorter: "myDateFormat" }
				        }
				});
				
				//show popover on popupDetail click
				$(".popupDetail").popover({
			        html: true,
			        title: 'Profile Info <a href="#" class="close" data-dismiss="alert">×</a>',
			        content: function() {
			            return $(this).find("#popover-content").html();
			        }
			    });
				
			}, 1000);
			return data;
		}
	},
	formatNumber(numberData){
		return accounting.formatNumber(numberData);
	},
	badgeIcon(){
		var bookingCode = this.bookingCode;
		var result = {};
	      var settlementExists = Settlement.findOne( { orderId: bookingCode} );
	      if ( !settlementExists ) {
	    	  result.badge = "";
	    	  result.icon = "";
	      }else{
	          //console.log("ini settlementExists status: ",settlementExists.settlementStatus);
	    	 switch (settlementExists.settlementStatus){
	    	 case "settlement":
	    		 result.badge = "badge-primary";
	    		 result.icon = "glyphicon-ok";
	    		 break;
	    	 case "cancel":
	    		 result.badge = "badge-warning";
	    		 result.icon = "glyphicon-remove";
	    		 break;
	    	 case "authorize":
	    		 result.badge = "badge-default";
	    		 result.icon = "glyphicon-ok";
	    		 break;
	    	 case "success":
	    		 result.badge = "badge-success";
	    		 result.icon = "glyphicon-ok";
	    		 break;
	    	 case "challenge":
	    		 result.badge = "badge-warning";
	    		 result.icon = "glyphicon-ok";
	    		 break;
	    	default:
	    		 result.badge = "badge-info";
	    		 result.icon = "glyphicon-ok";
	    		 break;
	    	 }
	      }
	      
	      return result;
		
	},
	iconStatus(){
		return accounting.formatNumber(numberData);
	},
	settlementCheck: function (bookingCode) {
  		//console.log("ini bookingId: ",bookingId);
      var settlementExists = Settlement.findOne( { orderId: bookingCode} );
      if ( !settlementExists ) {
          //console.log("settlement not found for orderId: ",orderId);
          return "";
      }else{
          var settlementAmount = settlementExists.settlementAmount;
          return accounting.formatNumber(settlementAmount);
      }
  	},
  	diffAmount: function (amount, orderId) {
  		var settlementExists = Settlement.findOne( { orderId: orderId} );
      if ( !settlementExists ) {
          //console.log("settlement not found for orderId: ",orderId);
          return "";
      }else{
          var settlementAmount = settlementExists.settlementAmount;
          var diff = settlementAmount - amount;    
          return accounting.formatNumber(diff);
      }
  	},
  	diffPercentage: function (amount, orderId) {
      var settlementExists = Settlement.findOne( { orderId: orderId} );
      if ( !settlementExists ) {
          //console.log("settlement not found for orderId: ",orderId);
          return "";
      }else{
          var settlementAmount = settlementExists.settlementAmount;
          var diff = settlementAmount - amount;
      
          var diffPercent = (diff / amount) * 100;
          //console.log("diffPercent: ",diffPercent);
          return  accounting.formatNumber(diffPercent, 2)+"%";
      }
  	},
	formatDate: function (date) {
  		return moment(date).format('DD/MM/YYYY');
  	},
    settlementStatus: function (bookingCode) {
      var settlementExists = Settlement.findOne( { orderId: bookingCode} );
      if ( !settlementExists ) {
          return "";
      }else{
          return settlementExists.settlementStatus;
      }
    }
});


Template.reconcile.events({
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

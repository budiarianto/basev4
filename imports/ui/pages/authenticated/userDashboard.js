Template.userDashboard.onCreated( function(){
	this.autorun(function() {
		var userId = FlowRouter.getParam('userId');
		console.log("nih userId: ",userId);
		//Session.set('foundUserId', userId);
		Meteor.call('findUserId', userId, function(err, res) {
			if(res) Session.set('foundUser', res);
		});

		Meteor.call('findMemberId', userId, function(err, res) {
			if(res) Session.set('foundMember', res);
		});
		
		Meteor.call('isUserBanned', userId, function(err, res) {
			//console.log("nih res: ",res);
			if(res) {
				Session.set('userIsBanned', res);
			}
		});

		Meteor.subscribe('payment', userId);
		Meteor.subscribe('member', userId);
		
	});
});

Template.userDashboard.onDestroyed(function() {
  Session.set('foundUser', undefined);
  Session.set('foundMember', undefined);
  Session.set('userIsBanned', undefined);
});


Template.userDashboard.helpers({
	//for get data from users
	'foundUser': function() {
	   var foundUser = Session.get('foundUser');
	   //console.log("foundUser: ",foundUser);
	   return foundUser;
	 },
	 //for get data from members
	 'foundMember': function() {
	   var foundMember = Session.get('foundMember');
	   //console.log("foundMember: ",foundMember);
	   return foundMember;
	 },
	userIsBanned: function(){
		//console.log("cek lagi res-nya: ",Session.get('userIsBanned'));
		return Session.get('userIsBanned');
	},
	'getPayment': function() {
	   var payment = Payment.findOne({});
	   return payment;
	},
	'getPaymentType': function() {
	   var payment = Payment.findOne({});
	   if ( !payment ) {
	   		return '';
	   }else{
	   		var paymentType = payment.paymentType;
	   		if(paymentType == 'CreditCard'){
	   			return 'Credit Card';
	   		}else if(paymentType == 'Transfer'){
	   			return 'Bank Transfer';
	   		}
	   }
	},
	'getPaymentNumber': function() {
	   var payment = Payment.findOne({});
	   if ( !payment ) {
	   		return '';
	   }else{
	   	var paymentNumber = payment.paymentNumber;
	   	//console.log("paymentNumber: ",paymentNumber);
	   	var regexPaymentNumber = paymentNumber.toString().replace(/\d{12}(\d{4})/, "xxxx xxxx xxxx $1");
		//console.log("regexPaymentNumber: ",regexPaymentNumber);
		return regexPaymentNumber;
	   }
	},
	'memberAdmin': function() {
	   var member = Member.findOne({});
	   if ( !member ) {
	   }else{
	   	var memberType = member.memberType;
	   	if(memberType == 'admin'){
	   		return true;
	   	}else{
	   		return false;
	   	}
	   }
	}
});

Template.userDashboard.events({
	
	'click #bannedUser' () {
		var userId = FlowRouter.getParam('userId');
		Meteor.call('bannedUser', userId, true, function(error, result){
			if(error){
				Bert.alert( error.message, 'error' );
			}else{
				Session.set('userIsBanned', result);
			}
				
		});

	},
	'click #unbannedUser' () {
		var userId = FlowRouter.getParam('userId');
		Meteor.call('bannedUser', userId, false, function(error, result){
			if(error){
				Bert.alert( error.message, 'error' );
			}else{
				Session.set('userIsBanned', result);
			}
		});
		
	}

});

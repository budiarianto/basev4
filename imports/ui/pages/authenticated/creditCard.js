Template.creditCard.onCreated( function(){
	this.autorun(function() {
		var userId = FlowRouter.getParam('userId');
		//console.log("nih userId: ",userId);

		Meteor.call('findUserId', userId, function(err, res) {
			if(res) Session.set('foundUser', res);
		});

		Meteor.subscribe('payment', userId);
		
	});
});

Template.creditCard.onRendered(function() {
  	Session.set('foundUser', undefined);
  	var template = Template.instance();
	Meteor.setTimeout(function(){
		Modules.client.updatePayment( { form: "#paymentForm", template: template} );
	}, 1000);
});


Template.creditCard.helpers({
	'foundUser': function() {
	   var foundUser = Session.get('foundUser');
	   //console.log("foundUser: ",foundUser);
	   return foundUser;
	 },
	 'getPayment': function() {
	   var payment = Payment.findOne({});
	   //console.log("payment: ",payment);
	   return payment;
	 }
});


Template.creditCard.events({
	'submit form': function(event) {
		event.preventDefault();
	},
	'click #cancel': (e)=>{
		e.preventDefault();
		window.history.back();
	}
});
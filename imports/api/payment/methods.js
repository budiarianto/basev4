Meteor.methods({  
	'updatePayment': function(paymentNumber, cardExpiryMonth, cardExpiryYear, memberId) {
		if (!this.userId)
			throw new Meteor.Error(401, 'You must be logged in.');

		check(paymentNumber, String);
		check(cardExpiryMonth, String);
		check(cardExpiryYear, String);
		check(memberId, String);

		// console.log("in server paymentNumber: ",paymentNumber);
		// console.log("in server cardExpiryMonth: ",cardExpiryMonth);
		// console.log("in server cardExpiryYear: ",cardExpiryYear);
		// console.log("in server memberId: ",memberId);

		var payment_ = Payment.findOne({ 'userId': memberId });

		if(!payment_)
			throw new Meteor.Error(404,'Member Payment not found!');

		if(payment_){
			//console.log("cek payment_: ",payment_);
		}
		Payment.update({userId:payment_.userId},{$set:{"paymentNumber": paymentNumber, "paymentExpiredMonth": cardExpiryMonth, "paymentExpiredYear": cardExpiryYear}});

	}
});
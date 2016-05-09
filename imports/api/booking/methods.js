import { Mongo } from 'meteor/mongo';
import faker from 'faker';

import { Booking } from './booking';

Meteor.methods({
	createBooking(book){
		
		check(book, Object);
		if (!this.userId)
			throw new Meteor.Error(401, 'You must be logged in.');
		
		try{
			var dateObj = new Date();
			var month = moment(dateObj).format("MM");
			var year = moment(dateObj).format("YY");
			var day = moment(dateObj).format("DD");
			
			var bookCode1 = Math.floor((Math.random() * 10)); //Random.id(4);
			var bookCode2 = Math.floor((Math.random() * 10)); //Random.id(4);
			var bookCode3 = Math.floor((Math.random() * 10)); //Random.id(4);
			//book.bookingCode = bookCode1+year+bookCode2+month;
			book.bookingCode = getBookingCode();
//			console.log('booking code', book.bookingCode );
			//console.log('book', book);
			//get price from fares
			//var route = Routes.findOne({departure: book.departureCity, arrival: book.destinationCity});
			
			var fare = Fare.findOne({'departureCity': book.departureCity ,'arrivalCity': book.destinationCity,'departureId': book.departureLocationId, 'arrivalId': book.destinationLocationId});
			//get fare
			if(fare){
				book.fare 		= parseFloat(fare.price);
				book.airTime	= fare.airTime
			}
			
			//get billing info
			var member = Member.findOne({userId: book.userId});
			
			//console.log('member', member);
			if(member){
				var billingInfo = {};
				billingInfo.fullName = member.fullname;
				billingInfo.email	 = member.emails;
				billingInfo.phone	 = member.mobileNumber;
				book.billingInfo = billingInfo;
			}
					
			//insert booking
			var bookingId = Booking.insert(book);
			return bookingId;
			
		}catch(e){
			var errorMessage = "Internal server error !",
			error_duplicate_key = "duplicate key error index",
			errorErr = 412;
			console.log('e:',e);
			console.log('e.error:',e.Error);
			
			
			if(e.sanitizedError){
				if(e.sanitizedError.reason)
					errorMessage = e.sanitizedError.reason;
					errorErr = e.sanitizedError.error;
				//console.log('e.reason:',e.sanitizedError.reason);
			}
			else if(e.reason){
				errorMessage = e.reason;
			}
			else{
				var err = JSON.stringify(e);
				
				if(err.indexOf(error_duplicate_key)> -1)
					errorMessage = "Error duplicate key id !";
			}
			
			throw new Meteor.Error(errorErr, errorMessage);
			
		}
	
	},
	updateBooking(id, fieldSet){
		check(id, String);
		check(fieldSet, Object);
		
		if (!this.userId)
			throw new Meteor.Error(401, 'You must be logged in.');
		
		var fare = Fare.findOne({'departureCity': fieldSet.departureCity ,'arrivalCity': fieldSet.destinationCity,'departureId': fieldSet.departureLocationId, 'arrivalId': fieldSet.destinationLocationId});
		
		if(fare){
			
			fieldSet.fare 		= parseFloat(fare.price);
			fieldSet.airTime	= fare.airTime
				
		}
		//console.log('fieldSet', fieldSet);
		//get billing info
		var member = Member.findOne({userId: fieldSet.userId});
		//console.log('member', member);
		if(member){
			var billingInfo = {};
			billingInfo.fullName = member.fullname;
			billingInfo.email	 = member.emails;
			billingInfo.phone	 = member.mobileNumber;
			fieldSet.billingInfo = billingInfo;
		}
		
		//control pax input
		var booking = Booking.findOne({_id: id});
		var manifest = booking.manifest;
		
		if(manifest && (manifest.length>=1))
			fieldSet.pax = manifest.length;
		
		var result = Booking.update({_id: id},{$set: fieldSet});
		return result;
	},
	updateBookingPayment(id, fieldSet){
		check(id, String);
		check(fieldSet, Object);
		if (!this.userId)
			throw new Meteor.Error(401, 'You must be logged in.');
		
		//control payment input
		var booking = Booking.findOne({_id: id});
		
		if(!booking.manifest){
			throw new Meteor.Error(412, 'please insert manifest !');
		}else{
			if(booking.manifest.length<=0)
				throw new Meteor.Error(412, 'please insert manifest !');
		}
		
		var status = 'Confirmed';
		//if payment by transfer then status is automatically saved as Paid State
		
//		console.log('field set:', fieldSet);
		if(fieldSet.paymentType=="Transfer")
			status = 'Paid';
		
		if(booking && booking.fare){
			if(booking.fare==fieldSet.totalPayment){
				var result = Booking.update({_id: id},{$set: {status: status, payment: fieldSet}});
				return result;
			}else{
				throw new Meteor.Error(412, 'Payment is not equal !');
			}
		}else{
			throw new Meteor.Error(412, 'Payment is not equal !');
		}
		
	
	},
	updateBookingPaymentData(id, fieldSet){
		check(id, String);
		check(fieldSet, Object);
		if (!this.userId)
			throw new Meteor.Error(401, 'You must be logged in.');
		
		//control payment input
		var booking = Booking.findOne({_id: id});
		
		if(!booking.manifest){
			throw new Meteor.Error(412, 'please insert manifest !');
		}else{
			if(booking.manifest.length<=0)
				throw new Meteor.Error(412, 'please insert manifest !');
		}
		
		var responseData = {};
		responseData = fieldSet.responseData;
		//console.log('responseData', responseData);
		var result = Booking.update({_id: id},{$push: {'payment.responseData': responseData }});
		//console.log('fieldSet', fieldSet);
		//console.log('result from payment data', result);
		
		return result;
		
	},
	capturePayment(id){
		//console.log('id', id);
		check(id, String);
		if (!this.userId)
			throw new Meteor.Error(401, 'You must be logged in.');
		
		//control status input
		var booking = Booking.findOne({_id: id});

		if(booking.status!="Confirmed")
			throw new Meteor.Error(412, 'please do payment before close transaction !');
		
		var result = Booking.update({_id: id},{$set: {status: 'Paid'}});
		return result;
		
	},
	refundTransaction(id){
		//console.log('id', id);
		check(id, String);
		if (!this.userId)
			throw new Meteor.Error(401, 'You must be logged in.');
		
		//control status input
		var booking = Booking.findOne({_id: id});
		
		if(booking.status!="Paid")
			throw new Meteor.Error(412, 'please do payment before close transaction !');
		
		var result = Booking.update({_id: id},{$set: {status: 'Refund'}});
		return result;
		
	},
	closeTransaction(id){
		//console.log('id', id);
		check(id, String);
		
		if (!this.userId)
			throw new Meteor.Error(401, 'You must be logged in.');
		
		//control status input
		var booking = Booking.findOne({_id: id});
//		console.log('booking status:', booking.status);
		if(booking.status!="Paid")
			throw new Meteor.Error(412, 'please do payment before close transaction !');
		
		var result = Booking.update({_id: id},{$set: {status: 'Closed'}});
		return result;
		
	},
	cancelPayment(id){
		check(id, String);
		
		if (!this.userId)
			throw new Meteor.Error(401, 'You must be logged in.');
		
		//control status input
		var booking = Booking.findOne({_id: id});
		
		if(booking.status!="Confirmed")
			throw new Meteor.Error(412, 'cannot cancel unpaid transaction !');
		
		var result = Booking.update({_id: id},{$set: {status: 'Canceled'}});
		return result;
		
	},
	addBookingManifest(id, manifest){
		check(id, String);
		check(manifest, Object);
			
		if (!this.userId)
			throw new Meteor.Error(401, 'You must be logged in.');
		
		var detailData = Booking.findOne({_id: id, 'manifest': {$elemMatch: manifest}});
		//console.log('manifest', manifest);
		if(!detailData){
			var result = Booking.update({_id: id},{$push: {'manifest': manifest}});
			//console.log('result--------', result);
			return result;
		}else{
			throw new Meteor.Error('duplicate entry','manifest already exists !');
		}
		
	},
	removeBooking(id){
		check(id, String);
		
		if (!this.userId)
			throw new Meteor.Error(401, 'You must be logged in.');
		
		var removedData = Booking.remove({_id: id});
		
		//console.log('removedData', removedData);
		if(!removedData){
			throw new Meteor.Error('remove failed !');
		}
		
		return "Succes removing routes...";
	},
	removeManifest(id, manifest){
		check(id, String);
		check(manifest, Object);
		
		if (!this.userId)
			throw new Meteor.Error(401, 'You must be logged in.');
		
		var removedData = Booking.update({_id: id}, {$pull:{manifest: {'fullName': manifest.fullName, 'birthDate': manifest.birthDate}}});
		
		if(!removedData){
			throw new Meteor.Error('remove failed !');
		}
//		else{
//				//insert into routes collection:
//				var routes = Routes.remove({fareId: id, departure: departure, arrival: arrival});
//		}
		return "Succes removing routes...";
	}
}); 

function getBookingCode(){
	
	var dateObj = new Date();
	var month = moment(dateObj).format("MM");
	var year = moment(dateObj).format("YY");
	var day = moment(dateObj).format("DD");
	
	var bookCode1 = Math.floor((Math.random() * 10)); //Random.id(4);
	var bookCode2 = Math.floor((Math.random() * 10)); //Random.id(4);
	var bookCode3 = Math.floor((Math.random() * 10)); //Random.id(4);
	//book.bookingCode = bookCode1+year+bookCode2+month;
	var bookingCode = "H"+getMonthCode(month)+year+day+bookCode1+bookCode2+bookCode3;
	
	var booking =  Booking.findOne({bookingCode: bookingCode});
	if(booking){
		bookingCode = getBookingCode();
	}
	
	return bookingCode;
}
function getMonthCode(mm){
	var monthCode
	switch (mm){
		case "01":
			monthCode = "JA";
			break;
		case "02":
			monthCode = "FE";
			break;
		case "03":
			monthCode = "MR";
			break;
		case "04":
			monthCode = "AP";
			break;
		case "05":
			monthCode = "MY";
			break;
		case "06":
			monthCode = "JN";
			break;
		case "07":
			monthCode = "JL";
			break;
		case "08":
			monthCode = "AU";
			break;
		case "09":
			monthCode = "SE";
			break;
		case "10":
			monthCode = "OC";
			break;
		case "11":
			monthCode = "NV";
			break;
		default:
			monthCode = "DE";
	
	}
	
	return monthCode;

}
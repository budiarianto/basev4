import { Mongo } from 'meteor/mongo';
import faker from 'faker';

export const Booking = new Meteor.Collection( 'booking' );

Booking.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Booking.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

let _ResponseDataSchema = new SimpleSchema({
	  "status_code": {
	    type		: String,
	    label       : "status code",
	    optional 	: true
	  },
	  "status_message": {
		  type		: String,
		  label       : "status message",
		  optional 	: true
	  },
	  "transaction_id": {
		  type		: String,
		  label       : "transaction id",
		  optional 	: true
	  },
	  "masked_card": {
		  type		: String,
		  label       : "masked card",
		  optional 	: true
	  },
	  "order_id": {
		  type		: String,
		  label       : "booking code",
		  optional 	: true
	  },
	  "gross_amount": {
		  type		: String,
		  label       : "gross amount",
		  optional 	: true
	  },
	  "payment_type": {
		  type		: String,
		  label       : "payment type",
		  optional 	: true
	  },
	  "transaction_time": {
		  type		: String,
		  label       : "payment timestamp ",
		  optional 	: true
	  },
	  "transaction_status": {
		  type		: String,
		  label       : "transaction status",
		  optional 	: true
	  },
	  "fraud_status": {
		  type		: String,
		  label       : "fraud status",
		  optional 	: true
	  },
	  "approval_code": {
		  type		: String,
		  label       : "approval code",
		  optional 	: true
	  },
	  "bank": {
		  type		: String,
		  label       : "bank acquired",
		  optional 	: true
	  },
	  "eci": {
		  type		: String,
		  label       : "electronic commerce indicator code",
		  optional 	: true
	  }
});

let _BillingInfoSchema = new SimpleSchema({
	"fullName": {
		type		: String,
		label       : "full name",
		optional 	: true
	},
	"company"   : {
		type      : String,
		label     : "company",
		optional 	: true
	},
	"email"   : {
		type        : String,
		label       : "email",
		regEx       : SimpleSchema.RegEx.Email
	},
	"phone"   : {
		type      : String,
		label     : "phone number",
		optional 	: true
	},
	"billingAddress"   : {
		type      : String,
		label     : "billing address",
		optional 	: true
	}
});

let _PaymentSchema = new SimpleSchema({
	"paymentType": {
		type		  : String,
		label         : "payment type",
		allowedValues : ["Credit Card", "Transfer"]
	},
	"fullName"   : {
		type      : String,
		label     : "full name"
	},
	"bank"   : {
		type          : String,
		label         : "bank transfer",
		allowedValues : ["BCA", "Mandiri", "BNI"],
		optional 	: true
	},
	"principal"   : {
		type      : String,
		label     : "credit card principal",
		allowedValues : ["Visa", "Master", "American Express", "JCB"],
		optional 	: true
	},
	"ccNo"   : {
		type      : String,
		label     : "credit card number",
		optional 	: true
	},
	"expMonth"   : {
		type      : Number,
		label     : "expired month",
		optional 	: true
	},
	"expYear"   : {
		type      : Number,
		label     : "expired year",
		optional 	: true
	},
	"cvv"   : {
		type      : String,
		label     : "expired year",
		optional 	: true
	},
	"accNo"   : {
		type      : String,
		label     : "account number",
		optional 	: true
	},
	"totalPayment"   : {
		type      : Number,
		label     : "total payment amount"
	},
	"responseData": {
		type		: [_ResponseDataSchema],
		label     	: "response data",
		optional	: true
	},
	"vtTransactionId": {
		type		: String,
		label     	: "veritrans transaction id",
		optional	: true
	},
	"vtTransactionStatus": {
		type		: String,
		label     	: "veritrans transaction status",
		optional	: true
	},
	"vtTransactionTime": {
		type		: Date,
		label     	: "veritrans transaction timestamp",
		optional	: true
	}
	
});

let _ManifestFieldSchema = new SimpleSchema({
	"prefix"		: {
		type		: String,
		label       : "Prefix",
		optional    : true
	},
	"fullName"		: {
		type		: String,
		label       : "full name"
	},
	"birthDate"   	: {
		type      	: Date,
		label     	: "birth date"
	},
	"email"   	: {
		type        : String,
		label       : "email",
		regEx       : SimpleSchema.RegEx.Email,
		optional 	: true
	},
	"phone"   : {
		type      : String,
		label     : "phone number",
		optional 	: true
	},
	"weight"   : {
		type      : Number,
		label     : "billing address",
		optional 	: true
	}
});

let _BookingSchema = new SimpleSchema({
   "bookingCode"   	:{
     type          	: String,
     label         	: "booking code",
     unique			: true
   },
  "userId"         	:{
    type           	: String,
    label          	: "login user id",
    optional 		: true
  },
  "flightDate"   	: {
	    type        : Date,
	    label       : "Estimated Flight Date",
	    optional 	: true
  },
  "flightTime"   	: {
    type        	: Date,
    label           : "Estimate Time Departure",
    optional 		: true
  },
  "billingInfo"    	:{
	  type         	: _BillingInfoSchema,
	  label        	: "billing info",
	  optional		: true
  },
  "pax"    			:{
	  type         	: Number,
	  label        	: "passenger count",
	  optional		: true
  },
  "manifest"    	:{
	  type         	: [_ManifestFieldSchema],
	  label        	: "passenger data",
	  optional		: true
  },
  "departureCity"          	:{
	    type        : String,
	    label       : "departure city",
		optional	: true
  },
  "departureLocationId"          	:{
	  type        : String,
	  label       : "departure location",
	  optional	: true
  },
  "departureLocation"          	:{
	  type        : String,
	  label       : "departure location",
	  optional	: true
  },
  "destinationCity"          	:{
	  type        : String,
	  label       : "destination city",
	  optional	: true
  },
  "destinationLocationId"          	:{
	  type        : String,
	  label       : "destination location",
	  optional	: true
  },
  "destinationLocation"          	:{
	  type        : String,
	  label       : "destination location",
	  optional	: true
  },
  "fare"          :{
	  type        : Number,
	  label       : "trip fare",
	  defaultValue: 0
  },
  "payment"          :{
	  type        : _PaymentSchema,
	  label       : "trip fare",
	  optional	  : true
  },
  "airTime"         :{
	  type        : Date,
	  label       : "air time",
	  optional	  : true
  },
  "notes"			: {
    type          	: String,
    label         	: "booking notes",
    optional		: true
  },
  "status"			: {
	  type          	: String,
	  label         	: "booking status",
	  allowedValues 	: ["Open", "Requesting", "Waiting", "Confirmed", "Paid", "Closed", "Canceled", "Refund"],
	  defaultValue 		: "Open"
  },
  "createdBy": {
	  type      : String,
	  label     : "Created By",
	  autoValue : function(){
		  if (this.isInsert) {
			  return this.userId;
		  } else if (this.isUpsert) {
			  return {$setOnInsert: this.userId};
		  } else {
			  this.unset();
		  }
	  }
  },
  "createdDate": {
	    type      : Date,
	    label     : "Created timestamp",
	    autoValue : function(){
	      if (this.isInsert) {
	        return new Date();
	      } else if (this.isUpsert) {
	        return {$setOnInsert: new Date()};
	      } else {
	        this.unset();
	      }
	      }
  },
  "modifiedBy": {
	  type      : String,
	  label     : "Modified By",
	  autoValue : function(){
		  if (this.isInsert) {
			  return  this.userId;
		  } else if (this.isUpsert) {
			  return {$setOnInsert: this.userId};
		  } else {
			  this.unset();
		  }
	  }
  },
  "modifiedDate": {
    type      : Date,
    label     : "Last modified timestamp",
    autoValue   : function() {
      if (this.isUpdate) {
        return new Date();
      }
    },
    denyInsert: true,
    optional: true
  }
});

Booking.attachSchema(_BookingSchema);

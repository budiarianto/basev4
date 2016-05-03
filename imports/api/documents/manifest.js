import { Mongo } from 'meteor/mongo';
import faker from 'faker';

export const Manifest = new Meteor.Collection( 'manifest' );

Manifest.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Manifest.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

let _manifestSchema = new SimpleSchema({
	"bookingCode"		: {
		type		: String,
		label       : "booking code"
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
	},
	"status"			: {
		  type          	: String,
		  label         	: "booking status",
		  allowedValues 	: ["Open", "Requesting", "Waiting Confirmation", "Confirmed", "Closed", "Canceled"],
		  defaultValue 		: "Open"
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

Manifest.attachSchema(_manifestSchema);

import { Mongo } from 'meteor/mongo';
import faker from 'faker';

export const Member = new Meteor.Collection( 'members' );

Member.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Member.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

let MemberSchema = new SimpleSchema({
	"userId": {
		type			: String,
		label			: "userId"
	},
	"emails": {
		type			: String,
		label			: "Email User",
		optional		: true
	},
	"fullname": {
		type			: String,
		label			: "Full name",
		optional		: true
	},
	"mobileNumber": {
		type			: String,
		label			: "Mobile Number",
		optional		: true
	},
	"memberType": {
		type          : String,
		label         : "Type of Member",
		allowedValues   : ["admin", "client"],
		defaultValue    : "client"
	},
	"memberRole":{
		type            : String,
		label           : "Role of Admin Member",
		allowedValues   : ["administrator", "operator"],
		optional		: true
    },
    "memberStatus"          :{
	    type            : String,
	    label           : "Status of this Member",
	    allowedValues   : ["Active", "Inactive", "Banned", "Deleted"],
	    defaultValue    : "Active"
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

Member.attachSchema( MemberSchema );

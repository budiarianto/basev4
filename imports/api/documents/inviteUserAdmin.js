import { Mongo } from 'meteor/mongo';
import faker from 'faker';

export const InviteUserAdmins = new Meteor.Collection( 'inviteUserAdmin' );

InviteUserAdmins.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

InviteUserAdmins.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

let _ProfileSchema = new SimpleSchema({
	  "fullname": {
	    type          : String,
	    label         : "Full name",
	    optional : true
	  }
   //  ,
	  // "userType"   : {
		 //  type          : String,
		 //  label         : "Type of User",
		 //  optional : true
	  // },
	  // "role"          :{
   //    type            : String,
   //    label           : "Role of User",
   //    allowedValues   : ["admin", "operator"],
   //    defaultValue    : "admin",
   //    optional : true
   //  }
});

let InviteUserAdminSchema = new SimpleSchema({

  "userId"          :{
    type            : String,
    label           : "user ID who sent invitation"
  },
  "userProfile"          :{
	  type            : _ProfileSchema,
	  label           : "User Profile",
	  optional: true
  },
  "email" :{
    type            : String,
    label           : "Email yang diundang"
  },
  "userStatus"          :{
    type            : String,
    label           : "Status User Invited",
    allowedValues   : ["administrator", "operator"],
    defaultValue    : "administrator"
  },
  "token" :{
	    type        : String,
	    label       : "token undangan",
	    optional	: true
  },
  "registeredId"      :{
    type            : String,
    label           : "ID user yang sudah melakukan registrasi",
    optional        : true
  },
  "registeredProfile"          :{
	  type            : _ProfileSchema,
	  label           : "Registered Profile",
	  optional: true
  },
  "status"          :{
	    type            : String,
	    label           : "Status Invitation",
	    allowedValues   : ["Created", "Sent", "Registered", "Deleted"],
	    defaultValue    : "Created"
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

InviteUserAdmins.attachSchema( InviteUserAdminSchema );

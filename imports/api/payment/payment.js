import { Mongo } from 'meteor/mongo';
import faker from 'faker';

export const Payment = new Meteor.Collection( 'payment' );

Payment.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Payment.deny({
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
});

let _paymentSchema = new SimpleSchema({
  "userId"          :{
    type            : String,
    label           : "user ID who have Credit Card"
  },
  "userProfile"          :{
    type            : _ProfileSchema,
    label           : "User Profile",
    optional: true
  },
  "paymentNumber"          :{
      type            : Number,
      label           : "Number of Payment",
      optional: true
  },
  "paymentType": {
    type          : String,
    label         : "Type of Payment",
    allowedValues : ["CreditCard", "Transfer"],
    defaultValue    : "CreditCard"
  },
  "paymentStatus": {
    type          : String,
    label         : "Status of Payment",
    allowedValues : ["Active", "Inactive"],
    defaultValue    : "Active"
  },
  "paymentExpiredMonth"          :{
      type            : Number,
      label           : "Expired Month of Payment",
      optional: true
  },
  "paymentExpiredYear"          :{
      type            : Number,
      label           : "Expired Year of Payment",
      optional: true
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

Payment.attachSchema(_paymentSchema);

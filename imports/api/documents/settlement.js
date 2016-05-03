import { Mongo } from 'meteor/mongo';
import faker from 'faker';

export const Settlement = new Meteor.Collection( 'settlement' );

Settlement.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Settlement.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

let _settlementSchema = new SimpleSchema({
   "orderId"          :{
     type            : String,
     label           : "Order ID"
   },
  "ccNumber"          :{
    type            : String,
    label           : "Credit Card Number"
  },
  "trxDate"   : {
    type        : Date,
    label           : "Transaction Date",
    optional : true
  },
  "settlementDate"   : {
    type        : Date,
    label           : "Settlement Date",
    optional : true
  },
  "settlementAmount" :{
    type            : Number,
    label           : "Settlement Amount",
    optional : true
  },
  "settlementStatus": {
    type          : String,
    label         : "Status of Settlement",
    allowedValues : ["authorize", "success", "cancel", "settlement", "challenge", "approved"],
    optional : true
  },
  "csvImportStatus": {
    type          : String,
    label         : "Status of Import CSV",
    allowedValues : ["created", "finish"],
    defaultValue    : "created"
  },
  "settlementBy": {
    type      : String,
    label     : "Settlement of this order",
    autoValue   : function(){
      if (this.isInsert){
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

Settlement.attachSchema(_settlementSchema);

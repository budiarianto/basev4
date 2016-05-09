import { Mongo } from 'meteor/mongo';
import faker from 'faker';

export const Fare = new Meteor.Collection( 'fare' );

Fare.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Fare.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

let FareSchema = new SimpleSchema({
  "name"    : {
	    type    : String,
	    label   : "Nama Fare",
	    max     : 150
  },
  "status"          :{
    type            : String,
    label           : "Status Fare",
    allowedValues   : ["Active", "Inactive"],
    defaultValue    : "Active"
  },
  "descriptions"  : {
    type      : String,
    label     : "descriptions of Fare",
    optional  : true
  },
  "airTime"  : {
	  type      : Date,
	  label     : "Fare time estimation"
  },
   "price"   : {
	  type          : Number,
	  label         : "Fare Price"
  },
  "routeType"   : {
	  type          : String,
	  label         : "route point based on city / helipad",
	  allowedValues   : ["City", "Helipad"],
	  defaultValue    : "Helipad"
  },
  "departureCity"   : {
	  type      :String,
	  label     : "Departure city"
  },
  "departureId"   : {
	  type      :String,
	  label     : "Departure helipad Id"
  },
  "departureLocation"   : {
	  type      :String,
	  label     : "Departure helipad name"
  },
  "arrivalCity"   : {
	  type      :String,
	  label     : "Arrival City"
  },
  "arrivalId"   : {
	  type      :String,
	  label     : "Arrival helipad Id"
  },
  "arrivalLocation"   : {
	  type      :String,
	  label     : "Arrival helipad name"
  },
  "createdBy": {
    type      : String,
    label     : "Creator of this document",
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
  "modifiedBy": {
    type      : String,
    label     : "Modifier of this document",
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

Fare.attachSchema( FareSchema );

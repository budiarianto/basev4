import { Mongo } from 'meteor/mongo';
import faker from 'faker';

export const City = new Meteor.Collection( 'city' );

City.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

City.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

let CitySchema = new SimpleSchema({
  "country"    : {
	    type    : String,
	    label   : "Country Name",
	    max     : 150
  },
  "city"          :{
    type            : String,
    label   : "City Name",
  },
  "sequence"  : {
    type      : Number,
    label     : "Sequence Number"
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

City.attachSchema( CitySchema );

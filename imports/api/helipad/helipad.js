import { Mongo } from 'meteor/mongo';
import faker from 'faker';

export const Helipad = new Meteor.Collection( 'helipad' );

Helipad.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Helipad.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

let _ImageSchema = new SimpleSchema({
  "imageId" : {
    type        : String,
    label       : "userId"
  },
  "imgUrl": {
    type          : String,
    label         : "Peran User",
    regEx		  : SimpleSchema.RegEx.Url 
  },
  "imgDescription": {
    type          : String,
    label         : "Deskripsi image"
  },
  "modifiedDate": {
    type      : Date,
    label     : "Last modified timestamp",
    autoValue   : function() {
      if (this.isUpdate || this.isInsert) {
        return new Date();
      }else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      }else {
        this.unset();
      }
    }
  }
});

let _AdministrativeSchema = new SimpleSchema({
	  level1long: {
	    type: String,
	    optional: true
	  },
	  level2long: {
	    type: String,
	    optional: true
	  },
	  level3long: {
	    type: String,
	    optional: true
	  },
	  level4long: {
		  type: String,
		  optional: true
	  }
});

let _AddressSchema = new SimpleSchema({
	  fullAddress: {
	    type: String,
	    optional: true
	  },
	  lat: {
	    type: Number,
	    decimal: true,
	    optional: true
	  },
	  lng: {
	    type: Number,
	    decimal: true,
	    optional: true
	  },
	  geometry: {
	    type: Object,
	    blackbox: true,
	    optional: true
	  },
	  placeId: {
	    type: String,
	    optional: true
	  },
	  street: {
	    type: String,
	    max: 100,
	    optional: true
	  },
	  city: {
	    type: String,
	    max: 50,
	    optional: true
	  },
	  state: {
	    type: String,
	    optional: true
	  },
	  zip: {
	    type: String,
	    optional: true
	  },
	  country: {
	    type: String,
	    optional: true
	  },
	  administrativeLevels: {
		  type: _AdministrativeSchema,
		  optional: true,
		  label: "Adminstrative level dari Provinsi sampai kelurahan"
	  }
	});

let HelipadSchema = new SimpleSchema({
  "name"    : {
	    type    : String,
	    label   : "Nama Helipad",
	    max     : 150
  },	  
  "images"  : {
    type      : [ _ImageSchema ],
    optional: true
  },
  "status"          :{
    type            : String,
    label           : "Status Helipad",
    allowedValues   : ["Available", "Unavailable"],
    defaultValue    : "Available"
  },
  "descriptions"  : {
    type      : String,
    label     : "descriptions of helipad",
    optional  : true
  },
  "location"  	: {
	  type      : _AddressSchema,
	  label     : "location",
	  optional	: true
  },
  "startDate"  : {
	  type      : Date,
	  label     : "Start date",
	  optional: true
  },
  "thruDate"  : {
	  type      : Date,
	  label     : "Thru Date",
	  optional: true
  },
  "operationStartTime"  : {
	  type      : Date,
	  label     : "startTime",
	  optional: true
  },
  "operationThruTime"  : {
	  type      : Date,
	  label     : "thruTime",
	  optional: true
  },
   "videoId"   : {
	  type          : String,
	  label         : "Youtube ID",
	  optional      : true
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

Helipad.attachSchema( HelipadSchema );

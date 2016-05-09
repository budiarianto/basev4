import { Mongo } from 'meteor/mongo';
import faker from 'faker';

export const Event = new Meteor.Collection( 'event' );

Event.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Event.deny({
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
  "status": {
	  type          : String,
	  label         : "Status User saat ini",
	  allowedValues : ["Active", "Inactive", "Deleted"]
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
	  }
	});

let _DetailSchema = new SimpleSchema({
	"detailId" : {
		type        : String,
		label       : "id of details",
	},
	"sequence" : {
		type        : Number,
		label       : "details sequence order number",
	},
	"detailHeader" : {
		type        : String,
		max			: 225,
		label       : "detail header"
	},
	"detailMarkdown" : {
		type        : String,
		label       : "details mark down",
		optional: true
	}
});


let EventSchema = new SimpleSchema({
  "name"    : {
	    type    : String,
	    label   : "Nama Event",
	    max     : 150
  },	  
  "images"  : {
    type      : [ _ImageSchema ],
    optional: true
  },
  "status"          :{
    type            : String,
    label           : "Status Event",
    allowedValues   : ["Open", "Draft", "Active", "Inactive", "Deprecated", "Deleted"],
    defaultValue    : "Active"
  },
//  "details"  : {
//	  type      : [ _DetailSchema ],
//	  optional: true
//  },
  "details"  : {
	  type      : String,
	  label     : "details of event",
	  optional: true
  },
  "descriptions"  : {
    type      : String,
    label     : "descriptions of event",
    optional  : true
  },
  "pax"  : {
	  type      : Number,
	  label     : "maximum pax"
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
  "startTime"  : {
	  type      : Date,
	  label     : "startTime",
	  optional: true
  },
  "thruTime"  : {
	  type      : Date,
	  label     : "thruTime",
	  optional: true
  },
  // statistik
  "hits"          : {
    type          : Number,
    label         : "Jumlah Dilihat",
    min           : 0,
    defaultValue  : 0
  },
  "viewed"        : {
    type          : [ String ],
    label         : "Pengguna yang melihat",
    optional      : true
  },
  "starred"    : {
    type          : [ String ],
    label         : "Jumlah disimpan oleh Pengguna",
    optional      : true
  },
  "shared"   : {
    type          : [ String ],
    label         : "Pengguna yang rekomendasi event ini",
    optional      : true
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

Event.attachSchema( EventSchema );

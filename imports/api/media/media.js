import { Mongo } from 'meteor/mongo';
import faker from 'faker';

export const Media = new Meteor.Collection( 'media' );

Media.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Media.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

let MediaSchema = new SimpleSchema({
  "refType" :{
    type            : String,
    allowedValues   : ["Biz", "User", "Product"]
  },
  "refId" :{
    type      : String
  },
  "cloudType" :{
    type            : String,
    allowedValues   : ["Cloudinary", "S3"]
  },
  "cloudId" :{
    type      : String
  },
  
  "type" :{
    type            : String,
    allowedValues   : ["Biz.Logo", "Biz.Background", "Biz.Media", "User.Image", "User.Background"]
  },
  
  "status" :{
    type            : String,
    allowedValues   : ["Active", "Spam", "Deleted"]
  },
  "sequenceNr" :{
    type          : Number,
    decimal       : true,
    min           : 0,
    defaultValue  : 0
  },

  "title" : {
    type        : String,
    label       : "Judul Media",
    max         : 140,
    optional    : true
  },
  "description" : {
    type        : String,
    label       : "Keterangan",
    max         : 1000,
    optional    : true
  },
  "mimeType" : {
    type        : String,
    label       : "mime-type",
    max         : 50,
    optional    : true
  },
  "url" : {
    type        : String,
    label       : "URL",
    regEx       : SimpleSchema.RegEx.Url
  },
  "size" : {
    type        : Number,
    label       : "Ukuran File",
    min         : 0,
    optional    : true
  },

  "tags" : {
    type : [ String ],
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
    label         : "Pengguna yang recommend Produk ini",
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

Media.attachSchema( MediaSchema );

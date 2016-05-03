export const Routes = new Meteor.Collection( 'routes' );

Routes.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Routes.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

let _RouteSchema = new SimpleSchema({
	  "fareId" : {
			type        : String,
			label       : "fare id"
	  },
	  "departure" : {
	    type        : String,
	    label       : "Departure"
	  },
	  "arrival": {
	    type          : String,
	    label         : "Arrival"
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

Routes.attachSchema( _RouteSchema );

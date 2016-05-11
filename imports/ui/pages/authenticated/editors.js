Template.editors.onCreated( function() {
  // Here, we create a ReactiveVar to track the "save state" of our document.
  this.saveState = new ReactiveVar();
 
  
});

Template.editors.onRendered(function() {
	this.id = FlowRouter.getParam('id').toString();
	//this.detailId = FlowRouter.getParam('detailId').toString();
  
	this.autorun(function(){
		  var id = FlowRouter.getParam('id').toString();
		  Meteor.subscribe('event', id, function(error, response){
			  if(!error){
				  var event = Event.findOne({});
				  if(event){
					  var descriptions = event.descriptions;
					  var details = event.details;

					  if(descriptions)
						  $('.editDescriptions').html(descriptions);

					  if(details)
						  $('.editDetails').html(details);

				  }
			  }
		  });
	  });
  	
	var AutoList = MediumEditor.Extension.extend({
		name: 'autolist',
		init: function() {
			this.subscribe('editableKeypress', this.onKeypress.bind(this));
		},
		onKeypress: function (keyPressEvent) {
		 if (MediumEditor.util.isKey(keyPressEvent, [MediumEditor.util.keyCode.SPACE])) {
					var list_start = this.base.getSelectedParentElement().textContent;
					if (list_start == "1."  && this.base.getExtensionByName('orderedlist')) {
						this.base.execAction('insertorderedlist');
						this.base.getSelectedParentElement().textContent = this.base.getSelectedParentElement().textContent.slice(2).trim();
					}
					else if( list_start == "*" && this.base.getExtensionByName('unorderedlist') || list_start == "-" && this.base.getExtensionByName('unorderedlist')) {
						this.base.execAction('insertunorderedlist');
						this.base.getSelectedParentElement().textContent = this.base.getSelectedParentElement().textContent.slice(1).trim();
					}
			}
		}
	});

	var editor = new MediumEditor('.editable', {
		toolbar: {
			buttons : ['bold', 'italic', 'underline', 'anchor', 'orderedlist', 'unorderedlist', 'h3' , 'h4', 'quote']
		},
		buttonLabels: 'fontawesome',
		placeholder: {
			text: 'Type your text',
			hideOnClick: false
		},
		extensions: {
			'autolist': new AutoList()
		}
	});
});

Template.editors.helpers({
	saving: function() {
		var saveState = Template.instance().saveState.get();
		return saveState;
	},
	event(){
		return Event.findOne({});
	}
});

Template.editors.events({
	'click .editable': function( event, template ) {
		var id = FlowRouter.getParam('id').toString();
		var textDescriptions = $(template.find('.editDescriptions')).html();
		var textDetails = $(template.find('.editDetails')).html();
	    var query={};
		template.saveState.set( true );
		
		 if ( textDescriptions !== "")
			 query['descriptions'] = textDescriptions;

		 if ( textDetails !== "")
			 query['details'] = textDetails;
		 
	    // For good measure, make sure we're not inserting a blank string. This saves
	    // us some unnecessary work but also prevents running into an "undefined" error
	    // if we save the blank string to the database.
		
		
	    if ( textDescriptions !== "" || textDetails !== "" ) {

	      // Here, we use the deanius:promise package to chain our calls. Why? Well,
	      // we need to call two methods here: one to convert our markdown to HTML on
	      // the server and get it back so we can update our preview, and then another
	      // to actually save our Markdown to the database. This package, using JavaScript
	      // promises, allows us to chain our method calls so our code is a little cleaner
	      // and we don't have to get caught up in "callback hell."

	    	Meteor.callPromise( "updateEvent", id, query )
	        	.then( function() {
		          _.delay( function() {
		            // After a short delay, set our "saving" state to "Saved!"
		            template.saveState.set( false );
		          }, 1000 );
		        })
	        .catch( function( error ) {
	          Bert.alert( error, "danger" );
	        });
	    }
	  },
	  'keyup .editDescriptions': function( event, template ) {
		  var id = FlowRouter.getParam('id').toString();
		  var text = $(template.find('.editDescriptions')).html();
		  console.log('text', text);
		  template.saveState.set( true );
		  
		  // For good measure, make sure we're not inserting a blank string. This saves
		  // us some unnecessary work but also prevents running into an "undefined" error
		  // if we save the blank string to the database.
		  if ( text !== "" ) {
			  
			  // Here, we use the deanius:promise package to chain our calls. Why? Well,
			  // we need to call two methods here: one to convert our markdown to HTML on
			  // the server and get it back so we can update our preview, and then another
			  // to actually save our Markdown to the database. This package, using JavaScript
			  // promises, allows us to chain our method calls so our code is a little cleaner
			  // and we don't have to get caught up in "callback hell."
			  
			  Meteor.callPromise( "updateEvent", id, { descriptions: text } )
			  .then( function() {
				  _.delay( function() {
					  // After a short delay, set our "saving" state to "Saved!"
					  template.saveState.set( false );
				  }, 1000 );
			  })
			  .catch( function( error ) {
				  Bert.alert( error, "danger" );
			  });
		  }
	  },
	  'keyup .editDetails': function( event, template ) {
		  //var text = template.editor.innerHtml();
		  var id = FlowRouter.getParam('id').toString();
		  var text = $(template.find('.editDetails')).html();
		  console.log('text', text);
		    
		  template.saveState.set( true );
		  
		  // For good measure, make sure we're not inserting a blank string. This saves
		  // us some unnecessary work but also prevents running into an "undefined" error
		  // if we save the blank string to the database.
		  if ( text !== "" ) {
			  
			  // Here, we use the deanius:promise package to chain our calls. Why? Well,
			  // we need to call two methods here: one to convert our markdown to HTML on
			  // the server and get it back so we can update our preview, and then another
			  // to actually save our Markdown to the database. This package, using JavaScript
			  // promises, allows us to chain our method calls so our code is a little cleaner
			  // and we don't have to get caught up in "callback hell."
			  
			  Meteor.callPromise( "updateEvent", id, { details: text } )
			  	.then( function() {
				  _.delay( function() {
					  // After a short delay, set our "saving" state to "Saved!"
					  template.saveState.set( false );
				  }, 1000 );
			  	})
			  .catch( function( error ) {
				  Bert.alert( error, "danger" );
			  });
		  }
	  }
});

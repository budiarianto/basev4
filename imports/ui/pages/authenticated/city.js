Template.city.onRendered(function() {
	var template = Template.instance();
	Meteor.setTimeout(function(){
		Modules.client.createNewCity( { form: "#cityForm", template: template} );
	}, 1000);
});

Template.city.helpers({
	
});

Template.city.events({
	'submit form': function(event) {
		event.preventDefault();
	},
	'click #cancel': (e)=>{
		e.preventDefault();
		window.history.back();
	}
});
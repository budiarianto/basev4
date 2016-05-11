Template.member.onCreated(function() {
});

Template.member.onRendered(function() {
	var template = Template.instance();
	Meteor.setTimeout(function(){
		Modules.client.createNewMember( { form: "#memberForm", template: template} );
	}, 1000);
});

Template.member.helpers({
});

Template.member.events({
	'submit form': function(event) {
		event.preventDefault();
	},
	'click #cancel': (e)=>{
		e.preventDefault();
		window.history.back();
	}
});
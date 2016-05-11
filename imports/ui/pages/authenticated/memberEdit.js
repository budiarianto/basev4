Template.memberEdit.onCreated(function() {
	this.autorun(function() {
		var userId = FlowRouter.getParam('userId');
		Meteor.call('findMemberId', userId, function(err, res) {
			if(res) Session.set('foundMember', res);
		});
		Meteor.subscribe('member', userId);
	});
});

Template.memberEdit.onRendered(function() {
	var template = Template.instance();
	Meteor.setTimeout(function(){
		Modules.client.updateMember( { form: "#memberForm", template: template} );
	}, 1000);
});

Template.memberEdit.onDestroyed(function() {
  Session.set('foundMember', undefined);
});

Template.memberEdit.helpers({
	'foundMember': function() {
	   var foundMember = Session.get('foundMember');
	   return foundMember;
	 }
});

Template.memberEdit.events({
	'submit form': function(event) {
		event.preventDefault();
	},
	'click #cancel': (e)=>{
		e.preventDefault();
		window.history.back();
	}
});
Template.settings.onCreated( function() {
});

Template.settings.onRendered( function() {
});

Template.settings.helpers({
	'currUser': function() {
	   var datas = Meteor.users.findOne({});
	   //console.log("ini datas: ", datas);
	   return datas;
	 }
});

Template.settings.events({
});








Template.cityEdit.onCreated(function() {

});

Template.cityEdit.onRendered(function() {
	var template = Template.instance();
	var id = FlowRouter.getParam('id');
	
	Meteor.subscribe('helipads');
	Meteor.subscribe('city', id);

	Meteor.setTimeout(function(){
		Modules.client.updateNewCity( { form: "#cityForm", template: template, id: id} );
	}, 1000);
});

Template.cityEdit.helpers({
	cities(){
		var id = FlowRouter.getParam('id');
		return City.findOne({_id: id});
	},
	helipads(){
		//console.log('this.city', this.city);
		return Helipad.find({'location.city': this.city}).fetch();
	}
});

Template.cityEdit.events({
	'submit form': function(event) {
		event.preventDefault();
	},
	'click #save': (e)=>{
		e.preventDefault();
		$('#cityForm').submit();
	},
	'click #cancel': (e)=>{
		e.preventDefault();
		window.history.back();
	},
	'click #delete': (e)=>{
		e.preventDefault();
		var id = FlowRouter.getParam('id');
		Meteor.call('removeCity', id, function(error){
			if(error)
				Bert.alert(error.message, 'warning');
			
			FlowRouter.go('/cityList');
		});
		
	}
});
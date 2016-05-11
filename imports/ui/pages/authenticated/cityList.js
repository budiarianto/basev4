Template.cityList.onCreated(function(){
	this.autorun(function(){
		Meteor.subscribe('cities');
	});
	 Session.keys = {};
});

Template.cityList.onDestroyed(function () {
	  Session.keys = {};
});

Template.CityData.onRendered(function(){
	Tracker.autorun(function(){	
		$("#tableCity").tablesorter();
	});
});

Template.cityList.helpers({
	cities(){
		var keyword = Session.get('keyword');
		var data = {};
		var conditions = {};
		
		if(keyword && keyword!="undefined"){
			conditions = {$or: [{'city': {$regex: keyword, $options: 'i'}},{'country': {$regex: keyword, $options: 'i'}}]};
		}

		
		data = City.find(conditions,{sort: {sequence: 1}}).fetch();
		Meteor.setTimeout(function(){
			$("#tableCity").trigger("destroy");
			$("#tableCity").tablesorter();
		}, 1000);
		return data;
	}
});

Template.cityList.events({
	'submit form'(event){
		event.preventDefault();
	},
	'click tr'(){
		var id = this._id;
		
		if(id)
			FlowRouter.go('/cityEdit/'+id);
	},
	'click #repairIndex'(event){
		Modules.client.loadingButton(event.currentTarget, 'start');
		Meteor.call('repairIndex', function(error, result){
			if(error)
				Bert.alert(error.reason, 'warning');
			else
				Bert.alert(result, 'success');
			
			Modules.client.loadingButton(event.currentTarget, 'end');
		});
	},
	'change #keyword': function(event) {
		//console.log('event', event.currentTarget.value);
		var keyword = event.currentTarget.value;
		if(keyword){
			Session.set('keyword', keyword);
		}else{
			Session.set('keyword', false);
		}
	}
});
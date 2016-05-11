var i = 0;
Template.helipadList.onCreated(function(){
	this.autorun(function(){
		Meteor.subscribe('helipads');
	});
	 Session.keys = {};
});

Template.helipadList.onDestroyed(function () {
	  Session.keys = {};
});

Template.helipadData.onRendered(function(){
});

Template.helipadList.onRendered(function(){
	//Meteor.subscribe('helipads');
});

Template.helipadList.helpers({
	helipads(){
		var keyword = Session.get('keyword');
		var data = {};
		var conditions = {};
		
		if(keyword && keyword!="undefined"){
			conditions = {$or: [{'_id': {$regex: keyword, $options: 'i'}},{'location.fullAddress': {$regex: keyword, $options: 'i'}},{'location.state': {$regex: keyword, $options: 'i'}},{'location.country': {$regex: keyword, $options: 'i'}},{'location.city': {$regex: keyword, $options: 'i'}},{'name': {$regex: keyword, $options: 'i'}},{'descriptions': {$regex: keyword, $options: 'i'}}]};
		}
		
		data = Helipad.find(conditions,{sort:{'_id': 1}}).fetch();
		Meteor.setTimeout(function(){
			$("#tableHelipad").trigger("destroy");
			$("#tableHelipad").tablesorter();
		}, 1000);
		return data;
	}
	
});

Template.helipadList.events({
	'submit form'(event){
		event.preventDefault();
	},
	'click tr'(){
		if(this._id)
			FlowRouter.go('/helipadEdit/'+this._id);
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

Template.helipadData.helpers({
	seq(){
		return ++i;
	},
	isAvail(){
		if(this && this.status=="Available")
		return "true";
	}
});
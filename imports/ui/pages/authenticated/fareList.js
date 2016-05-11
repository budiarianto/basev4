var i = 0;
Template.fareList.onCreated(function(){
	this.autorun(function(){
		Meteor.subscribe('fares');
	});
	Session.keys = {};
});

Template.fareList.onDestroyed(function () {
	  Session.keys = {};
});

Template.fareData.onRendered(function(){
});

Template.fareList.helpers({
	fares(){
		var keyword = Session.get('keyword');
		var data = {};
		var conditions = {};
		
		if(keyword && keyword!="undefined"){
			conditions = {$or: [{'name': {$regex: keyword, $options: 'i'}},{'descriptions': {$regex: keyword, $options: 'i'}},{'departureCity': {$regex: keyword, $options: 'i'}},{'departureLocation': {$regex: keyword, $options: 'i'}},{'arrivalCity': {$regex: keyword, $options: 'i'}},{'arrivalLocation': {$regex: keyword, $options: 'i'}}]};
		}

		data =  Fare.find(conditions,{sort:{'_id': 1}}).fetch();
		Meteor.setTimeout(function(){
			$("#tableFares").trigger("destroy");
			$("#tableFares").tablesorter();
		}, 1000);
		return data;
	}
});

Template.fareData.helpers({
	isActive(){
		if(this && this.status=="Active")
		return "true";
	},
	priceString(){
		//console.log('this.price', this.price);
		return accounting.formatNumber(this.price);
	},
	airTimeString(){
		var tm = moment(new Date(this.airTime.toString())).format('HH:mm');
		//console.log('tm', tm);
		return tm;
	}
});

Template.fareList.events({
	'submit form'(event){
		event.preventDefault();
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
Template.fareData.events({
	'click tr'(){
		var id = this._id
		if(id)
			FlowRouter.go('/fareEdit/'+id);
		return false;
	},
	
});
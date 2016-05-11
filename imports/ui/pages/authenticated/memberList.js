Template.memberList.onCreated( function() {
	this.autorun(function() {
    	Template.instance().subscribe( 'members' );
  	});
	
	Session.keys = {};
	//set default status
	var status = 'Active';
	Session.set('status', status);
});

Template.memberList.onDestroyed(function () {
	  Session.keys = {};
});

Template.memberList.events({
	'submit form'(event){
		event.preventDefault();
	},
	'click tr'(){
		var id = this.userId;
		
		if(id)
			FlowRouter.go('/userDashboard/'+id);
	},
	'change #keyword': function(event) {
		//console.log('event', event.currentTarget.value);
		var keyword = event.currentTarget.value;
		if(keyword){
			Session.set('keyword', keyword);
		}else{
			Session.set('keyword', false);
		}
	},
	'change .memberStatus': function(event) {
		var status = event.currentTarget.value;
		if(status){
			Session.set('status', status);
		}else{
			Session.set('status', false);
		}
	},
});

Template.memberList.helpers({
	'memberClientList': function() {
		var keyword = Session.get('keyword');
		var status = Session.get('status');
		var data = {};
		var conditions = [];
		var conditionList = {};
		
		if(keyword && keyword!="undefined"){
			conditions.push({'emails': {$regex: keyword, $options: 'i'}});
			conditions.push({'fullname': {$regex: keyword, $options: 'i'}});
			conditions.push({'mobileNumber': {$regex: keyword, $options: 'i'}});
			conditionList = {$or: conditions};
		}
		var dataMember = Member.find(
			{
				$and:[
					{ 'memberType': 'client' },
					{'memberStatus': status},
					conditionList
				]
			}, {sort: {createdDate: -1}}).fetch();
		//console.log("dataMember: ",dataMember);
		Meteor.setTimeout(function(){
			$("#tableMember").trigger("destroy");
			$("#tableMember").tablesorter();
		}, 1000);
		return dataMember;
	},
	formatDate: function (date) {
		return moment(date).format('DD/MM/YYYY');
	},
	formatTime: function (date) {
		return moment(date).format('HH:mm');
	},
	incremented: function (index) {
		index++;
		return index;
	}
});

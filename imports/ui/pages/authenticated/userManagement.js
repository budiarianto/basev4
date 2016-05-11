Template.userManagement.onCreated( function() {
	this.autorun(function() {
    	Template.instance().subscribe( 'inviteUserAdmin' );
    	Template.instance().subscribe( 'userAdmin' );
    	Template.instance().subscribe( 'members' );

    	Meteor.call('adminCheck', function(error, result){
			if(error){
				//console.log("err: ",error);
			}else{
				var result = result;
				if(result){
				}else{
					Bert.alert( 'You are not authorized to access this page', 'warning' );
		      		FlowRouter.go('/');
				}
				Session.set('foundAdmin', result);
			}
		});

  	});
	
});

Template.userManagement.onRendered( function() {
	// Meteor.setTimeout(function(){
	// 	Modules.client.inviteUserAdmin( { form: "#inviteUserAdmin", template: Template.instance() } );	
	// }, 400);
	var templateInstance = Template.instance();
	var waiting = setInterval(function() {
		if (document.getElementById('inviteUserAdmin')) {
			$('#admin').prop('checked', true);
			Modules.client.inviteUserAdmin( { form: "#inviteUserAdmin", template: templateInstance } );
			clearInterval(waiting);
		}
	}, 400);
});

Template.userManagement.helpers({
	'inviteUserAdminList': function() {
		var dataInvite = InviteUserAdmins.find(
			{'status': {$ne: 'Registered'}}, {sort: {createdDate: -1}}).fetch();
		return dataInvite;
	},
	'admin': function(){
		if(Meteor.user()){
			return Session.get('foundAdmin');
		}
	},
	formatDate: function (date) {
		return moment(date).format('DD MMMM YYYY');
	},
	formatTime: function (date) {
		return moment(date).format('HH:mm');
	},
	incremented: function (index) {
		index++;
		return index;
	},
	'memberAdminList': function(){
		return Member.find(
			{
				$and:[
					{ 'memberType': 'admin' },
					{ 'userId': {$ne:Meteor.userId()} }
				]
			}, {sort: {createdDate: -1}}).fetch();
	}
});

Template.userManagement.events({
	'submit form': ( event ) => event.preventDefault(),
	'click .deleteInvitation'(event){
		event.preventDefault();
		Meteor.call('deleteInvitation', this._id, function(error, result){
        	if(error)
        		Bert.alert(error.reason, 'warning');
        	else
        		Bert.alert(result, 'success');
        });
	}
});

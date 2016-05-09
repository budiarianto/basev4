Meteor.methods({  
	'updateUserFullname': function(fullname) {
		check(fullname, String);

		if(_.isEmpty(fullname.trim()))
			throw new Meteor.Error(111,'Fullname cannot be empty!');

		Meteor.users.update({_id:this.userId},{$set:{"profile.fullname": fullname}});
		Member.update({userId:this.userId},{$set:{"fullname": fullname}});
	},
	setUserDisableState: function (userId, state) {
		check(userId, String);
		check(state, Boolean);
		
	    var loggedInUserId = Meteor.userId();

	    if (state) {
	    	Member.update({ userId: userId }, { $set: { 'memberStatus': 'Inactive' }});
	      	Meteor.users.update({ _id: userId }, { $set: { 'disabled': state }});
	      	// Logout user
	      	Meteor.users.update({ _id: userId }, {$set: { "services.resume.loginTokens" : [] }});
	    } else {
	      	Member.update({ userId: userId }, { $set: { 'memberStatus': 'Active' }});
	      	Meteor.users.update({ _id: userId }, { $unset: { 'disabled': false }});
	    }
	    return true;
	},
	bannedUser: function (userId, state) {
		check(userId, String);
		check(state, Boolean);
		
		var loggedInUserId = Meteor.userId();
		
		if (state) {
			//Meteor.users.update({ _id: userId }, { $set: { 'banned': state }});
			//Member.update({ userId: userId }, { $set: { 'banned': state }});
			Member.update({ userId: userId }, { $set: { 'memberStatus': 'Banned' }});
			//Meteor.users.update({ _id: userId }, { $set: { 'disabled': state }});
	      	// Logout user
	      	Meteor.users.update({ _id: userId }, {$set: { "services.resume.loginTokens" : [] }});
		} else {
			//Meteor.users.update({ _id: userId }, { $unset: { 'banned': false }});
			//Member.update({ userId: userId }, { $unset: { 'banned': false }});
			Member.update({ userId: userId }, { $set: { 'memberStatus': 'Active' }});
			//Meteor.users.update({ _id: userId }, { $unset: { 'disabled': false }});
		}
		return state;
	},
	'findUserId': function(userId) {
		check(userId, String);

		var user = Meteor.users.findOne(
			{ '_id': userId },
			{
				fields: { 
					'profile': 1
				}
			}
		);

		return user;
	},
	'isUserBanned': function(userId) {
		check(userId, String);

		var user = Member.findOne(
			{ 'userId': userId, memberStatus:'Banned'});
		if(user)
			return true;
		else
			return false;
	},
	'findMemberId': function(userId) {
		check(userId, String);

		var member = Member.findOne(
			{ 'userId': userId }
		);
		return member;
	}
});

Meteor.methods({  
	'adminCheck': function(callback) {
		var dataAdmin = Member.findOne({ 'userId': Meteor.userId() });
		if(dataAdmin){
			if (dataAdmin.memberType == "admin" && dataAdmin.memberRole == "administrator"){
				return true;
			}else{
				return false;
			}
		}
	}
});

Meteor.methods({  
	'userCheck': function(email) {
		check(email, String);
		console.log("email: ",email);
		var dataUser = Member.findOne({ 'emails': email });
		if(dataUser){
			if (dataUser.memberType == "admin"){
				return true;
			}else{
				throw new Meteor.Error(403, "You are not authorized to access this page!");
			}
		}
	}
});

Accounts.validateLoginAttempt(function(attempt){

	//this flag logic for Admin create new member without autologin
	if (attempt.user && attempt.methodArguments[0].withoutLogin){
		return false;
	}

	if (attempt.user && attempt.user.disabled)
   		throw new Meteor.Error(403, "Account is Inactive !");

	if(attempt.user){
		var memberAdmin = Member.findOne({ 'userId': attempt.user._id });
		if(memberAdmin){
			//console.log("memberAdmin.memberType: ",memberAdmin.memberType);
			if ((attempt.user._id === memberAdmin.userId) && memberAdmin.memberType == 'admin'){
				return true;
			}else{
				throw new Meteor.Error(403, "You are not authorized to access this page!");
			}

			if ((attempt.user._id === memberAdmin.userId) && memberAdmin.memberStatus == 'Banned'){
				throw new Meteor.Error(403, "Account is Banned !");
			}

		}else{
			return true;
		}
	}
		
});
Meteor.methods({  
	'user_update_profile_image': function(userId, url) {
		if (!this.userId)
			throw new Meteor.Error(401, 'You must be logged in.');

		check(userId, String);
		check(url, String);

		var user = Meteor.users.findOne({ '_id': userId });

		if(!user)
			throw new Meteor.Error(404,'User not found!');

		Meteor.users.update({_id:userId},{$set:{"profile.profileImgUrl": url}});

	}
});
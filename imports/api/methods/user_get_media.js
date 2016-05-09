Meteor.methods({
	'user_get_media': function(options) {
		if (!this.userId)
			throw new Meteor.Error(401, 'You must be logged in.');
		
		check(options, Object);
		//get media
		var media = Media.findOne({refType: options.refType, refId: options.refId, type: options.type, status : "Active", url: options.url});
		return media;
	}
});

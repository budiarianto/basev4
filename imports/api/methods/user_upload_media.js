Meteor.methods({
	'user_upload_media': function(media) {
		if (!this.userId)
			throw new Meteor.Error(401, 'You must be logged in.');

		check( media, Object);

		var mediaId = Media.insert(media);
		return mediaId;
	}
});
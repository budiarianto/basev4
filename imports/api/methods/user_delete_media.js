Meteor.methods({
	'user_delete_media': function(mediaId) {
		if (!this.userId)
			throw new Meteor.Error(401, 'You must be logged in.');

		check( mediaId, String);
		
		var deleteMedia = Media.remove(mediaId);
		
		if(deleteMedia)
			return true;
		else
			return false;
	},
	'user_delete_media_object': function(mediaId) {
		if (!this.userId)
			throw new Meteor.Error(401, 'You must be logged in.');
		
		check( mediaId, String);
		
		var deleteMediaObject = Media.remove({_id: mediaId});
		return deleteMediaObject;
	}
});
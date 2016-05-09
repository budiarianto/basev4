Meteor.methods({
	createEvent(){
		if (!this.userId)
			throw new Meteor.Error(401, 'You must be logged in.');

		event = {};
		event.name="auto";
		event.pax=1;
		
		var eventId = Event.insert(event);
		return eventId;
	},
	updateNewEvent(event, id){
		check(id, String);
		check(event, Object);
		
		if (!this.userId)
			throw new Meteor.Error(401, 'You must be logged in.');
		
		if(event._id!=id)
			throw new Meteor.Error(403, 'Event update error on match');
		
		var result = Event.update({_id: id},{$set: event});
		return result;
	},
	updateEvent(id, fieldSet){
		check(id, String);
		check(fieldSet, Object);
		
		if (!this.userId)
			throw new Meteor.Error(401, 'You must be logged in.');
		
		var result = Event.update({_id: id},{$set: fieldSet});
		return result;
	},
	cancelCreateEvent(id){
		check(id, String)
		
		if (!this.userId)
			throw new Meteor.Error(401, 'You must be logged in.');
		
		
		//get data meteor
		var eventData = Event.findOne({_id: id});
		
		if(eventData && eventData.createdBy === this.userId ){
			var result = Event.remove({_id: id});
			console.log('remove result', result);
		}
	},
	createEventDetail(id, detailHeader, sequence){
		if (!this.userId)
			throw new Meteor.Error(401, 'You must be logged in.');

			check(id, String);
			check(detailHeader, String);
			check(sequence, Number);
			
			var detailData = Event.findOne({_id: id, details: {$elemMatch: {'detailHeader': detailHeader}}});
			
			if(!detailData){
				
				var detailId = Random.id();
				//console.log('detailId', detailId);
				
				var detail = {};
				detail.detailId 		= detailId;
				detail.detailHeader 	= detailHeader;
				detail.sequence 		= sequence;
				detail.detailMarkdown 	= " ";
				
				var result = Event.update({_id: id},{$push: {details: detail}});
				return detailId;
			}else{
				throw new Meteor.Error('duplicate','Detail header already exists !');
			}
		
	},
	updateEventDetail(options){
		if (!this.userId)
			throw new Meteor.Error(401, 'You must be logged in.');

			check(options, Object);
			
			var detailData = Event.findOne({_id: options.id, details: {$elemMatch: {'detailId': options.detailId}}});
			
			if(detailData){
				
				var query ={};
				
				if(options.detailHeader){
					query['details.$.detailHeader'] = options.detailHeader;
				}
					
				if(options.sequence){
					query['details.$.sequence'] 	= options.sequence;
				}
				
				if(options.detailMarkdown)
					query['details.$.detailMarkdown'] = options.detailMarkdown;

				//query.details = [data_details];
				
				console.log('options',options);
				var result = Event.update({_id: options.id, 'details.detailId': options.detailId},{$set: query});
				return result;
			}else{
				throw new Meteor.Error('duplicate','Detail header already exists !');
			}
		
	},
	updateEventDetailMarkdown(options){
		if (!this.userId)
			throw new Meteor.Error(401, 'You must be logged in.');

			check(options, Object);
			
			var detailData = Event.findOne({_id: options.id, details: {$elemMatch: {'detailId': options.detailId}}});
			
			if(detailData){
				var result = Event.update({_id: options.id, 'details.detailId': options.detailId},{$set: {'details.$.detailMarkdown': options.detailMarkdown}});
				return result;
			}else{
				throw new Meteor.Error('duplicate','Detail header already exists !');
			}
		
	}
}); 
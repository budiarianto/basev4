Meteor.methods({
	createHelipad(helipad){
		
		check(helipad, Object);
		if (!this.userId)
			throw new Meteor.Error(401, 'You must be logged in.');
		
		try{
			var helipadId = Helipad.insert(helipad);
		}catch(e){
			
			var errorMessage = "Internal server error !",
		    error_duplicate_key = "duplicate key error index";
			
			var err = JSON.stringify(e);
			
			if(err.indexOf(error_duplicate_key)> -1)
				errorMessage = "Error duplicate key id !";
				
			throw new Meteor.Error(errorMessage);
			
		}
		
		return helipadId;
	},
	updateHelipad(id, fieldSet){
		check(id, String);
		check(fieldSet, Object);
		
		if (!this.userId)
			throw new Meteor.Error(401, 'You must be logged in.');
		
		var result = Helipad.update({_id: id},{$set: fieldSet});
		return result;
	},
	removeHelipad(id){
		check(id, String)
		
		if (!this.userId)
			throw new Meteor.Error(401, 'You must be logged in.');
		
		//get data meteor
		var helipadData = Helipad.findOne({_id: id});
		
		//get data meteor
		var fares = Fare.find({$or: [{departureId: id}, {arrivalId: id}]}).count();
		console.log('fares',fares);
		if(fares>0)
			throw new Meteor.Error(412, helipadData.name+" already has fare, please delete fare first !");
		
		var result = Helipad.remove({_id: id});
		
	},
	createHelipadDetail(id, detailHeader, sequence){
		if (!this.userId)
			throw new Meteor.Error(401, 'You must be logged in.');

			check(id, String);
			check(detailHeader, String);
			check(sequence, Number);
			
			var detailData = Helipad.findOne({_id: id, details: {$elemMatch: {'detailHeader': detailHeader}}});
			
			if(!detailData){
				
				var detailId = Random.id();
				//console.log('detailId', detailId);
				
				var detail = {};
				detail.detailId 		= detailId;
				detail.detailHeader 	= detailHeader;
				detail.sequence 		= sequence;
				detail.detailMarkdown 	= " ";
				
				var result = Helipad.update({_id: id},{$push: {details: detail}});
				return detailId;
			}else{
				throw new Meteor.Error('duplicate','Detail header already exists !');
			}
		
	},
	updateHelipadDetail(options){
		if (!this.userId)
			throw new Meteor.Error(401, 'You must be logged in.');

			check(options, Object);
			
			var detailData = Helipad.findOne({_id: options.id, details: {$elemMatch: {'detailId': options.detailId}}});
			
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
				
//				console.log('options',options);
				var result = Helipad.update({_id: options.id, 'details.detailId': options.detailId},{$set: query});
				return result;
			}else{
				throw new Meteor.Error('duplicate','Detail header already exists !');
			}
		
	},
	updateHelipadDetailMarkdown(options){
		if (!this.userId)
			throw new Meteor.Error(401, 'You must be logged in.');

			check(options, Object);
			
			var detailData = Helipad.findOne({_id: options.id, details: {$elemMatch: {'detailId': options.detailId}}});
			
			if(detailData){
				var result = Helipad.update({_id: options.id, 'details.detailId': options.detailId},{$set: {'details.$.detailMarkdown': options.detailMarkdown}});
				return result;
			}else{
				throw new Meteor.Error('duplicate','Detail header already exists !');
			}
		
	},
	cityList(country){
		if (!this.userId)
			throw new Meteor.Error(401, 'You must be logged in.');
		
		check(country, String);
		
		 var data = {};
		 	data = JSON.parse(Assets.getText('data/'+country+'.json'));
		 	
//		 	console.log('data.city', data.city);
		 	return data.city;
		  
	}
}); 
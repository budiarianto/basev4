Meteor.methods({
	createFare(fare){
		
		check(fare, Object);
		if (!this.userId)
			throw new Meteor.Error(401, 'You must be logged in.');
		
		try{
			//check existing fares
			var fareId = "";
			var existing_fare = Fare.findOne({'departureCity': fare.departureCity,'arrivalCity': fare.arrivalCity,'departureId': fare.departureId, 'arrivalId': fare.arrivalId})
			//console.log('fare', fare);
			if(!existing_fare)
				fareId = Fare.insert(fare);
			
		}catch(e){
			var errorMessage = "Internal server error !",
			error_duplicate_key = "duplicate key error index";
			if(e.reason)
				errorMessage = e.reason;
			else{
				if(e.sanitizedError){
					if(e.sanitizedError.reason)
						errorMessage = e.sanitizedError.reason;
				}else{
					var err = "";
					err = JSON.stringify(e);
					
					if(err.indexOf(error_duplicate_key)> -1)
							errorMessage = "Error duplicate key id !";
				}
					
				
			}
			
			throw new Meteor.Error(errorMessage);
			
		}
		
		return fareId;
	},
	updateFare(id, fieldSet){
		check(id, String);
		check(fieldSet, Object);
		
		if (!this.userId)
			throw new Meteor.Error(401, 'You must be logged in.');
		
		var result = Fare.update({_id: id},{$set: fieldSet});
		return result;
	},
	addFareRoutes(id, departure, arrival){
		check(id, String);
		check(departure, String);
		check(arrival, String);
			
		if (!this.userId)
			throw new Meteor.Error(401, 'You must be logged in.');
		
		var detailData = Fare.findOne({routes: {$elemMatch: {'departure': departure, 'arrival': arrival}}});
		
		if(!detailData){
			var route = {};
			route.departure = departure;
			route.arrival = arrival;
			
			var result = Fare.update({_id: id},{$push: {routes: route}});
			if(result)
				{
					//insert into routes collection:
					route.fareId = id;
					var routes = Routes.insert(route);
				}
			return result;
		}else{
			throw new Meteor.Error('duplicate entry','Route from '+departure+' to ' + arrival +' already exists !');
		}
		
	},
	removeFareRoutes(id, departure, arrival){
		check(id, String);
		check(departure, String);
		check(arrival, String);
		
//		console.log('departure', departure);
//		console.log('arrival', arrival);
		
		if (!this.userId)
			throw new Meteor.Error(401, 'You must be logged in.');
		
		var removedData = Fare.update({_id: id}, {$pull:{routes: {'departure': departure, 'arrival': arrival}}});
		
		//console.log('removedData', removedData);
		if(!removedData){
			throw new Meteor.Error('remove failed !');
		}
		else{
				//insert into routes collection:
				var routes = Routes.remove({fareId: id, departure: departure, arrival: arrival});
		}
		return "Succes removing routes...";
	},
	removeFare(id){
		check(id, String);
		
		if (!this.userId)
			throw new Meteor.Error(401, 'You must be logged in.');
		
		var removedData = Fare.remove({_id: id});
		
		//console.log('removedData', removedData);
		if(!removedData){
			throw new Meteor.Error('remove failed !');
		}
		
		return "Succes removing routes...";
	}
}); 
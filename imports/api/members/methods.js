Meteor.methods({
	createMember(user, mobileNumber){
		
		check(user, Object);
		check(mobileNumber, String);

		if (!this.userId)
			throw new Meteor.Error(401, 'You must be logged in.');
		
		try{
			var users_ = Meteor.users.findOne( { 'emails.address': user.email} );
			if(users_){
				var userId = users_._id
				var memberExists = Member.findOne( { userId: userId} );
				if ( !memberExists ) {
			      Member.insert({
					userId: userId,
					emails: users_.emails[0].address,
					fullname: users_.profile.fullname,
					memberType: 'client',
					mobileNumber: mobileNumber
			      });
			      //Add user to Payment Collection
			      Payment.insert({
					userId: userId,
					userProfile: users_.profile
			      });
			    }
			}
			
		}catch(e){
			var errorMessage = "Internal server error !",
			error_duplicate_key = "duplicate key error index",
			errorErr = 412;
			//console.log('e.error:',e.Error);
			
			
			if(e.sanitizedError){
				if(e.sanitizedError.reason)
					errorMessage = e.sanitizedError.reason;
					errorErr = e.sanitizedError.error;
				//console.log('e.reason:',e.sanitizedError.reason);
			}
			else if(e.reason){
				errorMessage = e.reason;
			}
			else{
				var err = JSON.stringify(e);
				
				if(err.indexOf(error_duplicate_key)> -1)
					errorMessage = "Error duplicate key id !";
			}
			
			throw new Meteor.Error(errorErr, errorMessage);
			
		}
	
	},

	// next methode for update Member
	updateMember(fullname, mobileNumber, memberId){
		check(memberId, String);
		check(fullname, String);
		check(mobileNumber, String);

		// console.log("ini memberId: ",memberId);
		// console.log("ini fullname: ",fullname);
		// console.log("ini mobileNumber: ",mobileNumber);

		if (!this.userId)
			throw new Meteor.Error(401, 'You must be logged in.');
		
		try{
			var users_ = Meteor.users.findOne( { '_id': memberId} );
			//console.log("ini users_: ",users_);
			if(!users_){
				//console.log("user not found!");
			}else{
				Meteor.users.update({'_id':memberId},{$set:{"profile.fullname": fullname}});

				var memberExists = Member.findOne( { userId: memberId} );
				//console.log("ini memberExists: ",memberExists);
				if ( !memberExists ) {
					console.log("member not exist!");
			    }else{
			    	//console.log("ready to update member.");
			      	Member.update({'userId':memberId},{$set:{"fullname": fullname, "mobileNumber": mobileNumber}});
			      	Payment.update({'userId':memberId},{$set:{"userProfile.fullname": fullname}});
			    }
			}
		}catch(e){
			var errorMessage = "Internal server error !",
			error_duplicate_key = "duplicate key error index",
			errorErr = 412;
			//console.log('e.error:',e.Error);
			
			
			if(e.sanitizedError){
				if(e.sanitizedError.reason)
					errorMessage = e.sanitizedError.reason;
					errorErr = e.sanitizedError.error;
				//console.log('e.reason:',e.sanitizedError.reason);
			}
			else if(e.reason){
				errorMessage = e.reason;
			}
			else{
				var err = JSON.stringify(e);
				
				if(err.indexOf(error_duplicate_key)> -1)
					errorMessage = "Error duplicate key id !";
			}
			
			throw new Meteor.Error(errorErr, errorMessage);
			
		}
	
	}

	// next methode for delete Member
	
}); 
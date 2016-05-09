Meteor.methods({
	addSettlement (orderId, ccNumber, trxTime, settTime, settAmount, settStatus){
		check(orderId, String);
		check(ccNumber, String);
		check(trxTime, String);
		check(settTime, String);
		check(settAmount, String);
		check(settStatus, String);

		if (!this.userId)
			throw new Meteor.Error(401, 'You must be logged in.');
		
		if(settStatus == "cancel")
			settAmount=0;
		// console.log("server orderId: ",orderId);
		// console.log("server ccNumber: ",ccNumber);
		// console.log("server trxTime: ",trxTime);
		// console.log("server settTime: ",settTime);
		// console.log("server settAmount: ",settAmount);
		
		//check orderId in Settlement
		var settlementExists = Settlement.findOne( { orderId: orderId} );
		if ( !settlementExists ) {
	      Settlement.insert({
	          orderId: orderId,
	          ccNumber: ccNumber,
	          trxDate: trxTime,
	          settlementDate: settTime,
	          settlementAmount: settAmount,
	          settlementStatus: settStatus
	      });
	    }else{
	    	 Settlement.update({orderId: orderId},
	    		{$set: {
		          ccNumber: ccNumber,
		          trxDate: trxTime,
		          settlementDate: settTime,
		          settlementAmount: settAmount,
		          settlementStatus: settStatus
	    		}
	    	 });
	    }
	},
	importSettlement (){
	      var updateSettlement = Settlement.update({csvImportStatus: "created"}, {$set: {csvImportStatus: "finish"}}, {multi: true});
		
	      if (!this.userId)
				throw new Meteor.Error(401, 'You must be logged in.');
	      console.log("importSettlement", updateSettlement);
		if(updateSettlement)
			console.log("settlement import success");
			//return true;
		else
			console.log("settlement cancel");
			//return false;
	},
	clearImportSettlement (){
		var deleteSettlement = Settlement.remove({csvImportStatus: "created"});
		
		if (!this.userId)
			throw new Meteor.Error(401, 'You must be logged in.');
		
		if(deleteSettlement)
			console.log("settlement delete success");
		//return true;
		else
			console.log("settlement cancel");
		//return false;
	},
	settlementStatusCheck (orderId){
		check(orderId, String);
		//check orderId in Settlement
		if (!this.userId)
			throw new Meteor.Error(401, 'You must be logged in.');
		
		var settlementExists = Settlement.findOne( { orderId: orderId} );
		if ( !settlementExists ) {
	      console.log("settlement not found for orderId: ",orderId);
	      return "";
	    }else{
	    	//console.log("ini settlementExists: ",settlementExists);
	    	console.log("ini settlementExists status: ",settlementExists.settlementStatus);
	    	return settlementExists.settlementStatus;
	    }
	}
}); 
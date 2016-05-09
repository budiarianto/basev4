import { Mongo } from 'meteor/mongo';
import faker from 'faker';

import { City } from './city';

Meteor.methods({
	createCity(city){
		
		check(city, Object);
		if (!this.userId)
			throw new Meteor.Error(401, 'You must be logged in.');
		
		try{
			var cityName = city.city.trim();
			var pattern = new RegExp('^'+cityName+'$', 'i');
			var data = City.findOne({city: pattern});
			
			if(!data){
				var cityId = City.insert(city);
				if(cityId){
					reindexSequence(cityId, false, city.sequence);
				}
			}else{
				throw new Meteor.Error(412, city.city+ ' is already exists !');
			}
				
				
			
		}catch(e){
			var errorMessage = "Internal server error !",
			error_duplicate_key = "duplicate key error index";
			//console.log('error:', e);
			if(e.reason)
				errorMessage = e.reason;
			else{
				var err = JSON.stringify(e);
				
				if(err.indexOf(error_duplicate_key)> -1)
					errorMessage = "Error duplicate key id !";
			}
			
			throw new Meteor.Error(errorMessage);
			
		}
		
		return cityId;
	},
	updateCity(id, fieldSet){
		check(id, String);
		check(fieldSet, Object);
		
		if (!this.userId)
			throw new Meteor.Error(401, 'You must be logged in.');
		var oldSeq = 0;
		
		var cityName = fieldSet.city.trim();
		var pattern = new RegExp('^'+cityName+'$', 'i');
		var data = City.findOne({city: pattern});
		
		if(data && data._id != id)
			throw new Meteor.Error(412, fieldSet.city+ ' is already exists !');
		
		data = City.findOne({_id: id});
		if(data){
			var result = City.update({_id: id},{$set: fieldSet});
			reindexSequence(id, data.sequence, fieldSet.sequence);
			return result;
		}
	},
	removeCity(id){
		check(id, String);
		
		if (!this.userId)
			throw new Meteor.Error(401, 'You must be logged in.');
		
		var data = City.findOne({_id: id});
		var removedData=null;
		
		if(data){
			var seq=data.sequence;
			removedData = City.remove({_id: id});
			reindexSequence(id, seq, false);
		}
		
		//console.log('removedData', removedData);
		if(!removedData){
			throw new Meteor.Error(412, 'remove failed !');
		}
		
		return "Succes removing routes...";
	},
	repairIndex(){
		
		if (!this.userId)
			throw new Meteor.Error(401, 'You must be logged in.');
		
		repairIndexSequence();
		return "Succes repair index...";
	}
}); 

function reindexSequence(id, oldSeq, seq){

	//check sequence validity
	var jumlah = City.find({}).count();	

	if(seq){
		
		if(seq>jumlah)
		{
			seq = jumlah;
			City.update({_id: id},{$set: {sequence: seq}});
		}else if(seq<1){
			seq = 1;
			City.update({_id: id},{$set: {sequence: seq}});
		}
		
	}
	
	
	var result={};
	
//	console.log('oldSeq city', oldSeq);
//	console.log('seq city', seq);
	
	
	//start reindexing
	if(oldSeq && seq && oldSeq!=seq){
//		console.log('update city');
		if(oldSeq > seq){
			result = City.update({$and: [{_id: {$ne: id}},{sequence: {$gte: seq}},{sequence: {$lte: oldSeq}}]}, {$inc: {sequence: 1}},{multi: true});
		}else{
			result = City.update({$and: [{_id: {$ne: id}},{sequence: {$gt: oldSeq}},{sequence: {$lte: seq}}]},{$inc: {sequence: -1}},{multi: true});
		}
	}else if(oldSeq && !seq){
//		console.log('delete city');
		result = City.update({$and: [{_id: {$ne: id}},{sequence: {$gt: oldSeq}}]},{$inc: {sequence: -1}},{multi: true});
	}else if(seq && !oldSeq){
//		console.log('insert city');
		result = City.update({$and: [{_id: {$ne: id}},{sequence: {$gte: seq}}]},{$inc: {sequence: 1}},{multi: true});
	}else{
//		console.log('others city');
		console.log('reindex sequence is not required');
	}
	//repairIndex();
}

function repairIndexSequence(){
	var cities = City.find({},{sort:{sequence: 1}}).fetch();	
	var i=1;
	if(cities){
		_.each(cities, function(city){
			 City.update({_id:city._id}, {$set: {sequence: i}});
			 i++;
		});
	}
}
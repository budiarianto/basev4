Template.settlement.onCreated(function() {
	this.autorun(function() {
    	Template.instance().subscribe( 'settlement' );
  	});
	Session.keys = {};
});


Template.settlement.onRendered(function() {
	Meteor.setTimeout(function(){
		$('#fromDate').datetimepicker({
			format: "DD/MM/YYYY",
			date: new Date()
		});
		$('#thruDate').datetimepicker({
			format: "DD/MM/YYYY",
			date: new Date()
		});
		
		var fromDate = $('#fromDate').data("DateTimePicker").date();
		var thruDate = $('#thruDate').data("DateTimePicker").date();
		
		Session.set('fromDate', fromDate.toISOString());
		Session.set('thruDate', thruDate.toISOString());
	}, 1000);
	
});


Template.settlement.helpers({
	'settlementList': function() {
		
		var status = Session.get('status');
		var fromDate = Session.get('fromDate');
		var thruDate = Session.get('thruDate');
		var keyword = Session.get('keyword');
		//console.log('status', status);
		var afterDate = new Date(thruDate);
		afterDate.setDate(afterDate.getDate() + 1);
		
		
		if(fromDate){
			var conditions = [];
			
			conditions.push({'csvImportStatus': 'finish'});//show only saved imported data 
			
			if(status && status!="undefined"){
				conditions.push({'settlementStatus': status});
			}
			
			if(fromDate && fromDate!="undefined"){
				conditions.push({trxDate: {$gte: new Date(fromDate)}});
			}
	
			if(thruDate && thruDate!="undefined"){
				conditions.push({trxDate: {$lte: afterDate}});
			}
	
			if(keyword && keyword!="undefined"){
				conditions.push({$or: [{'orderId': {$regex: keyword, $options: 'i'}},{'ccNumber': {$regex: keyword, $options: 'i'}}]});
			}
			
			//console.log('conditions', conditions);
			
			$("#tabbleSettlement").trigger("destroy");
			var data = Settlement.find({$and:conditions}, {sort: {'trxDate': 1}}).fetch();
			Meteor.setTimeout(function(){
				$("#tabbleSettlement").tablesorter({
					 sortList: [[3,0]],
					 sortMultiSortKey: 'altKey',
					 headers: {
				            3: { sorter: "myDateFormat" },
				            4: { sorter: "myDateFormat" }
				        }
				});
			
			}, 1000);
			return data;
		}
	},
	formatDate: function (date) {
		if(date)
			return moment(date).format('DD/MM/YYYY');
  	},
  	formatNumber: function (number) {
  		return accounting.formatNumber(number);
  	},
//  	incremented: function (index) {
//		index++;
//		return index;
//	},
	badgeIcon(){
		var result={};
	    	 switch (this.settlementStatus){
	    	 case "settlement":
	    		 result.badge = "badge-primary";
	    		 result.icon = "glyphicon-ok";
	    		 break;
	    	 case "cancel":
	    		 result.badge = "badge-warning";
	    		 result.icon = "glyphicon-remove";
	    		 break;
	    	 case "authorize":
	    		 result.badge = "badge-default";
	    		 result.icon = "glyphicon-ok";
	    		 break;
	    	 case "success":
	    		 result.badge = "badge-success";
	    		 result.icon = "glyphicon-ok";
	    		 break;
	    	 case "challenge":
	    		 result.badge = "badge-warning";
	    		 result.icon = "glyphicon-ok";
	    		 break;
	    	default:
	    		 result.badge = "badge-info";
	    		 result.icon = "glyphicon-ok";
	    		 break;
	    	 }
	      
	    	 return result;
		
	}
});


Template.settlement.events({   
	'change .settlementStatus': function(event) {
		var status = event.currentTarget.value;
		//console.log('status', status);
		if(status){
			Session.set('status', status);
		}else{
			Session.set('status', false);
		}
	},
	'change #keyword': function(event) {
		var keyword = event.currentTarget.value;
		if(keyword){
			Session.set('keyword', keyword);
		}else{
			Session.set('keyword', false);
			//$("table").trigger('update', [true]);
		}
	},
	'blur #fromDate': function(event) {
		var fromDate = $('#fromDate').data("DateTimePicker").date();
		if(fromDate && fromDate.toISOString()){
			Session.set('fromDate', fromDate.toISOString());
		}else{
			Session.set('fromDate', false);
		}
	},
	'blur #thruDate': function(event) {
		var thruDate = $('#thruDate').data("DateTimePicker").date();
		if(thruDate && thruDate.toISOString()){
			Session.set('thruDate', thruDate.toISOString());
		}else{
			Session.set('thruDate', false);
		}
	}
});

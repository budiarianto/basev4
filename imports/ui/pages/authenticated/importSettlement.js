Template.importSettlement.onRendered(function(){
	$("input:file").change(function (){
		var fileName = "File Selected: "+$(this).val();
		$(".fileName").html(fileName);
	});
});
	
Template.importSettlement.events({
	'click #btnFile': ()=>{
		$("input[type=file]").click();
	},
	'click #btnClear': (event)=>{
		Modules.client.loadingButton(event.currentTarget, 'start');
		Meteor.call('clearImportSettlement', function(error) {
			//console.log("ini error: ",error);
			if ( error ) {
			 	Bert.alert( error.reason, 'warning' );
			 	//console.log("cek error: ", error.reason);
			}else{
				//Bert.alert( 'Clear Import Settlement was Successfully', 'success' );
				$(".fileName").html('');
				$('tbody').empty();
				Modules.client.loadingButton(event.currentTarget, 'end');
				//console.log("clear import settlement success.");
				//FlowRouter.go('/settlement');
			}
		});
	},
	'click #btnImport': (event)=>{
		//loading start
		Modules.client.loadingButton(event.currentTarget, 'start');
		Meteor.call('importSettlement', function(error) {
			//console.log("ini error: ",error);
			if ( error ) {
				Bert.alert( error.reason, 'warning' );
				//console.log("cek error: ", error.reason);
			}else{
				Bert.alert( 'Import Settlement Success', 'success' );
				$(".fileName").html('');
				$('tbody').empty();
				 //loading end
			     Modules.client.loadingButton(event.currentTarget, 'end');
				//console.log("clear import settlement success.");
				//FlowRouter.go('/settlement');
			}
			
			
		});
	},
	'click #btnRetrieve': (event)=>{
		if (!$("input[type=file]")[0].files.length)
		{
			$("input[type=file]").click();
			return;
		}else{
			//loading start
			Modules.client.loadingButton(event.currentTarget, 'start');
			 
			Meteor.call('clearImportSettlement', function(error) {
				//console.log("ini error: ",error);
				if ( error ) {
				 	Bert.alert( error.reason, 'warning' );
				 	//console.log("cek error: ", error.reason);
				}else{
					$('tbody').empty();
					Papa.parse($("input[type=file]")[0].files[0], {
						header: true,
						complete: function(results) {
							var i=0;
							var j=1;
							var amount = accounting.formatColumn(_.pluck(results.data, 'Amount'),"");
							console.log('amount: ', amount);
								_.each(results.data, function(result){
									var str ='<tr><td>'+j+'</td><td>'+result['Order ID']+'</td>';
								        str = str+'<td>'+result['Credit Card Number']+'</td>';
								        str = str+'<td><div class="list">'+moment(result['Transaction time']).format('DD-MM-YYYY')+'</div></td>';
								        str = str+'<td><div class="list">'+moment(result['Settlement time']).format('DD-MM-YYYY')+'</div></td>';
								        str = str+'<td>'+accounting.formatNumber(result['Amount'])+'</td>';
								        
								        if(result['Transaction status'] && result['Transaction status'] == 'settlement')
								        	str = str+'<td><span class="badge badge-primary"><span class="glyphicon glyphicon-ok"></span></span>&nbsp;'+result['Transaction status']+'</td></tr>';
								        else if(result['Transaction status'] && result['Transaction status'] == 'success')
								        	str = str+'<td><span class="badge badge-success"><span class="glyphicon glyphicon-ok"></span></span>&nbsp;'+result['Transaction status']+'</td></tr>';					        
								        else if(result['Transaction status'] && result['Transaction status'] == 'authorize')
								        	str = str+'<td><span class="badge badge-default"><span class="glyphicon glyphicon-ok"></span></span>&nbsp;'+result['Transaction status']+'</td></tr>';
								        else if(result['Transaction status'] && result['Transaction status'] == 'approve')
								        	str = str+'<td><span class="badge badge-info"><span class="glyphicon glyphicon-ok"></span></span>&nbsp;'+result['Transaction status']+'</td></tr>';
								        else
								        	str = str+'<td><span class="badge badge-warning"><span class="glyphicon glyphicon-remove"></span></span>&nbsp;'+result['Transaction status']+'</td></tr>';
								        
								     var orderId = result['Order ID'];
								     var ccNumber = result['Credit Card Number'];
								     var trxTime = result['Transaction time'];
								     var settTime = result['Settlement time'];
								     var settAmount = result['Amount'];
								     var settStatus = result['Transaction status'];
								     if(orderId){
								     	Meteor.call('addSettlement', orderId, ccNumber, trxTime, settTime, settAmount, settStatus, function(error) {
										    if ( error ) {
										     	Bert.alert( error.reason, 'warning' );
										    }
										    //loading end
										    Modules.client.loadingButton(event.currentTarget, 'end');
										    
								     	});
								     	$('tbody').append(str);
								     }
								     i++;
								     j++;
								});
						}
					});
				}
			});
			
		
		}
	}
});

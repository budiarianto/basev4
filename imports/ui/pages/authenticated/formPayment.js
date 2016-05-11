Template.formCCPayment.onCreated(function() {
	this.autorun(function() {
		//get client key sandbox
		//TODO: change client key with production
		Meteor.call('veritrans_client_key', 'sandbox', (error, result)=>{
			if(!error){
				console.log('result', result);
				Veritrans.client_key = result;
			}
		});
	});
});
Template.formCCPayment.onRendered(function() {
	var template = Template.instance();
	//Modules.client.ccPayment( { form: "#frmCCPayment", template: template} );
});

Template.formTransferPayment.onRendered(function() {
	var template = Template.instance();
	//Modules.client.trfPayment( { form: "#frmTransferPayment", template: template} );
	
	
});

Template.formCCPayment.helpers({
	amountString(){
		return accounting.formatNumber(Session.get('amount'));
	},
	amount(){
		return Session.get('amount');
	},
	paymentString(){
		return accounting.formatNumber(Session.get('payment'));
	},
	payment(){
		var payment = Session.get('payment');
		if(payment)
			return Session.get('payment');
		else
			return 0;
	}
});

Template.formCCPayment.events({
	'submit form':(event)=>{
		event.preventDefault();
		
		// Sandbox API URL. TODO: Change with Production API URL when you're ready to go live.
		  Veritrans.url = "https://api.sandbox.veritrans.co.id/v2/token";

		  console.log()
		  // TODO: Change with your actual client key that can be found at Merchant Administration Portal >> Settings >> Access Key
		  //Veritrans.client_key = client_key;
		  var card = function(){
		    return {
		      'card_number'     : $("#cardNo").val(),
		      'card_exp_month'  : $("#expMonth").val(),
		      'card_exp_year'   : $("#expYear").val(),
		      'card_cvv'        : $("#cvv").val(),

		      // Set 'secure', and 'gross_amount', if the merchant wants transaction to be processed with 3D Secure
		      'secure'       : true,
		      'type'		 : 'authorize',
		      'gross_amount'   : $("#amount").val()
		    }
		  };
		  
	    $('#submitCCPayment').prop("disabled", true); 
	    Veritrans.token(card, callback);
	},
	'change #totalPayment'(event){
		Session.set('payment', event.currentTarget.value);
	}
});
Template.formTransferPayment.helpers({
	amountString(){
		return accounting.formatNumber(Session.get('amount'));
	},
	amount(){
		return Session.get('amount');
	},
	paymentString(){
		return accounting.formatNumber(Session.get('payment'));
	},
	payment(){
		var payment = Session.get('payment');
		if(payment)
			return Session.get('payment');
		else
			return 0;
	}
});

Template.formTransferPayment.events({
	'submit form'(event) {
		event.preventDefault();
	},
	'change #totalPayment'(event){
		Session.set('payment', event.currentTarget.value);
	}
});

function callback(response) {
    if (response.redirect_url) {
    		// 3Dsecure transaction. Open 3Dsecure dialog
    		openDialog(response.redirect_url);
  
    } else if (response.status_code == '200') {
	  // success 3d secure or success normal
	  //close 3d secure dialog if any
      // store token data in input #token_id and then submit form to merchant server
	  $("#token-id").val(response.token_id);
	         
			var id = FlowRouter.getParam('id').toString();
			var booking = Booking.findOne({_id: id});
			
			if(booking){
				$transaction_details = {
		  		  'order_id': booking.bookingCode,
		  		  'gross_amount'   : booking.fare
		    	};
			
				var fullName = booking.billingInfo.fullName;
				var arrayName = fullName.split(' ');
				var firstName = "";
				var lastName = "";
				
				if(arrayName.length>0){
					 firstName = fullName.split(' ').slice(0, -1).join(' ');
					 lastName = fullName.split(' ').slice(-1).join(' ');
				}else{
					firstName = fullName;
				}
				
				$customer_details = {
						  'first_name' 	: firstName,
						  'last_name' 	: lastName,
						  'email' 		: booking.billingInfo.email,
						  'phone' 		: booking.billingInfo.phone
				};
					
				$transaction_data = {
					'payment_type'    		: 'credit_card', 
			  		'credit_card'     		: {
								  			  	'token_id' 	 : response.token_id,
								  			  	'type'		 : 'authorize'
								  			   },
			  		'transaction_details'   : $transaction_details,
			  		'customer_details'      : $customer_details
		      	};
		   
		        Veritrans.url = "https://api.sandbox.veritrans.co.id/v2/charge";
		    	Meteor.call('veritrans_charge', Veritrans, $transaction_data, callbackCharge);
				    	
    		}	
		  
	    /*
	    	$item1_details = {
	    		'id' : 'a1',
	  		    'price' : 50000,
	  		    'quantity' : 2,
	  		    'name' : 'Apple'
		    };
	 
	    		$item2_details ={
	    			'id' : 'a2',
					'price' : 100500,
					'quantity' : 1,
					'name' : 'Orange'
			}
		*/
	
//	    $items = {$item1_details, $item2_details};
	    	
	} else {
	  closeDialog();
	  $('#submitCCPayment').prop("disabled", false); 
		      
	}
}

function callbackCharge(error, response){
	  if(response)
		  console.log('response from server : ', response);	  
  //console.log('response data : ', response.data);	  
  //console.log('response trs id : ', response.data.transaction_id);	  
  closeDialog();
  if(response.data && response.data.transaction_id){
	  Session.set('transactionId', response.data.transaction_id);
	  
	  var id = FlowRouter.getParam('id');
	  var payment = {};
	  payment.paymentType = "Credit Card";
	  payment.principal = $('#principal').val();
	  payment.ccNo = $('#cardNo').val();
	  payment.fullName = $('#paymentCCFullName').val();
	  payment.totalPayment = $('#amount').val();
	  payment.vtTransactionId = response.data.transaction_id;
	  payment.vtTransactionStatus = response.data.transaction_status;
	  payment.vtTransactionTime = response.data.transaction_time;
	  
	 // console.log('payment to update: ', payment);
	  //payment.responseData = response.data;
	  Meteor.call('updateBookingPayment', id, payment, function(error, result){
		  if(error)
			  Bert.alert(error, 'danger');
		  
		  var fieldSet = {};
		  fieldSet.responseData = response.data;
		  
		  //console.log(' fieldSet.responseData: ', fieldSet);
		  
		  Meteor.call('updateBookingPaymentData', id, fieldSet, function(error, result){
			  if(error)
				  Bert.alert(error, 'danger');
			  	
			  $('#paymentModal').modal('hide');
		  });
	  });
  }
	  
	
  //simpen ke dalam booking payment:
  //1.approvalCode, response.data.approval_code 
  //2.bank, response.data.bank 
  //3.eci, response.data.eci 
  //4.fraudStatus, response.data.fraud_status 
  //5.grossAmount, response.data.gross_amount 
  //6.maskedCard, response.data.masked_card 
  //7.orderId, response.data.order_id 
  //8.grossAmount, response.data.payment_type 
  //9.paymentType, response.data.status_code 
  //10.statusMessage, response.data.status_message 
  //11.transactionId, response.data.transaction_id 
  //12.transactionStatus, response.data.transaction_status 
  //13.transactionTime, response.data.transaction_time 


}

// Open 3DSecure dialog box
function openDialog(url) {
    $.fancybox.open({
          href: url,
          type: 'iframe',
          autoSize: false,
          width: 400,
          height: 420,
          closeBtn: false,
          modal: true
      });
}

// Close 3DSecure dialog box
function closeDialog() {
    $.fancybox.close();
}
Template.payment.onCreated(function(){
	this.autorun(function() {
		Meteor.call('veritrans_client_key', 'sandbox', (error, result)=>{
			if(!error){
				console.log('result', result);
				Veritrans.client_key = result;
			}
		});
  });
	
	
});
Template.payment.helpers({
	transactionId(){
		return Session.get('transactionId');
	},
	orderId(){
		var orderId = FlowRouter.getParam('id').toString();
		
		if(Session.get('orderId'))
			return Session.get('orderId');
		else
			return '11-'+orderId;
	}
});
Template.payment.events({
	'submit form':(event)=>{
		event.preventDefault();
		
		// Sandbox API URL. TODO: Change with Production API URL when you're ready to go live.
		  Veritrans.url = "https://api.sandbox.veritrans.co.id/v2/token";

		  // TODO: Change with your actual client key that can be found at Merchant Administration Portal >> Settings >> Access Key
		  //Veritrans.client_key = client_key;
		  var card = function(){
		    return {
		      'card_number'     : $("#card-number").val(),
		      'card_exp_month'  : $("#card-expiry-month").val(),
		      'card_exp_year'   : $("#card-expiry-year").val(),
		      'card_cvv'        : $("#card-cvv").val(),

		      // Set 'secure', and 'gross_amount', if the merchant wants transaction to be processed with 3D Secure
		      'secure'       : true,
		      'type'		 : 'authorize',
		      'gross_amount'   : $("#price").val()
		    }
		  };
		  
	    $(this).attr("disabled", "disabled"); 
	    Veritrans.token(card, callback);
	},
	'click #capture': (event)=>{
		event.preventDefault();
		 $transaction_data = {
		         	'transaction_id'    : Session.get('transactionId'), 
		      		 'amount'   : $('#price').val()
		      	}
		   
		        Meteor.call('veritrans_capture', Veritrans, $transaction_data, callbackCharge);
	},
	'click #cancel': (event)=>{
		event.preventDefault();
		$transaction_data = {
				'order_id'    : $('#orderId').val(),
				'transaction_id'    : Session.get('transactionId')
		}
		
		Meteor.call('veritrans_cancel', Veritrans, $transaction_data, callbackCharge);
	},
	'click #approve': (event)=>{
		event.preventDefault();
		$transaction_data = {
				'transaction_id'    : Session.get('transactionId'), 
				'order_id'    : $('#orderId').val()
		}
		
		Meteor.call('veritrans_approve', Veritrans, $transaction_data, callbackCharge);
	},
	'click #status': (event)=>{
		event.preventDefault();
		$transaction_data = {
				'transaction_id'    : Session.get('transactionId'), 
				'order_id'    : $('#orderId').val()
		}
		
		Meteor.call('veritrans_status', Veritrans, $transaction_data, callbackCharge);
	},
	'change #orderId': ()=>{
		var orderId = $('#orderId').val();
		if(orderId)
			Session.set('orderId', orderId);
	}
	
});

  function callback(response) {
    if (response.redirect_url) {
      // 3Dsecure transaction. Open 3Dsecure dialog
      openDialog(response.redirect_url);
      
    } else if (response.status_code == '200') {
      // success 3d secure or success normal
      //close 3d secure dialog if any
      console.log('response 200', response);
      // store token data in input #token_id and then submit form to merchant server
      $("#token-id").val(response.token_id);
      //$("#payment-form").submit();
      
      //method call
      $billing_address = {
        		'first_name':"Andri",
      		    'last_name':"Litani",
      		    'address'       : "Mangga 20",
      		    'city'          : "Jakarta",
      		    'postal_code'   : "16602",
      		    'phone'         : "081122334455",
      		    'country_code'  : 'IDN'
          }
        
        $customer_details = {
    		'first_name':"Andri",
  		    'last_name':"Litani",
  		    'email':"Andri@Litani.com",
  		    'phone':"081122334455",
  		    'billing_address':$billing_address,
  		    'shipping_address':$billing_address
        }
             
    		var orderId = FlowRouter.getParam('id').toString();
    
        	$transaction_details = {
      		  'order_id': $('#orderId').val(),
      		  'gross_amount'   : $("#price").val()
        	}
  		  
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


        $items = {$item1_details, $item2_details};
      		
        $transaction_data = {
         	'payment_type'    : 'credit_card', 
      		  'credit_card'     : {
      			  'token_id' 	 : response.token_id,
      			  'type'		 : 'authorize'
      		  },
      		  'transaction_details'   : $transaction_details
      	}
   
        Veritrans.url = "https://api.sandbox.veritrans.co.id/v2/charge";

//        console.log("token", response.token_id);
//        console.log('$transaction_data', $transaction_data);
        Meteor.call('veritrans_charge', Veritrans, $transaction_data, callbackCharge);
    } else {
    	console.log('response else', response);
      // failed request token
      //close 3d secure dialog if any
      closeDialog();
      $('#submit-button').removeAttr('disabled');
      // Show status message.
      $('#message').text(response.status_message);
      console.log(JSON.stringify(response));
    }
  }

  function callbackCharge(error, response){
	  if(response)
		  console.log('response from server : ', response);	  
	  //console.log('response data : ', response.data);	  
	  //console.log('response trs id : ', response.data.transaction_id);	  
	  closeDialog();
	  if(response.data && response.data.transaction_id)
		  Session.set('transactionId', response.data.transaction_id);
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
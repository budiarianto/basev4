Template.transactionHistory.onRendered(function() {

	//show popover on popupDetail click
	$(".popupDetail").popover({
        html: true,
        title: 'Profile Info <a href="#" class="close" data-dismiss="alert">×</a>',
        content: function() {
            return $(this).find("#popover-content").html();
        }
    });

	//close popover on body click
	$(document).on("click", ".popover .close" , function(){
        $(this).parents(".popover").popover('hide');
    });

	$('#flightDate').datetimepicker();
	$('#flightDateTo').datetimepicker();
});



Template.transactionHistory.helpers({
	
});

Template.transactionHistory.events({
   
});


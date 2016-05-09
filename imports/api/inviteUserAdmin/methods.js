const urls = {
  development: 'http://localhost:3000/signup/',
  production: 'http://hct-admin.profilbiz.com/signup/'
};
Meteor.methods({
	clearInvite: function(){
		InviteUserAdmins.remove({});
	},
	inviteUserAdminByEmail: function( emailInvitation, userStatus, userId) {
		check(emailInvitation, String);
		check(userStatus, String);
		check(userId, String);
		
		if (!this.userId)
			throw new Meteor.Error(401, 'You must be logged in.');

		//check if email already invited
		let emailStatus = Meteor.users.findOne( { 'emails.address': emailInvitation } );
		if(emailStatus){
			throw new Meteor.Error( "duplicate-entry", "Email already registered !" );
		}
		
		let sender_ = Meteor.users.findOne( { _id: userId} );
		let invite_ = InviteUserAdmins.findOne( { email: emailInvitation} );
		
		if(!invite_){
			var inviteUserAdmin = {};
			
			inviteUserAdmin.userId 			= userId;
			inviteUserAdmin.userProfile 	= sender_.profile;
			inviteUserAdmin.email 			= emailInvitation;
			inviteUserAdmin.userStatus 		= userStatus;
			inviteUserAdmin.token			= Random.hexString( 15 );
			
			var inviteId = InviteUserAdmins.insert(inviteUserAdmin);
			//inviteId = inviteId.toString();
			//console.log("cek inviteId: ", inviteId);
			return inviteId;
		
		}else{
			if(invite_.status=="Registered" || invite_.status=="Sent"){
				throw new Meteor.Error( "duplicate-entry", "Email already invited !" );
			}else{
				return invite_._id;
			}
		}
	},
	sendInvitationEmail( inviteId ) {
		check(inviteId, String);
		let invite = InviteUserAdmins.findOne( { _id: inviteId } );
		let usr = Meteor.users.findOne({_id:invite.userId});
		
		if ( invite ) {
		
			try{
				
			      SSR.compileTemplate( 'inviteEmail', Assets.getText( 'email/templates/invite.html' ) );
			      Email.send({
			        to: invite.email,
			        from: 'Helicity <noreply@hct.profilbiz.com>',
			        subject: 'Undangan bergabung sebagai Admin di Helicity!',
			        html: SSR.render( 'inviteEmail', {
			          url: urls[ process.env.NODE_ENV ]+invite.token,
			          fullName: usr.profile.fullname
			        })
			      });
			
			}catch(e){
				throw new Meteor.Error( 500, 'Cannot send invitation email, please check your email server or internet conection !' );
			}

	      InviteUserAdmins.update( invite._id, {
	        $set: {
	          status: "Sent"
	        } 
	      });
	    } else {
	      throw new Meteor.Error( 'not-found', 'Sorry, an invite with that ID could not be found.' );
	    }
	},
	validateInvitation (email, tokenKey){
		check(email, String);
		check(tokenKey, String);
		//check InviteUserAdmins
		var invited = InviteUserAdmins.findOne({email: email, token: tokenKey});
		
		if(invited){
			InviteUserAdmins.update( invited._id, {
		        $set: {
		          status: "Registered"
		        } 
		      });
			if(invited.userStatus){
				return invited.userStatus;
			}
		} else {
	      throw new Meteor.Error( 'not-match', 'Sorry, invitation token key and email does not match.' );
	    }
	},
	createMemberAdmin (email, memberType, userId){
		check(email, String);
		check(memberType, String);
		check(userId, String);

		var users_ = Meteor.users.findOne( { _id: userId} );
		
		//check existing Member Admin
		var memberAdminExists = Member.findOne( { userId: userId} );
		if ( !memberAdminExists ) {
	      Member.insert({
			userId: userId,
			emails: email,
			fullname: users_.profile.fullname,
			memberType: 'admin',
			memberRole: memberType
	      });
	    }
	},
	addUserIdInvitation (email, userId){
		check(email, String);
		check(userId, String);

		var registered_ = Meteor.users.findOne( { _id: userId} );
		var invited = InviteUserAdmins.findOne({email: email, status: "Registered"});
		if(invited){
			InviteUserAdmins.update( invited._id, {
		        $set: {
		        	registeredId: userId,
		        	registeredProfile: registered_.profile
		        } 
		      });
		}
	},
	deleteInvitation(inviteId){
		check(inviteId, String);
		
		var invited = InviteUserAdmins.remove({_id: inviteId});
		if(invited)
			return "remove invitation success";
	}
	
});

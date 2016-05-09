const urls = {
  development: 'http://localhost:3000/resetPassword/',
  production: 'http://hct.profilbiz.com/resetPassword/'
};

Meteor.methods({
  checkExpiredResetPassword: function(token, callback) {
    check( token, String );
    var user = Meteor.users.findOne({'services.password.reset.token': token});
      if(user){
        var date = new Date()
        var when = moment(user.services.password.reset.when)._d;
        var expiredDate = moment(when).add(1, 'days')._d;   //expired link verify in 24 Hours(1 day)
        if(expiredDate > date){
          console.log("#### Link Reset Password Aktif ####");
        }else{
          console.log("#### Link Reset Password InActive ####");
          throw new Meteor.Error(403, "Link reset password mail was EXPIRED, more than 24 hours!");
        }
      }else{
        console.log("Oops, token not found!");
      }
  },
  getResetPasswordMember: function(currentMail) {
    check( currentMail, String );

    var users_ = Meteor.users.findOne( { 'emails.address': currentMail} );
      if(users_){
        var userId = users_._id;
        var email = users_.emails[0].address;
        console.log("cek di server userId: ",userId);
        console.log("cek di server email: ",email);

        var token = Random.secret();
        var when = new Date();
        var tokenRecord = {
          token: token,
          email: email,
          when: when
        };

        console.log("cek di server token: ",token);
        console.log("cek di server when: ",when);
        console.log("cek di server tokenRecord: ",tokenRecord);

        Meteor.users.update(userId, {$set: {
          "services.password.reset": tokenRecord
        }});
        // before passing to template, update user object with new token
        Meteor._ensure(users_, 'services', 'password').reset = tokenRecord;

        //return true;

      }
  },
  sendResetPasswordNewMemberEmail: function(user) {
    check( user, Object );
    //console.log("user: ",user);

    var users_ = Meteor.users.findOne( { 'emails.address': user.email} );
      if(users_){
        //console.log("users_: ",users_);
        var userId = users_._id;
        var email = users_.emails[0].address;
        var token = users_.services.password.reset.token;
        var fullName = users_.profile.fullname;
        
        // console.log("users_ userId: ",userId);
        // console.log("users_ email: ",email);
        console.log("users_ token: ",token);
        // console.log("users_ fullName: ",fullName);

        var getUrl = urls[ process.env.NODE_ENV ]+token;
        console.log("getUrl: ",getUrl);

        // this needs to be done on the server.
        SSR.compileTemplate( 'resetPasswordNewMemberEmail', Assets.getText( 'email/templates/resetPasswordNewMemberMail.html' ) );
        Email.send({
          to: email,
          from: 'Helicity - Whitesky Aviation <noreply@hct.profilbiz.com>',
          subject: 'Welcome to Helicity - Whitesky Aviation (Reset Password New Member)',
          html: SSR.render( 'resetPasswordNewMemberEmail', {
            urlWithoutHash: getUrl,
            fullName: fullName,
            supportEmail  : "customercare@hct.profilbiz.com"
          })
        });

      }
  }

});

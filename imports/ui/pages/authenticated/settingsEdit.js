Template.settingsEdit.onCreated(function() {
  this.autorun(function() {
    Session.set('showProfileCard', true);
    Session.set('showChangeProfileImage', false);
  });
});

Template.settings.onRendered( function() {
});

Template.settingsEdit.onDestroyed(function() {
  Session.set('showProfileCard', undefined);
  Session.set('showChangeProfileImage', undefined);
});

Template.settingsEdit.helpers({
  'currUser': function() {
    var datas = Meteor.users.findOne({});
    //console.log("datas: ", datas);
    return datas;
  },
  'showProfileCard': function() {
    return Session.get('showProfileCard');
  },
  'showChangeProfileImage': function() {
    return Session.get('showChangeProfileImage');
  }
  // ,
  // 'medias': function() {
  //   return Media.find();
  // },
  // 'showMediaTutorial': function() {
  //   if (Media.find().count() < 1)
  //     return true;
  // },
  // 'showProfileCard': function() {
  //   return Session.get('showProfileCard');
  // },
  // 'showChangeProfileImage': function() {
  //   return Session.get('showChangeProfileImage');
  // },
  // 'showChangeProfileBackground': function() {
  //   return Session.get('showChangeProfileBackground');
  // }
});

Template.settingsEdit.events({
  'blur #fullName': function(event) {
    try {
      var fullName = event.target.value.trim();
      //console.log("cek fullName: ",fullName);
      if (_.isEmpty(fullName)) {
        throw new Meteor.Error('Fullname cannot be empty!');
      }

      if (fullName !== Meteor.user().profile.fullname) {
        Meteor.call('updateUserFullname', fullName, function(error, result) {
          if (error) {
            event.target.value = Meteor.user().profile.fullname;
            Bert.alert(error.message, 'error');
          }
        });
      } else {
        event.target.value = Meteor.user().profile.fullname;
      }
    } catch(exception) {
      event.target.value = Meteor.user().profile.fullname;
      Bert.alert(exception, 'error');
    }
  },
  'click .changeProfileImage': function(event) {
    event.preventDefault();
    console.log("change profile image");
    Session.set('showProfileCard', false);
    Session.set('showChangeProfileImage', true);
  }
});

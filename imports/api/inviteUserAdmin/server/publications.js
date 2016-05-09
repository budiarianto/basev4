import { InviteUserAdmins } from '../inviteUserAdmin';

Meteor.publish('inviteUserAdmin', () => InviteUserAdmins.find());

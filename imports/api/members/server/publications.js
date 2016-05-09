import { Member } from '../members';

Meteor.publish('members', () => Member.find());

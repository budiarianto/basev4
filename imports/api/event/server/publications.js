import { Event } from '../event';

Meteor.publish('event', () => Event.find());

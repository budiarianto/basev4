import { Booking } from '../booking';

Meteor.publish('booking', () => Booking.find());


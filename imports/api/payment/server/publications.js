import { Payment } from '../payment';

Meteor.publish('payment', () => Payment.find());

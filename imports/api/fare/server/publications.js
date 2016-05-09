import { Fare } from '../fare';

Meteor.publish('fare', () => Fare.find());

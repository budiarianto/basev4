import { Helipad } from '../helipad';

Meteor.publish('helipad', () => Helipad.find());

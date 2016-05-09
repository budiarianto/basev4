import { Markers } from '../map-collections.js';

Meteor.publish('markers', () => Markers.find());

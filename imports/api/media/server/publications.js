import { Media } from '../media';

Meteor.publish('media', () => Media.find());

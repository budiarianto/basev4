import { Collection } from '../collection';

Meteor.publish('collection', () => Collection.find());

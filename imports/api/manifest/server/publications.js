import { Manifest } from '../manifest';

Meteor.publish('manifest', () => Manifest.find());

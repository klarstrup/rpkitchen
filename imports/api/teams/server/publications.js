import { Meteor } from 'meteor/meteor';

import { Teams } from '/imports/api/teams/teams.js';

Meteor.publish('teams', function() {
  return Teams.find({});
});

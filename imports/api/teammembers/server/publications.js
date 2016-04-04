import { Meteor } from 'meteor/meteor';

import { TeamMembers } from '/imports/api/teammembers/teammembers.js';

Meteor.publish('teamMembers', function() {
  return TeamMembers.find({});
});

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Teams } from '/imports/api/teams/teams.js';

export const TeamMembers = new Mongo.Collection('teammembers');
TeamMembers.helpers({  
  getUser: function () {
    return Meteor.users.findOne({'services.google.email':this.email});
  },
  getTeam: function () {
    return Teams.findOne({id:this.teamId});
  }
});

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const TeamMembers = new Mongo.Collection('teammembers');
TeamMembers.helpers({  
  getUser: function () {
    return Meteor.users.findOne({'services.google.email':this.email});
  }
});

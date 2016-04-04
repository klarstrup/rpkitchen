import { Meteor } from 'meteor/meteor';

Meteor.publish("publicUserData", function() {
  return Meteor.users.find({}, {
    fields: {
      '_id': 1,
      'services.google.email': 1,
      'services.google.name': 1,
      'services.google.given_name': 1,
      'services.google.family_name': 1,
      'services.google.picture': 1,
      'services.google.locale': 1
    }
  });
});

Meteor.publish("ownUserData", function() {
  return Meteor.users.find(this.userId,{
    fields: {
      'resume': 0,
      'services.google.resume': 0
    }
  });
});

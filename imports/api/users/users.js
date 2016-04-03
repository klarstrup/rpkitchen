import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { TeamMembers } from '/imports/api/teammembers/teammembers.js';

Accounts.validateNewUser(function(user) {
	if (!(user.services && user.services.google && user.services.google.email && TeamMembers.findOne({
			'email': user.services.google.email
		}))) throw new Meteor.Error(403, "You're not a penguin!");
	return true;
});

Accounts.onCreateUser(function(options, user) {
	TeamMembers.update({
		'email': user.services.google.email
	}, {
		$set: {
			userId: user._id
		}
	})
	return user;
});

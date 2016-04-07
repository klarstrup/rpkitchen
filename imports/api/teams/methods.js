import {
	Meteor
}
from 'meteor/meteor';
import {
	ValidatedMethod
}
from 'meteor/mdg:validated-method';
import {
	SimpleSchema
}
from 'meteor/aldeed:simple-schema';

import {
	Teams
}
from '/imports/api/teams/teams.js';
import {
	WeekToKitchenTeam
}
from '/lib/functions.js';

export const rate = new ValidatedMethod({
	name: 'team.rate',
	validate: new SimpleSchema({
		teamId: {
			type: String
		},
		rating: {
			type: String
		}
	}).validator(),
	run({
		teamId, rating
	}) {
		// Validate user
		if (!Meteor.userId())
			throw new Meteor.Error("logged-out", "You must be logged in to rate a team.");

		// Validate team
		team = Teams.findOne(teamId);
		if (!team)
			throw new Meteor.Error("invalid-team", "Invalid team.");

		// Validate rating
		if (rating != "+1" && rating != "0" && rating != "-1")
			throw new Meteor.Error("invalid-rating", "Invalid rating.");

		// Rules
		if (!team.isCurrent())
			throw new Meteor.Error("noncurrent-team-rating", "You can only rate the current team, cheater.");

		if (team.isMyTeam())
			throw new Meteor.Error("own-team-rating", "You can't rate your own team, cheater.");

		$set = {}
		team.getMembers().map(function(member) {
			$set['ratings.' + member._id] = rating;
		})

		if (team.getMyRating() == rating) //If the desired rating is the same as the current one, we assume that the user wants to unrate the team and we will do so.
			Meteor.users.update({
			_id: Meteor.userId()
		}, {
			$unset: $set
		})
		else
			Meteor.users.update({
				_id: Meteor.userId()
			}, {
				$set: $set
			})

		if (Meteor.isServer)
			team.recalculateRating();

		return;
	}
});

export const rank = new ValidatedMethod({
	name: 'team.rank',
	validate: new SimpleSchema({
		teamId: {
			type: String
		},
		rankedMemberIds: {
			type: [String]
		}
	}).validator(),
	run({
		teamId, rankedMemberIds
	}) {
		// Validate user
		if (!Meteor.userId())
			throw new Meteor.Error("logged-out", "You must be logged in to rank a team.");

		// Validate team
		team = Teams.findOne(teamId);
		if (!team)
			throw new Meteor.Error("invalid-team", "Invalid team.");

		// Validate members
		teamMemberIds = team.getMembers().map((member)=>member._id);

		if (!(teamMemberIds.length == rankedMemberIds.length && _.intersection(rankedMemberIds,teamMemberIds)))
			throw new Meteor.Error("incorrect-team-members-ranking", "Incorrect team members.");

		// Rules
		if (!team.isCurrent())
			throw new Meteor.Error("noncurrent-team-ranking", "You can only rank the current team, cheater.");

		if (team.isMyTeam())
			throw new Meteor.Error("own-team-ranking", "You can't rank your own team, cheater.");

		$set = {};
		$set['rankings.' + teamId] = rankedMemberIds;
		Meteor.users.update({
			_id: Meteor.userId()
		}, {
			$set: $set
		})

		if (Meteor.isServer)
			team.recalculateOrder();

		return;
	}
});

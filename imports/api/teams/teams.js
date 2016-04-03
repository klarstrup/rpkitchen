import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import moment from 'moment-timezone';

import { TeamMembers } from '/imports/api/teammembers/teammembers.js';
import { WeekToKitchenTeam } from '/lib/functions.js';

export const Teams = new Mongo.Collection('teams');
Teams.helpers({  
  getMembers: function () {
    return TeamMembers.find({ teamId: this.id },{sort: {'name': 1}});
  },
  isCurrent: function () {
    return this._id == WeekToKitchenTeam(moment().isoWeekday(1).startOf('day'))._id;
  },
  isNext: function () {
    return this._id == WeekToKitchenTeam(moment().isoWeekday(8).startOf('day'))._id;
  },
  isMyTeam: function () {
  	return !!TeamMembers.findOne({ teamId: this.id, userId: Meteor.userId() });
  },
  recalculateRating: function () {
  	var ratings = [];
  	this.getMembers().map(function(member){
  		$find = {}
  		$find['ratings.'+member._id]={$exists:true}
	  	Meteor.users.find($find).map(function(user){
	  		ratings.push(user.ratings[member._id]);
	  	})
  	});

  	var rating = _.reduce(ratings, function(memo, num){ return memo + parseInt(num); }, 0);

  	Teams.update(this._id,{$set:{'rating':rating}});
  },
  getMyRating: function () { 	
  	var ratings = [];
  	this.getMembers().map(function(member){
  		$find = {'_id': Meteor.userId()}
  		$find['ratings.'+member._id]={$exists:true}
	  	Meteor.users.find($find).map(function(user){
	  		ratings.push(user.ratings[member._id]);
	  	})
  	});

  	var rating = _.chain(ratings).countBy().pairs().max(_.last).head().value()
  	return rating;
  }
});

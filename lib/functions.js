import moment from 'moment-timezone';

import { Teams } from '/imports/api/teams/teams.js';

export const WeekToKitchenTeam = function(week) {
  weeksFromEpoch = Math.round(moment.duration(moment(week).day(1).startOf('day').valueOf() - moment(0).day(1).startOf('day').valueOf()).asWeeks());
  var teamId = ((weeksFromEpoch + 4) % 5);
  // console.log('week '+week+' is team '+teamId+'('+weeksFromEpoch+' weeks from kitchen epoch)', Teams.findOne({'id':teamId}));
  return Teams.findOne({'id':teamId});
}

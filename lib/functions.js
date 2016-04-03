import { Teams } from '/imports/api/teams/teams.js';

export const WeekToKitchenTeam = function(){ return Teams.findOne({id:2}); }

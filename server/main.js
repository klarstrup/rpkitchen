import '/imports/startup/server.js';
import '/imports/startup/client.jsx';

Meteor.startup(function(){
	require('/imports/api/teams/teams.js').Teams.find({}).forEach((team)=>{return team.recalculateScores()});
})

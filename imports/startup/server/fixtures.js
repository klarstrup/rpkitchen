import { Teams } from '/imports/api/teams/teams.js';
import { TeamMembers } from '/imports/api/teammembers/teammembers.js';

//Teams.remove({});
if (!Teams.findOne()) {
	Teams.insert({
		id: 0,
	});
	Teams.insert({
		id: 1,
	});
	Teams.insert({
		id: 2,
	});
	Teams.insert({
		id: 3,
	});
	Teams.insert({
		id: 4,
	});
}

//TeamMembers.remove({});
if (!TeamMembers.findOne()) {
	TeamMembers.insert({
		name: "Luuk",
		teamId: 0,
		email: "lfv@rebelpenguin.dk"
	});
	TeamMembers.insert({
		name: "Nicolas",
		teamId: 0,
		email: "nmo@rebelpenguin.dk"
	});
	TeamMembers.insert({
		name: "Frederik",
		teamId: 0,
		email: "ftw@rebelpenguin.dk"
	});
	TeamMembers.insert({
		name: "Lenny",
		teamId: 0,
		email: "lg@rebelpenguin.dk"
	});
	TeamMembers.insert({
		name: "Jonas P.",
		teamId: 0,
		email: "jdp@rebelpenguin.dk"
	});


	TeamMembers.insert({
		name: "Sarah",
		teamId: 1,
		email: "sab@rebelpenguin.dk"
	});
	TeamMembers.insert({
		name: "Robert",
		teamId: 1,
		email: "roh@rebelpenguin.dk"
	});
	TeamMembers.insert({
		name: "Simone",
		teamId: 1,
		email: "sil@rebelpenguin.dk"
	});
	TeamMembers.insert({
		name: "Khalid",
		teamId: 1,
		email: "kmz@rebelpenguin.dk"
	});
	TeamMembers.insert({
		name: "Sergi",
		teamId: 1,
		email: "sto@rebelpenguin.dk"
	});

	TeamMembers.insert({
		name: "Jonas",
		teamId: 2,
		email: "jwp@rebelpenguin.dk"
	});
	TeamMembers.insert({
		name: "Asbjørn",
		teamId: 2,
		email: "abh@rebelpenguin.dk"
	});
	TeamMembers.insert({
		name: "Tommy",
		teamId: 2,
		email: "tbz@rebelpenguin.dk"
	});
	TeamMembers.insert({
		name: "Sergio",
		teamId: 2,
		email: "sei@rebelpenguin.dk"
	});
	TeamMembers.insert({
		name: "Jonas K.",
		teamId: 2,
		email: "jkj@rebelpenguin.dk"
	});

	TeamMembers.insert({
		name: "Jakob",
		teamId: 3,
		email: "jhb@rebelpenguin.dk"
	});
	TeamMembers.insert({
		name: "Mia",
		teamId: 3,
		email: "mfc@rebelpenguin.dk"
	});
	TeamMembers.insert({
		name: "Nilaus",
		teamId: 3,
		email: "nvk@rebelpenguin.dk"
	});
	TeamMembers.insert({
		name: "Anders",
		teamId: 3,
		email: "ash@rebelpenguin.dk"
	});

	TeamMembers.insert({
		name: "Alex",
		teamId: 4,
		email: "ari@rebelpenguin.dk"
	});
	TeamMembers.insert({
		name: "Mathilde",
		teamId: 4,
		email: "msm@rebelpenguin.dk"
	});
	TeamMembers.insert({
		name: "Eduardo",
		teamId: 4,
		email: "evi@rebelpenguin.dk"
	});
	TeamMembers.insert({
		name: "Sebastian",
		teamId: 4,
		email: "seb@rebelpenguin.dk"
	});
	TeamMembers.insert({
		name: "Gabby",
		teamId: 4,
		email: "gcn@rebelpenguin.dk"
	});
}

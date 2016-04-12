import './server/fixtures.js';


import '/imports/api/teams/methods.js';
import '/imports/api/teams/server/publications.js';

import '/imports/api/teammembers/server/publications.js';

import '/imports/api/users/users.js';
import '/imports/api/users/server/publications.js';


ServiceConfiguration.configurations.remove({
	service: 'google'
});

ServiceConfiguration.configurations.insert({
	service: 'google',
	clientId: '506825037495-ct1hok25femun8u30e05tkcp6bu5u2sd.apps.googleusercontent.com',
	secret: 'MOsBQ_sqJvHycX1FrNJriEXU'
});

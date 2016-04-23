import { Meteor } from 'meteor/meteor';
import moment from 'moment-timezone';

import { FlowRouter } from 'meteor/kadira:flow-router-ssr';
import {mount} from 'react-mounter';
import React from 'react';

import MainLayout from '/imports/ui/layout';

import { KitchenWeeks } from '/imports/ui/components/kitchen';
import { KitchenTeamLeaderboard, KitchenerLeaderboard } from '/imports/ui/components/kitchenscoreboards';

if (Meteor.isServer) {
  var timeInMillis = 1000 * 10; // 10 secs
  FlowRouter.setPageCacheTimeout(timeInMillis)
  FlowRouter.setDeferScriptLoading(true);
  Session = ServerSession;
}

moment.tz.setDefault("Europe/Copenhagen");

SubsManager = new SubsManager();



AccountsTemplates.configure({
  hideSignUpLink: true,
  showLabels: false,
  texts: {
    socialSignIn: "",
    socialSignUp: "",
    socialWith: "",
    button: {
      signIn: "",
      signUp: "",
      enrollAccount: "",
    }
  }
});

FlowRouter.route('/', {
  name: 'schedule',
  action() {
    return mount(MainLayout, { content: () => (<KitchenWeeks />) });
  },
  triggersEnter: [function(context, redirect) {
    const user = Meteor.users.findOne({_id: Meteor.userId()})
    console.log(user) // undefined
  }]
});
FlowRouter.route('/teams', {
  name: 'teams',
  action() {
    return mount(MainLayout, { content: () => (<KitchenTeamLeaderboard />) });
  }
});

FlowRouter.route('/kitcheners', {
  name: 'kitcheners',
  action() {
    return mount(MainLayout, { content: () => (<KitchenerLeaderboard />) });
  }
});


/*
FlowRouter.route('/:postId', {
  action(params) {
    ReactLayout.render(MainLayout, {content: <BlogPost {...params} />});
  }
});
BlogPost = React.createClass({
  render() {
    return (
      <div>
        <p>
          <a href="/">Back</a> <br/>
          This is a single blog post
        </p>
      </div>
    );
  }
});
*/

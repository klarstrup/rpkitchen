import { Meteor } from 'meteor/meteor';
import { ServerSession } from 'meteor/matteodem:server-session';
import { FlowRouter } from 'meteor/kadira:flow-router-ssr';
import React from 'react';
import c from 'classnames';
import Blaze from 'meteor/gadicc:blaze-react-component';
import { applyContainerQuery } from 'react-container-query';


import MediaQuery from 'react-responsive';

import { VelocityComponent, VelocityTransitionGroup } from 'velocity-react';

import BottomNavigation from '/imports/ui/components/bottomnavigation';
import { KitchenWeeks, CurrentAccount } from '/imports/ui/components/kitchen';
import { KitchenTeamLeaderboard, KitchenerLeaderboard } from '/imports/ui/components/kitchenscoreboards';

if(Meteor.isServer)
  Session = ServerSession;

ns = function(o, suffixes, prefix = 'c') {
  if(typeof suffixes == "string")
    suffixes = [suffixes]
  if (suffixes)
    suffixes = '-' + suffixes.join('-');
  else suffixes = '';
  return (prefix + '-' + o.constructor.displayName.replace("_render", "") + suffixes).toLowerCase();
}

const mdBreakpoints = (function(breakpoints) {
  breakpointArray = breakpoints.slice(0);
  breakpointObject = {};
  while (breakpointArray.length) {
    breakpoint = breakpointArray.shift()
    breakpointObject['from' + breakpoint] = { minWidth: breakpoint };
    breakpointArray.forEach(function(tobreakpoint) {
      breakpointObject['from' + breakpoint + 'to' + tobreakpoint] = {
        minWidth: breakpoint, maxWidth: tobreakpoint-1
      }
    })
    breakpointObject['to' + breakpoint] = { maxWidth: breakpoint-1 };
  }
  return breakpointObject;
})([0, 360, 400, 480, 600, 720, 840, 960, 1024, 1280, 1440, 1600, 1920]);

export default MainLayout = applyContainerQuery(React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    SubsManager.subscribe('publicUserData');
    SubsManager.subscribe('ownUserData');
    SubsManager.subscribe('teams');
    SubsManager.subscribe('teamMembers');
    return {
      currentUser: Meteor.user()?Meteor.user():null,
      showTeams: Session.get('showTeams')
    }
  },
  render() {
  	return (
  		<div className={c(ns(this),this.props.containerQuery,'r-'+FlowRouter.current().route.name,{'is-ready':Meteor.isClient})}>
        <header className="c-header">
          <div className="c-masthead">
            <a href="http://rebelpenguin.dk/" className="c-masthead-homelink"><img src="/images/rp-logo.png"/></a>
            <h1>Kitchen Teams</h1>
          </div>
          {this.data.currentUser ?(<CurrentAccount />):(Meteor.isClient?(<Blaze template="atForm" />):null)}
        </header>
        <main>
          <KitchenWeeks key="KitchenWeeks"/>
          <aside>
            <KitchenTeamLeaderboard key="KitchenTeamLeaderboard"/>
            <KitchenerLeaderboard key="KitchenTeamRankings"/>
          </aside>
        </main>
        <BottomNavigation/>
      </div>
		)
  }
}), mdBreakpoints);

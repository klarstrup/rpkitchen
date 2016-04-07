import { Meteor } from 'meteor/meteor';
//import { Session } from 'meteor/session';
import { ServerSession } from 'meteor/matteodem:server-session';
import React from 'react';
import c from 'classnames';
import Blaze from 'meteor/gadicc:blaze-react-component';
import { applyContainerQuery } from 'react-container-query';


import MediaQuery from 'react-responsive';

import { VelocityComponent, VelocityTransitionGroup } from 'velocity-react';

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
  		<div className={c(ns(this),this.props.containerQuery)}>
        <header className="c-header">
          <div className="c-masthead">
            <a href="http://rebelpenguin.dk/" className="c-masthead-homelink"><img src="/images/rp-logo.png"/></a>
            <h1>Kitchen Teams</h1>
          </div>
          {this.data.currentUser ?(<CurrentAccount />):(Meteor.isClient?(<Blaze template="atForm" />):null)}
        </header>
          <VelocityTransitionGroup component="main"
            enter={{animation: 'fadeIn', duration: 500, style: {height: ''}}}
            leave={{animation: 'fadeOut', duration: 500}}>
          <KitchenWeeks key="KitchenWeeks"/>
          {true?(<MediaQuery minWidth={1440} component="aside" values={{width: 1600}}>
            <KitchenTeamLeaderboard key="KitchenTeamLeaderboard"/>
            <KitchenerLeaderboard key="KitchenTeamRankings"/>
          </MediaQuery>):null}
        </VelocityTransitionGroup>
      {true?(<BottomNavigation/>):null}
      </div>
		)
  }
}), mdBreakpoints);

export const BottomNavigation = React.createClass({
  render() {
    return (
      <nav className={c(ns(this))}>
        <ul>
          <li className="is-active">
            <a href="#schedule">
              <i className="fa fa-calendar"></i>
              <span className={c(ns(this,'label'))}>Schedule</span>
            </a>
          </li>
          <li>
            <a href="#kitcheners">
              <i className="fa fa-user"></i>
              <span className={c(ns(this,'label'))}>Kitcheners</span>
            </a>
          </li>
          <li>
            <a href="#teams">
              <i className="fa fa-users"></i>
              <span className={c(ns(this,'label'))}>Teams</span>
            </a>
          </li>
        </ul>
      </nav>
    )
  }
});


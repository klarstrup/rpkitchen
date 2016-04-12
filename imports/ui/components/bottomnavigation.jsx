import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router-ssr';
import React from 'react';
import c from 'classnames';


injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

export default BottomNavigation = React.createClass({
  render() {
    return (
      <nav className={c(ns(this))}>
        <ul>
          <li className={c({"is-active":FlowRouter.current().route.path==FlowRouter.path("schedule")})}>
            <a href={FlowRouter.path("schedule")} onTouchStart={()=>{FlowRouter.go('schedule')}} touch-action="none">
              <i className="fa fa-calendar"></i>
              <span className={c(ns(this,'label'))}>Schedule</span>
            </a>
          </li>
          <li className={c({"is-active":FlowRouter.current().route.path==FlowRouter.path("kitcheners")})}>
            <a href={FlowRouter.path("kitcheners")} onTouchStart={()=>{FlowRouter.go('kitcheners')}} touch-action="none">
              <i className="fa fa-user"></i>
              <span className={c(ns(this,'label'))}>Kitcheners</span>
            </a>
          </li>
          <li className={c({"is-active":FlowRouter.current().route.path==FlowRouter.path("teams")})}>
            <a href={FlowRouter.path("teams")} onTouchStart={()=>{FlowRouter.go('teams')}} touch-action="none">
              <i className="fa fa-users"></i>
              <span className={c(ns(this,'label'))}>Teams</span>
            </a>
          </li>
        </ul>
      </nav>
    )
  }
});

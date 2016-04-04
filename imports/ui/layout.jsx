import { Meteor } from 'meteor/meteor';
import React from 'react';
import Blaze from 'meteor/gadicc:blaze-react-component';

import { KitchenWeeks, CurrentAccount } from '/imports/ui/components/kitchen';

ns = function(o, suffixes, prefix = 'c') {
  if(typeof suffixes == "String")
    suffixes = [suffixes]
  if (suffixes)
    suffixes = '-' + suffixes.join('-');
  else suffixes = '';
  return (prefix + '-' + o.constructor.displayName.replace("_render", "") + suffixes).toLowerCase();
}

export default MainLayout = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    SubsManager.subscribe('publicUserData');
    SubsManager.subscribe('ownUserData');
    SubsManager.subscribe('teams');
    SubsManager.subscribe('teamMembers');
    return {
      currentUser: Meteor.user()?Meteor.user():null
    }
  },
  render() {
	return (
		<div className={ns(this)}>
      <header className="c-header">
        <div className="c-masthead">
          <a href="http://rebelpenguin.dk/" className="c-masthead-homelink"><img src="/images/rp-logo.png"/></a>
          <h1>Kitchen Teams</h1>
        </div>
        {this.data.currentUser ?(<CurrentAccount />):(Meteor.isClient?(<Blaze template="atForm" />):null)}
      </header>
      <main>
      	<KitchenWeeks />{this.props.content}
      </main>
      <footer>
        We love meteor.
      </footer>
    </div>
		)
}
});

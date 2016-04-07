import { Meteor } from 'meteor/meteor';
import moment from 'moment-timezone';
import {mount} from 'react-mounter';

import { FlowRouter } from 'meteor/kadira:flow-router-ssr';

import MainLayout from '/imports/ui/layout';

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
  action() {
    return mount(MainLayout, { content: (null) });
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

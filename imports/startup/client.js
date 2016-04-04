import { Meteor } from 'meteor/meteor';
import moment from 'moment-timezone';

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
    ReactLayout.render(MainLayout, { content: (null) });
    if (Meteor.isClient) {
      $('.c-mainlayout').data('react-checksum', null);
    }
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

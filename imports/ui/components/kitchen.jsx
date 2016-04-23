import { Meteor } from 'meteor/meteor';
import { $ } from 'meteor/jquery';
import moment from 'moment-timezone';
import c from 'classnames';
import React from 'react';
import * as ReactDOM from 'react-dom';
import { rank as rankTeam } from '/imports/api/teams/methods.js';
import { FlowRouter } from 'meteor/kadira:flow-router-ssr';

// Ugly non-ES6 import because dragula wants to touch the document global on import for no good reason.
if(Meteor.isClient)
  dragula = require('react-dragula');

import { WeekToKitchenTeam } from '/lib/functions.js';
import { Teams } from '/imports/api/teams/teams.js';
import { TeamMembers } from '/imports/api/teammembers/teammembers.js';

ns = function(o, suffixes, prefix = 'c') {
  if(typeof suffixes == "String")
    suffixes = [suffixes]
  if (suffixes)
    suffixes = '-' + suffixes.join('-');
  else suffixes = '';
  return (prefix + '-' + o.constructor.displayName.replace("_render", "") + suffixes).toLowerCase();
}

export const CurrentAccount = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    currentUser = Meteor.user();
    if (currentUser && 'services' in currentUser && 'google' in currentUser.services) {
      currentUserDetails = currentUser.services.google;
    } else {
      currentUserDetails = null
    }
    return {
      currentUserDetails: currentUserDetails,
      currentUser: currentUser?currentUser:null,
      currentTeamMember: currentUser?TeamMembers.findOne({ 'userId': currentUser._id }):null
    };
  },
  render() {
    return (
      <div className={ns(this)}>
        <div className={ns(this,['ProfileInfo'])}>
          {this.data.currentTeamMember?(<div className={ns(this,['ProfileInfo','Name'])}>{this.data.currentTeamMember.name}</div>):null}
          {this.data.currentTeamMember?(<a className={ns(this,['ProfileInfo','Signout'])+' js-signout'} href="javascript:void(0)" onClick={AccountsTemplates.logout}>Sign Out <i className="fa fa-sign-out"></i></a>):null}
          {false && this.data.currentUserDetails?(<div className={ns(this,['ProfileInfo','Email'])}>{this.data.currentUserDetails.email}</div>):null}
        </div>
        {this.data.currentUserDetails?(<img className={ns(this,['ProfilePicture'])} src={this.data.currentUserDetails.picture}/>):''}
      </div>
    );
  }
});
export const KitchenWeeks = React.createClass({
  mixins: [ReactMeteorData],
  getInitialState() {
    return {
      weekMax: 10
    }
  },
  componentWillMount(){
    if (Meteor.isClient)
      $(window).scroll(this.onScroll)
  },
  onScroll() {
    if ($(window).scrollTop() + $(window).height() == $(document).height() && FlowRouter.current().route.name == "schedule")
      this.setState({weekMax: this.state.weekMax + 8})
  },
  getMeteorData() {
    var data = {};

    data.weeks = [];
    max = 10;
    if (this.state.weekMax)
      max = this.state.weekMax;

    for (var i = 0; i < max; i++) {
      if (i == 0)
        data.weeks.push(moment().isoWeekday(1).startOf('day'));
      else
        data.weeks.push(moment().isoWeekday(1 + (i * 7)).startOf('day'));
    }
    return data;
  },
  renderWeeks() {
    return this.data.weeks.map((week) => {
      return <KitchenWeek key={week} week={week} className={ns(this,['week'])} 
            isCurrent={moment().isoWeekday(1).startOf('day').isSame(moment(week),'week')}
            isNext={moment().isoWeekday(8).startOf('day').valueOf()==moment(week).isoWeekday(1).startOf('day').valueOf()}
            />;
    });
  },
  render() {
    return (
      <ol className={ns(this)}>
        {this.data.weeks ? this.renderWeeks() : <span>Loading...</span>}
      </ol>
    );
  }
});


import { KitchenTeamRater } from '/imports/ui/components/kitchenteamrater.jsx';

export const KitchenWeek = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var data = {};
    data.team = Teams.findOne(WeekToKitchenTeam(this.props.week))
    data.currentUser = Meteor.user();
    return data;
  },
  render() {
    team = Teams._transform(this.data.team);
    isCurrent = this.props.isCurrent;
    isNext = this.props.isNext;
    teamSpan = (<span style={{fontWeight: 'normal'}}>&nbsp;-&nbsp;Team {this.data.team.id+1}</span>)
    return (
      <li className={this.props.className+(isCurrent?' is-current':'')+(isNext?' is-next':'')}>
        {(isCurrent&&!team.isMyTeam()?(<KitchenTeamRater team={this.data.team}/>):null)}
        {(isCurrent
          ?(<h2>This Week{teamSpan}</h2>)
          :isNext
            ?(<h2>Next Week{teamSpan}</h2>)
            :(<h2>Week&nbsp;<b>{moment(this.props.week).isoWeek()}</b>{!moment().isoWeekday(1).startOf('day').isSame(moment(this.props.week),'year')?', '+(moment(this.props.week).year()):null}{teamSpan}</h2>))}
        
        <KitchenTeam 
          className={c({'is-current':isCurrent,'is-next':isNext})}
          isCurrent={isCurrent}
          isNext={isNext}
          team={this.data.team}
          />
      </li>
    );
  }
});
export const KitchenTeam = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var data = {};
    let transformedTeam = Teams._transform(this.props.team);
    data.teammembers = transformedTeam.getMembers().fetch();

    return data;
  },
  renderTeamMembers() {
    if(!this.data.teammembers)
      return null;

    sortedTeammembers = _.sortBy(this.data.teammembers,(member)=>{
      if(Meteor.user() && 'rankings' in Meteor.user() && this.props.team._id in Meteor.user().rankings)
        if(this.props.team._id in Meteor.user().rankings && Meteor.user().rankings[this.props.team._id].indexOf(member._id) > -1)
          return Meteor.user().rankings[this.props.team._id].indexOf(member._id)
        else return 999;
      else
        return member.name;
    });
    
    return sortedTeammembers.map((member) => {
      return <KitchenTeamMember classNames={[ns(this,['Member']),c({'is-currentuser':Meteor.user() && Meteor.user()._id == member.userId})]} key={member._id} member={member} />;
    });
  },
  render() {
    return (
      <ol className={c(this.props.className,ns(this),{'is-ready':Meteor.isClient})}>
        {this.renderTeamMembers()}
        <li className={ns(this,['Filler'])}></li>
        <li className={ns(this,['Filler'])}></li>
        <li className={ns(this,['Filler'])}></li>
      </ol>
    );
  },
  componentDidMount: function () {
    if(Meteor.isClient && this.props.isCurrent){
      var container = ReactDOM.findDOMNode(this);
      drake = dragula({
        containers: [container],
        mirrorContainer: container,
        direction: 'horizontal',
        moves: function (el, target, source, sibling) {
          // Only allow dragging members
          return el.classList.contains('c-kitchenteam-member')
        },
        accepts: function (el, target, source, sibling) {
          // Only allow dropping next to members
          if(sibling)
            return sibling.classList.contains('c-kitchenteam-member')||sibling.previousElementSibling.classList.contains('c-kitchenteam-member');
          else true;
        }
      });
      drake.on('drop',(el, target, source, sibling)=>{
        let orderedArray = $(target).children().map(function(index, element){
          if('teammemberId' in element.dataset && !element.classList.contains('gu-mirror'))
            return element.dataset.teammemberId
        }).toArray();

        rankTeam.call({
          teamId: this.props.team._id, 
          rankedMemberIds: orderedArray
        }, (error,result)=>{
          if(error){
            console.error(error);
            MDSnackbars.show({
              text: error.reason ? error.reason : error.message,
              fullWidth: true,
              animation: 'slideup'
            });
            return;
          }
          MDSnackbars.show({
            text: "Ranking saved!",
            fullWidth: true,
            animation: 'slideup'
          });
          
          var li = $(target).children('.c-kitchenteam-member').detach();
          var liFillers = $(target).children('.c-kitchenteam-filler').detach();
          li.sort(function(elA,elB){
            if(orderedArray.indexOf(elA.dataset.teammemberId)>orderedArray.indexOf(elB.dataset.teammemberId))
              return 1;
            if(orderedArray.indexOf(elA.dataset.teammemberId)<orderedArray.indexOf(elB.dataset.teammemberId))
              return -1;
            return 0;
          });
          $(target).append(li);
          $(target).append(liFillers);

          return true;
        });

        var li = $(target).children('.c-kitchenteam-member').detach();
        var liFillers = $(target).children('.c-kitchenteam-filler').detach();
        li.sort(function(elA,elB){
          if(orderedArray.indexOf(elA.dataset.teammemberId)>orderedArray.indexOf(elB.dataset.teammemberId))
            return 1;
          if(orderedArray.indexOf(elA.dataset.teammemberId)<orderedArray.indexOf(elB.dataset.teammemberId))
            return -1;
          return 0;
        });
        $(target).append(li);
        $(target).append(liFillers);

      })
    }
  }
});
export const KitchenTeamMember = (props)=>{
  var imgUrlDefault = "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg";
  var imgUrl = imgUrlDefault;
//    var imgUrl = "http://www.gravatar.com/avatar/"+CryptoJS.MD5(props.member.email)+"?s=400&d=retro";
  transformedMember = TeamMembers._transform(props.member)
  if (transformedMember.getUser && transformedMember.getUser() && transformedMember.getUser().services.google.picture != imgUrlDefault) {
    imgUrl = transformedMember.getUser().services.google.picture;
  }
  var style = {
    backgroundImage: 'url(' + imgUrl + ')'
  }
  return (
    <li className={props.classNames.join(' ')} data-teammember-id={props.member._id}>
      <div className={props.classNames[0]+'-picture'} style={style}></div>
      <div className={props.classNames[0]+'-name'}>{props.member.name}</div>
    </li>
  );
};

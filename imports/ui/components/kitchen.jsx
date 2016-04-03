import { Meteor } from 'meteor/meteor';
import moment from 'moment-timezone';
import c from 'classnames';
import React from 'react';


import { WeekToKitchenTeam } from '/lib/functions.js';
import { Teams } from '/imports/api/teams/teams.js';
import { TeamMembers } from '/imports/api/teammembers/teammembers.js';
import { rate as rateTeam } from '/imports/api/teams/methods.js';

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
    if ($(window).scrollTop() + $(window).height() == $(document).height())
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
    return (
      <li className={this.props.className+(isCurrent?' is-current':'')+(isNext?' is-next':'')}>
        {(isCurrent&&this.data.currentUser&&!team.isMyTeam()?(<KitchenTeamRater team={this.data.team}/>):null)}
        {(isCurrent?(<h2>This Week</h2>):isNext?(<h2>Next Week</h2>):(<h2>Week&nbsp;<b>{moment(this.props.week).isoWeek()}</b>{!moment().isoWeekday(1).startOf('day').isSame(moment(this.props.week),'year')?', '+(moment(this.props.week).year()):null}</h2>))}
        <KitchenTeam 
          className={c({'is-current':isCurrent,'is-next':isNext})}
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
    transformedTeam = Teams._transform(this.props.team);
    data.teammembers = transformedTeam.getMembers().fetch();
    data.currentUser = Meteor.user();
    return data;
  },
  isMemberCurrentUser(member, currentUser) {
    if (currentUser && currentUser.services && currentUser.services.google && currentUser.services.google.email) {
      TeamMembers._transform(TeamMembers.findOne(member._id));
      if (TeamMembers.findOne(member._id) && TeamMembers._transform(TeamMembers.findOne(member._id)).getUser() && this.data.currentUser._id == TeamMembers._transform(TeamMembers.findOne(member._id)).getUser()._id) {
        return true;
      }
    }
  },
  renderTeamMembers() {
    if(!this.data.teammembers)
      return
    
    return this.data.teammembers.map((member) => {
      return <KitchenTeamMember classNames={[ns(this,['Member']),(this.isMemberCurrentUser(member,this.data.currentUser)?' is-currentuser':'')]} key={member._id} member={member} />;
    });
  },
  render() {
    return (
      <ul className={this.props.className+' '+ns(this)}>
        {this.renderTeamMembers()}
        <li className={ns(this,['Filler'])}></li>
        <li className={ns(this,['Filler'])}></li>
        <li className={ns(this,['Filler'])}></li>
      </ul>
    );
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
    <li className={props.classNames.join(' ')}>
      <div className={props.classNames[0]+'-picture'} style={style}></div>
      <div className={props.classNames[0]+'-name'}>{props.member.name}</div>
    </li>
  );
};

export const KitchenTeamRater = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var data = {};
    if(this.props.team && '_id' in this.props.team && this.props.team._id)
      data.myRating = Teams._transform(Teams.findOne(this.props.team._id)).getMyRating();
    return data;
  },
  handleRate(e) {
    rating = e.target.value;
    rateTeam.call({
      teamId: this.props.team._id, 
      rating: rating
    }, function(error,result){
      if(error){
        console.error(error);
        toastr.error(error.reason)
        return;
      }
    });
  },
  render() {
    return (
      <div className={ns(this)+' '+ns(this,[],'js')}>
        <form className={ns(this,['form'])}>
          <label>
            <input type="radio" name="rating" value="+1" onChange={this.handleRate} checked={this.data.myRating=="+1"}/>
            <i className="fa fa-smile-o" title="Good."></i>
          </label>
          <label>
            <input type="radio" name="rating" value="0" onChange={this.handleRate} checked={this.data.myRating=="0"}/>
            <i className="fa fa-meh-o" title="Meh."></i>
          </label>
          <label>
            <input type="radio" name="rating" value="-1" onChange={this.handleRate} checked={this.data.myRating=="-1"}/>
            <i className="fa fa-frown-o" title="Poor."></i>
          </label>
        </form>
      </div>
    );
  }
});

import React from 'react';
import {TrackerReactMixin} from 'meteor/ultimatejs:tracker-react';


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

export const KitchenTeamLeaderboard = React.createClass({
  renderTeams() {
    let iterator = 0;
    return Teams.find({},{sort:{rating:-1}}).map((team) => {
      return (<li key={team._id}>#{++iterator} Team {team.id+1} {team.rating?team.rating:0}</li>);
    });
  },
  render(){
    return (
      <section className="c-kitchenteamleaderboard">
        <img src="/images/question-mark.png" className="c-kitchenteamleaderboard-q"/>
      </section>
    )
  }
}); 
export const KitchenerLeaderboard = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    return {
      teammembers: TeamMembers.find({}).fetch()
    }
  },
  renderKitcheners() {
    let iterator = 0;
    sortedTeammembers = _.sortBy(this.data.teammembers,(member)=>-member.score);
    return _.map(sortedTeammembers,(kitchener) => {

      return (<KitchenerLeaderboardEntry className={ns(this,['list','entry'])} key={kitchener._id} index={++iterator} member={kitchener}/>)

    });
  },
  render(){
  return (
    <section className={ns(this)}>
      <ol className={ns(this,['list'])}>
        {this.renderKitcheners()}
      </ol>
    </section>
  )
}
}); 

export const KitchenerLeaderboardEntry = React.createClass({
  render(){
    member = this.props.member;
    var imgUrlDefault = "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg";
    var imgUrl = imgUrlDefault;
  //    var imgUrl = "http://www.gravatar.com/avatar/"+CryptoJS.MD5(props.member.email)+"?s=400&d=retro";
    transformedMember = TeamMembers._transform(member)
    if (transformedMember.getUser && transformedMember.getUser() && transformedMember.getUser().services.google.picture != imgUrlDefault) {
      imgUrl = transformedMember.getUser().services.google.picture;
    }
    var style = {
      backgroundImage: 'url(' + imgUrl + ')'
    }

    return (
      <li className={this.props.className} key={member._id}>
        <img className={this.props.className+'-picture'} src={imgUrl}/>
        <div>
          <span className={this.props.className+'-score'}>{member.score?member.score:0} pts</span>
          <span className={this.props.className+'-name'}>{member.name}</span>
          <span className={this.props.className+'-team'}>Team {transformedMember.getTeam().id+1}</span>
        </div>
      </li>
    );
  }
})

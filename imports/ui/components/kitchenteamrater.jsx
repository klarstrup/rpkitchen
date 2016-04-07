import { Meteor } from 'meteor/meteor';
import React from 'react';

import { Teams } from '/imports/api/teams/teams.js';
import { rate as rateTeam } from '/imports/api/teams/methods.js';

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
        MDSnackbars.show({
          text: error.reason ? error.reason : error.message,
          fullWidth: true,
          animation: 'slideup'
        })
        return;
      }
      MDSnackbars.show({
        text: "Thank you for rating!",
        fullWidth: true,
        animation: 'slideup'
      })
    });
  },
  render() {
    if(Meteor.isClient)
      MDSnackbars.init();

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

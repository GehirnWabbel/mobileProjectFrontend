import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the JoinTeamPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-join-team',
  templateUrl: 'join-team.html',
})
export class JoinTeamPage {

  public teamName: string = 'Teamname';

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    alert(navParams.get("teamName"));
    alert(navParams.get("teamId"));

    this.teamName = "Team: " + navParams.get("teamName");

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad JoinTeamPage');
  }

  updateCheckbox() {
    return null;
  }

}

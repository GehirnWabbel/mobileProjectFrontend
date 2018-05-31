import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';

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

  isDriver: boolean;
  driverName: string;
  notification: number;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private apiProvider: ApiServiceProvider) {

    //For testing on android emulator
    //alert(navParams.get("teamName"));
    //alert(navParams.get("teamId"));
    //this.teamName = "Team: " + navParams.get("teamName");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad JoinTeamPage');
  }

  updateCheckbox() {
    return null;
  }

  joinTeam(){

    console.log(this.driverName);

    if(this.isDriver != true){
      console.log("is kein Fahrer");
      //TODO: add User to team, using teamid from deeplink
    }
    else {
      //New Driver is connected with device
      //mock teamid
      if(typeof this.driverName != 'undefined' && typeof this.notification != 'undefined' ){
        //TODO: COLOR PICKER AND USAGE OF COLOR RESULT IN REQUEST
        let newDriver = "{ \"name\":\"" + this.driverName + "\", \"connectedViaDevice\": true, \"driver\": true, \"color\": 1, \"minutesBeforeNotification\": " + this.notification + " }"
        //this.apiProvider.registerNewDriver(this.navParams.get("teamId"), newDriver);
        this.apiProvider.registerNewDriver("5b06a79fef9f5500141336d2", newDriver);
      }



    }
  }

}

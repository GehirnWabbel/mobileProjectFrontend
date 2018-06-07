import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { Storage } from '@ionic/storage';

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
  teamName: string;
  teamId: string;
  teamNameUI: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private apiProvider: ApiServiceProvider,
              private storage: Storage) {

    //TODO: Remove Mock to use real Team ID
    //this.teamNameUI = "Team: " + navParams.get("teamName");
    //this.teamName = navParams.get("teamName");
    this.teamNameUI = "Team: needracing.com";
    this.teamName = "needracing.com";
    //this.teamId = navParams.get("teamId");
    this.teamId = "5b06a79fef9f5500141336d2";
    this.storage.set('teamId', this.teamId );
    console.log("Team Id: " + this.teamId + " saved in local storage." )

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad JoinTeamPage');
  }

  updateCheckbox() {
    return null;
  }

  joinTeam(){

    if(this.isDriver != true){
      if(typeof this.driverName != 'undefined' && typeof this.notification != 'undefined' ){
        console.log("Anmeldung als User, nicht als Fahrer!");
        let color = Math.floor(Math.random() * 17) + 1;
        let colorNumber = Math.round(color);
        let newUser = "{ \"name\":\"" + this.driverName + "\", \"connectedViaDevice\": true, \"driver\": false, \"color\": " + colorNumber + ", \"minutesBeforeNotification\": " + this.notification + " }";

        if(this.teamId != undefined ){
          this.apiProvider.registerNewDriver(this.navParams.get("teamId"), newUser);
        }
        else{
          this.apiProvider.registerNewDriver("5b06a79fef9f5500141336d2", newUser);
        }

      }
    }
    else {
      //New Driver is connected with device
      if(typeof this.driverName != 'undefined' && typeof this.notification != 'undefined' ){
        console.log("Anmeldung als Fahrer!");
        let color = Math.floor(Math.random() * 17) + 1;
        let colorNumber = Math.round(color);
        let newDriver = "{ \"name\":\"" + this.driverName + "\", \"connectedViaDevice\": true, \"driver\": true, \"color\": " + colorNumber + ", \"minutesBeforeNotification\": " + this.notification + " }";

        if(this.teamId != undefined ){
          this.apiProvider.registerNewDriver(this.navParams.get("teamId"), newDriver);
        }
        else{
          this.apiProvider.registerNewDriver("5b06a79fef9f5500141336d2", newDriver);
        }

      }



    }
  }

}

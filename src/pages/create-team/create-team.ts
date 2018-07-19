import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {EventsPage} from "../events/events";
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the CreateTeamPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-team',
  templateUrl: 'create-team.html',
})
export class CreateTeamPage {

  newTeamName: string;
  teamId: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private apiProvider: ApiServiceProvider,
              private storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateTeamPage');
  }

  jumpDirectlyToEvents(){
    this.teamId = "5b06a79fef9f5500141336d2";
    this.storage.set('teamId', this.teamId );
    console.log("Team Id mock: " + this.teamId + " saved in local storage." )
    this.navCtrl.setRoot(EventsPage);
  }

  createTeam(){
    if(this.newTeamName != null && this.newTeamName != undefined){
      let newTameNameJson =  "{ \"name\": \""+ this.newTeamName + "\"}";
      this.apiProvider.createTeam(newTameNameJson).then(data => {
          this.teamId = data['_id'];
          this.storage.set('teamId', this.teamId );
          console.log("Team Id: " + this.teamId + " saved in local storage." )
          this.navCtrl.setRoot(EventsPage);
        }
      );

    }

  }

}

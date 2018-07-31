import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {EventsPage} from "../events/events";
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { Storage } from '@ionic/storage';
import {MemberMgmtPage} from "../member-mgmt/member-mgmt";

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
              public modalCtrl: ModalController,
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
    this.storage.set("memberId", "5b5f4e03a2a2d000142da8ba");
    console.log("Team Id mock: " + this.teamId + " saved in local storage." );
    this.navCtrl.setRoot(EventsPage);
  }

  createTeam(){
    if(this.newTeamName != null && this.newTeamName != undefined){
      let newTameNameJson =  "{ \"name\": \""+ this.newTeamName + "\"}";
      this.apiProvider.createTeam(newTameNameJson).then(data => {
          this.teamId = data['_id'];
          this.storage.set('teamId', this.teamId );
          console.log("Team Id: " + this.teamId + " saved in local storage." );
          this.registerTeamMember();
        }
      ).catch(reason => {
        console.log("Create Team: Failed to create Team");
        console.dir(reason);
        this.storage.clear().then(() => {
          this.navCtrl.setRoot(CreateTeamPage);
        });
      });

    }

  }

  registerTeamMember() {
    const addMember = this.modalCtrl.create(MemberMgmtPage, {
      person: {
        name: "",
        driver: true,
        connectedViaDevice: true,
        color: 1,
        avatarNo: 1,
        minutesBeforeNotification: 30
      },
      mode: 'new',
      allowCancel: false,
      teamId: this.teamId
    });
    addMember.present();
  }

}

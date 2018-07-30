import { Component } from '@angular/core';
import {
  IonicPage,
  ViewController,
  NavParams,
  AlertController,
  ToastController, NavController
} from 'ionic-angular';
import {ApiServiceProvider} from "../../providers/api-service/api-service";
import {CreateTeamPage} from "../create-team/create-team";
import { Storage } from "@ionic/storage";

/**
 * Generated class for the TeamMgmtPopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-team-mgmt-popover',
  templateUrl: 'team-mgmt-popover.html',
})
export class TeamMgmtPopoverPage {

  teamId;
  teamName;

  constructor(public viewCtrl: ViewController,
              public navCtrl: NavController,
              public toastCtrl: ToastController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              private storage: Storage,
              private api: ApiServiceProvider) {
    this.teamId = this.navParams.get("teamId");
    this.teamName = this.navParams.get("teamName");
  }

  ionViewDidLoad() {
    console.log('Team Mgmt Popover: ionViewDidLoad TeamMgmtPopoverPage');
  }

  deleteTeam(event) {
    this.viewCtrl.dismiss();
    const confirm = this.alertCtrl.create({
      title: 'Wirklich Team Löschen?',
      message: 'Das Löschen des Teams kann nicht rückgängig gemacht werden!\nZur Bestätigung bitte den Team Namen ' + this.teamName + ' eintragen.',
      inputs: [
        {
          name: 'teamName',
          placeholder: 'Team Name'
        }
      ],
      buttons: [
        {
          text: 'Abbrechen',
          handler: data => {
            console.log("Team Mgmt Popover: Team Löschen Cancle");
          }
        },
        {
          text: 'Unwiederruflich Löschen',
          handler: data => {
            console.log(data.teamName);
            if(data.teamName === this.teamName) {
              this.api.deleteTeam(this.teamId).then(data => {
                this.storage.clear().then(() => this.navCtrl.setRoot(CreateTeamPage))
                .catch(reason => {
                  console.log("Team Management Popover: Failed to delete team!");
                  console.dir(reason);
                  this.storage.clear().then(() => {
                    this.navCtrl.setRoot(CreateTeamPage);
                  })
                }); // also clear local storage
                this.showToast("Team gelöscht.")
              })
            } else
              this.showToast("Team Name stimmt nicht überein!");
          }
        }
      ]
    });
    confirm.present({
      ev: event
    });
  }

  showToast(msg :string){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2500
    });
    toast.present();
  }

}

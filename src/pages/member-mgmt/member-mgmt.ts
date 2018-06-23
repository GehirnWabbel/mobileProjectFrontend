import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  ToastController
} from 'ionic-angular';
import {ApiServiceProvider} from "../../providers/api-service/api-service";
import { colorDefinitions } from "../../app/colordefinitions";
import { Storage } from "@ionic/storage";


@IonicPage()
@Component({
  selector: 'page-member-mgmt',
  templateUrl: 'member-mgmt.html',
})
export class MemberMgmtPage {

  changeMode: boolean = false;
  mode: string = 'edit';

  editMember;

  colorDefinitions;

  teamId;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    private apiProvider : ApiServiceProvider,
    private storage : Storage
  ) {
    this.storage.get("teamId").then(val => {
      this.teamId = val;
    });
    this.mode = this.navParams.data.mode;
    if(this.mode === 'new')
      this.changeMode = true;
    this.editMember = Object.assign({}, this.navParams.data.person); //copy member object for editing to not have changed original reference when leaving with discarding changes
    this.colorDefinitions = colorDefinitions;
  }

  static ionViewDidLoad() {
    console.log('ionViewDidLoad MemberMgmtPage');
  }

  ionViewCanLeave() {
    if (this.changeMode) {
      let confirm = this.alertCtrl.create({
        title: 'Änderungen speichern?',
        // message: '',
        buttons: [
          {
            text: 'Verwerfen',
            handler: () => {
              console.log('Ja clicked, discarding changes');
              this.changeMode = false;
              let transition = confirm.dismiss();
              transition.then(() => {
                this.navCtrl.pop();
              });
              return false; //prevent automatic dismiss
            }
          },
          {
            text: 'Abbrechen',
            handler: () => {
              console.log('Nein clicked');
            },
            role: 'cancle'
          }
        ]
      });
      confirm.present();
      return false;
    }else {
      return true;
    }
  }
  colorForward() {
      this.editMember.color++;
      if(this.editMember.color > 17)
        this.editMember.color -= 17;
  }

  colorBackward() {
    this.editMember.color--;
    if(this.editMember.color < 0)
      this.editMember.color += 17;
  }

  avatarForward() {
    this.editMember.avatarNo++;
    if(this.editMember.avatarNo > 18)
      this.editMember.avatarNo -= 18;
  }

  avatarBackward() {
    this.editMember.avatarNo--;
    if(this.editMember.avatarNo < 1)
      this.editMember.avatarNo += 18;
  }

  isDriverChanged() {
    this.editMember.driver = !this.editMember.driver;
    console.log(this.editMember.driver);
  }

  toggleMode() {
    if(this.changeMode)
      this.savePerson();
    this.changeMode = !this.changeMode;
  }

  savePerson(){
    if(this.mode === 'edit') {
      this.apiProvider.updateTeamMember(this.teamId, this.editMember);
      this.aToastOnASuccessfulSave('Änderungen gespeichert.');
    } else {
      console.log(this.editMember.avatarNo);
      this.apiProvider.registerNewDriver(this.teamId, this.editMember).then(data => {
        console.log(data['avatarNo']);
        Object.assign(this.editMember, data);
        this.aToastOnASuccessfulSave('Neues Teammitglied angelegt.')
      });
      this.mode = 'edit';
    }
    console.log('saved');
  }

  aToastOnASuccessfulSave(msg: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2500
    });
    toast.present();
  }

}

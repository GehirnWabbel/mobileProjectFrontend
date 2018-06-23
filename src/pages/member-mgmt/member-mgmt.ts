import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
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

  member; //data of person to be edited

  colorDefinitions;

  teamId;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private apiProvider : ApiServiceProvider,
    private storage : Storage
  ) {
    this.storage.get("teamId").then(val => {
      this.teamId = val;
    });
    this.member = this.navParams.data;
    this.colorDefinitions = colorDefinitions;
  }

  static ionViewDidLoad() {
    console.log('ionViewDidLoad MemberMgmtPage');
  }

  ionViewCanLeave() {
    if(this.changeMode)
      return this.confirmLeaveWhenInChangeMode();
    else
      return true;
  }

  colorForward() {
      this.member.color++;
      if(this.member.color > 17)
        this.member.color -= 17;
  }

  colorBackward() {
    this.member.color--;
    if(this.member.color < 0)
      this.member.color += 17;
  }

  avatarForward() {
    this.member.avatarNo++;
    if(this.member.avatarNo > 18)
      this.member.avatarNo -= 18;
  }

  avatarBackward() {
    this.member.avatarNo--;
    if(this.member.avatarNo < 1)
      this.member.avatarNo += 18;
  }

  isDriverChanged() {
    this.member.driver = !this.member.driver;
    console.log(this.member.driver);
  }

  toggleMode() {
    if(this.changeMode)
      this.savePerson();
    this.changeMode = !this.changeMode;
  }

  savePerson(){
    this.apiProvider.updateTeamMember(this.teamId, this.member);
    console.log('saved');
  }

  confirmLeaveWhenInChangeMode() : Promise<boolean> {
    let confirm = this.alertCtrl.create({
      title: 'Änderungen verwerfen?',
      // message: '',
      buttons: [
        {
          text: 'Ja',
          handler: () => {
            console.log('Ja clicked, discarding changes');
          }
        },
        {
          text: 'Nein',
          handler: () => {
            console.log('Nein clicked');
          }
        }
      ]
    });
    return confirm.present();
  }

}

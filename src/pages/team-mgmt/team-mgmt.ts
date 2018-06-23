import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular';
import { Storage } from "@ionic/storage";
import {ApiServiceProvider} from "../../providers/api-service/api-service";
import {MemberMgmtPage} from "../member-mgmt/member-mgmt";

/**
 * Generated class for the TeamMgmtPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-team-mgmt',
  templateUrl: 'team-mgmt.html',
})
export class TeamMgmtPage {

  teamId;

  allDrivers = [];
  allManagements = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public toastCtrl: ToastController,
              private apiProvider: ApiServiceProvider,
              private storage: Storage) {
    console.log('constructor')
    this.storage.get("teamId").then(val => {
      this.teamId = val;
      this.reloadTeamData();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TeamMgmtPage');
  }

  ionViewWillEnter() {
    console.log('will enter');
  }

  ionViewDidEnter(){
    console.log('did enter');
    if(this.teamId != null)
      this.reloadTeamData();
  }

  parseTeamMember(data: any){
    let allMember = data as Array<any>;
    for (let i=0; i < allMember.length; i++){
      let member = allMember[i];
      if(member.driver)
        this.allDrivers.push(member);
      else
        this.allManagements.push(member);
    }
  }

  navToPersonMgmtEditMode(person: any) {
    this.navCtrl.push(MemberMgmtPage, {
      person: person,
      mode: 'edit'
    })
      .catch(() => {})//catch error occuring when dismissing changes
  }

  navToPersonMgmtNewMode(person: any) {
    this.navCtrl.push(MemberMgmtPage, {
      person: person,
      mode: 'new'
    })
  }


  addTeamMember() {
    this.navToPersonMgmtNewMode({
      name: "",
      driver: true,
      connectedViaDevice: false,
      color: 1,
      avatarNo: 1,
      minutesBeforeNotification: 30
    });
  }

  removeTeamMember(person: any) {
    this.apiProvider.removeTeamMember(this.teamId, person).then(data => {
      this.reloadTeamData();
      this.showToast('Teammitglied \"' + person.name + '\" gelöscht.');
    });
  }

  reloadTeamData() {
    this.allDrivers = [];
    this.allManagements = [];
    this.apiProvider.getAllTeamMember(this.teamId).then(data => {
      this.parseTeamMember(data);
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

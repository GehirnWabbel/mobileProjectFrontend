import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  ModalController,
  PopoverController,
  NavParams,
  ToastController
} from 'ionic-angular';
import { SocialSharing} from "@ionic-native/social-sharing";
import { Storage } from "@ionic/storage";
import {ApiServiceProvider} from "../../providers/api-service/api-service";
import {MemberMgmtPage} from "../member-mgmt/member-mgmt";
import {TeamMgmtPopoverPage} from "../team-mgmt-popover/team-mgmt-popover";

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
  teamName;

  allDrivers = [];
  allManagements = [];

  constructor(public navCtrl: NavController,
              public modalCtrl: ModalController,
              public popoverCtrl: PopoverController,
              public navParams: NavParams,
              public toastCtrl: ToastController,
              private apiProvider: ApiServiceProvider,
              private storage: Storage,
              private sharing: SocialSharing) {
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
      mode: 'edit',
      allowCancel: true
    })
      .catch(() => {})//catch error occuring when dismissing changes
  }

  navToPersonMgmtNewMode(person: any) {
    const addModal = this.modalCtrl.create(MemberMgmtPage, {
      person: person,
      mode: 'new',
      allowCancel: true
    });
    addModal.present();
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

  inviteTeamMember() {
    this.sharing.shareWithOptions({
      subject: "Tritt Team " + this.teamName + " bei!",
      url: "https://racemanager-mobile-project.herokuapp.com/join?teamid=" + this.teamId + "&teamname=" + this.teamName,
    }).then(result => {
      console.log("Sharing completed? " + result.completed);
      console.log("Shared to app: " + result.app);
    }).catch(error => {
      console.log("Sharing Failed: " + error);
    });
  }

  reloadTeamData() {
    this.allDrivers = [];
    this.allManagements = [];
    this.apiProvider.getTeam(this.teamId).then(data => {
      this.teamName = data["teamName"];
      this.parseTeamMember(data["members"]);
    });
  }

  showToast(msg :string){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2500
    });
    toast.present();
  }

  showPopoverMenu(event){
    const popover = this.popoverCtrl.create(TeamMgmtPopoverPage, {
      teamId: this.teamId,
      teamName: this.teamName
    },{
      cssClass: 'popover-resize'
    });
    popover.present({
      ev: event
    })
  }

}

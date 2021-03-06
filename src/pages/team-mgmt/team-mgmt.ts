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
import {CreateTeamPage} from "../create-team/create-team";

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
  memberId;
  teamName;

  allDrivers = [];
  allManagements = [];

  finishedStorageLoading = false;
  isLoading = false;

  constructor(public navCtrl: NavController,
              public modalCtrl: ModalController,
              public popoverCtrl: PopoverController,
              public navParams: NavParams,
              public toastCtrl: ToastController,
              private apiProvider: ApiServiceProvider,
              private storage: Storage,
              private sharing: SocialSharing) {
    this.storage.get("teamId").then(val => {
      console.log("Team Management: Found TeamId in storage: " + val);
      this.teamId = val;
      this.storage.get("memberId").then(memberVal => {
        this.memberId = memberVal;
        this.finishedStorageLoading = true;
        this.reloadTeamData();
      });
    });
  }

  ionViewDidEnter(){
    console.log('Team Management: did enter, loading team data');
    this.reloadTeamData();
  }

  parseTeamMember(data: any){
    let allMember = data as Array<any>;
    for (let i=0; i < allMember.length; i++){
      let member = allMember[i];
      if(!member.active)
        continue;
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
    this.apiProvider.removeTeamMember(this.teamId, person, this.memberId).then(data => {
      console.log("Team Management: Remove Done");
      this.reloadTeamData();
      this.showToast('Teammitglied \"' + person.name + '\" gelöscht.');
    }).catch(reason => {
      console.log("Team Management: Error removing team member");
      console.dir(reason);
      this.reloadTeamData();
    });
  }

  inviteTeamMember() {
    this.sharing.shareWithOptions({
      subject: "Tritt Team " + this.teamName + " bei!",
      url: "https://racemanager-mobile-project.herokuapp.com/join?teamid=" + this.teamId + "&teamname=" + encodeURI(this.teamName),
    }).then(result => {
      console.log("Team Management: Sharing completed? " + result.completed);
      console.log("Team Management: Shared to app: " + result.app);
    }).catch(error => {
      console.log("Team Management: Sharing Failed: " + error);
    });
  }

  reloadTeamData() {
    if(this.finishedStorageLoading && !this.isLoading) {
      this.isLoading = true;
      this.allDrivers = [];
      this.allManagements = [];
      this.apiProvider.getTeam(this.teamId, this.memberId).then(data => {
        this.teamName = data["name"];
        console.log("Team Management: Loaded Team: " + this.teamName);
        this.parseTeamMember(data["members"]);
        this.isLoading = false;
      }).catch(reason => {
        console.log("Team Management: run to error while refrehing team data; assuming user has been remove from team");
        this.storage.clear().then(() => {
          this.isLoading = false;
          this.navCtrl.setRoot(CreateTeamPage);
        });
      });
    }
  }

  refreshTeamData(refresher) {
    this.reloadTeamData();
    refresher.complete();
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
      teamName: this.teamName,
      memberId: this.memberId
    },{
      cssClass: 'popover-resize'
    });
    popover.present({
      ev: event
    })
  }
}

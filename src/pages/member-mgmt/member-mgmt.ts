import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  ToastController, ViewController
} from 'ionic-angular';
import {ApiServiceProvider} from "../../providers/api-service/api-service";
import { colorDefinitions } from "../../app/colordefinitions";
import { Storage } from "@ionic/storage";
import {EventsPage} from "../events/events";
import {CreateTeamPage} from "../create-team/create-team";


@IonicPage()
@Component({
  selector: 'page-member-mgmt',
  templateUrl: 'member-mgmt.html',
})
export class MemberMgmtPage {

  allowCancel: boolean = true;
  changeMode: boolean = false;
  mode: string = 'edit';

  editMember;

  colorDefinitions;

  teamId;
  memberId;
  notificationId;

  constructor(
    public navCtrl: NavController,
    public viewCrtl: ViewController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    private apiProvider : ApiServiceProvider,
    private storage : Storage
  ) {
    if (this.navParams.data.teamId) {
      this.teamId = this.navParams.data.teamId;
      console.log("Member Mgmt: Found passed TeamId: " + this.teamId)
    }else {
      this.storage.get("teamId").then(val => {
        this.teamId = val;
        console.log("Member Mgmt: Found stored TeamId: " + this.teamId);
      });
    }
    if(this.navParams.data.memberId) {
      this.memberId = this.navParams.data.memberId;
      console.log("Member Mgtm: Found passed memberId: " + this.memberId);
    }else {
      this.storage.get("memberId").then(val => {
        this.memberId = val;
        console.log("Member Mgmt: Found stored memberId: " + this.memberId);
      });
    }

    this.storage.get("notificationId").then(notificationId => {
      this.notificationId = notificationId;
    });

    this.mode = this.navParams.data.mode;
    if(this.mode === 'new')
      this.changeMode = true;
    this.allowCancel = this.navParams.data.allowCancel;
    this.editMember = Object.assign({}, this.navParams.data.person); //copy member object for editing to not have changed original reference when leaving with discarding changes
    this.colorDefinitions = colorDefinitions;

    console.log("Member Mgmt: mode: " + this.mode + "; changeMode: " + this.changeMode + "; allowCancle: " + this.allowCancel);
    console.log("Member Mgmt: person: " + this.editMember);
  }

  static ionViewDidLoad() {
    console.log('Member Mgmt: ionViewDidLoad MemberMgmtPage');
  }

  ionViewCanLeave() {
    if (this.changeMode) {
      if(!this.allowCancel)
        return false;

      let confirm = this.alertCtrl.create({
        title: 'Änderungen speichern?',
        // message: '',
        buttons: [
          {
            text: 'Verwerfen',
            handler: () => {
              console.log('Member Mgmt: Ja clicked, discarding changes');
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
              console.log('Member Mgmt: Nein clicked');
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
    if(this.editMember.avatarNo > 11)
      this.editMember.avatarNo -= 11;
  }

  avatarBackward() {
    this.editMember.avatarNo--;
    if(this.editMember.avatarNo < 1)
      this.editMember.avatarNo += 11;
  }

  isDriverChanged() {
    this.editMember.driver = !this.editMember.driver;
    console.log(this.editMember.driver);
  }

  toggleMode() {
    if(this.changeMode) {
      this.savePerson();
    }else {
      this.changeMode = true;
    }
  }

  savePerson(){
    console.log("Going to save Person: " + JSON.stringify(this.editMember));
    if(this.mode === 'edit') {
      this.apiProvider.updateTeamMember(this.teamId, this.editMember, this.memberId).catch(reason => {
        console.log("Member Management: Update failed!");
        console.dir(reason);
        this.storage.clear().then(() => {
          console.log("Member Management: Storage cleared!");
          this.navCtrl.setRoot(CreateTeamPage);
        });
      });
      this.aToastOnASuccessfulSave('Änderungen gespeichert.');
      this.changeMode = false;
    } else {
      console.log(this.editMember.avatarNo);

      this.editMember['notificationId'] = this.notificationId;

      this.apiProvider.registerNewDriver(this.teamId, this.editMember).then(data => {
        console.log(data['avatarNo']);
        if(!this.allowCancel) { //we came from join team or create team and need to know which team member id belongs to this phone
          this.storage.set("memberId", data['_id']);
          console.log("Member Mgmt: New memberId stored: " + data["_id"]);
        }
        Object.assign(this.editMember, data);
        this.aToastOnASuccessfulSave('Neues Teammitglied angelegt.');

        this.changeMode = false;

        if(this.allowCancel) // cancel is permitted if a new member joins the team and if a new team is created; then one wants to land on the event page not the team overview page
          this.viewCrtl.dismiss(); //back to where we came from
        else {
          this.navCtrl.setRoot(EventsPage);
        }

      }).catch(reason => {
        console.log("Member Management: Creation failed!");
        console.dir(reason);
        this.storage.clear().then(() => {
          console.log("Member Management: Storage cleared!");
          this.navCtrl.setRoot(CreateTeamPage);
        });
      });
    }
    console.log('Member Mgmt: saved team member');
  }

  aToastOnASuccessfulSave(msg: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2500
    });
    toast.present();
  }

  cancelCreationModal() {
    this.viewCrtl.dismiss();
  }

}

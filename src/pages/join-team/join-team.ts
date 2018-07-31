import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { Storage } from '@ionic/storage';
import {EventsPage} from "../events/events";
import {CreateTeamPage} from "../create-team/create-team";
import {RootPageDeterminer} from "../../app/RootPageDeterminer";

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

  storageTeamId: string;
  storageMemberId: string;
  checkAlreadyStoredIdsCalled = 0;

  notificationId: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private apiProvider: ApiServiceProvider,
              private storage: Storage,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController,
              private api: ApiServiceProvider) {

    console.log("Join Team: " + navParams);
    this.teamNameUI = "Team: " + navParams.get("teamName");
    this.teamName = navParams.get("teamName");
    this.teamId = navParams.get("teamId");

    if(this.teamId === undefined || this.teamId === null) {
      console.log("Join Team: No TeamId found. Cannot Join Team.");
      this.navCtrl.setRoot(CreateTeamPage); //redirect to create team
      return;
    }

    //check whether a teamId is already stored on the device
    this.storage.get("teamId").then(val => {
      console.log("Join Team: Found existing teamId: " + val);
      this.storageTeamId = val;
      this.checkAlreadyStoredIds();
    });

    this.storage.get("memberId").then(val => {
      console.log("Join Team: Found existing memberId: " + val);
      this.storageMemberId = val;
      this.checkAlreadyStoredIds();
    });

    this.storage.get("notificationId").then(notificationId => {
      this.notificationId = notificationId;
    });

    console.log('Join Team: TeamId: '+this.teamId);
    console.log('Join Team: teamName:'+this.teamName);
  }

  ionViewDidLoad() {
    console.log('Join Team: ionViewDidLoad JoinTeamPage');
  }

  checkAlreadyStoredIds() {
    ++this.checkAlreadyStoredIdsCalled;
    if(this.checkAlreadyStoredIdsCalled >= 2){
      if(this.storageTeamId){
        if (this.teamId === this.storageTeamId) {
          if (this.storageMemberId) {
            //already part of team -> redirect to events
            this.navCtrl.setRoot(EventsPage);
            this.showToast("Du bist bereits teil des Teams!");
            return;
          } else {
            //saved teamId but no memberid is known -> stay here -> do nothing
            return;
          }
        } else {
          //teamIds are unequal
          this.showUnequalTeamIdsConfirm(
            () => {
              //no team change wanted -> call root page determiner
              RootPageDeterminer.determineAndNavigateToRootPage(this.navCtrl, this.storageTeamId, this.storageMemberId);
            }, () => {
              //'delete' from old team and add to new team
              if (this.storageMemberId)
                this.transferTeamMember();
              else {
                //stay here to join the new team
                return;
              }
            }
          );
        }
      }
    }
  }

  updateCheckbox() {
    return null;
  }

  joinTeam(){



    if(this.isDriver != true){
      if(typeof this.driverName != 'undefined' && typeof this.notification != 'undefined' ){
        console.log("Join Team: Anmeldung als User, nicht als Fahrer!");
        let color = Math.floor(Math.random() * 17) + 1;
        let colorNumber = Math.round(color);
        let newUser = "{ \"name\":\"" + this.driverName + "\", \"connectedViaDevice\": true, \"avatarNo\":10, \"driver\": false, \"color\": " + colorNumber + ", \"minutesBeforeNotification\": " + this.notification + ", \"notificationId\": \"" + this.notificationId + "\" }";

        console.log(newUser);

        if(this.teamId != undefined ){
          this.apiProvider.registerNewDriver(this.teamId, newUser).then(data => {
            console.log("Join Team: MemeberId: " + data["_id"]);
            this.storage.set("memberId", data["_id"]).then(data => {
              this.navCtrl.setRoot(EventsPage);
            });
          }).catch(reason => {
            this.errorHandling(reason);
          });
        }
      }
    }
    else {
      //New Driver is connected with device
      if(typeof this.driverName != 'undefined' && typeof this.notification != 'undefined' ){
        console.log("Anmeldung als Fahrer!");
        let color = Math.floor(Math.random() * 17) + 1;
        let colorNumber = Math.round(color);
        let newDriver = "{ \"name\":\"" + this.driverName + "\", \"connectedViaDevice\": true, \"avatarNo\":10, \"driver\": true, \"color\": " + colorNumber + ", \"minutesBeforeNotification\": " + this.notification + ", \"notificationId\": \"" + this.notificationId + "\" }";

        console.log(newDriver);

        this.apiProvider.registerNewDriver(this.teamId, newDriver).then(data => {
          console.log("Join Team: MemberId: " + data["_id"]);
          this.storage.set("memberId", data["_id"]).then(data => {
            this.navCtrl.setRoot(EventsPage);
          });
        }).catch(reason => {
          this.errorHandling(reason);
        });
      }
    }

    this.storage.set('teamId', this.teamId ).then(() => {

      console.log("Join Team: Team Id: " + this.teamId + " saved in local storage." );
    });
  }

  jumpDirectlyToEvents(){
    this.navCtrl.setRoot(EventsPage);
  }

  showToast(msg :string){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2500
    });
    toast.present();
  }

  showUnequalTeamIdsConfirm(decline, accept) {
    const confirm = this.alertCtrl.create({
      title: 'Team wechseln?',
      message: 'Du bist bereits Teil eines Teams! Willst du dein aktuelles Team Verlassen und dem neuen Team beitreten?',
      buttons: [
        {
          text: 'Nein, niemals!',
          handler: decline
        },
        {
          text: 'Ja, ich will!',
          handler: accept
        }
      ]
    });
    confirm.present();
  }

  transferTeamMember() {
    //1. get member data
    //2. delete on old team
    //3. register on new team with same data
    console.log("Join Team: Transfere to start ...");
    this.api.getSingleTeamMember(this.storageTeamId, this.storageMemberId, this.storageMemberId).then(data => {
      console.log("Join Team: Transfere: Recieved member data");
      console.log(JSON.stringify(data));
      this.api.removeTeamMember(this.storageTeamId, data, this.storageMemberId).then(removeData => {
        console.log('Join Team: Transfere: Deactivated Member in old team.');
        delete data['_id'];
        this.api.registerNewDriver(this.teamId, data).then(result => {
          console.log("Join Team: Transfere: Registered to the new Team with same member data");
          //4. save the new teamId to storage and navigate to events
          this.storage.set('teamId', this.teamId).then( () => {
            console.log("Join Team: Transfere: Saved new TeamId: " + this.teamId);
            this.storage.set('memberId', result['_id']).then(() => {
              console.log("Join Team: Transfere: Saved new MemberId: " + result['_id']);
              console.log("Join Team: Transfere: Going to nav to the Events Page");
              this.navCtrl.setRoot(EventsPage);
            })
          })
        }).catch(reason => this.errorHandling(reason));
      }).catch(reason => this.errorHandling(reason));
    }).catch(reason => this.errorHandling(reason));
  }

  errorHandling(reason) {
    console.log("Join Team: Failed to create team Member");
    console.dir(reason);
    this.storage.clear().then(() => {
      this.navCtrl.setRoot(CreateTeamPage);
    })
  }

}

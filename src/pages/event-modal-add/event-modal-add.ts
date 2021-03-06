import { Component } from '@angular/core';
import {Events, NavParams, ViewController, NavController} from 'ionic-angular';
import {ApiServiceProvider} from "../../providers/api-service/api-service";
import { ToastController } from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {CreateTeamPage} from "../create-team/create-team";
import moment from 'moment';

/**
 * Generated class for the EventModalAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-event-modal-add',
  templateUrl: 'event-modal-add.html',
})
export class EventModalAddPage {
  track: string;
  raceTime: string;
  raceDays: number;
  kartFull: number;
  kartEmpty: number;
  eventName: string;
  address: string;
  picture: string;
  teamId: string;
  memberId: string;

  constructor(
    public view: ViewController,
    public apiProvider: ApiServiceProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    private toastCtrl: ToastController,
    private ionEvents: Events,
    private storage: Storage
  ) {
    if(this.navParams.get('edit') == true){
      this.eventName = this.navParams.get('name');
      this.raceTime = moment(this.navParams.get('start')).format();
      this.track = this.navParams.get('track');
      this.track = this.track.toLowerCase();
      this.raceDays = this.navParams.get('days');
      this.kartFull = this.navParams.get('kartWeightWithFuel');
      this.kartEmpty = this.navParams.get('kartWeightWithoutFuel');
      this.teamId = navParams.get('teamId');
      this.memberId = this.navParams.get("memberId");
    }
    else{
      this.raceTime = moment().format();
      this.teamId = navParams.get('teamId');
      this.memberId = this.navParams.get("memberId");
    }

    console.log("Soll locale sein Datum: " + this.raceTime);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventModalAddPage');
  }

  addEvent(){

    //check if fields are filled
    if(this.track == undefined || this.raceDays == undefined || this.raceTime == undefined ||
        this.kartFull == undefined || this.kartEmpty == undefined || this.eventName == undefined ||
        this.track == "" || this.raceDays == 0 || this.raceTime == "" ||
        this.kartFull == 0 || this.kartEmpty == 0 || this.eventName == ""){

      this.presentToast("Please fill in all required fields")
    }
    else{
      //expected to have all values filled
      switch (this.track){

        //no coordinates because json will be broken
        case "ch": {
          this.address = "Dřenice 13, 350 02 Cheb, Tschechien";
          this.picture = "cheb.png";
          break;
        }
        case "op": {
          this.address = "Stefan Bellof-Straße 1, 35418 Buseck";
          this.picture = "oppenrod.png";
          break;
        }
        case "wi": {
          this.address = "Waldensberger Str. 57, 63607 Wächtersbach";
          this.picture = "wittgenborn.png";
          break;
        }
        case "wa": {
          this.address = "Industriestraße 8, 92442 Wackersdorf";
          this.picture = "wackersdorf.png";
          break;
        }
        case "li": {
          this.address = "Kartbahnring 1, 76706 Dettenheim";
          this.picture = "liedolsheim.png";
          break;
        }
        case "te": {
          this.address = "Carl-Friedrich-Benz-Straße 2, 17268 Templin";
          this.picture = "templin.png";
          break;
        }
        case "ni": {
          this.address = "Flugplatzweg 6, 14913 Niedergörsdorf";
          this.picture = "niedergoersdorf.png";
          break;
        }
      }

      //format date
      let date = moment.utc(this.raceTime).format();
      console.log("Soll UTC sein Datum: " + date);

      let eventJson = "{\"name\":\"" + this.eventName  +"\",\"startdate\": \"" + date +
        "\",\"location\": \""+ this.address +"\",\"noRaceDays\": "+ this.raceDays +",\"picturePath\": \""+
        this.picture +"\",\"kartWeightWithFuel\": "+ this.kartFull +",\"kartWeightWithoutFuel\": "+
        this.kartEmpty +"}";

      if((this.navParams.get('edit')) == true){

        this.apiProvider.editEvent(eventJson, this.teamId, this.navParams.get('eventId'), this.memberId).then( data =>
          {
            this.ionEvents.publish('event:edit');
            this.closeAddModal();
            this.presentToast('Event editiert');
          }
        ).catch(reason => this.errorHandling(reason));
      }

      else {

        this.apiProvider.createEvent(eventJson, this.teamId, this.memberId).then( data => {
          this.ionEvents.publish('event:create');
          this.closeAddModal();
          this.presentToast('Event erstellt');
        }).catch(reason => this.errorHandling(reason));
      }

    }
  }

  errorHandling(reason) {
    console.log("Events Add: Failed to create Event!");
    console.dir(reason);
    this.storage.clear().then(() => {
      this.navCtrl.setRoot(CreateTeamPage);
    })
  }

  closeAddModal() {
    this.view.dismiss();
  }

  presentToast(text: string) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
     //do nothing
    });

    toast.present();
  }

}

import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {ApiServiceProvider} from "../../providers/api-service/api-service";
import { EventsPage } from "../events/events";
import { ToastController } from 'ionic-angular';

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

  constructor(
    public view: ViewController,
    public apiProvider: ApiServiceProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    private toastCtrl: ToastController
  ) {
    this.teamId = navParams.get('teamId');
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

        case "ch": {
          this.address = "Kartarena Cheb, 50°05'1\"N 12°26'E, 58 9, 350 02 Odrava, Tschechien";
          this.picture = "cheb.png";
          break;
        }
        case "op": {
          this.address = "Stefan Bellof-Straße 1, 35418 Buseck";
          this.picture = "oppenrod.png";
          break;
        }
        case "wi": {
          this.address = "50°17'23.9\"N 9°16'47.1\"E";
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
      let date = new Date(this.raceTime);
      let convertDate = date.toISOString();

      let newEventJson = "{\"name\":\"" + this.eventName  +"\",\"startdate\": \"" + convertDate +
        "\",\"location\": \""+ this.address +"\",\"noRaceDays\": "+ this.raceDays +",\"picturePath\": \""+
        this.picture +"\",\"kartWeightWithFuel\": "+ this.kartFull +",\"kartWeightWithoutFuel\": "+
        this.kartEmpty +"}";

      this.apiProvider.createEvent(newEventJson, this.teamId);
      this.navCtrl.setRoot(EventsPage);
    }
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

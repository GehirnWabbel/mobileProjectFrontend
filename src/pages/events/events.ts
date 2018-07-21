import { Component } from "@angular/core";
import {IonicPage, ModalController, NavController, NavParams} from "ionic-angular";
import { ApiServiceProvider } from "../../providers/api-service/api-service";
import { Storage } from "@ionic/storage";
import { PlanningPage } from "../planning/planning";
import { EventModalAddPage } from "../event-modal-add/event-modal-add";
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { AlertController } from 'ionic-angular';

/**
 * Generated class for the EventsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-events",
  templateUrl: "events.html"
})
export class EventsPage {
  private allEvents: Array<any>;
  teamId: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private apiProvider: ApiServiceProvider,
    private storage: Storage,
    private nav: LaunchNavigator,
    private modal: ModalController,
    private alert: AlertController
  ) {
    this.storage.get("teamId").then(val => {
      this.teamId = val;
      this.apiProvider.getEvents(this.teamId).then(data => {
        this.allEvents = this.convertData(data);
      });
    });
  }

  private convertData(data: any) {
    this.allEvents = data as Array<any>;
    EventsPage.formatDate(this.allEvents);
    return this.allEvents;
  }

  private static formatDate(data: any) {
    for (let i = 0; i < data.length; i++) {
      let fullDate = new Date(data[i].startdate);
      data[i].date =
        fullDate.getDate() +
        "." +
        (fullDate.getMonth() + 1) +
        "." +
        fullDate.getFullYear();
      // data[i].time = fullDate.getHours() + ':' + fullDate.getMinutes();
    }
  }

  navToPlanningPage(event: any) {
    this.storage.set("eventId", event._id);
    console.log("Event Id: " + event._id + " saved in local storage.");
    this.navCtrl.setRoot(PlanningPage);
  }

  openAddEventModal(){
    const addModal = this.modal.create(EventModalAddPage, {'teamId': this.teamId
    });
    addModal.present();
  }

  // Pull to refresh
  doRefresh(refresher) {
    this.apiProvider.getEvents(this.teamId).then(data => {
      this.allEvents = this.convertData(data);
    });
    refresher.complete();
  }

  deleteEvent(event: any){
    let alert = this.alert.create({
      title: 'Soll dieses Event wirklich gelöscht werden?',
      message: 'Das Löschen eines Events lässt sich nicht rückgängig machen!',
      buttons: [
        {
          text: 'Abbrechen',
          handler: () => {
            console.log('Delete cancelled');
          }
        },
        {
          text: 'Löschen',
          handler: () => {
            console.log('Delete Event: ' + event._id);
            this.apiProvider.deleteEvent(event._id, this.teamId);
          }
        }
      ]
    });
    alert.present();
  }

  navigateToEvent(event: any){
    this.nav.navigate(event.location);

  }
}

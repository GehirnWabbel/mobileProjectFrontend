import { Component } from "@angular/core";
import {Events, IonicPage, ModalController, NavController, NavParams, Platform} from "ionic-angular";
import { ApiServiceProvider } from "../../providers/api-service/api-service";
import { Storage } from "@ionic/storage";
import { PlanningPage } from "../planning/planning";
import { EventModalAddPage } from "../event-modal-add/event-modal-add";
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { AlertController } from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import {CreateTeamPage} from "../create-team/create-team";

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
  memberId: string;
  activeMenu: string;
  trackList: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private apiProvider: ApiServiceProvider,
    private storage: Storage,
    private nav: LaunchNavigator,
    private modal: ModalController,
    private alert: AlertController,
    public menu: MenuController,
    private ionEvents: Events,
    private platform: Platform
  ) {
    this.storage.get("teamId").then(val => {
      this.teamId = val;
      this.storage.get("memberId").then(memberVal => {
        this.memberId = memberVal;
        this.apiProvider.getEvents(this.teamId, this.memberId).then(data => {
          this.allEvents = this.convertData(data);
        }).catch(reason => {
          console.log("Events: Failed to load Events");
          console.dir(reason);
          this.storage.clear().then(() => {
            this.navCtrl.setRoot(CreateTeamPage);
          })
        });
      });
    });
    this.activeMenu = 'menu1';
    this.menu.swipeEnable(false, this.activeMenu);

    this.platform.registerBackButtonAction(() => {
      //sometimes the best thing you can do is not think, not wonder, not imagine, not obsess.
      //just breathe, and have faith that everything will work out for the best.
    },1);

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
    this.menu.swipeEnable(true, this.activeMenu);
    this.storage.set("eventId", event._id);
    console.log("Event Id: " + event._id + " saved in local storage.");
    this.navCtrl.push(PlanningPage);
  }

  openAddEventModal(){
    const addModal = this.modal.create(EventModalAddPage, {'teamId': this.teamId, "memberId": this.memberId});
    addModal.present();
  }

  // Pull to refresh
  doRefresh(refresher) {
    this.refreshEventPage();
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
            this.apiProvider.deleteEvent(event._id, this.teamId, this.memberId)
              .catch(reason => {
                console.log("Events: Failed to Delete Event");
                console.dir(reason);
                this.storage.clear().then(() => {
                  this.navCtrl.setRoot(CreateTeamPage);
                });
              });
            this.allEvents = this.allEvents.filter( el => el._id !== event._id );

          }
        }
      ]
    });
    alert.present();
  }

  navigateToEvent(event: any){
    this.menu.swipeEnable(true, this.activeMenu);
    this.nav.navigate(event.location);
  }

  editEvent(event: any) {
    this.trackList = event.picturePath.substring(0, 2);
    this.openEditEventModal(event);
  }

  openEditEventModal(event: any) {
    const editModal = this.modal.create(EventModalAddPage, {
      'edit': true,
      'name' : event.name,
      'start' : event.startdate,
      'track' : this.trackList,
      'days' : event.noRaceDays,
      'kartWeightWithFuel' : event.kartWeightWithFuel,
      'kartWeightWithoutFuel' : event.kartWeightWithoutFuel,
      'eventId': event._id,
      'teamId' : this.teamId
    });
    editModal.present();
  }

  ionViewWillEnter(){
    this.ionEvents.subscribe('event:edit', eventData => {
      console.log("Event:edit");
      this.refreshEventPage();
    });
    this.ionEvents.subscribe('event:create', eventData => {
      console.log('Event:crate');
      this.refreshEventPage();
    })
  }

  private refreshEventPage() {
    this.apiProvider.getEvents(this.teamId, this.memberId).then(data => {
      this.allEvents = this.convertData(data);
    }).catch(reason => {
      console.log("Events: failed to load the events");
      console.dir(reason);
      this.storage.clear().then(() => {
        this.navCtrl.setRoot(CreateTeamPage);
      });
    });
  }
}

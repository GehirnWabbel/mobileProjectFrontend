import { Component } from "@angular/core";
import {
  ViewController,
  NavParams,
  NavController,
  ToastController,
  Events
} from "ionic-angular";
import { ApiServiceProvider } from "../../providers/api-service/api-service";
import { PlanningPage } from "../planning/planning";

@Component({
  selector: "page-planning-modal-add",
  templateUrl: "planning-modal-add.html"
})
export class PlanningModalAddPage {
  eventId: string;
  teamId: string;
  allStints: Array<any>;
  allDrivers: Array<any>;
  currentEvent: any;

  // stint attributes
  raceday: number;
  selectedDriver: any;
  starttime: string = new Date().toISOString();
  endtime: string = new Date().toISOString();
  duration: string;
  tagsArray = [];
  kartTag: string;
  weatherTag: string;
  flagTag: string;
  existingStint: any;
  existingStintUpdated: any;

  private starttimeISO = new Date();
  private durationISO = new Date();
  private endtimeISO = new Date();

  constructor(
    public view: ViewController,
    public apiProvider: ApiServiceProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public ionEvents: Events,
    private toastCtrl: ToastController
  ) {
    this.allStints = navParams.get("allStints");
    this.allDrivers = navParams.get("allDrivers");
    this.teamId = navParams.get("teamId");
    this.eventId = navParams.get("eventId");

    // get existing stint data
    this.existingStint = this.navParams.get("existingStint");
    let existingStintDuration = this.navParams.get("duration");


    if (this.existingStint != undefined) {
      console.log("Existing stint received: " + this.existingStint);
      // if we received an existing stint fill UI inputs with existing stint values
      this.starttime = this.existingStint.startdate;
      this.endtime = this.existingStint.enddate;
      let durationFloat = existingStintDuration;
      this.duration = parseInt(durationFloat).toString();
      this.selectedDriver = this.existingStint.driver;
      this.kartTag = this.existingStint.tags[0];
      this.weatherTag = this.existingStint.tags[1];
      this.flagTag = this.existingStint.tags[2];

    } else {
      console.log("Ready to create a new Stint");
      this.selectedDriver = { name: "wähle einen Fahrer" };
      this.tagsArray = [];
    }

    // get current event
    this.apiProvider.getSingleEvent(this.teamId, this.eventId).then(data => {
      this.currentEvent = data as Array<any>;
    });
  }

  closeAddModal() {
    this.view.dismiss();
  }

  presentToast(toastMessage: string) {
    let toast = this.toastCtrl.create({
      message: toastMessage,
      duration: 3000,
      position: "top"
    });

    toast.onDidDismiss(() => {
      console.log("Dismissed toast");
    });

    toast.present();
  }

  // calculate the difference between two dates
  calcDate(date1,date2) {
    var diff = Math.floor(date1.getTime() - date2.getTime());
    var day = 1000 * 60 * 60 * 24;

    var days = Math.floor(diff/day);
    // var months = Math.floor(days/31);
    // var years = Math.floor(months/12);

    // var message = date2.toDateString();
    // message += " was "
    // message += days + " days "
    // message += months + " months "
    // message += years + " years ago \n"

    return days;
  }

  // Split e.g. "12:30" in 12 Hours and 30 minutes and define date object
  setDateTime(date, time) {
    let index = time.indexOf(":");
    let hours = time.substring(0, index);
    let minutes = time.substring(index + 1);

    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);

    return date;
  }

  newStint() {
    if (this.existingStint != undefined) {
      // start editing routine
      this.editStintInModal();
    } else {


      // starttime
      this.setDateTime(this.starttimeISO, this.starttime);

      // format duration from minutes to hour and minutes in ISO format
      let durationNumber = parseInt(this.duration);
      if (durationNumber >= 60) {
        this.durationISO.setHours(1);
        this.durationISO.setMinutes(durationNumber - 60);
      } else {
        this.durationISO.setHours(0);
        this.durationISO.setMinutes(durationNumber);
      }

      // set endtimeISO
      this.endtimeISO.setHours(
        this.starttimeISO.getHours() + this.durationISO.getHours()
      );
      this.endtimeISO.setMinutes(
        this.starttimeISO.getMinutes() + this.durationISO.getMinutes()
      );

      // calculate raceday of new stint
      let eventStartdate = new Date(this.currentEvent.startdate);
      // let testDate  = new Date("2018-07-30T01:26:54.686Z");

      this.raceday = this.calcDate(this.starttimeISO, eventStartdate);


      // tags
      this.tagsArray[0] = this.kartTag;
      this.tagsArray[1] = this.weatherTag;
      this.tagsArray[2] = this.flagTag;

      // Outputs
      console.log("#################### NEW STINT DATA ########################");
      // console.log("Startzeit: " + this.starttime);
      console.log("Geplante Startzeit: " + this.starttimeISO);
      // console.log("Dauer: " + this.duration);
      console.log("Geplante Fahrzeit in Stunden: " + this.durationISO.getHours());
      console.log("Geplante Fahrzeit in  Minuten: " + this.durationISO.getMinutes());
      // console.log("DauerISO Gesamt: " + this.durationISO.toISOString());
      console.log("Geplante Endzeit: " + this.endtimeISO);
      console.log("Geplanter Fahrer: " + this.selectedDriver.name);
      // console.log("RaceDays of Event: " + this.currentEvent.noRaceDays);
      console.log("Renntag des Stints: " + this.raceday);
      console.log("Karttag: " + this.kartTag);
      console.log("Wetter: " + this.weatherTag);
      console.log("Flaggen: " + this.flagTag);
      console.log("Tags als array: " + this.tagsArray);


      this.apiProvider.createStint(
        this.teamId,
        this.eventId,
        this.selectedDriver,
        this.starttimeISO,
        this.endtimeISO,
        this.raceday,
        this.tagsArray
      );
      this.ionEvents.publish("stint:created");
      this.navCtrl.setRoot(PlanningPage);
      this.presentToast("Stint angelegt");
    } // if edit or new
  }

  editStintInModal() {

    // get changes and edit existingSting to existingStintUpdated which will be putted to backend
    // stint ID remains the same
    this.existingStintUpdated = this.existingStint;

    delete this.existingStintUpdated.selectedDriver;
    delete this.existingStintUpdated.starttime;
    delete this.existingStintUpdated.endtime;
    delete this.existingStintUpdated.raceday;


    this.existingStintUpdated.driver = this.selectedDriver._id;
    this.existingStintUpdated.startdate = this.starttimeISO;
    this.existingStintUpdated.enddate = this.endtimeISO;
    this.existingStintUpdated.finished = false;
    this.existingStintUpdated.isBreak = false;
    this.existingStintUpdated.raceDay = this.raceday;
    this.existingStintUpdated.tags[0] = this.kartTag;
    this.existingStintUpdated.tags[1] = this.weatherTag;
    this.existingStintUpdated.tags[2] = this.flagTag;

    this.apiProvider.updateStintData(
      this.teamId,
      this.eventId,
      this.existingStint._id,
      this.existingStintUpdated
    );
    this.ionEvents.publish("stint:edited");
    this.navCtrl.setRoot(PlanningPage);
    this.presentToast("Stint geändert");
  }
}

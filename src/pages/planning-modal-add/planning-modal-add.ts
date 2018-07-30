import { Component } from "@angular/core";
import {
  ViewController,
  NavParams,
  ToastController,
  Events
} from "ionic-angular";
import { ApiServiceProvider } from "../../providers/api-service/api-service";

@Component({
  selector: "page-planning-modal-add",
  templateUrl: "planning-modal-add.html"
})
export class PlanningModalAddPage {

  // Numbers
  private raceday: number;

  // Objects
  private selectedDriver: any;
  private currentEvent: any;
  private existingStint: any;
  private existingStintUpdated: any;

  // Strings
  private eventId: string;
  private teamId: string;
  public starttime: string;
  public endtime: string;
  public duration: string;
  private kartTag: string;
  private weatherTag: string;
  private flagTag: string;

  // Arrays
  public allStints: Array<any>;
  public allDrivers: Array<any>;
  private tagsArray: Array<string>;

  // Date objects
  private starttimeISO: Date;
  private durationISO: Date;
  private endtimeISO: Date;

  constructor(
    private view: ViewController,
    private apiProvider: ApiServiceProvider,
    private navParams: NavParams,
    private ionEvents: Events,
    private toastCtrl: ToastController
  ) {

    // Initialize with existing data from planning page
    this.allStints = navParams.get("allStints");
    this.allDrivers = navParams.get("allDrivers");
    this.teamId = navParams.get("teamId");
    this.eventId = navParams.get("eventId");

    // Get existing stint data
    this.existingStint = this.navParams.get("existingStint");
    let existingStintDuration = this.navParams.get("duration");

    // Initialize date objects
    this.durationISO = new Date();
    this.endtimeISO = new Date();
    this.starttime = new Date().toISOString();
    this.endtime = new Date().toISOString();

    // Check if this modal is for editing or adding a stint and set attributes accordingly
    if (this.existingStint != undefined) {

      console.log("Existing stint data received");
      // If we received an existing stint fill UI inputs with existing stint values
      this.starttime = this.existingStint.startdate;
      this.endtime = this.existingStint.enddate;
      this.duration = Math.abs(parseInt(existingStintDuration)).toString();
      this.selectedDriver = this.existingStint.driver;
      this.kartTag = this.existingStint.tags[0];
      this.weatherTag = this.existingStint.tags[1];
      this.flagTag = this.existingStint.tags[2];

    } else {
      console.log("Ready to create a new Stint");
      this.selectedDriver = { name: "wähle einen Fahrer" };
      this.tagsArray = [];
    }

    // Get current event
    this.apiProvider.getSingleEvent(this.teamId, this.eventId).then(data => {
      this.currentEvent = data as Array<any>;
    });
  }

  // Invoked when closing the modal
  closeAddModal() {
    this.view.dismiss();
  }

  // Present toast messages
  presentToast(toastMessage: string) {
    let toast = this.toastCtrl.create({
      message: toastMessage,
      duration: 3000,
      position: "top"
    });

    toast.onDidDismiss(() => {
      });

    toast.present();
  }

  // Calculates days, months and years the difference between two dates --> used to define raceday attribute
  calcTimeBetween2Dates(date1: Date, date2: Date) {

    // Floor = abrunden
    let diff = Math.floor(date1.getTime() - date2.getTime());
    let day = 1000 * 60 * 60 * 24;
    let days = Math.floor(diff/day);

    // let months = Math.floor(days/31);
    // let years = Math.floor(months/12);
    //
    // let message = date2.toDateString();
    // message += " was "
    // message += days + " days "
    // message += months + " months "
    // message += years + " years ago \n"
    // console.log(message);

    return days;
  }

  // Routine for adding a new stint
  newStint() {

    // Check if this modal is for editing or adding a stint
    if (this.existingStint != undefined) {
      // Start editing routine
      this.editStintInModal();

    } else {
      // Start adding routine

      /*
       *
       * Calculation and data preparation
       *
       */

      // Starttime
      this.starttimeISO = new Date(this.starttime);

      // Format duration from minutes to hour and minutes in ISO format
      let durationNumber = parseInt(this.duration);
      if (durationNumber >= 60) {
        this.durationISO.setHours(1);
        this.durationISO.setMinutes(durationNumber - 60);
      } else {
        this.durationISO.setHours(0);
        this.durationISO.setMinutes(durationNumber);
      }

      // Set endtimeISO
      this.endtimeISO = new Date(this.starttime);
      this.endtimeISO.setHours(
        this.starttimeISO.getHours() + this.durationISO.getHours()
      );
      this.endtimeISO.setMinutes(
        this.starttimeISO.getMinutes() + this.durationISO.getMinutes()
      );

      // Calculate raceday of new stint
      let eventStartdate = new Date(this.currentEvent.startdate);
      this.raceday = this.calcTimeBetween2Dates(this.starttimeISO, eventStartdate);

      // Tags
      this.tagsArray[0] = this.kartTag;
      this.tagsArray[1] = this.weatherTag;
      this.tagsArray[2] = this.flagTag;


      /*
       *
       * OUTPUTS
       *
       */

      // Outputs
      console.log("#################### NEW STINT DATA ########################");

      // Starttime
      console.log("Startzeit als String (Inputfeld): " + this.starttime); // "2018-07-29T22:30:09.317Z"
      console.log("StartzeitISO als Objekt: " + this.starttimeISO);

      // Duration
      console.log("Dauer (Inputfeld): " + this.duration); // "60"
      console.log("Geplante Dauer in Stunden: " + this.durationISO.getHours()); // 0 oder 1
      console.log("Geplante Dauer in  Minuten: " + this.durationISO.getMinutes()); // 0 bis 59
      console.log("DauerISO Gesamt als String: " + this.durationISO.toISOString()); // "Sun Jul 29 2018 01:00:09 GMT+0200 (Central European Summer Time)" = richtiger String
      console.log("DauerISO Gesamt als Objekt: " + this.durationISO); // Sun Jul 29 2018 01:00:09 GMT+0200 (Central European Summer Time) = Date object

      // Endtime
      console.log("Geplante Endzeit: " + this.endtimeISO);

      // Driver
      console.log("Geplanter Fahrer (Inputfeld): " + this.selectedDriver.name);
      console.log("Geplanter Fahrer ID: " + this.selectedDriver._id);

      // Racedays
      console.log("Number of RaceDays of Event: " + this.currentEvent.noRaceDays);
      console.log("Renntag des Stints: " + this.raceday);

      // Tags
      console.log("Tags als array (Inputfelder): " + this.tagsArray);

      /*
       *
       * VALUE PASSING TO API
       *
       */

      // Call API method
      this.apiProvider.createStint(
        this.teamId,
        this.eventId,
        this.selectedDriver._id,
        this.starttimeISO.toISOString(),
        this.endtimeISO.toISOString(),
        this.raceday,
        this.tagsArray
      );

      // Publish event for auto-reload of PlanningPage, close Modal and present toast
      this.ionEvents.publish("stint:created");
      this.closeAddModal();
      this.presentToast("Stint angelegt");
    }
  }

  // Routine for editing an existing stint
  editStintInModal() {

    /*
     *
     * Calculation and data preparation
     *
     */

    // Get changes and edit existingSting to existingStintUpdated which will be putted to backend
    // Stint ID remains the same
    this.existingStintUpdated = this.existingStint;

    // Starttime
    this.starttimeISO = new Date(this.starttime);

    // Format duration from minutes to hour and minutes in ISO format
    let durationNumber = parseInt(this.duration);
    if (durationNumber >= 60) {
      this.durationISO.setHours(1);
      this.durationISO.setMinutes(durationNumber - 60);
    } else {
      this.durationISO.setHours(0);
      this.durationISO.setMinutes(durationNumber);
    }

    // Set endtimeISO
    this.endtimeISO = new Date(this.starttime);
    this.endtimeISO.setHours(
      this.starttimeISO.getHours() + this.durationISO.getHours()
    );
    this.endtimeISO.setMinutes(
      this.starttimeISO.getMinutes() + this.durationISO.getMinutes()
    );

    // Calculate raceday of new stint
    let eventStartdate = new Date(this.currentEvent.startdate);
    this.raceday = this.calcTimeBetween2Dates(this.starttimeISO, eventStartdate);

    // Delete unneccessary attributes
    delete this.existingStintUpdated.selectedDriver;
    delete this.existingStintUpdated.starttimeISO;
    delete this.existingStintUpdated.endtimeISO;
    delete this.existingStintUpdated.raceday;
    delete this.existingStintUpdated.driver.starttimeISO;
    delete this.existingStintUpdated.driver.endtimeISO;
    delete this.existingStintUpdated.driver.kartTag;
    delete this.existingStintUpdated.driver.weatherTag;
    delete this.existingStintUpdated.driver.flagTag
    delete this.existingStintUpdated.driver.duration;

    // Add new data to existing stint
    this.existingStintUpdated.driver = this.selectedDriver._id;
    this.existingStintUpdated.startdate = this.starttimeISO.toISOString();
    this.existingStintUpdated.enddate = this.endtimeISO.toISOString();
    this.existingStintUpdated.duration = this.duration;
    this.existingStintUpdated.finished = false;
    this.existingStintUpdated.isBreak = false;
    this.existingStintUpdated.raceDay = this.raceday;
    this.existingStintUpdated.tags[0] = this.kartTag;
    this.existingStintUpdated.tags[1] = this.weatherTag;
    this.existingStintUpdated.tags[2] = this.flagTag;

    console.log(JSON.stringify(this.existingStintUpdated));

    /*
     *
     * VALUE PASSING TO API
     *
     */

    // Call API method
    this.apiProvider.updateStintData(
      this.teamId,
      this.eventId,
      this.existingStint._id,
      this.existingStintUpdated
    );

    this.ionEvents.publish("stint:edited");
    this.closeAddModal();
    this.presentToast("Stint geändert");
  }



  /*
   *
   * eventually obsolete
   *
   */


  // // Split time, e.g. "12:30" in 12 Hours and 30 minutes and define new date object
  // setDateTime(date, time) {
  //   let index = time.indexOf(":");
  //   let hours = time.substring(0, index);
  //   let minutes = time.substring(index + 1);
  //
  //   date.setHours(hours);
  //   date.setMinutes(minutes);
  //   date.setSeconds(0);
  //
  //   return date;
  // }

}

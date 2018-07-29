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

  /*
   *
   * DISCLAIMER
   *
   * THE DIFFERENCE HERE IS THAT WE HAVE ATTRIBUTES WHICH REPRESENT THE UI-VALUES
   * AND WE HAVE ATTRIBUTES WHICH WILL BE PASSED TO THE API PROVIDER METHODS.
   * ESPECIALLY THE DATETIME OBJECTS, LIKE DURATION ARE DIFFICULT TO HANDLE.
   *
   */

  // Numbers
  raceday: number;

  // Objects
  selectedDriver: any;
  currentEvent: any;
  existingStint: any;
  existingStintUpdated: any;

  // Strings
  eventId: string;
  teamId: string;
  starttime: string;
  endtime: string;
  duration: string;
  kartTag: string;
  weatherTag: string;
  flagTag: string;

  // Arrays
  allStints: Array<any>;
  allDrivers: Array<any>;
  tagsArray: Array<string>;

  // Date objects
  starttimeISO: Date;
  durationISO: Date;
  endtimeISO: Date;

  constructor(
    public view: ViewController,
    public apiProvider: ApiServiceProvider,
    public navParams: NavParams,
    public ionEvents: Events,
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

    // Inizialize
    this.starttimeISO = new Date();
    this.durationISO = new Date();
    this.endtimeISO = new Date();
    this.starttime = new Date().toISOString();
    this.endtime = new Date().toISOString();

    // Check if this modal is for editing or adding a stint and set attributes accordingly
    if (this.existingStint != undefined) {

      console.log("Existing stint data received");
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

  // Calculate the difference between two dates
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

  // Split time, e.g. "12:30" in 12 Hours and 30 minutes and define date object
  setDateTime(date, time) {
    let index = time.indexOf(":");
    let hours = time.substring(0, index);
    let minutes = time.substring(index + 1);

    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);

    return date;
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
      this.setDateTime(this.starttimeISO, this.starttime);

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
      this.endtimeISO.setHours(
        this.starttimeISO.getHours() + this.durationISO.getHours()
      );
      this.endtimeISO.setMinutes(
        this.starttimeISO.getMinutes() + this.durationISO.getMinutes()
      );

      // Calculate raceday of new stint
      let eventStartdate = new Date(this.currentEvent.startdate);
      this.raceday = this.calcDate(this.starttimeISO, eventStartdate);

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
      console.log("Startzeit: " + this.starttime);
      console.log("Geplante Startzeit: " + this.starttime);

      // Duration
      console.log("Dauer: " + this.duration);
      console.log("Geplante Fahrzeit in Stunden: " + this.durationISO.getHours());
      console.log("Geplante Fahrzeit in  Minuten: " + this.durationISO.getMinutes());
      console.log("DauerISO Gesamt: " + this.durationISO.toISOString());

      // Endtime
      console.log("Geplante Endzeit: " + this.endtime);

      // Driver
      console.log("Geplanter Fahrer: " + this.selectedDriver.name);
      console.log("Geplanter Fahrer ID: " + this.selectedDriver._id);

      // Racedays
      console.log("Number of RaceDays of Event: " + this.currentEvent.noRaceDays);
      console.log("Renntag des Stints: " + this.raceday);

      // Tags
      console.log("Tags als array: " + this.tagsArray);

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
        this.starttime,
        this.endtime,
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

    delete this.existingStintUpdated.selectedDriver;
    delete this.existingStintUpdated.starttime;
    delete this.existingStintUpdated.endtime;
    delete this.existingStintUpdated.raceday;

    this.existingStintUpdated.driver = this.selectedDriver._id;
    this.existingStintUpdated.startdate = this.starttime;
    this.existingStintUpdated.enddate = this.endtime;
    this.existingStintUpdated.finished = false;
    this.existingStintUpdated.isBreak = false;
    this.existingStintUpdated.raceDay = this.raceday;
    this.existingStintUpdated.tags[0] = this.kartTag;
    this.existingStintUpdated.tags[1] = this.weatherTag;
    this.existingStintUpdated.tags[2] = this.flagTag;


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
}

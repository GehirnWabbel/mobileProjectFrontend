import { Component } from "@angular/core";
import {
  ViewController,
  NavParams,
  ToastController,
  Events, NavController
} from "ionic-angular";
import { ApiServiceProvider } from "../../providers/api-service/api-service";
import {Storage} from "@ionic/storage";
import {CreateTeamPage} from "../create-team/create-team";
import moment from 'moment'

@Component({
  selector: "page-planning-modal-add",
  templateUrl: "planning-modal-add.html"
})
export class PlanningModalAddPage {

  // Numbers and Bools
  private raceday: number;
  public isBreakToggle: boolean;
  public disableToggle: boolean;

  // Objects
  private selectedDriver: any;
  private currentEvent: any;
  private existingStint: any;
  private existingStintUpdated: any;

  // Strings
  private eventId: string;
  private teamId: string;
  private memberId: string;
  public starttime: string;
  public endtime: string;
  public duration: string;
  private kartTag: string;
  private weatherTag: string;
  private flagTag: string;

  public eventStartdate: string;
  public eventEnddate: string;

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
    private toastCtrl: ToastController,
    private storage: Storage,
    private navCtrl: NavController
  ) {

    // isBreak Toggle switch
    this.isBreakToggle = navParams.get("isBreak");

    // Initialize with existing data from planning page
    this.allStints = navParams.get("allStints");
    this.allDrivers = navParams.get("allDrivers");
    this.teamId = navParams.get("teamId");
    this.memberId = navParams.get("memberId");
    this.eventId = navParams.get("eventId");

    // Get existing stint data
    this.existingStint = this.navParams.get("existingStint");
    let existingStintDuration = this.navParams.get("duration");

    // Initialize date objects
    this.durationISO = moment().toDate();
    this.endtimeISO = moment().toDate();
    this.starttime = moment().format();
    this.endtime = moment().format();

    // Check if this modal is for editing or adding a stint and set attributes accordingly
    if (this.existingStint != undefined) {

      console.log("Existing stint data received");
      // If we received an existing stint fill UI inputs with existing stint values
      this.starttime = moment(this.existingStint.startdate).format();
      this.endtime = moment(this.existingStint.enddate).format();
      console.log("Stint Startzeit (Lokal): " + this.starttime);
      console.log("Sting Endzeit (Lokal)" + this.endtime);
      this.duration = Math.abs(parseInt(existingStintDuration)).toString();
      this.selectedDriver = this.existingStint.driver;
      this.kartTag = this.existingStint.tags[0];
      this.weatherTag = this.existingStint.tags[1];
      this.flagTag = this.existingStint.tags[2];

      if(this.existingStint.isBreak){
        this.disableToggle = true;
      } else {
        this.disableToggle = false;
      }

    } else {
      console.log("Ready to create a new Stint");
      this.selectedDriver = { name: "wähle einen Fahrer" };
      this.tagsArray = [];
    }

    this.initEvent();
  }

  initEvent() {
    // Get current event
    this.apiProvider.getSingleEvent(this.teamId, this.eventId, this.memberId).then(data => {

      this.currentEvent = data as Array<any>;
      console.log(this.currentEvent);

      // Set min datepicker
      let eventStartdateUnformatted = new Date(this.currentEvent.startdate);
      this.eventStartdate = moment(eventStartdateUnformatted).format();

      // Set max datepicker
      let eventEnddateUnformatted = moment(eventStartdateUnformatted).add('days', this.currentEvent.noRaceDays);
      this.eventEnddate = moment(eventEnddateUnformatted).format();

    }).catch(reason => {
      this.errorHandling(reason);
    });
  }

  // ionViewWillEnter() {
  //   // Get current event
  //   this.apiProvider.getSingleEvent(this.teamId, this.eventId, this.memberId).then(data => {
  //     this.currentEvent = data as Array<any>;
  //     console.log(this.currentEvent);
  //   }).catch(reason => {
  //     this.errorHandling(reason);
  //   });
  // }

  errorHandling(reason) {
    console.log("Planning-Modal-Add: error while loading data");
    console.dir(reason);
    this.storage.clear().then(() => {
      this.navCtrl.setRoot(CreateTeamPage);
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
      position: "bottom"
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
      this.starttimeISO = new Date(moment.utc(this.starttime).format());

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
      this.endtimeISO = new Date(moment.utc(this.starttime).format());
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
       * CHECK REQUIRED FIELDS
       * AND
       * VALUE PASSING TO API
       *
       */

      if((this.starttime == undefined ||
        this.endtime == undefined ||
        this.raceday == undefined ||
        this.selectedDriver == undefined ||
        this.durationISO == undefined) &&
        !this.isBreakToggle == false
      ){
        this.presentToast("Bitte fülle alle Pflichtfelder aus");
      } else {

        // TODO
        // Call API method
        this.apiProvider.createStint(
          this.teamId,
          this.eventId,
          this.selectedDriver._id,
          this.starttimeISO.toISOString(),
          this.endtimeISO.toISOString(),
          this.raceday,
          this.isBreakToggle,
          this.tagsArray,
          this.memberId
        ).then(data => {
          // Publish event for auto-reload of PlanningPage, close Modal and present toast
          this.ionEvents.publish("stint:created");
          this.closeAddModal();
          this.presentToast("Stint angelegt");
        }).catch(reason => this.errorHandling(reason));
      }
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
    this.starttimeISO = new Date(moment.utc(this.starttime).format());

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
    this.endtimeISO = new Date(moment.utc(this.starttime).format());
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
    delete this.existingStintUpdated.driver;
    delete this.existingStintUpdated.notificationTime;
    delete this.existingStintUpdated.notified;

    // Add new data to existing stint
    if (this.selectedDriver)
      this.existingStintUpdated.driverId = this.selectedDriver._id;
    this.existingStintUpdated.startdate = this.starttimeISO.toISOString();
    this.existingStintUpdated.enddate = this.endtimeISO.toISOString();
    this.existingStintUpdated.finished = false;
    this.existingStintUpdated.isBreak = this.isBreakToggle;
    this.existingStintUpdated.raceDay = this.raceday;
    this.existingStintUpdated.tags[0] = this.kartTag;
    this.existingStintUpdated.tags[1] = this.weatherTag;
    this.existingStintUpdated.tags[2] = this.flagTag;

    /*
     *
     * CHECK REQUIRED FIELDS
     * AND
     * VALUE PASSING TO API
     *
     */

    // Check required fields
    if((this.starttime == undefined ||
      this.endtime == undefined ||
      this.raceday == undefined ||
      this.selectedDriver == undefined ||
      this.duration == undefined)
      && !this.isBreakToggle
    ){
      this.presentToast("Bitte fülle alle Pflichtfelder aus");
    } else {

      // Call API method
      this.apiProvider.updateStintData(
        this.teamId,
        this.eventId,
        this.existingStint._id,
        this.existingStintUpdated,
        this.memberId
      ).then(data => {
        this.ionEvents.publish("stint:edited");
        this.closeAddModal();
        this.presentToast("Stint geändert");
      }).catch(reason => this.errorHandling(reason));
    }
  }
}

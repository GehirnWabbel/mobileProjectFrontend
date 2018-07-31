import { Component } from "@angular/core";
import {
  IonicPage,
  ModalController,
  ViewController,
  ToastController,
  Events,
  ItemSliding
} from "ionic-angular";
import { ApiServiceProvider } from "../../providers/api-service/api-service";
import { Storage } from "@ionic/storage";
import { PlanningModalAddPage } from "../planning-modal-add/planning-modal-add";
import { colorDefinitions } from "../../app/colordefinitions";

@IonicPage()
@Component({
  selector: "page-planning",
  templateUrl: "planning.html"
})
export class PlanningPage{

  // Class attributes
  teamId: string;
  eventId: string;
  kartTag: string;
  weatherTag: string;
  flagTag: string;
  colorDefinitions;
  zeroForFormatting: string;

  allStints: Array<any>; // All Stints
  allDrivers: Array<any>; // Drivers for modal
  allProtocolItems: Array<any>; // Subset of allStints
  allPlanningItems: Array<any>; // Subset of allStints

  // Weekdays array for date translations
  weekdays: Array<string> = [
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
    "Sonntag"
  ];

  constructor(
    private apiProvider: ApiServiceProvider,
    private modal: ModalController,
    private viewCtrl: ViewController,
    private storage: Storage,
    private ionEvents: Events,
    private toastCtrl: ToastController
  ) {

    // Initialize color definitions
    this.colorDefinitions = colorDefinitions;

    // Load data
    this.refreshPlanningPage();
  }

  // Invoked before this page is entered/set to active
  ionViewWillEnter() {

    // Disable back button
    this.viewCtrl.showBackButton(false);

    // Subscribe to ionic events: stint modifications
    this.ionEvents.subscribe('stint:edited', eventData => {
      console.log("EVENT RECEIVED: edited");
      this.refreshPlanningPage();
    });
    this.ionEvents.subscribe('stint:created', eventData => {
      console.log("EVENT RECEIVED: created");
      this.refreshPlanningPage();
    });
    this.ionEvents.subscribe('stint:setToDone', eventData => {
      console.log("EVENT RECEIVED: finished");
      this.refreshPlanningPage();
    });
    this.ionEvents.subscribe('stint:deleted', eventData => {
      console.log("EVENT RECEIVED: deleted");
      this.refreshPlanningPage();
    });
  }

  // Data/page refresh, which will be invoked if different ionEvents are published
  refreshPlanningPage() {

    // Initialize
    this.allPlanningItems = [];
    this.allProtocolItems = [];
    this.allStints = [];
    this.allDrivers = [];
    this.zeroForFormatting = "0";

    // Get teamId out of local storage
    this.storage.get("teamId").then(val => {
      this.teamId = val;
    });

    // Get eventId out of local storage
    this.storage.get("eventId").then(val => {
      this.eventId = val;

      // Get all stints from backend
      // TODO
      this.apiProvider.getStints(this.teamId, this.eventId).then(backendData => {
        this.formatStints(backendData);
        this.getDriversFromAPI();
      });
    });
  }

  // Present invokes toast messages
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

  // Formatting raw data from backend
  formatStints(backendData: any) {
    this.allStints = backendData as Array<any>;
    console.log("All stints of event (protocol and planned): ", this.allStints);
    let arrayWithStints = this.allStints;
    this.getPlanningItemsOfStint(arrayWithStints);
    this.getProtocolItemsOfStint(arrayWithStints);
  }

  // Planning Items
  getPlanningItemsOfStint(allStints) {
    for (let i = 0; i <= allStints.length - 1; i++) {
      // Add to allDrivers if a member is a driver and Stint is NOT finished
      // Some stints do not even have a driver subArray

      if (allStints[i].driver != null && allStints[i].driver != "undefined") {
        if (
          allStints[i].finished == false &&
          allStints[i].driver.driver == true
        ) {
          let planningItem = allStints[i].driver;

          // Driver
          planningItem.selectedDriver = allStints[i].driver.driver;

          // Calculate duration
          let endtimeISO = new Date(allStints[i].enddate);
          let starttimeISO = new Date(allStints[i].startdate);
          let duration = endtimeISO.valueOf() - starttimeISO.valueOf();
          duration = duration / 60000;
          planningItem.duration = Math.abs(parseInt(duration.toString()));

          // Startdate of stint
          if(starttimeISO.getMinutes() < 10) {
            planningItem.starttime =
              starttimeISO.getHours() +
              ":" + this.zeroForFormatting +
              starttimeISO.getMinutes();
          } else {
            planningItem.starttime =
              starttimeISO.getHours() +
              ":" +
              starttimeISO.getMinutes();
          }
          planningItem.starttimeISO = starttimeISO;

          // Endtime of stint
          if(endtimeISO.getMinutes() < 10) {
            planningItem.endtime =
              endtimeISO.getHours() +
              ":" + this.zeroForFormatting +
              endtimeISO.getMinutes();
          } else {
            planningItem.endtime =
              endtimeISO.getHours() +
              ":" +
              endtimeISO.getMinutes();
          }
          planningItem.endtimeISO = endtimeISO;

          // Tags
          planningItem.kartTag = allStints[i].tags[0];
          planningItem.weatherTag = allStints[i].tags[1];
          planningItem.flagTag = allStints[i].tags[2];

          this.allPlanningItems.push(planningItem);
        }
      }
    }
    // console.log(this.allPlanningItems);
  }

  // Protocol Items
  getProtocolItemsOfStint(allStints) {
    for (let i = 0; i < allStints.length; i++) {

      // Add to allProtocolItems if stint is finished
      if (allStints[i].driver != null && allStints[i].driver != "undefined") {
        if (allStints[i].finished == true) {
          let protocolItem = allStints[i].driver;

          // Calculate duration
          let endtimeISO = new Date(allStints[i].enddate);
          let starttimeISO = new Date(allStints[i].startdate);
          let duration =
            endtimeISO.valueOf() - starttimeISO.valueOf();
          duration = duration / 60000;
          protocolItem.duration = Math.abs(parseInt(duration.toString()));

          // Startdate of stint
          if(starttimeISO.getMinutes() < 10) {
            protocolItem.starttime =
              this.weekdays[starttimeISO.getDay()] +
              ", " +
              starttimeISO.getHours() +
              ":" + this.zeroForFormatting +
              starttimeISO.getMinutes();
          } else {
            protocolItem.starttime =
              this.weekdays[starttimeISO.getDay()] +
              ", " +
              starttimeISO.getHours() +
              ":" +
              starttimeISO.getMinutes();
          }

          // Endtime of stint
          if(endtimeISO.getMinutes() < 10) {
            protocolItem.endtime =
              this.weekdays[endtimeISO.getDay()] +
              ", " +
              endtimeISO.getHours() +
              ":" + this.zeroForFormatting +
              endtimeISO.getMinutes();
          } else {
            protocolItem.endtime =
              this.weekdays[endtimeISO.getDay()] +
              ", " +
              endtimeISO.getHours() +
              ":" +
              endtimeISO.getMinutes();
          }

          // Tags
          protocolItem.kartTag = allStints[i].tags[0];
          protocolItem.weatherTag = allStints[i].tags[1];
          protocolItem.flagTag = allStints[i].tags[2];

          // Add to array
          this.allProtocolItems.push(protocolItem);
        }
      }
    }
    // console.log(this.allProtocolItems);
  }

  // TODO
  // Driver objects from API
  getDriversFromAPI() {
    this.apiProvider.getDrivers(this.teamId).then(data => {
      this.allDrivers = data as Array<any>;
    });
  }

  // Get stint by driver and (indirect) current event
  getStintByDriver(driver: any) {
      for (let i = 0; i < this.allStints.length; i++) {
        if (this.allStints[i].driver._id == driver._id) {
          let stint = this.allStints[i];
          return stint;
        }
      }
  }

  // Open Modal for adding a new stint
  addStintModal() {
    const addModal = this.modal.create(PlanningModalAddPage, {
      allStints: this.allStints,
      allDrivers: this.allDrivers,
      teamId: this.teamId,
      eventId: this.eventId
    });
    addModal.present();
  }

  // Open Modal for editing an existing sting
  editStintModal(planningItem: any, slidingItem: ItemSliding) {
    console.log("STINT TO BE EDITED: " + planningItem);

    let existingStint = this.getStintByDriver(planningItem);
    const addModal = this.modal.create(PlanningModalAddPage, {

      allStints: this.allStints,
      allDrivers: this.allDrivers,
      teamId: this.teamId,
      eventId: this.eventId,
      existingStint: existingStint,
      duration: planningItem.duration

    });
    slidingItem.close();
    addModal.present();
  }

  // Update 'finished' attribute of an existing stint --> new protocol item
  setStintToDone(planningItem: any, slidingItem: ItemSliding) {
    let finishedStint = this.getStintByDriver(planningItem);

    console.log("STINT TO BE EDITED: " + finishedStint);

    // Item preparation
    finishedStint.enddate = new Date().toISOString(); // set enddate to current time
    finishedStint.finished = true;
    finishedStint.driverId = planningItem._id;
    let finishedStintId = finishedStint._id;
    delete finishedStint._id;
    delete finishedStint.driver;

    console.log("finishednStint.enddate: " + finishedStint.enddate);
    slidingItem.close();
    // TODO
    this.apiProvider.setStintToDoneAPI(
      this.teamId,
      this.eventId,
      finishedStint,
      finishedStintId
    ).then(data => {
      this.ionEvents.publish("stint:setToDone");
      this.presentToast("Stint abgeschlossen");
    });
  }

  // Delete a planned stint
  deletePlannedStint(planningItem: any, slidingItem: ItemSliding) {
    let stint = this.getStintByDriver(planningItem);
    slidingItem.close();
    console.log("TO BE DELETED SINT: " + stint);
    // TODO
    this.apiProvider.removePlannedStint(
      this.teamId,
      this.eventId,
      stint._id
    ).then(data => {
      this.ionEvents.publish("stint:deleted");
      this.presentToast("Stint gelöscht");
    });

  }

  // Invoked when clicking the kart tag
  openKartTag(item: any) {
    this.presentToast("Kart: " + item.kartTag);
  }

  // Invoked when clicking the weather tag
  openWeatherTag(item: any) {
    this.presentToast("Wetter: " + item.weatherTag);
  }

  // Invoked when clicking the flag tag
  openFlagTag(item: any) {
    this.presentToast("Flaggen: " + item.flagTag);
  }
}

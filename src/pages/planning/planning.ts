import { Component } from "@angular/core";
import {
  IonicPage,
  ModalController,
  ViewController,
  ToastController,
  Events,
  ItemSliding, NavController
} from "ionic-angular";
import { ApiServiceProvider } from "../../providers/api-service/api-service";
import { Storage } from "@ionic/storage";
import { PlanningModalAddPage } from "../planning-modal-add/planning-modal-add";
import { colorDefinitions } from "../../app/colordefinitions";
import {CreateTeamPage} from "../create-team/create-team";

@IonicPage()
@Component({
  selector: "page-planning",
  templateUrl: "planning.html"
})
export class PlanningPage{

  // Class attributes
  teamId: string;
  memberId: string;
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
    private toastCtrl: ToastController,
    private navCtrl: NavController
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
    this.ionEvents.subscribe('item:reorder', eventData => {
      console.log("EVENT RECEIVED: reorder");
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

    this.storage.get("memberId").then(val => {
      this.memberId = val;
    });

    // Get eventId out of local storage
    this.storage.get("eventId").then(val => {
      this.eventId = val;

      // Get all stints from backend
      this.apiProvider.getStints(this.teamId, this.eventId, this.memberId).then(backendData => {
        this.formatStints(backendData);
        this.getDriversFromAPI();
      }).catch(reason => {
        this.errorHandling(reason);
      });
    });
  }

  errorHandling(reason) {
    console.log("Planning: Failed to load data");
    console.dir(reason);
    this.storage.clear().then(() => {
      this.navCtrl.setRoot(CreateTeamPage);
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
    let arrayWithStints = this.allStints;

    this.getPlanningItemsOfStint(arrayWithStints);
    //this.getPlanningBreakItems(arrayWithStints);

    this.getProtocolItemsOfStint(arrayWithStints);
    //this.getProtocolBreakItems(arrayWithStints);

    //this.allPlanningItems = this.allPlanningItems.sort(function(a,b) {return (a.orderNo > b.orderNo) ? 1 : ((b.orderNo > a.orderNo) ? -1 : 0);} );
    //this.allProtocolItems = this.allProtocolItems.sort(function(a,b) {return (a.orderNo > b.orderNo) ? 1 : ((b.orderNo > a.orderNo) ? -1 : 0);} );

  }

  // Planning Items
  getPlanningItemsOfStint(allStints) {

    var firstItem = true;
    for (let i = 0; i <= allStints.length - 1; i++) {
      // Add to allDrivers if a member is a driver and Stint is NOT finished
      // Some stints do not even have a driver subArray

      if (allStints[i].driver != null && allStints[i].driver != "undefined" && allStints[i].isBreak === false) {
        if (allStints[i].isBreak === false && allStints[i].finished === false) {
          let planningItem = allStints[i].driver;

          // Driver
          //planningItem.selectedDriver = allStints[i].driver.driver;

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

          // Break
          planningItem.isBreak = allStints[i].isBreak;

          planningItem.stintId = allStints[i]._id;

          planningItem.firstItem = firstItem;
          if(planningItem.firstItem)
            console.log(planningItem)
          firstItem = false;

          // Add to array
          this.allPlanningItems.push(planningItem);
        }
      }
      if (allStints[i].isBreak && allStints[i].finished === false && allStints[i].isBreak === true){
        // Define breakItem
        let breakItem = allStints[i];


        // Calculate duration
        let endtimeISO = new Date(allStints[i].enddate);
        let starttimeISO = new Date(allStints[i].startdate);
        let duration = endtimeISO.valueOf() - starttimeISO.valueOf();
        duration = duration / 60000;
        breakItem.duration = Math.abs(parseInt(duration.toString()));

        // Startdate of stint
        if(starttimeISO.getMinutes() < 10) {
          breakItem.starttime =
            starttimeISO.getHours() +
            ":" + this.zeroForFormatting +
            starttimeISO.getMinutes();
        } else {
          breakItem.starttime =
            starttimeISO.getHours() +
            ":" +
            starttimeISO.getMinutes();
        }
        breakItem.starttimeISO = starttimeISO;

        // Endtime of stint
        if(endtimeISO.getMinutes() < 10) {
          breakItem.endtime =
            endtimeISO.getHours() +
            ":" + this.zeroForFormatting +
            endtimeISO.getMinutes();
        } else {
          breakItem.endtime =
            endtimeISO.getHours() +
            ":" +
            endtimeISO.getMinutes();
        }
        breakItem.endtimeISO = endtimeISO;

        // Break
        breakItem.isBreak = allStints[i].isBreak;

        breakItem.stintId = allStints[i]._id;

        breakItem.firstItem = firstItem;
        if(breakItem.firstItem)
          console.log(breakItem)
        firstItem = false;

        // Add to array
        this.allPlanningItems.push(breakItem);
      }
    }
  }

  // Protocol Items
  getProtocolItemsOfStint(allStints) {
    for (let i = 0; i < allStints.length; i++) {

      // Add to allProtocolItems if stint is finished
      if (allStints[i].driver != null && allStints[i].driver != "undefined" && !allStints[i].isBreak) {
        if (allStints[i].isBreak === false && allStints[i].finished == true) {
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
      if (allStints[i].isBreak && allStints[i].finished === true){

        // Define breakItem
        let breakItem = allStints[i];

        // Calculate duration
        let endtimeISO = new Date(allStints[i].enddate);
        let starttimeISO = new Date(allStints[i].startdate);
        let duration = endtimeISO.valueOf() - starttimeISO.valueOf();
        duration = duration / 60000;
        breakItem.duration = Math.abs(parseInt(duration.toString()));

        // Startdate of stint
        if(starttimeISO.getMinutes() < 10) {
          breakItem.starttime =
            starttimeISO.getHours() +
            ":" + this.zeroForFormatting +
            starttimeISO.getMinutes();
        } else {
          breakItem.starttime =
            starttimeISO.getHours() +
            ":" +
            starttimeISO.getMinutes();
        }
        breakItem.starttimeISO = starttimeISO;

        // Endtime of stint
        if(endtimeISO.getMinutes() < 10) {
          breakItem.endtime =
            endtimeISO.getHours() +
            ":" + this.zeroForFormatting +
            endtimeISO.getMinutes();
        } else {
          breakItem.endtime =
            endtimeISO.getHours() +
            ":" +
            endtimeISO.getMinutes();
        }
        breakItem.endtimeISO = endtimeISO;

        // Break
        breakItem.isBreak = allStints[i].isBreak;

        // Add to array
        this.allProtocolItems.push(breakItem);
      }
    }
  }

  // Driver objects from API
  getDriversFromAPI() {
    this.apiProvider.getDrivers(this.teamId, this.memberId).then(data => {
      this.allDrivers = data as Array<any>;
    }).catch(reason => this.errorHandling(reason));
  }

  // Open Modal for adding a new stint
  addStintModal() {
    const addModal = this.modal.create(PlanningModalAddPage, {
      allStints: this.allStints,
      allDrivers: this.allDrivers,
      teamId: this.teamId,
      memberId: this.memberId,
      eventId: this.eventId
    });
    addModal.present();
  }

  // Open Modal for editing an existing sting
  editStintModal(planningItem: any, slidingItem: ItemSliding) {
    console.log(planningItem);
    this.apiProvider.getStintById(this.teamId, this.eventId, this.memberId, planningItem.stintId).then(data => {
      const addModal = this.modal.create(PlanningModalAddPage, {

        allStints: this.allStints,
        allDrivers: this.allDrivers,
        teamId: this.teamId,
        memberId: this.memberId,
        eventId: this.eventId,
        existingStint: data as any,
        duration: planningItem.duration,
        isBreak: planningItem.isBreak

      });
      slidingItem.close();
      addModal.present();
    }).catch(reason => this.errorHandling(reason));
  }

  // Update 'finished' attribute of an existing stint or pause --> new protocol item
  setStintToDone(planningItem: any, slidingItem: ItemSliding) {
    this.apiProvider.getStintById(this.teamId, this.eventId, this.memberId, planningItem.stintId).then(data => {
      let stintFromAPI = data as any;
      let finishedStint = stintFromAPI;

      // Item preparation
      finishedStint.enddate = new Date().toISOString(); // set enddate to current time
      finishedStint.finished = true;
      finishedStint.driverId = planningItem._id;
      let finishedStintId = planningItem.stintId;
      delete finishedStint._id;
      delete finishedStint.driver;

      console.log("finishednStint.enddate: " + finishedStint.enddate);
      slidingItem.close();
      this.apiProvider.setStintToDoneAPI(
        this.teamId,
        this.eventId,
        finishedStint,
        finishedStintId,
        this.memberId
      ).then(data => {
        slidingItem.close();
        this.ionEvents.publish("stint:setToDone");
        this.presentToast("Stint abgeschlossen");
      }).catch(reason => this.errorHandling(reason));
    }).catch(reason => this.errorHandling(reason));

  }

  // Delete a planned stint
  deletePlannedStint(planningItem: any, slidingItem: ItemSliding) {
    // let stint = this.getStintByDriver(planningItem);
    this.apiProvider.getStintById(this.teamId, this.eventId, this.memberId, planningItem.stintId).then(data => {
      let stint = data as any;

      slidingItem.close();
      console.log("\"TO BE DELETED SINT: \" + ")
      console.log(stint);
      this.apiProvider.removePlannedStint(
        this.teamId,
        this.eventId,
        stint._id,
        this.memberId
      ).then(data => {
        this.ionEvents.publish("stint:deleted");
        this.presentToast("Stint gelöscht");
      }).catch(reason => this.errorHandling(reason));
    }).catch(reason => this.errorHandling(reason));
  }

  reorderItems(indexes) {
    let elementMoved = this.allPlanningItems[indexes.from];
    let newPos = this.allProtocolItems.length + indexes.to + 2;
    //put auf elementMoved.stintId mit orderNo newPos
    this.apiProvider.getStintById(this.teamId, this.eventId, this.memberId, elementMoved.stintId).then(data => {
      let stintFromAPI = data as any;
      stintFromAPI.orderNo = newPos;

      this.apiProvider.updateStintData(
        this.teamId,
        this.eventId,
        elementMoved.stintId,
        stintFromAPI,
        this.memberId
      ).then(data => {
        this.ionEvents.publish("item:reorder");
        this.presentToast("Stints/Pausen getauscht");
      }).catch(reason => this.errorHandling(reason));
    }).catch(reason => this.errorHandling(reason));
  }

  // Pull to refresh
  doRefresh(refresher) {
    this.refreshPlanningPage();
    refresher.complete();
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

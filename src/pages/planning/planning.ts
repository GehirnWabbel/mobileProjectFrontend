import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, ModalController, ViewController } from "ionic-angular";
import { ApiServiceProvider } from "../../providers/api-service/api-service";
import { Storage } from "@ionic/storage";
import { PlanningModalAddPage} from "../planning-modal-add/planning-modal-add";

@IonicPage()
@Component({
  selector: "page-planning",
  templateUrl: "planning.html"
})
export class PlanningPage {

  allStints = [];             // complete Stints
  allDrivers = [];           // subset of Stints (only driver objects)
  allProtocolItems = [];     // Protocol Items = Stints with attribute 'finished' true
  allPlanningItems = [];     // Planning Items = Stints with attribute 'finished' false

  teamId: string;
  eventId: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private apiProvider: ApiServiceProvider,
    private modal: ModalController,
    private viewCtrl: ViewController,
    private storage: Storage
  ) {

      this.storage.get("teamId").then(val => {
        this.teamId = val;
      });

      this.storage.get("eventId").then(val => {
        this.eventId = val;
        this.apiProvider.getStints(this.teamId, this.eventId).then(data => {
          this.formatStints(data);
          this.getDriversFromAPI();
      });
    });
  }

  ionViewWillEnter() {
    this.viewCtrl.showBackButton(false);
  }

  formatStints(data: any) {
    this.allStints = data as Array<any>;
    console.log("All Stints: ", this.allStints);
    let arrayWithStints = this.allStints;
    this.getDriversOfStint(arrayWithStints);
    this.getProtocolItemsOfStint(arrayWithStints);
  }

  getDriversOfStint(allStints) {
     for (let i = 0; i <= allStints.length-1; i++) {
       // add to allDrivers if a member is a driver and Stint is NOT finished
       // Some stints do not even have a driver subArray!

       if (allStints[i].driver != null && allStints[i].driver != 'undefined') {
         if (allStints[i].finished == false && allStints[i].driver.driver == true) {
           let driver = allStints[i].driver;
           this.allPlanningItems.push(driver);
         }
       }
     }
   }

  getDriversFromAPI() {
    this.apiProvider.getDrivers(this.teamId).then(data => {
      this.allDrivers = data as Array<any>;
    });
  }

  getProtocolItemsOfStint(allStints) {

    for (let i = 0; i < allStints.length; i++) {
      // add to allProtocolItems if stint is finished
      if (allStints[i].driver != null && allStints[i].driver != 'undefined') {
      if (allStints[i].finished == true) {
        let protocolItem = allStints[i].driver;
        this.allProtocolItems.push(protocolItem);
      }}
    }
    //console.log(this.allProtocolItems);
  }

  setStintToDone(driver: any) {
    let finishedStint = this.getStintOfDriver(driver);

    // console.log("complete stint before update: " + finishedStint);
    // console.log("Stint finished: " + finishedStint.finished);

    finishedStint.finished = true;
    finishedStint.driverId = driver._id;
    delete finishedStint.driver;
    let finishedStintId = finishedStint._id;
    delete finishedStint._id;

    // console.log("Stint finished: " + finishedStint.finished);
    // console.log("complete updated Stint: " + finishedStint);
    this.apiProvider.setStintToDoneAPI(this.teamId, this.eventId, finishedStint, finishedStintId);
  }

  getStintOfDriver(driver: any) {
    for (let i = 0; i < this.allStints.length; i++) {
      // search stint of driver
      if (this.allStints[i].driver._id == driver._id) {
        let stint = this.allStints[i];
        return stint;
      }
    }
  }

  openAddStintModal() {
    const addModal = this.modal.create(PlanningModalAddPage, {
      allStints: this.allStints,
      allDrivers: this.allDrivers,
      teamId: this.teamId,
      eventId: this.eventId
    });
    addModal.present();
  }

  /*
   *
   * TODO: Tag functionality
   *
   */

  editStint() {
    console.log("Pop up for editing driver");
  }

  openKartTag() {
    console.log("Kart Tag options open");
  }

  openWeatherTag() {
    console.log("Weather Tag options open");
  }

  openFlagTag() {
    console.log("Flag Tag options open");
  }
}

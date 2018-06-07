import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  ViewController
} from "ionic-angular";
import { ApiServiceProvider } from "../../providers/api-service/api-service";
import { Storage } from "@ionic/storage";

@IonicPage()
@Component({
  selector: "page-planning",
  templateUrl: "planning.html"
})
export class PlanningPage {
  public protocolItems: Array<{
    name: string;
    icon: string;
    timestamp: any;
    duration: any;
  }>;

  allStints: Array<any>; // complete Stints
  allDrivers: Array<any>; // subset of Stints (only driver objects)
  allProtocolItems = []; // Protocol Items = Stints with attribute 'finished' true
  // allPlanningItems = [];    // Planning Items = Stints with attribute 'finished' false

  eventId: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private apiProvider: ApiServiceProvider,
    private modal: ModalController,
    private viewCtrl: ViewController,
    private storage: Storage
  ) {
    this.storage.get("eventId").then(val => {
      // Get current event out of storage
      this.eventId = val;

      // Get complete stints
      this.apiProvider.getStints(this.eventId).then(data => {
        this.allStints = this.formatStints(data);
      });
    });

    this.getDriversFromAPI();
  }

  ionViewWillEnter() {
    this.viewCtrl.showBackButton(false);
  }

  formatStints(data: any) {
    this.allStints = data as Array<any>;
    console.log("All Stints: ", this.allStints);
    //this.getDriversOfStint(this.allStints);
    this.getProtocolItemsOfStint(this.allStints);
    return this.allStints;
  }

  // getDriversOfStint(allStints) {
  //   for (let i = 0; i < allStints.length; i++) {
  //     // add to allDrivers if a member is a driver and Stint is NOT finished
  //     if (
  //       allStints[i].finished == false &&
  //       allStints[i].driver.driver == true
  //     ) {
  //       let driver = allStints[i].driver;
  //       this.allDrivers.push(driver);
  //     }
  //   }
  //   //this.storage.set("allDrivers", this.allDrivers);
  // }

  getDriversFromAPI() {
    this.apiProvider.getDrivers('5b06a79fef9f5500141336d2').then(data => {
      this.allDrivers = data as Array<any>;;
    });
    this.storage.set("allDrivers", this.allDrivers);
  }

  getProtocolItemsOfStint(allStints) {
    for (let i = 0; i < allStints.length; i++) {
      // add to allProtocolItems if stint is finished
      if (allStints[i].finished == true) {
        let protocolItem = allStints[i].driver;
        this.allProtocolItems.push(protocolItem);
      }
    }
    //console.log(this.allProtocolItems);
  }

  setStintToDone(driver: any) {
    let finishedStint = this.getStintOfDriver(driver);
    console.log("Stint not updated: " + finishedStint.finished);
    finishedStint.finished = true;
    console.log("Stint updated: " + finishedStint.finished);
    this.apiProvider.setStintToDone(this.eventId, finishedStint);
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
    const addModal = this.modal.create("PlanningModalAddPage", {
      allStints: this.allStints
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

import { Component } from "@angular/core";
import {
  IonicPage,
  ViewController,
  NavParams,
  NavController
} from "ionic-angular";
import { ApiServiceProvider } from "../../providers/api-service/api-service";
import { Storage } from "@ionic/storage";
import { PlanningPage } from "../planning/planning";

@IonicPage()
@Component({
  selector: "page-planning-modal-add",
  templateUrl: "planning-modal-add.html"
})
export class PlanningModalAddPage {
  eventId: any;
  allStints: any;
  allDrivers = [];

  constructor(
    public view: ViewController,
    public apiProvider: ApiServiceProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage
  ) {
    this.allStints = navParams.get("allStints");

    this.storage.get("allDrivers").then(val => {
      this.allDrivers = val;
    });

    this.storage.get("eventId").then(val => {
      this.eventId = val;
    });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad PlanningModalAddPage");
  }

  closeAddModal() {
    this.view.dismiss();
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

  newStint(driverId: any) {
    let selectedDriver;
    for (let i = 0; i <= this.allDrivers.length; i++) {
      if (this.allDrivers[i]._id == driverId) {
        selectedDriver = this.allDrivers[i];
        break;
      }
    }

    let stintOfDriver = this.getStintOfDriver(selectedDriver);
    this.apiProvider.createStint(this.eventId, stintOfDriver);
    this.navCtrl.setRoot(PlanningPage);
    //this.view.dismiss();
  }
}

import { Component } from "@angular/core";
import { ViewController, NavParams, NavController } from "ionic-angular";
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
  starttime: any;
  duration: any;

  constructor(
    public view: ViewController,
    public apiProvider: ApiServiceProvider,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.allStints = navParams.get("allStints");
    this.allDrivers = navParams.get("allDrivers");
    this.teamId = navParams.get("teamId");
    this.eventId = navParams.get("eventId");

    // edit stint params
    this.starttime = this.navParams.get('starttime');
    this.duration = this.navParams.get('duration');
  }

  closeAddModal() {
    this.view.dismiss();
  }

  getStintOfDriver(driver: any) {
    for (let i = 0; i < this.allStints.length; i++) {
      if (
        this.allStints[i].driver != null &&
        this.allStints[i].driver != "undefined"
      ) {
        // get stint of driver
        if (this.allStints[i].driver._id == driver._id) {
          let stint = this.allStints[i];
          return stint;
        }
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
    this.apiProvider.createStint(this.teamId, this.eventId, stintOfDriver);
    this.navCtrl.setRoot(PlanningPage);
  }
}

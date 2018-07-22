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
  endtime: any;
  raceday: any;
  selectedDriver: any;
  // isDriver: boolean;

  // public myDate:string=new Date().toISOString();

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
    this.selectedDriver = this.navParams.get('selectedDriver');
  }

  closeAddModal() {
    this.view.dismiss();
  }

  // getStintOfDriver(driver: any) {
  //   for (let i = 0; i < this.allStints.length; i++) {
  //     if (
  //       this.allStints[i].driver != null &&
  //       this.allStints[i].driver != "undefined"
  //     ) {
  //       // get stint of driver
  //       if (this.allStints[i].driver._id == driver._id) {
  //         let stint = this.allStints[i];
  //         return stint;
  //       }
  //     }
  //   }
  // }

  newStint() {
    console.log("NEUE Startzeit: " + this.starttime);
    console.log("NEUE Dauer: " + this.duration);
    console.log("NEUER Fahrer: " + this.selectedDriver.name);

    // calculate enddate

    // calculate raceday
    // get data from event object

    this.apiProvider.createStint(this.teamId, this.eventId, this.selectedDriver, this.starttime, this.endtime, this.raceday);
    this.navCtrl.setRoot(PlanningPage);
  }
}

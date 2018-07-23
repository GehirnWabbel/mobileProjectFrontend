import { Component } from "@angular/core";
import { ViewController, NavParams, NavController } from "ionic-angular";
import { ApiServiceProvider } from "../../providers/api-service/api-service";
//import { PlanningPage } from "../planning/planning";

@Component({
  selector: "page-planning-modal-add",
  templateUrl: "planning-modal-add.html"
})
export class PlanningModalAddPage {
  eventId: string;
  teamId: string;
  allStints: Array<any>;
  allDrivers: Array<any>;
  currentEvent = [];

  // stint attributes
  raceday: number;
  numberOfRacedays: number;
  selectedDriver: any;
  starttime: string = new Date().toISOString();
  duration: string;
  private starttimeISO = new Date();
  private durationISO = new Date();
  private endtimeISO = new Date();


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

  // Split e.g. "12:30" in 12 Hours and 30 minutes and define date object
  setDateTime(date, time) {
    let index = time.indexOf(":");
    let hours = time.substring(0, index);
    let minutes = time.substring(index + 1);

    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds("00");

    return date;
  }

  getSingleEventFromAPI() {
    console.log("METHOD INVOCATION")
    this.apiProvider.getSingleEvent(this.teamId, this.eventId).then(data => {
      this.currentEvent = data as Array<any>;
      console.log(this.currentEvent);
    });
  }

  newStint() {
    //starttime
    this.setDateTime(this.starttimeISO, this.starttime);

    // endtime
    let durationNumber = parseInt(this.duration);
    if(durationNumber >= 60){
      this.durationISO.setHours(1);
      this.durationISO.setMinutes(durationNumber - 60)
    } else {
      this.durationISO.setHours(0);
      this.durationISO.setMinutes(durationNumber);
    }

    this.endtimeISO.setHours(this.starttimeISO.getHours() + this.durationISO.getHours());
    let minutes = this.starttimeISO.getMinutes() + this.durationISO.getMinutes();
    console.log("FDSAFDAFDA: " + minutes)
    this.endtimeISO.setMinutes(this.starttimeISO.getMinutes() + this.durationISO.getMinutes())

    // Outputs
    console.log("Startzeit: " + this.starttime);
    console.log("StartzeitISO: " + this.starttimeISO.toISOString());
    console.log("Dauer: " + this.duration);
    console.log("DauerISO Stunden: " + this.durationISO.getHours());
    console.log("DauerISO Minuten: " + this.durationISO.getMinutes());
    console.log("DauerISO Gesamt: " + this.durationISO.toISOString());
    console.log("EndzeitISO: " + this.endtimeISO.toISOString());
    console.log("Fahrer: " + this.selectedDriver.name);

    // calculate raceday
    // get data from event object
    this.getSingleEventFromAPI();


    //this.apiProvider.createStint(this.teamId, this.eventId, this.selectedDriver, this.starttime, this.endtime, this.raceday);
    //this.navCtrl.setRoot(PlanningPage);
  }


}

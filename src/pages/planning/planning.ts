import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  ViewController,
  ToastController
} from "ionic-angular";
import { ApiServiceProvider } from "../../providers/api-service/api-service";
import { Storage } from "@ionic/storage";
import { PlanningModalAddPage } from "../planning-modal-add/planning-modal-add";

@IonicPage()
@Component({
  selector: "page-planning",
  templateUrl: "planning.html"
})
export class PlanningPage {
  allStints = []; // complete Stints
  allDrivers = []; // drivers for modal
  allProtocolItems = []; // Protocol Items = Stints with attribute 'finished' true
  allPlanningItems = []; // Planning Items = Stints with attribute 'finished' false

  weekdays: Array<string> = [
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
    "Sonntag"
  ];

  teamId: string;
  eventId: string;
  kartTag: string;
  weatherTag: string;
  flagTag: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private apiProvider: ApiServiceProvider,
    private modal: ModalController,
    private viewCtrl: ViewController,
    private storage: Storage,
    private toastCtrl: ToastController
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

  presentToast(toastMessage: string) {
    let toast = this.toastCtrl.create({
      message: toastMessage,
      duration: 3000,
      position: "top"
    });

    toast.onDidDismiss(() => {
      console.log("Dismissed toast");
    });

    toast.present();
  }

  formatStints(data: any) {
    this.allStints = data as Array<any>;
    console.log("All stints of event (protocol and planned): ", this.allStints);
    let arrayWithStints = this.allStints;
    this.getDriversOfStint(arrayWithStints);
    this.getProtocolItemsOfStint(arrayWithStints);
  }

  getDriversOfStint(allStints) {
    for (let i = 0; i <= allStints.length - 1; i++) {
      // add to allDrivers if a member is a driver and Stint is NOT finished
      // Some stints do not even have a driver subArray

      if (allStints[i].driver != null && allStints[i].driver != "undefined") {
        if (
          allStints[i].finished == false &&
          allStints[i].driver.driver == true
        ) {
          let planningItem = allStints[i].driver;

          // calculate duration of stint
          let endtimeFormatted = new Date(allStints[i].enddate);
          let starttimeFormatted = new Date(allStints[i].startdate);
          let duration =
            endtimeFormatted.valueOf() - starttimeFormatted.valueOf();
          planningItem.duration = duration / 60000;

          // startdate of stint
          planningItem.starttime =
            starttimeFormatted.getHours() +
            ":" +
            starttimeFormatted.getMinutes();

          // endtime of stint
          planningItem.endtime =
            endtimeFormatted.getHours() +
            ":" +
            endtimeFormatted.getMinutes();


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

  getDriversFromAPI() {
    this.apiProvider.getDrivers(this.teamId).then(data => {
      this.allDrivers = data as Array<any>;
    });
  }

  getProtocolItemsOfStint(allStints) {
    for (let i = 0; i < allStints.length; i++) {
      // add to allProtocolItems if stint is finished
      if (allStints[i].driver != null && allStints[i].driver != "undefined") {
        if (allStints[i].finished == true) {
          let protocolItem = allStints[i].driver;

          // calculate duration of stint
          // TODO: Formatierung der Dauer bzw. Einheit
          let endtimeFormatted = new Date(allStints[i].enddate);
          let starttimeFormatted = new Date(allStints[i].startdate);
          let duration =
            endtimeFormatted.valueOf() - starttimeFormatted.valueOf();
          protocolItem.duration = duration / 60000;

          // starttime of stint
          protocolItem.starttime =
            this.weekdays[starttimeFormatted.getDay()] +
            ", " +
            starttimeFormatted.getHours() +
            ":" +
            starttimeFormatted.getMinutes();

          // endtime of stint
          protocolItem.endtime =
            this.weekdays[endtimeFormatted.getDay()] +
            ", " +
            endtimeFormatted.getHours() +
            ":" +
            endtimeFormatted.getMinutes();

          // Tags
          protocolItem.kartTag = allStints[i].tags[0];
          protocolItem.weatherTag = allStints[i].tags[1];
          protocolItem.flagTag = allStints[i].tags[2];

          // Add to array
          this.allProtocolItems.push(protocolItem);
        }
      }
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
    this.apiProvider.setStintToDoneAPI(
      this.teamId,
      this.eventId,
      finishedStint,
      finishedStintId
    );
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

  editStint(stintItem: any) {
    console.log(stintItem);
    const addModal = this.modal.create(PlanningModalAddPage, {
      allStints: this.allStints,
      allDrivers: this.allDrivers,
      teamId: this.teamId,
      eventId: this.eventId,
      starttime: stintItem.starttimeFormatted,
      duration: stintItem.duration,
      selectedDriver: stintItem.name, // CAUTION: Hier wird fälschlicherweise nur der String vom Fahrer übergeben
      kartTag: stintItem.kartTag,
      weatherTag: stintItem.weatherTag,
      flagTag: stintItem.flagTag
    });
    addModal.present();
  }

  openKartTag(item: any) {
    this.presentToast("Kart: " + item.kartTag);
  }

  openWeatherTag(item: any) {
    this.presentToast("Wetter: " + item.weatherTag);
  }

  openFlagTag(item: any) {
    this.presentToast("Flaggen: " + item.flagTag);
  }
}

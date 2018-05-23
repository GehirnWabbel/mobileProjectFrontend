import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';

@IonicPage()
@Component({
  selector: 'page-planning',
  templateUrl: 'planning.html',
})

export class PlanningPage {

  public protocolItems: Array<{name: string, icon: string, timestamp: any, duration: any}>;

  allStints: Array<any>; // complete Stints
  allDrivers = []; // subset of Stints (only driver objects)

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private apiProvider: ApiServiceProvider,
    private modal: ModalController,
    private viewCtrl: ViewController) {

    // examples for protocol items
    this.protocolItems = [
      { name: 'Johannes', icon: 'person', timestamp: '13:37', duration: '0:32'},
      { name: 'Marcus', icon: 'person', timestamp: '14:24', duration: '0:53' },
      { name: 'Alex', icon: 'person', timestamp: '15:34', duration: '2:12' },
      { name: 'Marie', icon: 'person', timestamp: '3:15', duration: '1:16' }
    ];

    // Get complete stints
    this.apiProvider.getStints().then(data => {this.allStints = this.formatStints(data)});
  }

  ionViewWillEnter() {
    this.viewCtrl.showBackButton(false);
  }

  formatStints(data: any) {
     this.allStints = data as Array<any>;
     this.getDriversOfStint(this.allStints);
     return this.allStints;
  }

  getDriversOfStint(allStints) {
    for (let i=0; i<allStints.length; i++){
      let driver = allStints[i].driver;
      this.allDrivers.push(driver);
    }
  }

  setStintToDone() {
    this.apiProvider.setStintToDone();
  }

  openAddStintModal() {
    const addModal = this.modal.create('PlanningModalAddPage', {'protocolItems' : this.protocolItems});
    addModal.present();
  }

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

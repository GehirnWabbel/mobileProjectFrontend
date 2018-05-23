import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { PlanningDriverProvider } from '../../providers/planning-driver/planning-driver';

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
    private stintProvider: PlanningDriverProvider,
    private modal: ModalController ) {

    // examples for protocol items
    this.protocolItems = [
      { name: 'Johannes', icon: 'person', timestamp: '13:37', duration: '0:32'},
      { name: 'Marcus', icon: 'person', timestamp: '14:24', duration: '0:53' },
      { name: 'Alex', icon: 'person', timestamp: '15:34', duration: '2:12' },
      { name: 'Marie', icon: 'person', timestamp: '3:15', duration: '1:16' }
    ];

    // Get complete stints
    this.stintProvider.getStints().then(data => {this.allStints = this.formatStints(data)});
  }

  ionViewDidLoad() {
    
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
    this.stintProvider.setStintToDone();
  }

  openAddModal() {
    const addModal = this.modal.create('PlanningModalAddPage', {'protocolItems' : this.protocolItems});
    addModal.present();
  }

  editNextDriver() {
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

import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams, NavController } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { Storage } from "@ionic/storage";
import {PlanningPage} from "../planning/planning";



@IonicPage()
@Component({
  selector: 'page-planning-modal-add',
  templateUrl: 'planning-modal-add.html',
})
export class PlanningModalAddPage {

  allStints: any;
  allDrivers = [];
  eventId: any;

  constructor(
    public view: ViewController,
    public apiProvider: ApiServiceProvider,
    public navController, NavController,
    public navParams: NavParams,
    public planningPage: PlanningPage,
    private storage: Storage) {

    this.allStints = navParams.get('allStints');


    this.storage.get('allDrivers').then((val) => {
      this.allDrivers = val;
      //console.log('All available Drivers: ', this.allDrivers);
    });

    this.storage.get('eventId').then((val) => {
      this.eventId = val;
      //console.log('Modal EventId: ', this.eventId);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlanningModalAddPage');
  }

  closeAddModal() {
    this.view.dismiss();
  }

  getStintOfDriver(driver: any) {
    for (let i=0; i<this.allStints.length; i++) {
      // search stint of driver
      if (this.allStints[i].driver._id == driver._id) {
        let stint = this.allStints[i];
        return stint;
      }
    }
  }

  newStint(driverId: any) {
    let selectedDriver;
    for(let i=0; i<=this.allDrivers.length; i++){
      console.log('All Drivers Id: ', this.allDrivers[i]._id);
      if(this.allDrivers[i]._id == driverId){
        selectedDriver = this.allDrivers[i];
        break;
      }
    }
    //console.log('Selected Driver: ', selectedDriver);
    let stintOfDriver = this.getStintOfDriver(selectedDriver);
    this.apiProvider.createStint(this.eventId, stintOfDriver);
    this.navController.setRoot(PlanningPage);
    //this.view.dismiss();
  }
}

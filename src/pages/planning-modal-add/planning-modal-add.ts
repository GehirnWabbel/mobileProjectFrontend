import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { Storage } from "@ionic/storage";


@IonicPage()
@Component({
  selector: 'page-planning-modal-add',
  templateUrl: 'planning-modal-add.html',
})
export class PlanningModalAddPage {

  allDrivers = [];
  eventId: any;

  constructor(
    public view: ViewController,
    public apiProvider: ApiServiceProvider,
    private storage: Storage) {

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
    //console.log('ionViewDidLoad PlanningModalAddPage');
  }

  closeAddModal() {
    this.view.dismiss();
  }

  newStint(driverId: any) {
    this.apiProvider.createStint(this.eventId, driverId);
    this.view.dismiss();
  }
}

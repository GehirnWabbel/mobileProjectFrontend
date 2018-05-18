import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PlanningDriverProvider} from '../../providers/planning-driver/planning-driver';

@IonicPage()
@Component({
  selector: 'page-planning',
  templateUrl: 'planning.html',
})
export class PlanningPage {

  public protocolItems: Array<{name: string, icon: string, timestamp: any, duration: any}>; // Protokoll items
  public drivers: Array<{name: string, icon: string,  timestamp: any, duration: any}>;

  public allDrivers = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private driverProvider: PlanningDriverProvider) {

    // examples
    this.protocolItems = [
      { name: 'Johannes', icon: 'person', timestamp: '13:37', duration: '0:32'},
      { name: 'Marcus', icon: 'person', timestamp: '14:24', duration: '0:53' },
      { name: 'Alex', icon: 'person', timestamp: '15:34', duration: '2:12' },
      { name: 'Marie', icon: 'person', timestamp: '3:15', duration: '1:16' }
    ];

    // examples
    this.drivers = [
      { name: 'Alice', icon: 'person', timestamp: '13:37', duration: '0:32' },
      { name: 'Bob', icon: 'person', timestamp: '13:37', duration: '0:32' },
      { name: 'James', icon: 'person', timestamp: '13:37', duration: '0:32' },
      { name: 'Frank', icon: 'person', timestamp: '13:37', duration: '0:32' }
    ];
  }

  ionViewDidLoad() {
    // get drivers from driverProdiver
    this.driverProvider.getDriver().subscribe(driverList => this.allDrivers = driverList);
  }

}

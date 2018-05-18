import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-planning',
  templateUrl: 'planning.html',
})
export class PlanningPage {

  public protocolItems: Array<{name: string, icon: string, timestamp: any, duration: any}>; // Protokoll items
  public drivers: Array<{name: string, icon: string}>;
  public reorderIsEnabled = false; // Ordnen der Fahrerplanung Button

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.protocolItems = [
      { name: 'Johannes', icon: 'person', timestamp: '13:37', duration: '0:32'},
      { name: 'Marcus', icon: 'person', timestamp: '14:24', duration: '0:53' },
      { name: 'Alex', icon: 'person', timestamp: '15:34', duration: '2:12' },
      { name: 'Marie', icon: 'person', timestamp: '3:15', duration: '1:16' }
    ];

    this.drivers = [
      { name: 'Alice', icon: 'person' },
      { name: 'Bob', icon: 'person' },
      { name: 'James', icon: 'person' },
      { name: 'Frank', icon: 'person' }
    ];

  }

  toggleReorder() {
    this.reorderIsEnabled = !this.reorderIsEnabled;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlanningPage');
  }

}

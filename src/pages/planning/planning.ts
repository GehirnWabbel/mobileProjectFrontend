import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-planning',
  templateUrl: 'planning.html',
})
export class PlanningPage {

  public items = []; // Protokoll items
  public drivers = []; // Fahrerplanung

  public reorderIsEnabled = false; // Ordnen der Fahrerplanung Button

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  

  toggleReorder() {
    this.reorderIsEnabled = !this.reorderIsEnabled;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlanningPage');
  }

}

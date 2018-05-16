import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-planning',
  templateUrl: 'planning.html',
})
export class PlanningPage {

  public drivers = [];
  public reorderIsEnabled = false;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  toggleReorder() {
    this.reorderIsEnabled = !this.reorderIsEnabled;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlanningPage');
  }

}

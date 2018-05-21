import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-planning-modal-add',
  templateUrl: 'planning-modal-add.html',
})
export class PlanningModalAddPage {

  public protocolItems: Array<{name: string, icon: string, timestamp: any, duration: any}> = this.navParams.get('protocolItems');
  
  constructor(
    private navParams: NavParams,
    public view: ViewController ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlanningModalAddPage');
  }

  closeAddModal() {
    this.view.dismiss();
  }
}

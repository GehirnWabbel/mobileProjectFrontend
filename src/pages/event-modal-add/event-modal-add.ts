import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {ApiServiceProvider} from "../../providers/api-service/api-service";
import { EventsPage } from "../events/events";

/**
 * Generated class for the EventModalAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-event-modal-add',
  templateUrl: 'event-modal-add.html',
})
export class EventModalAddPage {

  constructor(
    public view: ViewController,
    public apiProvider: ApiServiceProvider,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventModalAddPage');
  }

  addEvent(){
    this.navCtrl.setRoot(EventsPage);
  }

  closeAddModal() {
    this.view.dismiss();
  }

}

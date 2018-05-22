import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EventServiceProvider } from '../../providers/event-service/event-service';

/**
 * Generated class for the EventsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
})
export class EventsPage {

  allEvents: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private eventProvider: EventServiceProvider) {

    this.eventProvider.getEvents().then(data => {this.allEvents = data});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventsPage');
  }

}

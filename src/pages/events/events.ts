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

  private allEvents: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private eventProvider: EventServiceProvider) {

    this.eventProvider.getEvents().then(data => {this.allEvents = this.convertData(data)});
  }

  private convertData(data: any) {
    this.allEvents = data as Array<any>;
    EventsPage.formatDate(this.allEvents);
    return this.allEvents;
  }

  private static formatDate(data: any) {
    for(let i = 0; i < data.length; i++){
      // console.log(data[i].startdate);
      let fullDate = new Date(data[i].startdate);
      data[i].date = fullDate.getDate() + '.' + (fullDate.getMonth() + 1) + '.' + fullDate.getFullYear();
      // data[i].time = fullDate.getHours() + ':' + fullDate.getMinutes();
    }
    console.log(data);
  }

  navToEvent(id: string){
    //TODO: nav to Planning Page
    console.log(id);
  }

}

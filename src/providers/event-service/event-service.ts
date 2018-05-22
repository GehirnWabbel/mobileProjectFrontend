import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

/*
  Generated class for the EventServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class EventServiceProvider {

  private apiUrl: string = 'https://racemanager-mobile-project.herokuapp.com/team/5afd8827e9eb7d0014b71e25';

  constructor(public http: HttpClient) {
    console.log('Hello EventServiceProvider Provider');
  }

  getEvents() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl+'/event').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

}

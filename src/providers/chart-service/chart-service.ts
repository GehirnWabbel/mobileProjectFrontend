import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

// To be specified
const API: string = "https://racemanager-mobile-project.herokuapp.com/driverstats/";

@Injectable()
export class ChartServiceProvider {

  constructor(
    public http: Http) {
      
    console.log('Hello ChartServiceProvider Provider');
  }

  getDriverStats() {
    return this.http.get(API).map(response => response.json());
  }

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

// To be specified
// const API: string = "https://racemanager-mobile-project.herokuapp.com/driverstats/";

@Injectable()
export class ChartServiceProvider {

  constructor(
    public http: HttpClient) {

    console.log('Hello ChartServiceProvider Provider');
  }

  // getDriverStats() {
  //   return this.http.get(API).map(response => response.json());
  // }

}

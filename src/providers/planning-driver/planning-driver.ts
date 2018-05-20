import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

// To be specified
const API: string = "https://racemanager-mobile-project.herokuapp.com/team";

@Injectable()
export class PlanningDriverProvider {

  constructor(public http: Http) {
    console.log('Hello PlanningDriverProvider Provider');
  }

  // get drivers from backend
  getDriver() {
    return this.http.get(API).map(response => response.json());
  }

  // add driver to plan
  addDriverToPlan() {
    console.log("Driver added to plan");
  }

  //set Stint to 'done' and add to protocol
  setStintToDone() {
    console.log("Stint is now set to done and added to protocol");
  }

}

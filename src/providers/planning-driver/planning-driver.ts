import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';


export interface Stint { 
    finished: boolean;
    isBreak: boolean;
    raceDay: number;
    _id: String;
    orderNo: number;
    startdate: String;
    enddate: String;
    driver: {
      _id: String;
      name: String;
      connectedViaDevice: boolean;
      avatarNo: number;
      color: String;
    }
}

@Injectable()
export class PlanningDriverProvider {

  // To be specified
private apiUrl: string = "https://racemanager-mobile-project.herokuapp.com/team/5afd8827e9eb7d0014b71e25/event/5b03dbcf1dbbfe00142fc27a/stint";

  constructor(public http: HttpClient) {
    console.log('Hello PlanningDriverProvider Provider');
  }

// get drivers from backend
  getStints() {
      return new Promise(resolve => {
        this.http.get(this.apiUrl).subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
        });
      });
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

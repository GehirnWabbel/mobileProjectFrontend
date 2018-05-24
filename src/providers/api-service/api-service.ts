import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ApiServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiServiceProvider {

  private apiUrl: string = 'https://racemanager-mobile-project.herokuapp.com/team/5b06a79fef9f5500141336d2';

  constructor(
    public http: HttpClient) {

  }

  // get events from API
  getEvents() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl+'/event').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  // get stints from API
  getStints(eventId: any) {
    return new Promise(resolve => {
      this.http.get(this.apiUrl+'/event/'+ eventId + '/stint/').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  // update Stint to API
  // Sets a stint to finished -> stint will be a protocol item
  setStintToDone(eventId: any, finishedStint: any){
    console.log("Finished: " + finishedStint.finished);
    return new Promise(resolve => {
      this.http.put(this.apiUrl+'/event/'+ eventId + '/stint/' + finishedStint._id, JSON.stringify(finishedStint))
        .subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  createStint(eventId: any, driver: any){
    console.log("Trying to POST to : " + eventId);
    console.log("Trying to POST Driver: " + driver);
    return new Promise(resolve => {
      this.http.post(this.apiUrl+'/event/'+ eventId + '/stint/' + driver._id, JSON.stringify(driver))
        .subscribe(data => {
          resolve(data);
          console.log("STINT CREATED");
        }, err => {
          console.log(err);
        });
    });
  }

}

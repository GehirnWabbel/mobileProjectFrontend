import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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

  createStint(eventId: any, stintOfDriver: any){
    // console.log("Transfered Event ID : " + eventId);
    // console.log("Transfered Stint of Driver: " + stintOfDriver);

    // Clone old stint and create new one in correct Stint format
    // (only driver reference instead of complete driver object)

    const newStint = JSON.parse(JSON.stringify(stintOfDriver));
    delete newStint.driver;
    newStint.driverId = stintOfDriver.driver._id;
    newStint.finished = false;

    // TODO: get correct orderNo
    newStint.orderNo = 32;
    JSON.stringify(newStint);
    console.log(newStint);

    return new Promise(resolve => {
      this.http.post(this.apiUrl+'/event/'+ eventId + '/stint', newStint)
        .subscribe(data => {
          resolve(data);
          console.log("STINT CREATED");
        }, err => {
          console.log(err);
        });
    });

  }

}

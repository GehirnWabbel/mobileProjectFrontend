import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ApiServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiServiceProvider {

  private apiUrl: string = 'https://racemanager-mobile-project.herokuapp.com/team/';

  constructor(public http: HttpClient) {
    console.log('Hello ApiServiceProvider Provider');
  }

  getEvents() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl+'5b06a79fef9f5500141336d2/event').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  // get drivers from backend
  getStints() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl+'5b06a79fef9f5500141336d2/event/5b03dbcf1dbbfe00142fc27a/stint').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  setStintToDone(){

  }

  registerNewDriver(teamId: string, newDriver: any){

    return new Promise(resolve => {
      this.http.post(this.apiUrl+ teamId + '/person', newDriver,{headers: {'Content-Type': 'application/json'}}).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

}

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

  constructor(public http: HttpClient) {
    console.log('Hello ApiServiceProvider Provider');
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

  // get drivers from backend
  getStints() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl+'/event/5b03dbcf1dbbfe00142fc27a/stint').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  setStintToDone(){
    return null;
  }

}

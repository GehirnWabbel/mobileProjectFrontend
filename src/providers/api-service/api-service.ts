import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ApiServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiServiceProvider {

  private apiUrl: string = 'https://racemanager-mobile-project.herokuapp.com/team/5afd8827e9eb7d0014b71e25';

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

  getTeamMember() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/person').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    })
  }

}

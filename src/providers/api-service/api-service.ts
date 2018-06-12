import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class ApiServiceProvider {
  private apiUrl: string = "https://racemanager-mobile-project.herokuapp.com/team/";
    //"team/5b06a79fef9f5500141336d2";

  constructor(
    public http: HttpClient) {
  }

  // get events from API
  getEvents(teamId: string) {
    return new Promise(resolve => {
      this.http.get(this.apiUrl +  teamId + "/event").subscribe(
        data => {
          resolve(data);
        },
        err => {
          console.log(err);
        }
      );
    });
  }

  // get stints from API
  getStints(teamId: string, eventId: any) {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + teamId + "/event/" + eventId + "/stint/").subscribe(
        data => {
          resolve(data);
        },
        err => {
          console.log(err);
        }
      );
    });
  }

  // get drivers from API
  getDrivers(teamId: string){
    return new Promise(resolve => {
      this.http.get(this.apiUrl+ teamId + '/person?driver=true').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  // update Stint to API
  // Sets a stint to finished -> stint will be a protocol item
  setStintToDoneAPI(teamId: any, eventId: any, finishedStint: any, finishedStintId: any) {
    let toBePuttedStint = JSON.stringify(finishedStint);

    console.log("FINISHED STINT READY TO PUT: " + toBePuttedStint);
    return new Promise(resolve => {

      this.http
        .put(this.apiUrl + teamId + "/event/" + eventId + "/stint/" + finishedStintId, toBePuttedStint,
          {headers: {'Content-Type': 'application/json'}}).subscribe(data => {
            resolve(data);
          }, err => {
            console.log(err);
          }
        );
    });
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

  createStint(teamId: any, eventId: any, stintOfDriver: any) {
    // console.log("Transfered Event ID : " + eventId);
    // console.log("Transfered Stint of Driver: " + stintOfDriver);

    // Clone old stint and create new one in correct Stint format
    // (only driver reference instead of complete driver object)

    const newStint = JSON.parse(JSON.stringify(stintOfDriver));
    delete newStint.driver;
    delete newStint.orderNo;
    newStint.driverId = stintOfDriver.driver._id;
    newStint.finished = false;
    JSON.stringify(newStint);
    console.log('Object to be posted: ', newStint);

    return new Promise(resolve => {
      this.http
        .post(this.apiUrl + teamId + "/event/" + eventId + "/stint", newStint, {headers: {'Content-Type': 'application/json'}}).subscribe(data => {
            resolve(data);
            console.log("NEW STINT CREATED");
            // TODO: refresh planning page
          },
          err => {
            console.log(err);
          }
        );
    });
  }
}

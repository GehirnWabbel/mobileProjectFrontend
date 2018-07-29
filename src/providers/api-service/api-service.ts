import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LoadingController } from "ionic-angular";

export interface Stint {
  driverId: string;
  startdate: string; //ISO string
  enddate: string; //ISO string
  raceday: number;
  finished: boolean;
  isBreak: boolean;
  tags: Array<string>;
}

@Injectable()
export class ApiServiceProvider {
  private loading;
  private apiUrl: string = "https://racemanager-mobile-project.herokuapp.com/team/";

  constructor(public http: HttpClient, public loadingCtrl: LoadingController) {}

  presentLoading() {
    this.loading = this.loadingCtrl.create({
      spinner: "ios",
      content: "Lädt..."
    });

    this.loading.present();
  }

  // get events from API
  getEvents(teamId: string) {
    return new Promise(resolve => {
      this.presentLoading();
      this.http.get(this.apiUrl + teamId + "/event").subscribe(
        data => {
          resolve(data);
        },
        err => {
          console.log(err);
        },
        () => {
          this.loading.dismiss();
        }
      );
    });
  }

  // get single event from API
  getSingleEvent(teamId: string, eventId: string) {
    return new Promise(resolve => {
      this.presentLoading();
      this.http.get(this.apiUrl + teamId + "/event/" + eventId).subscribe(
        data => {
          resolve(data);
        },
        err => {
          console.log(err);
        },
        () => {
          this.loading.dismiss();
        }
      );
    });
  }

  // get stints from API
  getStints(teamId: string, eventId: any) {
    return new Promise(resolve => {
      this.http
        .get(this.apiUrl + teamId + "/event/" + eventId + "/stint/")
        .subscribe(
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
  getDrivers(teamId: string) {
    return new Promise(resolve => {
      this.presentLoading();
      this.http.get(this.apiUrl + teamId + "/person?driver=true").subscribe(
        data => {
          resolve(data);
        },
        err => {
          console.log(err);
        },
        () => {
          this.loading.dismiss();
        }
      );
    });
  }

  // update Stint to API -> stint will be finished -> protocol item
  setStintToDoneAPI(
    teamId: any,
    eventId: any,
    finishedStint: any,
    finishedStintId: any
  ) {
    let toBePuttedStint = JSON.stringify(finishedStint);

    console.log("FINISHED STINT READY TO PUT: " + toBePuttedStint);
    return new Promise(resolve => {
      this.http
        .put(
          this.apiUrl +
            teamId +
            "/event/" +
            eventId +
            "/stint/" +
            finishedStintId,
          toBePuttedStint,
          { headers: { "Content-Type": "application/json" } }
        )
        .subscribe(
          data => {
            resolve(data);
          },
          err => {
            console.log(err);
          }
        );
    });
  }

  registerNewDriver(teamId: string, newDriver: any) {
    return new Promise(resolve => {
      this.http
        .post(this.apiUrl + teamId + "/person", newDriver, {
          headers: { "Content-Type": "application/json" }
        })
        .subscribe(
          data => {
            resolve(data);
          },
          err => {
            console.log(err);
          }
        );
    });
  }

  createStint(
    teamId: string,
    eventId: string,
    idOfSelectedDriver: string,
    startdate: string, //ISO string
    enddate: string, //ISO string
    raceday: number,
    tagsArray: Array<string>
  ) {
    // Clone old stint and create new one in correct Stint format
    // only driver reference instead of complete driver object
    // const newStint = JSON.parse(JSON.stringify(stintOfDriver));
    // delete newStint.driver;
    // delete newStint.orderNo;
    // newStint.driverId = stintOfDriver.driver._id;
    // newStint.finished = false;

    const newStint: Stint = {
      driverId: idOfSelectedDriver,
      startdate: startdate,
      enddate: enddate,
      raceday: raceday,
      finished: false,
      isBreak: false,
      tags: tagsArray
    };

    JSON.stringify(newStint);

    return new Promise(resolve => {
      this.http
        .post(this.apiUrl + teamId + "/event/" + eventId + "/stint", newStint, {
          headers: { "Content-Type": "application/json" }
        })
        .subscribe(
          data => {
            resolve(data);
          },
          err => {
            console.log(err);
          }
        );
    });
  }

  // update Stint data, e.g. change driver of existing planned stint
  updateStintData(
    teamId: string,
    eventId: string,
    existingStintId: string,
    existingStint: any
  ) {
    let toBePuttedStint = JSON.stringify(existingStint);

    console.log("EXISTING STINT READY TO PUT: " + toBePuttedStint);
    return new Promise(resolve => {
      this.http
        .put(
          this.apiUrl +
          teamId +
          "/event/" +
          eventId +
          "/stint/" +
          existingStintId,
          toBePuttedStint,
          { headers: { "Content-Type": "application/json" } }
        )
        .subscribe(
          data => {
            resolve(data);
          },
          err => {
            console.log(err);
          }
        );
    });
  }

  createTeam(newTeamName: string) {
    return new Promise(resolve => {
      this.http
        .post(this.apiUrl, newTeamName, {
          headers: { "Content-Type": "application/json" }
        })
        .subscribe(
          data => {
            resolve(data);
          },
          err => {
            console.log(err);
          }
        );
    });
  }

  createEvent(newEvent: string, teamId: string) {
    let newEventJson = JSON.parse(JSON.stringify(newEvent));
    return new Promise(resolve => {
      this.http
        .post(this.apiUrl + teamId + "/event", newEventJson, {
          headers: { "Content-Type": "application/json" }
        })
        .subscribe(
          data => {
            resolve(data);
          },
          err => {
            console.log(err);
          }
        );
    });
  }

  getAllTeamMember(teamId: string) {
    this.presentLoading();
    return new Promise(resolve => {
      this.http.get(this.apiUrl + teamId + "/person").subscribe(
        data => {
          resolve(data);
        },
        err => {
          console.log(err);
        },
        () => {
          this.loading.dismiss();
        }
      );
    });
  }

  updateTeamMember(teamId: string, member: any) {
    this.presentLoading();
    return new Promise(resolve => {
      this.http
        .put(this.apiUrl + teamId + "/person/" + member._id, member, {
          headers: { "Content-Type": "application/json" }
        })
        .subscribe(
          data => {
            resolve(data);
          },
          err => {
            console.log(err);
          },
          () => {
            this.loading.dismiss();
          }
        );
    });
  }

  removeTeamMember(teamId: string, member: any) {
    return new Promise(resolve => {
      this.http
        .delete(this.apiUrl + teamId + "/person/" + member._id)
        .subscribe(
          data => {
            resolve(data);
          },
          err => {
            console.log(err);
          }
        );
    });
  }

  removePlannedStint(teamId: string, eventId: string, stintId: string) {
    return new Promise(resolve => {
      this.http
        .delete(this.apiUrl + teamId + "/event/" + eventId + "/stint/" + stintId)
        .subscribe(
          data => {
            resolve(data);
          },
          err => {
            console.log(err);
          }
        );
    });
  }
}

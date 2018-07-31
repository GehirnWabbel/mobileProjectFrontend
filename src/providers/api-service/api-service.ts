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
  // private apiUrl: string = "https://racemanager-mobile-project.herokuapp.com/team/";
  private apiUrl: string = "https://mobile-project-for-leon.herokuapp.com/team/";

  constructor(public http: HttpClient, public loadingCtrl: LoadingController) {}

  presentLoading() {
    this.loading = this.loadingCtrl.create({
      spinner: "ios",
      content: "Lädt..."
    });

    this.loading.present();
  }

  getEvents(teamId: string, memberId: string) {
    return new Promise((resolve, reject) => {
      this.presentLoading();
      this.http.get(this.apiUrl + teamId + "/event", {
        headers: { "X-Team-Member-Id": memberId }
      }).subscribe(
        data => {
          resolve(data);
        },
        err => {
          console.log("API Provider: " + err);
          this.loading.dismiss();
          reject(err);
        },
        () => {
          this.loading.dismiss();
        }
      );
    });
  }

  getSingleEvent(teamId: string, eventId: string, memberId: string) {
    return new Promise((resolve, reject) => {
      this.presentLoading();
      this.http.get(this.apiUrl + teamId + "/event/" + eventId, {
        headers: { "X-Team-Member-Id": memberId }
      }).subscribe(
        data => {
          resolve(data);
        },
        err => {
          console.log(err);
          this.loading.dismiss();
          reject(err);
        },
        () => {
          this.loading.dismiss();
        }
      );
    });
  }

  getStints(teamId: string, eventId: any, memberId: string) {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiUrl + teamId + "/event/" + eventId + "/stint/", {
          headers: { "X-Team-Member-Id": memberId }
        })
        .subscribe(
          data => {
            resolve(data);
          },
          err => {
            console.log(err);
            this.loading.dismiss();
            reject(err);
          }
        );
    });
  }

  getDrivers(teamId: string, memberId: string) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl + teamId + "/person?driver=true", {
        headers: { "X-Team-Member-Id": memberId }
      }).subscribe(
        data => {
          resolve(data);
        },
        err => {
          console.log(err);
          this.loading.dismiss();
          reject(err);
        },
        () => {
        }
      );
    });
  }

  registerNewDriver(teamId: string, newDriver: any) {
    return new Promise((resolve, reject) => {
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
            this.loading.dismiss();
            reject(err);
          }
        );
    });
  }

  createStint(
    teamId: string,
    eventId: string,
    idOfSelectedDriver: string,
    startdate: string,
    enddate: string,
    raceday: number,
    isBreakToogle: boolean,
    tagsArray: Array<string>,
    memberId: string
  ) {
    const newStint: Stint = {
      driverId: idOfSelectedDriver,
      startdate: startdate,
      enddate: enddate,
      raceday: raceday,
      finished: false,
      isBreak: isBreakToogle,
      tags: tagsArray
    };
    JSON.stringify(newStint);
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + teamId + "/event/" + eventId + "/stint", newStint, {
          headers: { "Content-Type": "application/json", "X-Team-Member-Id": memberId }
        })
        .subscribe(
          data => {
            resolve(data);
          },
          err => {
            console.log(err);
            this.loading.dismiss();
            reject(err);
          }
        );
    });
  }

  setStintToDoneAPI(
    teamId: any,
    eventId: any,
    finishedStint: any,
    finishedStintId: any,
    memberId: string
  ) {
    let toBePuttedStint = JSON.stringify(finishedStint);
    return new Promise((resolve, reject) => {
      this.http
        .put(
          this.apiUrl +
          teamId +
          "/event/" +
          eventId +
          "/stint/" +
          finishedStintId,
          toBePuttedStint,
          { headers: { "Content-Type": "application/json", "X-Team-Member-Id": memberId } }
        )
        .subscribe(
          data => {
            resolve(data);
          },
          err => {
            console.log(err);
            this.loading.dismiss();
            reject(err);
          }
        );
    });
  }

  updateStintData(
    teamId: string,
    eventId: string,
    existingStintId: string,
    existingStint: any,
    memberId: string
  ) {
    let toBePuttedStint = JSON.stringify(existingStint);
    return new Promise((resolve, reject) => {
      this.http
        .put(
          this.apiUrl +
            teamId +
            "/event/" +
            eventId +
            "/stint/" +
            existingStintId,
          toBePuttedStint,
          { headers: { "Content-Type": "application/json", "X-Team-Member-Id": memberId} }
        )
        .subscribe(
          data => {
            resolve(data);
          },
          err => {
            console.log(err);
            this.loading.dismiss();
            reject(err);
          }
        );
    });
  }

  createTeam(newTeamName: string) {
    return new Promise((resolve, reject) => {
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
            this.loading.dismiss();
            reject(err);
          }
        );
    });
  }

  createEvent(newEvent: string, teamId: string, memberId: string) {
    let newEventJson = JSON.parse(JSON.stringify(newEvent));
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + teamId + "/event", newEventJson, {
          headers: { "Content-Type": "application/json", "X-Team-Member-Id": memberId }
        })
        .subscribe(
          data => {
            resolve(data);
          },
          err => {
            console.log(err);
            this.loading.dismiss();
            reject(err);
          }
        );
    });
  }

  getAllTeamMember(teamId: string, memberId: string) {
    this.presentLoading();
    return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl + teamId + "/person", {
        headers: { "X-Team-Member-Id": memberId }
      }).subscribe(
        data => {
          resolve(data);
        },
        err => {
          console.log(err);
          this.loading.dismiss();
          reject(err);
        },
        () => {
          this.loading.dismiss();
        }
      );
    });
  }

  updateTeamMember(teamId: string, member: any, memberId: string) {
    this.presentLoading();
    return new Promise((resolve, reject) => {
      this.http
        .put(this.apiUrl + teamId + "/person/" + member._id, member, {
          headers: { "Content-Type": "application/json", "X-Team-Member-Id": memberId }
        })
        .subscribe(
          data => {
            resolve(data);
          },
          err => {
            console.log(err);
            this.loading.dismiss();
            reject(err);
          },
          () => {
            this.loading.dismiss();
          }
        );
    });
  }

  removeTeamMember(teamId: string, member: any, memberId: string) {
    return new Promise((resolve, reject) => {
      this.http
        .delete(this.apiUrl + teamId + "/person/" + member._id, {
          headers: { "X-Team-Member-Id": memberId }
        })
        .subscribe(
          data => {
            resolve(data);
          },
          err => {
            console.log(err);
            this.loading.dismiss();
            reject(err);
          }
        );
    });
  }

  removePlannedStint(teamId: string, eventId: string, stintId: string, memberId: string) {
    return new Promise((resolve, reject) => {
      this.http
        .delete(
          this.apiUrl + teamId + "/event/" + eventId + "/stint/" + stintId
        , {
            headers: { "X-Team-Member-Id": memberId }
          })
        .subscribe(
          data => {
            resolve(data);
          },
          err => {
            console.log(err);
            this.loading.dismiss();
            reject(err);
          }
        );
    });
  }
  getSingleTeamMember(teamId: string, memberId: string, userId: string) {
    this.presentLoading();
    return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl + teamId + '/person/' + memberId, {
        headers: { "X-Team-Member-Id": userId }
      }).subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
          this.loading.dismiss();
          reject(err);
        },
        () => {
          this.loading.dismiss();
        });
    })
  }

  getTeam(teamId : string, memberId: string) {
    this.presentLoading();
    return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl + teamId, {
        headers: { "X-Team-Member-Id": memberId }
      })
        .subscribe(
          data => {resolve(data);},
            err => {console.log(err); this.loading.dismiss(); reject(err);},
          () => {this.loading.dismiss();});
    })
  }


  deleteTeam(teamId: string, memberId: string) {
    return new Promise((resolve, reject) => {
      this.http.delete(this.apiUrl + teamId, {
        headers: { "X-Team-Member-Id": memberId }
      })
        .subscribe(data => resolve(data),
          err => {
          console.log(err);
          this.loading.dismiss();
          reject(err);
          })
    })
  }




  deleteEvent(eventId: string, teamId: string, memberId: string){
    return new Promise((resolve, reject) => {
      this.http.delete(this.apiUrl + teamId + "/event/" + eventId, { headers: { "Content-Type": "application/json", "X-Team-Member-Id": memberId }})
        .subscribe(data => {
            resolve(data);
          },
          err => {
            console.log(err);
            this.loading.dismiss();
            reject(err);
          }
        );
    });
  }


  getStatistics(eventId: string, teamId: string, finished: boolean, memberId: string) {
    return new Promise((resolve, reject) => {
      this.presentLoading();
      this.http.get(this.apiUrl + teamId + "/event/" + eventId + "/driver_stats?finished=" + finished,
        { headers: { "Content-Type" : "application/json", "X-Team-Member-Id": memberId}})
        .subscribe(data => {
            resolve(data);
          },
          err => {
            console.log(err);
            this.loading.dismiss();
            reject(err);
          },
          () => {
            this.loading.dismiss();
          })
    })
  }

  editEvent(event: string, teamId: string, eventId: string, memberId: string) {
    let newEventJson = JSON.parse(JSON.stringify(event));
    return new Promise((resolve, reject) => {
      this.http
        .put(this.apiUrl + teamId + "/event/" + eventId, newEventJson, {
          headers: { "Content-Type": "application/json", "X-Team-Member-Id": memberId }
        })
        .subscribe(
          data => {
            resolve(data);
          },
          err => {
            console.log(err);
            this.loading.dismiss();
            reject(err);
          }
        );
    });
  }
}

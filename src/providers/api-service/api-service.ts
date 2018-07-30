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

  getDrivers(teamId: string) {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + teamId + "/person?driver=true").subscribe(
        data => {
          resolve(data);
        },
        err => {
          console.log(err);
        },
        () => {
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
    startdate: string,
    enddate: string,
    raceday: number,
    isBreakToogle: boolean,
    tagsArray: Array<string>
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

  setStintToDoneAPI(
    teamId: any,
    eventId: any,
    finishedStint: any,
    finishedStintId: any
  ) {
    let toBePuttedStint = JSON.stringify(finishedStint);
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

  updateStintData(
    teamId: string,
    eventId: string,
    existingStintId: string,
    existingStint: any
  ) {
    let toBePuttedStint = JSON.stringify(existingStint);
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
        .delete(
          this.apiUrl + teamId + "/event/" + eventId + "/stint/" + stintId
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
  getSingleTeamMember(teamId: string, memberId: string) {
    this.presentLoading();
    return new Promise(resolve => {
      this.http.get(this.apiUrl + teamId + '/person/' + memberId).subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
        },
        () => {
          this.loading.dismiss();
        });
    })
  }

  getTeam(teamId : string) {
    this.presentLoading();
    return new Promise(resolve => {
      this.http.get(this.apiUrl + teamId)
        .subscribe(data => {resolve(data);}, err => {console.log(err);}, () => {this.loading.dismiss();});
    })
  }


  deleteTeam(teamId: string) {
    return new Promise(resolve => {
      this.http.delete(this.apiUrl + teamId)
        .subscribe(data => resolve(data),
          err => console.log(err))
    })
  }




  deleteEvent(eventId: string, teamId: string){
    return new Promise(resolve => {
      this.http.delete(this.apiUrl + teamId + "/event/" + eventId, { headers: { "Content-Type": "application/json" }})
        .subscribe(data => {
            resolve(data);
          },
          err => {
            console.log(err);
          }
        );
    });
  }


  getStatistics(eventId: string, teamId: string, finished: boolean) {
    return new Promise(resolve => {
      this.presentLoading();
      this.http.get(this.apiUrl + teamId + "/event/" + eventId + "/driver_stats?finished=" + finished,
        { headers: { "Content-Type" : "application/json"}})
        .subscribe(data => {
            resolve(data);
          },
          err => {
            console.log(err);
          },
          () => {
            this.loading.dismiss();
          })
    })
  }
}

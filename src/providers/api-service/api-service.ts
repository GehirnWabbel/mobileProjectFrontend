import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LoadingController } from "ionic-angular";

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

  createStint(teamId: any, eventId: any, stintOfDriver: any) {
    // Clone old stint and create new one in correct Stint format
    // only driver reference instead of complete driver object
    const newStint = JSON.parse(JSON.stringify(stintOfDriver));
    delete newStint.driver;
    delete newStint.orderNo;
    newStint.driverId = stintOfDriver.driver._id;
    newStint.finished = false;
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

  createEvent(newEvent: string, teamId: string){
    let newEventJson = JSON.parse(JSON.stringify(newEvent));
    return new Promise(resolve => {
      this.http.post(this.apiUrl + teamId + "/event", newEventJson, { headers: { "Content-Type": "application/json" }})
      .subscribe(data => {
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
      this.http.get(this.apiUrl + teamId + '/person?active=true').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      },
      () => {
        this.loading.dismiss();
      });
    })
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

  updateTeamMember(teamId : string, member : any) {
    this.presentLoading();
    return new Promise(resolve => {
      this.http.put(this.apiUrl + teamId + '/person/' + member._id, member, {
        headers: { "Content-Type": "application/json" }
      }).subscribe(
        data => {
          resolve(data);
        },
        err => {
          console.log(err);
        },
        () => {
          this.loading.dismiss();
        }
      )
    })
  }

  removeTeamMember(teamId : string, member: any) {
    member.active = false;
    return this.updateTeamMember(teamId, member);
  }

  getTeam(teamId : string) {
    this.presentLoading();
    return new Promise(resolve => {
      this.http.get(this.apiUrl + teamId)
      .subscribe(data => {resolve(data);}, err => {console.log(err);}, () => {this.loading.dismiss();});
    })
  }

  createTeam(newTeamName: string) {
    return new Promise(resolve => {
      this.http.post(this.apiUrl, newTeamName, { headers: { "Content-Type": "application/json" }})
      .subscribe(data => {
          resolve(data);
        },
        err => {
          console.log(err);
        }
      );
    });
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
}

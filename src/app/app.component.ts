import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { timer } from 'rxjs/observable/timer';

import { PlanningPage } from '../pages/planning/planning';
import { TeamMgmtPage } from '../pages/team-mgmt/team-mgmt';
import { EventsPage } from '../pages/events/events';
import { ChartPage } from '../pages/chart/chart';
import { JoinTeamPage } from '../pages/join-team/join-team';
import { CreateTeamPage } from "../pages/create-team/create-team";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = CreateTeamPage;

  pages: Array<{title: string, component: any, icon: string}>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen) {

    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Events', component: EventsPage, icon: 'trophy' },
      { title: 'Protokoll & Planung', component: PlanningPage, icon: 'clipboard' },
      { title: 'Statistiken', component: ChartPage, icon: 'stats' },
      { title: 'Team verwalten', component: TeamMgmtPage, icon: 'people' }
    ];
  }

  showSplash = true;

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      timer(2500).subscribe(() => this.showSplash = false); // <-- hide animation after 3.5s

      this.initializeUniversalLinks();

    });
  }

  initializeUniversalLinks() {
    if(window["universalLinks"]){
      window["universalLinks"].subscribe("joinTeam", eventData => {
        console.log("Opened through universal Link!");
        if(eventData.params.teamId) {
          this.nav.setRoot(JoinTeamPage, {
            teamId: eventData.params.teamId,
            teamName: eventData.params.teamName
          });
        }
      });
    }else
      console.log("No Universal Link Plugin avaliable!");
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}

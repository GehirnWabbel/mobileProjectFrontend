import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { timer } from 'rxjs/observable/timer';
import {Storage} from "@ionic/storage";

import { PlanningPage } from '../pages/planning/planning';
import { TeamMgmtPage } from '../pages/team-mgmt/team-mgmt';
import { EventsPage } from '../pages/events/events';
import { ChartPage } from '../pages/chart/chart';
import { JoinTeamPage } from '../pages/join-team/join-team';
import { CreateTeamPage } from "../pages/create-team/create-team";
import {Deeplinks} from "@ionic-native/deeplinks";
import {RootPageDeterminer} from "./RootPageDeterminer";
import {PushNotificationProvider} from "../providers/push-notification/push-notification";


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
    public splashScreen: SplashScreen,
    public deeplinks: Deeplinks,
    public storage: Storage,
    private pushNotificationProvider: PushNotificationProvider) {

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
  teamId;
  memberId;
  determineStartPageCallCount = 0;
  launchedFromDeeplink = false;

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.pushNotificationProvider.init();
      this.statusBar.styleDefault();
      this.splashScreen.hide();


      timer(2500).subscribe(() => this.showSplash = false); // <-- hide animation after 3.5s

      //check for existing teamId and memberId in storage
      this.storage.get("teamId").then(val => {
        this.teamId = val;
        console.log("App Component: Found TeamId: " + this.teamId);
        this.determineStartPage();
      });

      this.storage.get("memberId").then(val => {
        this.memberId = val;
        console.log("App Component: Found MemberId: " + this.memberId);
        this.determineStartPage();
      });

      this.deeplinks.route({ //todo: what happens if one is already in a team?
        '/join': {"join": true}
      } ).subscribe((match) => {
        //alert(JSON.stringify(match.$args.teamname));
        console.log("App Component: " + match.$args);
        this.launchedFromDeeplink = true; //prevent redirection by root page determination
        this.nav.setRoot(JoinTeamPage, {"teamId": match.$args.teamid, "teamName": match.$args.teamname});
      }, (noMatch) => {
        alert(JSON.stringify(noMatch));
      } )
    });
  }

  determineStartPage(){
    ++this.determineStartPageCallCount;
    if(this.determineStartPageCallCount >= 2 && !this.launchedFromDeeplink){
      RootPageDeterminer.determineAndNavigateToRootPage(this.nav, this.teamId, this.memberId);
    }
  }

  clearStorage() {
    this.storage.clear().then(() => console.log("App Component: Storage cleared"));
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}

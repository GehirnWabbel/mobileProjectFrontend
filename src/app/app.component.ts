import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { NewDriverPage } from '../pages/new-driver/new-driver';
import { PlanningPage } from '../pages/planning/planning';
import { TeamMgmtPage } from '../pages/team-mgmt/team-mgmt';
import { EventsPage } from '../pages/events/events';
import { ChartPage } from '../pages/chart/chart';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'List', component: ListPage },
      { title: 'Events', component: EventsPage },
      { title: 'Neuer Fahrer', component: NewDriverPage },
      { title: 'Teamverwaltung', component: TeamMgmtPage },
      { title: 'Diagramm', component: ChartPage },
      { title: 'Planung', component: PlanningPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}

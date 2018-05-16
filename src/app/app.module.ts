import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { NewDriverPage } from '../pages/new-driver/new-driver';
import { PlanningPage } from '../pages/planning/planning';
import { TeamMgmtPage } from '../pages/team-mgmt/team-mgmt';
import { EventsPage } from '../pages/events/events';
import { ChartPage } from '../pages/chart/chart';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    NewDriverPage,
    PlanningPage,
    TeamMgmtPage,
    EventsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    NewDriverPage,
    PlanningPage,
    TeamMgmtPage,
    EventsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

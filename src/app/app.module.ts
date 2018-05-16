import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { PlanningPage } from '../pages/planning/planning';
import { TeamMgmtPage } from '../pages/team-mgmt/team-mgmt';
import { EventsPage } from '../pages/events/events';
import { ChartPage } from '../pages/chart/chart';
import { JoinTeamPage } from '../pages/join-team/join-team';
import { MemberMgmtPage } from '../pages/member-mgmt/member-mgmt';
import { CreateTeamPage } from '../pages/create-team/create-team';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PlanningDriverProvider } from '../providers/planning-driver/planning-driver';

@NgModule({
  declarations: [
    MyApp,
    PlanningPage,
    TeamMgmtPage,
    EventsPage,
    ChartPage,
    JoinTeamPage,
    MemberMgmtPage,
    CreateTeamPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PlanningPage,
    TeamMgmtPage,
    EventsPage,
    ChartPage,
    JoinTeamPage,
    MemberMgmtPage,
    CreateTeamPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    PlanningDriverProvider
  ]
})
export class AppModule {}

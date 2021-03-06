import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';
import { Deeplinks } from '@ionic-native/deeplinks';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { OneSignal } from '@ionic-native/onesignal';

import { PlanningPage } from '../pages/planning/planning';
import { PlanningModalAddPage} from "../pages/planning-modal-add/planning-modal-add";
import { EventModalAddPage} from "../pages/event-modal-add/event-modal-add";
import { TeamMgmtPage } from '../pages/team-mgmt/team-mgmt';
import { EventsPage } from '../pages/events/events';
import { ChartPage } from '../pages/chart/chart';
import { JoinTeamPage } from '../pages/join-team/join-team';
import { MemberMgmtPage } from '../pages/member-mgmt/member-mgmt';
import { CreateTeamPage } from '../pages/create-team/create-team';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ApiServiceProvider } from '../providers/api-service/api-service';
import {SocialSharing} from "@ionic-native/social-sharing";
import {TeamMgmtPopoverPage} from "../pages/team-mgmt-popover/team-mgmt-popover";
import {InfoPage} from "../pages/info/info";
import { PushNotificationProvider } from '../providers/push-notification/push-notification';

@NgModule({
  declarations: [
    MyApp,
    PlanningPage,
    TeamMgmtPage,
    EventsPage,
    ChartPage,
    JoinTeamPage,
    MemberMgmtPage,
    CreateTeamPage,
    PlanningModalAddPage,
    EventModalAddPage,
    TeamMgmtPopoverPage,
    InfoPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(
      MyApp,
      {},
      {
        links: [
          { component: PlanningPage, name: 'planning', segment: 'planning' },
          { component: TeamMgmtPage, name: 'teammgmt', segment: 'teammgmt' },
          { component: EventsPage, name: 'event', segment: 'event' },
          { component: ChartPage, name: 'chart', segment: 'chart' },
          { component: JoinTeamPage, name: 'join', segment: 'join' },
          { component: MemberMgmtPage, name: 'membermgmt', segment: 'membermgmt' },
          { component: CreateTeamPage, name: 'create', segment: 'create' },
          { component: InfoPage, name: 'info', segment: 'info'}
          ]}),
    HttpClientModule,
    IonicStorageModule.forRoot()
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
    CreateTeamPage,
    PlanningModalAddPage,
    EventModalAddPage,
    TeamMgmtPopoverPage,
    InfoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiServiceProvider,
    SocialSharing,
    Deeplinks,
    LaunchNavigator,
    OneSignal,
    PushNotificationProvider
  ]
})
export class AppModule {}

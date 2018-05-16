import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TeamMgmtPage } from './team-mgmt';

@NgModule({
  declarations: [
    TeamMgmtPage,
  ],
  imports: [
    IonicPageModule.forChild(TeamMgmtPage),
  ],
})
export class TeamMgmtPageModule {}

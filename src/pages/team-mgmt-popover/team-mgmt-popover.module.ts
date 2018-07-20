import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TeamMgmtPopoverPage } from './team-mgmt-popover';

@NgModule({
  declarations: [
    TeamMgmtPopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(TeamMgmtPopoverPage),
  ],
})
export class TeamMgmtPopoverPageModule {}

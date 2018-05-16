import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JoinTeamPage } from './join-team';

@NgModule({
  declarations: [
    JoinTeamPage,
  ],
  imports: [
    IonicPageModule.forChild(JoinTeamPage),
  ],
})
export class JoinTeamPageModule {}

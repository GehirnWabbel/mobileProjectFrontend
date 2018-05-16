import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateTeamPage } from './create-team';

@NgModule({
  declarations: [
    CreateTeamPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateTeamPage),
  ],
})
export class CreateTeamPageModule {}

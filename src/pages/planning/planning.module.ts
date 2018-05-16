import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlanningPage } from './planning';

@NgModule({
  declarations: [
    PlanningPage,
  ],
  imports: [
    IonicPageModule.forChild(PlanningPage),
  ],
})
export class PlanningPageModule {}

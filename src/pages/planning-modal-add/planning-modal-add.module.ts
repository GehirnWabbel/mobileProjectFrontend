import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlanningModalAddPage } from './planning-modal-add';

@NgModule({
  declarations: [
    PlanningModalAddPage,
  ],
  imports: [
    IonicPageModule.forChild(PlanningModalAddPage),
  ],
})
export class PlanningModalAddPageModule {}

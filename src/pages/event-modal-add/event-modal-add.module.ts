import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventModalAddPage } from './event-modal-add';

@NgModule({
  declarations: [
    EventModalAddPage,
  ],
  imports: [
    IonicPageModule.forChild(EventModalAddPage),
  ],
})
export class EventModalAddPageModule {}

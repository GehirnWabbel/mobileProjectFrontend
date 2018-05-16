import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewDriverPage } from './new-driver';

@NgModule({
  declarations: [
    NewDriverPage,
  ],
  imports: [
    IonicPageModule.forChild(NewDriverPage),
  ],
})
export class NewDriverPageModule {}

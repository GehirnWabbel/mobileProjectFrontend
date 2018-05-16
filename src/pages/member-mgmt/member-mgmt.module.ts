import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MemberMgmtPage } from './member-mgmt';

@NgModule({
  declarations: [
    MemberMgmtPage,
  ],
  imports: [
    IonicPageModule.forChild(MemberMgmtPage),
  ],
})
export class MemberMgmtPageModule {}

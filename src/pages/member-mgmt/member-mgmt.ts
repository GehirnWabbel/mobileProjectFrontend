import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the MemberMgmtPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-member-mgmt',
  templateUrl: 'member-mgmt.html',
})
export class MemberMgmtPage {

  member; //data of person to be edited

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.member = this.navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MemberMgmtPage');
  }

  colorForward() {

  }

  colorBackward() {

  }

  avatarForward() {
    this.member.avatarNo++;
    if(this.member.avatarNo > 18)
      this.member.avatarNo -= 18;
  }

  avatarBackward() {
    this.member.avatarNo--;
    if(this.member.avatarNo < 1)
      this.member.avatarNo += 18;
  }

  isDriverChanged() {
    this.member.driver = !this.member.driver;
    console.log(this.member.driver);
  }

}

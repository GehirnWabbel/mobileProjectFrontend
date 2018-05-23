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

  member;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.member = this.navParams.data;
    console.log(this.member);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MemberMgmtPage');
  }

}

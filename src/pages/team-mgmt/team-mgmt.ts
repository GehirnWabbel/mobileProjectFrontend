import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ApiServiceProvider} from "../../providers/api-service/api-service";
import {MemberMgmtPage} from "../member-mgmt/member-mgmt";

/**
 * Generated class for the TeamMgmtPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-team-mgmt',
  templateUrl: 'team-mgmt.html',
})
export class TeamMgmtPage {

  allDrivers = [];
  allManagements = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private apiProvider: ApiServiceProvider) {
    this.apiProvider.getTeamMember().then(data => {
      this.parseTeamMember(data);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TeamMgmtPage');
  }

  parseTeamMember(data: any){
    let allMember = data as Array<any>;
    for (let i=0; i < allMember.length; i++){
      let member = allMember[i];
      if(member.driver)
        this.allDrivers.push(member);
      else
        this.allManagements.push(member);
    }
  }

  navToPersonMgmt(person: any) {
    this.navCtrl.push(MemberMgmtPage, person);
  }

}

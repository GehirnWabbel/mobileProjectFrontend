// Checks which page to open upon app start or a refresh with error
import {NavController} from "ionic-angular";
import {EventsPage} from "../pages/events/events";
import {MemberMgmtPage} from "../pages/member-mgmt/member-mgmt";
import {CreateTeamPage} from "../pages/create-team/create-team";

export class RootPageDeterminer {
  static determineAndNavigateToRootPage(navCtrl : NavController, teamId: string, memberId: string) {
    if(teamId && memberId) {
      //found a team and a member id, so going for the EventsPage
      console.log("Root Page Determiner: Navigating to Events Page");
      navCtrl.setRoot(EventsPage);
      return;
    }

    if(teamId) {
      //found a team but no member id; this happens when leaving during team creation
      //the we want to bring back the member registration page for that team
      console.log("Root Page Determiner: Navigating to MemberMgmtPage");
      navCtrl.setRoot(MemberMgmtPage, {
        person: {
          name: "",
          driver: true,
          connectedViaDevice: true,
          color: 1,
          avatarNo: 1,
          minutesBeforeNotification: 30
        },
        mode: 'new',
        allowCancel: false,
        teamId: teamId
      });
      return;
    }

    //if we found none of the above go to the create team page
    console.log("Root Page Determiner: Navigating to CreateTeamPage");
    navCtrl.setRoot(CreateTeamPage);
  }
}

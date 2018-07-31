import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {OneSignal} from "@ionic-native/onesignal";
import {Platform} from "ionic-angular";

/*
  Generated class for the PushNotificationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PushNotificationProvider {

  constructor(
    public http: HttpClient,
    private platform: Platform,
    private oneSignal: OneSignal ) {

  }

    init(){
      if(this.platform.is('core')){
        return ;
      }

      this.oneSignal.startInit('064d5b24-973b-4fca-91ca-33b6532214fe');
      this.oneSignal.handleNotificationOpened().subscribe((notification) =>{
        alert(JSON.stringify(notification));
      });

      this.oneSignal.getIds().then((ids) => {
        alert(ids.userId);
        alert(ids.pushToken);
      });

      this.oneSignal.endInit();
    }


}

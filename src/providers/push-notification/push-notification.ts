import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {OneSignal} from "@ionic-native/onesignal";
import {Platform} from "ionic-angular";
import {Storage} from "@ionic/storage";

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
    private oneSignal: OneSignal,
    private storage: Storage) {

  }

    init(sub){
      if(this.platform.is('core')){
        return ;
      }

      this.oneSignal.startInit('064d5b24-973b-4fca-91ca-33b6532214fe');

      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);

      //define behavior by notification
      this.oneSignal.handleNotificationOpened().subscribe((notification) =>{
        let eventId = notification.notification.payload.additionalData.eventId;
        console.log("event Id: " + eventId);
        this.storage.set('eventId', eventId).then( data => {
          console.log("event id stored")
          sub();
        });
      });

      this.oneSignal.endInit();

      this.oneSignal.getIds().then((ids) => {
        let id = ids.userId;
        this.storage.set("notificationId", id);
      });
    }

}

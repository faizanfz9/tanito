import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationService { 
  url = environment.baseUrl;
  loggedUser: any;
  profilePath = "https://tanito.in/admin/assets/user-profile/";

  constructor(private db: AngularFireDatabase, 
    private authService: AuthService,
    private userService: UserService,
    private http: HttpClient) { 
    this.authService.user.subscribe((res: any) => {
      this.loggedUser = res.data;
    })
    this.loggedUser = JSON.parse(this.userService.getUser());
  }

  sendNotification(userId: any, userPic: any, notification: any) {
    const timestamp = Date();
    let notifications = this.getNotification(userId);
    notifications.push({
      notification: notification,
      userPic: userPic,
      timestamp: timestamp,
      isRead: false
    })
  }

  getNotification(userId: any) {
    return this.db.list("/notifications/" + userId);
  }

  readNotification() {
    let loggedUserId = this.loggedUser.id;
    let db = this.db;
    this.db.database.ref("/notifications/").once("value").then(function(snapshot){
      let data = snapshot.child(loggedUserId).val();
      for (const key in data) {
        db.list("/notifications/" + loggedUserId).update(key, {
          isRead: true
        })
      }
    })
  }

  getAnnouncement() {
    return this.http.get(this.url + "/notification");
  }

  announcementUrlArr(annIdArr: any, userId: any) {
    let array: any = [];
    annIdArr.forEach((annId: any) => {
      let notiInfo = new FormData();
      notiInfo.append('user_id', userId);
      notiInfo.append('noti_id', annId);
      array.push(this.http.post(this.url + "/read_notification", notiInfo));
    })
    return array;
  }
}

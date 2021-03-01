import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService { 
  loggedUser: any;

  constructor(private db: AngularFireDatabase, private authService: AuthService, private userService: UserService) { 
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
}

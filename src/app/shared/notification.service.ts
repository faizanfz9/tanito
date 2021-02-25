import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private db: AngularFireDatabase) { 
  }

  sendNotification(userId: any, userPic: any, notification: any) {
    const timestamp = Date();
    let notifications = this.getNotification(userId);
    notifications.push({
      notification: notification,
      userPic: userPic,
      timestamp: timestamp
    })
  }

  getNotification(userId: any) {
    return this.db.list("/notification/" + userId);
  }
}

import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  sender: any;
  senderId: any;
  receiverId: any;
  lastMsg: any;
  chatId: any;
  profilePath = "https://tanito.in/admin/assets/user-profile/";

  constructor(private userService: UserService,
    private db: AngularFireDatabase) {
    this.sender = JSON.parse(this.userService.getUser());
    this.senderId = this.sender.id;
  }

  sendMessage(msg: string, attachment: any, chatRoomId: any) {
    // const timestamp = this.getTimeStamp();
    let chatMessage: any = [];
    chatMessage = this.getMessages(chatRoomId);
    this.lastMsg = msg;
    chatMessage.push({
      message: msg,
      attachment: attachment,
      timeSent: Date(),
      senderPic: this.sender.profile_img,
      senderType: this.sender.usertype,
      senderId: this.senderId
    })
  }

  getMessages(chatRoomId: any) {
    this.chatId = chatRoomId;
    return this.db.list("/chats/" + this.chatId);
  }

  // getTimeStamp() {
  //   const now = new Date();
  //   // const time = now.toLocaleDateString() + " | " + now.getHours() + ':' +
  //   //              now.getMinutes();
  //   return now;
  // }

  getRooms(senderId: any) {
    return this.db.list("/members/" + senderId);
  }

  createRoom(receiver: any) {
    let sender = this.sender;
    let receiverId = receiver.user_id;
    let chatId = this.chatId;
    let last_msg = this.lastMsg;
    let db = this.db;
    this.db.database.ref("/members/").once("value").then(function(snapshot){
      let senderRooms: any = [];
      let senderArr = snapshot.child(sender.id).val();
      let receiverArr = snapshot.child(receiverId).val();
      for (const key in senderArr) {
        senderRooms.push(senderArr[key]);
      }
      let isRoomExist = senderRooms.some((item: any) => item.memberId == receiverId);
      if(!isRoomExist) {
         db.list("/members/" + sender.id).push({
          chatId: chatId,
          memberId: receiverId,
          memberName: receiver.username,
          profileImg: receiver.profile_img,
          lastMsg: "You: " + (last_msg.length > 0 ? last_msg : "File"),
          msgSeen: true
        })
        db.list("/members/" + receiverId).push({
          chatId: chatId,
          memberId: sender.id,
          memberName: sender.username,
          profileImg: sender.profile_img.slice(sender.profile_img.lastIndexOf("/") + 1),
          lastMsg: sender.username.slice(0, sender.username.indexOf(" ")) + ": " + (last_msg.length > 0 ? last_msg : "File"),
          newMsg: 1,
          msgSeen: false
        })
      }
      else {
        for (const key in senderArr) {
          if(senderArr[key].memberId == receiverId) {
            db.list("/members/" + sender.id).update(key, {
              lastMsg: "You: " + (last_msg.length > 0 ? last_msg : "File"),
              msgSeen: true
            })
            break;
          }
        }
        for (const key in receiverArr) {
          if(receiverArr[key].memberId == sender.id) {
            db.list("/members/" + receiverId).update(key, {
              lastMsg: sender.username.slice(0, sender.username.indexOf(" ")) + ": " + (last_msg.length > 0 ? last_msg : "File"),
              newMsg: 1,
              msgSeen: false
            })
            break;
          }
        }
      }
    })
  }

  readNewMsg(receiver_id: any) {
    let sender = this.sender;
    let receiverId = receiver_id;
    let db = this.db;
    this.db.database.ref("/members/").once("value").then(function(snapshot){
      let senderArr = snapshot.child(sender.id).val();
      for (const key in senderArr) {
        if(senderArr[key].memberId == receiverId) {
          db.list("/members/" + sender.id).update(key, {
            msgSeen: true
          })
          break;
        }
      }
    })
  }
}

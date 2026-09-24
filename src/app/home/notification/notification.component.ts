import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController, ToastController } from '@ionic/angular';
import { DateUtilService } from 'src/app/common/util/date-util.service';
import { AddNotificationModalComponent } from './add-notification-modal/add-notification-modal.component';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
  notifications: any[] = [];
  sucessNotificationCount: number = 0;
  failNotificationCount: number = 0;
  constructor(
    private modalController: ModalController,
    private firestore: AngularFirestore,
    private dateUtilService: DateUtilService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.notifications = [];
    this.getAllNotifications();
  }


  getAllNotifications() {
    this.notifications = [];
    this.firestore.collection("admin_notifications", ref => ref).get().subscribe(data => {
      if (!data.empty) {
        data.forEach(res => {
          let noti = res.data();
          noti['id'] = res.id;
          this.notifications.push(noti);
        })
      }
    });

  }

  doRefresh(event){
    this.getAllNotifications();
    event.target.complete();
  }

  deleteNotifications(noti) {
    this.firestore.collection("admin_notifications").doc(noti.id).delete().then(result => {
      this.getAllNotifications();
      this.presentToast('Notification Deleted Sucessfully!!');
    });


  }

  sendNotifications(noti) {
    this.failNotificationCount = 0;
    this.sucessNotificationCount = 0;
    if (null != noti.stateId && null != noti.districtId && null != noti.cityId && null != noti.boardId && null != noti.schoolId && null != noti.classId) {
      this.firestore.collection("users", ref => ref
        .where('userType', '==', 'student')
        .where('boardId', '==', noti.boardId)
        .where('districtId', '==', noti.districtId)
        .where('cityId', '==', noti.cityId)
        .where('stateId', '==', noti.stateId)
        .where('schoolId', '==', noti.schoolId)
        .where('classId', '==', noti.classId)
      ).get().subscribe(data => {
        if (!data.empty) {
          data.forEach(res => {
            if (noti.type == 'PUSH') {
              this.processPushNotification(noti, res.data());
            }
            if (noti.type == 'SMS') {
              this.processSMSNotification(noti, res.data());
            }
          })
          let lastProcessDate = this.dateUtilService.getCurrentDateWithTime()
          this.firestore.collection("admin_notifications").doc(noti.id).update({
            sucesscount: this.sucessNotificationCount,
            failCount: this.failNotificationCount,
            lastProcessDate: lastProcessDate
          }).then(result => {
            noti.sucesscount = this.sucessNotificationCount;
            noti.failCount = this.failNotificationCount;
            noti.lastProcessDate = lastProcessDate;
            let notiindex = this.notifications.findIndex(not => not.id == noti.id);
            if (notiindex != -1) {
              this.notifications[notiindex] = noti;
            }

          })
        }
      });
    } else if (null != noti.stateId && null != noti.districtId && null != noti.cityId && null != noti.boardId && null != noti.schoolId) {
      this.firestore.collection("users", ref => ref
        .where('userType', '==', 'student')
        .where('boardId', '==', noti.boardId)
        .where('districtId', '==', noti.districtId)
        .where('cityId', '==', noti.cityId)
        .where('stateId', '==', noti.stateId)
        .where('schoolId', '==', noti.schoolId)
      ).get().subscribe(data => {
        if (!data.empty) {
          data.forEach(res => {
            if (noti.type == 'PUSH') {
              this.processPushNotification(noti, res.data());
            }
            if (noti.type == 'SMS') {
              this.processSMSNotification(noti, res.data());
            }
          })

          let lastProcessDate = this.dateUtilService.getCurrentDateWithTime()
          this.firestore.collection("admin_notifications").doc(noti.id).update({
            sucesscount: this.sucessNotificationCount,
            failCount: this.failNotificationCount,
            lastProcessDate: lastProcessDate
          }).then(result => {
            noti.sucesscount = this.sucessNotificationCount;
            noti.failCount = this.failNotificationCount;
            noti.lastProcessDate = lastProcessDate;
            let notiindex = this.notifications.findIndex(not => not.id == noti.id);
            if (notiindex != -1) {
              this.notifications[notiindex] = noti;
            }
          })
        }
      });
    } else if (null != noti.stateId && null != noti.districtId && null != noti.cityId && null != noti.boardId) {
      this.firestore.collection("users", ref => ref
        .where('userType', '==', 'student')
        .where('boardId', '==', noti.boardId)
        .where('districtId', '==', noti.districtId)
        .where('cityId', '==', noti.cityId)
        .where('stateId', '==', noti.stateId)
      ).get().subscribe(data => {
        if (!data.empty) {
          data.forEach(res => {
            if (noti.type == 'PUSH') {
              this.processPushNotification(noti, res.data());
            }
            if (noti.type == 'SMS') {
              this.processSMSNotification(noti, res.data());
            }
          })
          let lastProcessDate = this.dateUtilService.getCurrentDateWithTime()
          this.firestore.collection("admin_notifications").doc(noti.id).update({
            sucesscount: this.sucessNotificationCount,
            failCount: this.failNotificationCount,
            lastProcessDate: lastProcessDate
          }).then(result => {
            noti.sucesscount = this.sucessNotificationCount;
            noti.failCount = this.failNotificationCount;
            noti.lastProcessDate = lastProcessDate;
            let notiindex = this.notifications.findIndex(not => not.id == noti.id);
            if (notiindex != -1) {
              this.notifications[notiindex] = noti;
            }
          })
        }
      });
    } else if (null != noti.stateId && null != noti.districtId && null != noti.boardId) {
      this.firestore.collection("users", ref => ref
        .where('userType', '==', 'student')
        .where('boardId', '==', noti.boardId)
        .where('districtId', '==', noti.districtId)
        .where('stateId', '==', noti.stateId)
      ).get().subscribe(data => {
        if (!data.empty) {
          data.forEach(res => {
            if (noti.type == 'PUSH') {
              this.processPushNotification(noti, res.data());
            }
            if (noti.type == 'SMS') {
              this.processSMSNotification(noti, res.data());
            }
          })
          let lastProcessDate = this.dateUtilService.getCurrentDateWithTime()
          this.firestore.collection("admin_notifications").doc(noti.id).update({
            sucesscount: this.sucessNotificationCount,
            failCount: this.failNotificationCount,
            lastProcessDate: lastProcessDate
          }).then(result => {
            noti.sucesscount = this.sucessNotificationCount;
            noti.failCount = this.failNotificationCount;
            noti.lastProcessDate = lastProcessDate;
            let notiindex = this.notifications.findIndex(not => not.id == noti.id);
            if (notiindex != -1) {
              this.notifications[notiindex] = noti;
            }
          })
        }
      });
    } else if (null != noti.stateId && null != noti.boardId) {
      this.firestore.collection("users", ref => ref
        .where('userType', '==', 'student')
        .where('boardId', '==', noti.boardId)
        .where('stateId', '==', noti.stateId)
      ).get().subscribe(data => {
        if (!data.empty) {
          data.forEach(res => {
            if (noti.type == 'PUSH') {
              this.processPushNotification(noti, res.data());
            }
            if (noti.type == 'SMS') {
              this.processSMSNotification(noti, res.data());
            }
          });
          let lastProcessDate = this.dateUtilService.getCurrentDateWithTime()
          this.firestore.collection("admin_notifications").doc(noti.id).update({
            sucesscount: this.sucessNotificationCount,
            failCount: this.failNotificationCount,
            lastProcessDate: lastProcessDate
          }).then(result => {
            noti.sucesscount = this.sucessNotificationCount;
            noti.failCount = this.failNotificationCount;
            noti.lastProcessDate = lastProcessDate;
            let notiindex = this.notifications.findIndex(not => not.id == noti.id);
            if (notiindex != -1) {
              this.notifications[notiindex] = noti;
            }
          })
        }
      });
    } else if (null != noti.stateId && null != noti.boardId) {
      this.firestore.collection("users", ref => ref
        .where('userType', '==', 'student')
        .where('boardId', '==', noti.boardId)
      ).get().subscribe(data => {
        if (!data.empty) {
          data.forEach(res => {
            if (noti.type == 'PUSH') {
              this.processPushNotification(noti, res.data());
            }
            if (noti.type == 'SMS') {
              this.processSMSNotification(noti, res.data());
            }
          });
          let lastProcessDate = this.dateUtilService.getCurrentDateWithTime()
          this.firestore.collection("admin_notifications").doc(noti.id).update({
            sucesscount: this.sucessNotificationCount,
            failCount: this.failNotificationCount,
            lastProcessDate: lastProcessDate
          }).then(result => {
            noti.sucesscount = this.sucessNotificationCount;
            noti.failCount = this.failNotificationCount;
            noti.lastProcessDate = lastProcessDate;
            let notiindex = this.notifications.findIndex(not => not.id == noti.id);
            if (notiindex != -1) {
              this.notifications[notiindex] = noti;
            }
          })
        }

      });
    }
  }



  processSMSNotification(noti, user) {
    if (null != user.mobileNo) {
      let userData = {
        name: user.firstName,
        id: user.id,
        phoneNo: user.mobileNo
      }
      let createEventNotification = {
        creationDate: this.dateUtilService.getCurrentDateWithTime(),
        types: "SMS",
        functionType: noti.functionType,
        body: null,
        to: null,
        userDetail: userData
      }
      createEventNotification.body = `Dear ${userData.name} , ` + noti.msg;
      createEventNotification.to = userData.phoneNo;
      return this.firestore.collection('user_message_sms')
        .add(JSON.parse(JSON.stringify(createEventNotification))).then(result => {
          this.sucessNotificationCount = this.sucessNotificationCount + 1;
        });
    } else {
      this.failNotificationCount = this.failNotificationCount + 1;
    }
  }

  processPushNotification(notification, user) {
    if (null != user.token) {
      let userData = {
        name: user.firstName,
        id: user.id,
        token: user.token
      }
      let createEventNotification = {
        creationDate: this.dateUtilService.getCurrentDateWithTime(),
        type: notification.functionType,
        id: notification.id,
        name: notification.name,
        types: "PUSH",
        functionType: notification.functionType,
        msgText: null,
        title: null,
        receivers: [] = [userData],
        receiversId: [] = [userData.id],
        userDetail: userData
      }

      createEventNotification.msgText = `Dear ${userData.name} , ` + notification.msg;
      createEventNotification.title = notification.name;

      return this.firestore.collection('user_message_push')
        .add(JSON.parse(JSON.stringify(createEventNotification))).then(result => {
          this.sucessNotificationCount = this.sucessNotificationCount + 1;
        });
    } else {
      this.failNotificationCount = this.failNotificationCount + 1;
    }

  }



  async editNotifications(noti) {
    const modal = await this.modalController.create({
      component: AddNotificationModalComponent,
      componentProps: {
        notification: noti
      },
      cssClass: 'addEvent-modal',
      backdropDismiss: false
    });
    await modal.present();
  }
  async onClickAddEdit() {
    const modal = await this.modalController.create({
      component: AddNotificationModalComponent,
      componentProps: {},
      cssClass: 'addEvent-modal',
      backdropDismiss: false
    });
    await modal.present();

  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    await toast.present();
  }



}

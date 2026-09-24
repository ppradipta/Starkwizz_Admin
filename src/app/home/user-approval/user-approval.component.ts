import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { EventsService } from 'src/app/services/events.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-approval',
  templateUrl: './user-approval.component.html',
  styleUrls: ['./user-approval.component.scss'],
})
export class UserApprovalComponent implements OnInit {
  pendingApprovals: any[] = [];
  approved: any[] = [];
  segmentValue: string = 'PENDING';
  constructor(
    private firestore: AngularFirestore,
    private toastController: ToastController,
    private eventsService: EventsService,
    private alertController: AlertController,
    private router: Router,
    private user: UserService,
  ) { }

  ngOnInit() {
    this.getAllPendingUserProfileChanges();
    this.getAllApprovedserProfileChanges();
    this.ionViewWillEnter()
  }

  ionViewWillEnter() {
    this.getAllPendingUserProfileChanges();
    this.getAllApprovedserProfileChanges();
  }

  eventTabChanged(event) {
    this.segmentValue = event.detail.value;
    if (this.segmentValue == 'PENDING') {
      this.getAllPendingUserProfileChanges();
    }
    if (this.segmentValue == 'APPROVED') {
      this.getAllApprovedserProfileChanges();
    }
  }

  getAllPendingUserProfileChanges() {
    this.firestore.collection("user_approval", ref => ref.where("status", "==", 'REQUESTED')).get().subscribe(data => {
      if (!data.empty) {
        data.forEach((res: any) => {
          let record = res.data();
          record['id'] = res.id;
          let paindex = this.pendingApprovals.findIndex(paprroval => paprroval.id == record.id);
          if (paindex == -1) {
            this.pendingApprovals.push(record);
          } else {
            this.pendingApprovals[paindex] = record;
          }

        })
      }
    });
  }

  getAllApprovedserProfileChanges() {
    this.firestore.collection("user_approval", ref => ref.where("status", "==", 'APPROVED')).get().subscribe(data => {
      if (!data.empty) {
        data.forEach((res: any) => {
          let record = res.data();
          record['id'] = res.id;
          let aindex = this.approved.findIndex(paprroval => paprroval.id == record.id);
          if (aindex == -1) {
            this.approved.push(record);
          } else {
            this.approved[aindex] = record;
          }
        })
      }
    });
  }

  approveUserProfile(profile) {
    this.firestore.collection("user_approval").doc(profile.id).update({
      status: 'APPROVED'
    }).then(result => {
      if (null != profile.changeDetails.boardId && null != profile.changeDetails.classId) {
        this.firestore.collection("users").doc(profile.userId).update({
          boardId: profile.changeDetails.boardId,
          boardName: profile.changeDetails.boardName,
          classId: profile.changeDetails.classId,
          className: profile.changeDetails.className,
        }).then(result => {
          this.firestore.collection("users_profile").doc(profile.userId).update({
            boardId: profile.changeDetails.boardId,
            boardName: profile.changeDetails.boardName,
            classId: profile.changeDetails.classId,
            className: profile.changeDetails.className,
          }).then(result => {
            this.presentToast('Approved Profile Changes Sucessfully!!!');
            this.eventsService.processProfileUpdateNotification(profile, 'USER_PROFILE_CHANGE_REQUEST', profile.changeDetails, 'Approved');
            this.eventsService.processProfileUpdateSMS(profile, profile.mobileNo, 'USER_PROFILE_CHANGE_REQUEST', profile.changeDetails, 'Approved');
          });
        })
      }
      else if (null != profile.changeDetails.boardId) {
        this.firestore.collection("users").doc(profile.userId).update({
          boardId: profile.changeDetails.boardId,
          boardName: profile.changeDetails.boardName,
        }).then(result => {
          this.firestore.collection("users_profile").doc(profile.userId).update({
            boardId: profile.changeDetails.boardId,
            boardName: profile.changeDetails.boardName
          }).then(result => {
            this.presentToast('Approved Profile Changes Sucessfully!!!');
            this.eventsService.processProfileUpdateNotification(profile, 'USER_PROFILE_CHANGE_REQUEST', profile.changeDetails, 'Approved');
            this.eventsService.processProfileUpdateSMS(profile, profile.mobileNo, 'USER_PROFILE_CHANGE_REQUEST', profile.changeDetails, 'Approved');
          })
        })
      } else if (null != profile.changeDetails.classId) {
        this.firestore.collection("users").doc(profile.userId).update({
          classId: profile.changeDetails.classId,
          className: profile.changeDetails.className,
        }).then(result => {
          this.firestore.collection("users_profile").doc(profile.userId).update({
            classId: profile.changeDetails.classId,
            className: profile.changeDetails.className,
          }).then(result => {
            this.presentToast('Approved Profile Changes Sucessfully!!!');
            this.eventsService.processProfileUpdateNotification(profile, 'USER_PROFILE_CHANGE_REQUEST', profile.changeDetails, 'Approved');
            this.eventsService.processProfileUpdateSMS(profile, profile.mobileNo, 'USER_PROFILE_CHANGE_REQUEST', profile.changeDetails, 'Approved');
          })
        })
      }

    })
    this.getAllPendingUserProfileChanges();

  }

  declineUserProfile(profile) {
    this.firestore.collection("user_approval").doc(profile.id).update({
      status: 'REJECTED'
    }).then(result => {
      this.getAllPendingUserProfileChanges();
      this.presentToast('Rejected Profile Changes !!!');
    })
  }


  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    await toast.present();
  }

  checkForDynamoSubscription(pending) {
    this.firestore.collection("user_subscription", ref => ref
      .where("userId", "==", pending.userId)).get().subscribe(data => {
      if (!data.empty) {
        data.forEach((res: any) => {
          let record = res.data();
        });
      }
    });
  }

  checkForEventSubscription(pending) {
    this.firestore.collection("user_event_subscription", ref => ref
      .where("userId", "==", pending.userId)).get().subscribe(data => {
      if (!data.empty) {
        data.forEach((res: any) => {
          let record = res.data();
        });
      }
    });
  }

  async deleteUserApproval(record) {
    const alert = await this.alertController.create({
      header: "Confirm Alert",
      message: `Deleting <b>${record.displayName}</b>, Are you Sure ?`,
      cssClass: 'customAlert',
      buttons: [
        {
          text: `Cancel `,
          role: "CANCEL",
          cssClass: "secondary",
          handler: (CANCEL) => {
          }
        },
        {
          text: `Delete`,
          role: "DELETE",
          handler: async (DELETE) => {
            this.firestore.collection('user_approval').doc(record.id).delete().then(result => {
              this.presentToast('User Remove successfully!!!');
              let index = this.approved.findIndex(app => app.id == record.id);
              if (index != -1) {
                this.approved.splice(index, 1);
              }
              this.getAllApprovedserProfileChanges();
            })
          }
        }
      ]
    });
    await alert.present();
  }

  goToUserApproval(data: any) {
    this.user.setUserTxnHistory(data);
    this.router.navigate(['home/userTxnHistory'], { queryParams: { TYPE: 'APPROVAL' } });
  }

}

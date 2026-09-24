import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController, ToastController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-cancel-subscription',
  templateUrl: './cancel-subscription.component.html',
  styleUrls: ['./cancel-subscription.component.scss'],
})
export class CancelSubscriptionComponent implements OnInit {
  subsList: any[] = [];
  segmentValue: string = 'ACTIVE';

  constructor(
    private firestore: AngularFirestore,
    private toastController: ToastController,
    private alertController: AlertController,
    private userService: UserService,
  ) {
    // this.segmentValue = 'ACTIVE';
  }

  ngOnInit() {

    this.getCancelSubscription();
  }

  subscriptionTabChanged(event) {
    this.segmentValue = event.detail.value;
    this.getCancelSubscription();
  }

  getCancelSubscription() {
    this.firestore.collection("cancel_subscription", ref => ref
      .where("status", "==", this.segmentValue)
    ).get().subscribe(data => {
      this.subsList = [];
      if (!data.empty) {
        data.forEach((res: any) => {
          let record = res.data();
          this.subsList.push(record);
        });
      }
    });

  }


  async presentAlertForUpdateStatus(record) {
    const alert = await this.alertController.create({
      message: 'Are you sure you want to Status Update!',
      cssClass: 'customAlert customAlert1',
      header: "Confirm",
      buttons: [{
        text: 'PENDING',
        role: 'NO',
        cssClass: 'secondary',
        handler: (blah) => {
          console.log('Confirm Cancel: blah');
          this.firestore.collection('cancel_subscription').doc(record.id).update({
            status: 'PENDING'
          }).then(result => {
            this.presentToast('Status updated sucessfully!!!');
            this.getCancelSubscription();
          })
        }
      }, {
        text: 'REJECT',
        handler: () => {
          console.log('Confirm YES: Yeahh');
          this.firestore.collection('cancel_subscription').doc(record.id).update({
            status: 'REJECT'
          }).then(result => {
            this.presentToast('Status updated sucessfully!!!');
            this.getCancelSubscription();
          })
        }
      },
      , {
        text: 'APPROVE',
        handler: () => {
          console.log('Confirm YES: Yeahh');
         this.cancelSubscription(record);
        }
      }]
    });
    await alert.present();
  }

  async presentAlertForStatusPending(record) {
    const alert = await this.alertController.create({
      message: 'Are you sure you want to Status Update!',
      cssClass: 'customAlert',
      header: "Confirm",
      buttons: [{
        text: 'REJECT',
        role: 'NO',
        cssClass: 'secondary',
        handler: (blah) => {
          console.log('Confirm Cancel: blah');
          this.firestore.collection('cancel_subscription').doc(record.id).update({
            status: 'REJECT'
          }).then(result => {
            this.presentToast('Status updated sucessfully!!!');
            this.getCancelSubscription();
          })
        }
      }, {
        text: 'APPROVE',
        handler: () => {
          console.log('Confirm YES: Yeahh');
         this.cancelSubscription(record);
        }
      }]
    });
    await alert.present();
  }

  cancelSubscription (record) {
    this.firestore.collection('cancel_subscription').doc(record.id).update({
      status: 'APPROVE'
    }).then(result => {
      this.userService.onClickCancelSubsTransaction(record);
      this.userService.onClickCancelDynamoSubscription(record);
      this.userService.onClickCancelEventSubscription(record);
      this.userService.onClickCancelQuizwhizzSubscription(record);
      this.presentToast('Status updated sucessfully!!!');
      this.getCancelSubscription();
    })
   
  }

  async presentAlertForDelete(record) {
    const alert = await this.alertController.create({
      message: 'Are you sure you want to Delete!',
      cssClass: 'customAlert',
      header: "Confirm",
      buttons: [{
        text: 'NO',
        role: 'NO',
        cssClass: 'secondary',
        handler: (blah) => {
          console.log('Confirm Cancel: blah');
    
        }
      }, {
        text: 'YES',
        handler: () => {
          console.log('Confirm YES: Yeahh');
            this.firestore.collection('cancel_subscription').doc(record.id).delete().then(result => {
              this.presentToast('Cancel Subscripiton Deleted sucessfully!!');
              this.getCancelSubscription();
            });
          
        }
      }]
    });
    await alert.present();
  }


  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    await toast.present();
  }
}


import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { DateUtilService } from 'src/app/common/util/date-util.service';
import { FirebaseCollection } from 'src/app/model/comman/firebase-collection';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-txn-history',
  templateUrl: './user-txn-history.component.html',
  styleUrls: ['./user-txn-history.component.scss'],
})
export class UserTxnHistoryComponent implements OnInit {
  txnHistory: any[] = [];
  examDetail: any[] = [];
  // @Input() user: any;
  user: any = {};
  userType = [
    { name: 'Profile', value: 'PROFILE' },
    { name: 'Transaction History', value: 'TXN_HISTORY' },
    { name: 'Events', value: 'EVENTS' },
    { name: 'Dynamo', value: 'DYNAMO' },
    { name: 'QuizWhizz', value: 'QUIZWHIZZ' },
  ];
  segmentValue: string = 'TXN_HISTORY';
  userDetail: any;
  typeUsers: string = '';
  approvalUser: any = {};
  userId: any;

  constructor(
    private router: Router,
    private dateUtilService: DateUtilService,
    private firestore: AngularFirestore,
    private userService: UserService,
    private alertController: AlertController,
    private toastController: ToastController,
    private route: ActivatedRoute,
    private navCtrl: NavController,
  ) {
    this.typeUsers = this.route.snapshot.queryParams['TYPE'];
  }

  ngOnInit() {
    this.userService.getUserTxnHistory().subscribe(user => {
      this.user = user;
      if (this.typeUsers == 'STUDENT') {
        this.userId = user.id;
      }
      if (this.typeUsers == 'APPROVAL') {
        this.userId = user.userId;
      }
    });


    if (this.typeUsers == 'APPROVAL') {
      this.firestore.collection("users", ref => ref
        .where("id", "==", this.user?.userId)).get().subscribe(data => {
          if (!data.empty) {
            data.forEach((res: any) => {
              this.approvalUser = res.data();
            });
          }
        });
    }

    this.getTxnHistory();
    this.getUserEventData();
  }
  
  goBack() {
    this.navCtrl.back();
  }

  tabChanged(event) {
    this.segmentValue = event.detail.value;
    if (this.segmentValue == 'TXN_HISTORY') {
      this.getTxnHistory();
    } else {
      this.getUserEventData();
    }
  }

  getTxnHistory() {
    const query = this.firestore.collection('transaction').ref
      .where("userid", "==", this.userId).limit(50);
    query.get().then((txnRecords: any) => {
      this.txnHistory = [];
      if (!txnRecords.empty) {
        txnRecords.forEach((data: any) => {
          let txn: any = data.data();
          txn.expiredDays = this.dateUtilService.getDateDifferenceInDays(txn.endDate);
          this.txnHistory.push(txn);
        });
        this.txnHistory = this.dateUtilService.sortingBasedSubscriptionDate(this.txnHistory);
      }

    });
  }

  getUserEventData() {
    let collection = this.segmentValue == 'QUIZWHIZZ' ? 'user_quizwhizz_events' : this.segmentValue == 'DYNAMO' ? 'user_dyanmo_exam' : FirebaseCollection.USER_EVENTS;
    this.firestore.collection(collection, ref => ref
      .where('classId', '==', this.user.classId)
      .where('boardId', '==', this.user.boardId)
      .where('userId', '==', this.userId))
      .get().subscribe(data => {
        this.examDetail = [];
        if (!data.empty) {
          data.forEach((data: any) => {
            let exam: any = data.data();
            this.examDetail.push(exam);
          });
        }

      });

  }

  async presentAlertBlockUsers(record) {
    const alert = await this.alertController.create({
      header: "Confirm Alert",
      message: 'Are you sure you want to Block Student!',
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
          text: `Block`,
          role: "BLOCK",
          handler: async (DELETE) => {
            this.firestore.collection('users').doc(record.id).update({
              status: 'BLOCK',
            }).then(result => {
              this.presentToast(`${record.displayName} Student Block successfully!!`);
            })
          }
        }
      ]
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

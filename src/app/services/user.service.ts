import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ReplaySubject } from 'rxjs';
import { DateUtilService } from '../common/util/date-util.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    userDetails = new ReplaySubject<any>(1);
    txnDetail = new ReplaySubject<any>(1);
    viewDetails = new ReplaySubject<any>(1);
    constructor(
        private firestore: AngularFirestore,
        private dateUtil: DateUtilService,
    ) {

    }
    setUserDetails(user: any) {
        this.userDetails.next(user);
    }

    getUserDetails() {
        return this.userDetails.asObservable();
    }

    setUserTxnHistory(data: any) {
        this.txnDetail.next(data);
    }

    getUserTxnHistory() {
        return this.txnDetail.asObservable();
    }

    setViewDetails(user: any) {
        this.viewDetails.next(user);
    }

    getViewDetails() {
        return this.viewDetails.asObservable();
    }


    onClickCancelSubsTransaction(record: any) {
        this.firestore.collection("transaction", ref => ref
          .where("userid", "==", record.userId)
          .where("boardName", "==", record.boardName)
          .where("classId", "==", record.classId)
          .where("status", "==", 'SUCCESS'))
          .get().subscribe((results: any) => {
            if (!results.empty) {
              results.forEach(result => {
                let subscription = result.data();
                this.firestore.collection('transaction').doc(subscription.id).update({
                  cancelSubscriptionDate: this.dateUtil.getCurrentDateWithYYYYMMDD(),
                  subsType: 'CANCEL',
                  cancelId: record.id,
                  cancelDetail: {
                    date: this.dateUtil.getCurrentDateWithYYYYMMDD(),
                    cancelId: record.id,
                    reason: record.reason,
                    message: record.message,
                  },
                });
              });
            }
          });
      }
    
      onClickCancelDynamoSubscription(record: any) {
        this.firestore.collection("user_subscription", ref => ref
          .where("userId", "==", record.id)
          .where("boardName", "==", record.boardName)
          .where("classId", "==", record.classId)
          .where("status", "==", 'SUBSCRIBE'))
          .get().subscribe((results: any) => {
            if (!results.empty) {
              results.forEach(result => {
                let subscription = result.data();
                this.firestore.collection('user_subscription').doc(subscription.id).update({
                  cancelSubscriptionDate: this.dateUtil.getCurrentDateWithYYYYMMDD(),
                  status: 'CANCEL',
                  cancelId: record.id,
                  cancelDetail: {
                    date: this.dateUtil.getCurrentDateWithYYYYMMDD(),
                    cancelId: record.id,
                    reason: record.reason,
                    message: record.message,
                  },
                });
              });
            } 
          });
      }
    
      onClickCancelEventSubscription(record: any) {
        this.firestore.collection("user_subscription_event", ref => ref
          .where("userId", "==", record.id)
          .where("boardName", "==", record.boardName)
          .where("classId", "==", record.classId)
          .where("status", "==", 'SUBSCRIBE'))
          .get().subscribe((results: any) => {
            if (!results.empty) {
              results.forEach(result => {
                let subscription = result.data();
                this.firestore.collection('user_subscription_event').doc(subscription.id).update({
                  cancelSubscriptionDate: this.dateUtil.getCurrentDateWithYYYYMMDD(),
                  status: 'CANCEL',
                  cancelId: record.id,
                  cancelDetail: {
                    date: this.dateUtil.getCurrentDateWithYYYYMMDD(),
                    cancelId: record.id,
                    reason: record.reason,
                    message: record.message,
                  },
                });
              });
            }
          });
      }
    
      onClickCancelQuizwhizzSubscription(record: any) {
        this.firestore.collection("user_subscription_quizwhizz", ref => ref
          .where("userId", "==", record.id)
          .where("boardName", "==", record.boardName)
          .where("classId", "==", record.classId)
          .where("status", "==", 'SUBSCRIBE'))
          .get().subscribe((results: any) => {
            if (!results.empty) {
              results.forEach(result => {
                let subscription = result.data();
                this.firestore.collection('user_subscription_quizwhizz').doc(subscription.id).update({
                  cancelSubscriptionDate: this.dateUtil.getCurrentDateWithYYYYMMDD(),
                  status: 'CANCEL',
                  cancelId: record.id,
                  cancelDetail: {
                    date: this.dateUtil.getCurrentDateWithYYYYMMDD(),
                    cancelId: record.id,
                    reason: record.reason,
                    message: record.message,
                  },
                });
              });
            }
          });
      }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IonModal, ToastController } from '@ionic/angular';
import { DateUtilService } from 'src/app/common/util/date-util.service';
import { GenerateKeyService } from 'src/app/model/comman/common.generatekey';
import { FirebaseCollection } from 'src/app/model/comman/firebase-collection';

@Component({
  selector: 'app-type-freetrial',
  templateUrl: './type-freetrial.component.html',
  styleUrls: ['./type-freetrial.component.scss'],
})
export class TypeFreetrialComponent implements OnInit {
  trialList: any[] = [];
  @ViewChild(IonModal) freeTrialModal: IonModal;
  isFreeTrialOpen: boolean = false;
  boardDetails: any = [];
  classDetails: any = [];
  selectBoard: any = {};
  selectClass: any = {};
  totalDays: string = '';
  limitCount: string = '';
  constructor(
    private firestore: AngularFirestore,
    private generateKey: GenerateKeyService,
    private toastController: ToastController,
    private dateUtil: DateUtilService
  ) { }

  ngOnInit() {

    this.getFreeTrialList();
    this.getAllBoardData();
  }

  getFreeTrialList() {
    this.firestore.collection('freeTrial_subscription').valueChanges().subscribe((records: any[]) => {
      this.trialList = records;
    });
  }

  async addFreeTrial() {
    this.isFreeTrialOpen = true;
  }


  blockModalDismiss() {
    this.isFreeTrialOpen = false;
    this.freeTrialModal.dismiss(null, 'cancel');
  }


  deleteFreeTrial(trial: any) {
    this.firestore.collection('freeTrial_subscription').doc(trial.id).delete().then(result => {
      this.presentToast('Free Trial Deleted sucessfully!!');
      this.getFreeTrialList();
    });
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    await toast.present();
  }

  getAllBoardData() {
    const query = this.firestore.collection(FirebaseCollection.BOARD_OF_EDUCATION);
    query.ref
      .get().then((boards: any) => {
        this.boardDetails = [];
        if (!boards.empty) {
          boards.forEach(data => {
            this.boardDetails.push(data.data());
          });
        }
      })
  }


  selectClasses(event) {
    this.classDetails = [];
    this.firestore.collection("classes", ref => ref.where("boardId", "==", this.selectBoard.id)).get().subscribe(data => {
      data.forEach(res => {
        this.classDetails.push(res.data());
        this.classDetails = this.classDetails.sort((a, b) => (a.displayName > b.displayName) ? 1 : -1);
      })
    });
  }

  createFreeTrial() {
    let trialData = {
      id: this.generateKey.generateUniqueFirestoreId(),
      boardId: this.selectBoard.id,
      boardName: this.selectBoard.name,
      classId: this.selectClass.id,
      className: this.selectClass.name,
      totalDays: this.totalDays,
      limitCount: this.limitCount,
      creationdate: this.dateUtil.getCurrentDateWithYYYYMMDD(),
      createDateUnix: this.dateUtil.getCurrentEpochTime(),
    }

    this.firestore.collection('freeTrial_subscription').doc(trialData.id)
      .set(JSON.parse(JSON.stringify(trialData)), { merge: true }).then(result => {
        this.presentToast('Free Trial added sucessfully!!');
        this.blockModalDismiss();
      });
  }


}



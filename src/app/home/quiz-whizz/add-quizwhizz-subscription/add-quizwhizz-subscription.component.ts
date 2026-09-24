import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController, ToastController } from '@ionic/angular';
import { DateUtilService } from 'src/app/common/util/date-util.service';
import { GenerateKeyService } from 'src/app/model/comman/common.generatekey';
import { FirebaseCollection } from 'src/app/model/comman/firebase-collection';
import { Events } from 'src/app/model/events';
import { EventsService } from 'src/app/services/events.service';


@Component({
  selector: 'app-add-quizwhizz-subscription',
  templateUrl: './add-quizwhizz-subscription.component.html',
  styleUrls: ['./add-quizwhizz-subscription.component.scss'],
})
export class AddQuizwhizzSubscriptionComponent implements OnInit {
  @Input() actionType: string;
  @Input() SubscriptionSetp: any;

  boardDetails: any[] = [];
  classDetails: any[] = [];
  subsDetail: Events = new Events();

  constructor(
    private modalController: ModalController,
    private firestore: AngularFirestore,
    public eventsService: EventsService,
    private toastController: ToastController,
    private dateUtil: DateUtilService,
    private generateKey: GenerateKeyService,
  ) { }

  ngOnInit() {

    this.getAllBoardData();
  }

  close() {
    this.modalController.dismiss();
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


  selectClass(event) {
    let boarddetls = this.boardDetails.find(cld => cld.id == this.subsDetail.boardId);
    if (boarddetls) {
      this.subsDetail.boardName = boarddetls.name;
    }
    this.classDetails = [];
    this.firestore.collection("classes", ref => ref.where("boardId", "==", this.subsDetail.boardId)).get().subscribe(data => {
      data.forEach(res => {
        this.classDetails.push(res.data());
        this.classDetails = this.classDetails.sort((a, b) => (a.displayName > b.displayName) ? 1 : -1);
      })
    });
  }

  saveEvent() {
    let classdetls = this.classDetails.find(cld => cld.id == this.subsDetail.classId);
    if (classdetls) {
      this.subsDetail.className = classdetls.name;
    }
    if (null == this.subsDetail.boardId && null == this.subsDetail.classId) {
      this.presentToast("Event Category and Event Type can't be empty");
    } else {

      let eventData: any = {
        id: this.actionType == 'EDIT' ? this.SubscriptionSetp.id : this.generateKey.generateUniqueFirestoreId(),
        creationDate: this.dateUtil.getCurrentDateWithYYYYMMDD(),
        eventMonth: this.dateUtil.getCurrentMonth(),
        boardName: this.subsDetail.boardName,
        boardId: this.subsDetail.boardId,
        className: this.subsDetail.className,
        classId: this.subsDetail.classId,
        subscriptionAmount: this.subsDetail.price,
      };

      this.eventsService.setQuizWhizzSubscriptionCollecton(eventData).then((data) => {
        this.presentToast("Create QuizWhizz Subscription Successfully !!!");
      });
    }

    this.close();
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    await toast.present();
  }

}

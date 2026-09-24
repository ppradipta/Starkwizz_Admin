import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController, ToastController } from '@ionic/angular';
import { ViewQuestionImageModalComponent } from 'src/app/home/question/questions-list/view-question-image-modal/view-question-image-modal.component';

@Component({
  selector: 'app-event-activity-detail',
  templateUrl: './event-activity-detail.component.html',
  styleUrls: ['./event-activity-detail.component.scss'],
})
export class EventActivityDetailComponent implements OnInit {

  @Input() activity: any;
  constructor(
    private firestore: AngularFirestore,
    private modalController: ModalController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    console.log(this.activity);
  }

  close() {
    this.modalController.dismiss();
  }

  confirmEvaluation(quest) {
    let questionIndex = this.activity.questions.findIndex(aquest => aquest.id == quest.id);
    if (questionIndex != -1) {
      this.activity.questions[questionIndex].mark = quest.mark;
      this.activity.totalSecuredMark = this.activity.totalSecuredMark + quest.mark;
      this.activity.totalCorrectMark = this.activity.totalCorrectMark + quest.mark;
    }
  }

  async previewImage(question) {
    console.log();
    const modal = await this.modalController.create({
      component: ViewQuestionImageModalComponent,
      componentProps: {
        question: question
      },
      cssClass: 'addQuestion-modal',
      backdropDismiss: true
    });
    return await modal.present();
  }

  finalizedEventEvaluation() {
    this.firestore.collection('user_events').doc(this.activity.id).set(JSON.parse(JSON.stringify(this.activity)), { merge: true }).then(result => {
      this.presentToast('Event evaluate sucessfully!!!')
    })
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    await toast.present();
  }

}

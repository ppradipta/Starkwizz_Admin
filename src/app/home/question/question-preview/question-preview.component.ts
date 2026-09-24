import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { Events } from 'src/app/model/events';
import { Questions } from 'src/app/model/questions';
import { EventsService } from 'src/app/services/events.service';

@Component({
  selector: 'app-question-preview',
  templateUrl: './question-preview.component.html',
  styleUrls: ['./question-preview.component.scss'],
})
export class QuestionPreviewComponent implements OnInit {
  questionList: any[]=[];
  questionListFilter: any;
  isClicked: boolean = false;
  eventData: Events;

  constructor(
    private toastController: ToastController,
    private firestore: AngularFirestore,
    public eventsService: EventsService,
    private router: Router,
    private navCtrl: NavController,

  ) { }

  ngOnInit() {

    this.eventsService.getEventData().subscribe(event => {
      this.eventData = event;
    })

  }

  viewQuestionRelatedToEvent() {
    if (this.eventData) {
      this.getAllQuestionsForEvent();
    } else {
      this.presentToast('No Event Select for Seeting Questions');
    }

  }

  getAllQuestionsForEvent() {
    this.questionList = [];
    if (this.eventData.moduleId) {
      this.firestore.collection("questions", ref =>
        ref.where("class.id", "==", this.eventData.classId)
          .where("subject.id", "==", this.eventData.subjectId)
          .where("module.id", "==", this.eventData.moduleId)
          .where("board", "==", this.eventData.boardName)
      ).get().subscribe((data: any) => {
        data.forEach(res => {
          let qus: Questions = res.data();
          if (this.eventData.questions.length > 0) {
            let foundIndex = this.eventData.questions.findIndex(equs => equs.id == qus.id);
            if (foundIndex != -1) {
              qus['isSelected'] = true;
              qus['isExistPreviously'] = true;
            }
          }
          this.questionList.push(qus);
        })
      });
    } else {
      this.firestore.collection("questions", ref =>
        ref.where("class.id", "==", this.eventData.classId)
          .where("subject.id", "==", this.eventData.subjectId)
          .where("board", "==", this.eventData.boardName)
      ).get().subscribe((data: any) => {
        data.forEach(res => {
          let qus: Questions = res.data();
          if (this.eventData.questions.length > 0) {
            let foundIndex = this.eventData.questions.findIndex(equs => equs.id == qus.id);
            if (foundIndex != -1) {
              qus['isSelected'] = true;
            }
          }
          this.questionList.push(qus);
        })
      });
    }

  }


  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    await toast.present();
  }

  selectQuestion(event, question) {
    this.isClicked = true;
    if (event.detail.checked) {
      let foundIndex = this.questionList.findIndex(qus => qus.id == question.id);
      if (foundIndex != -1) {
        this.questionList[foundIndex].isSelected = true;
      }
    } else {
      let foundIndex = this.questionList.findIndex(qus => qus.id == question.id);
      if (foundIndex != -1) {
        this.questionList[foundIndex].isSelected = false;
      }
    }
  }

  save() {
    const questions = this.questionList.filter(qus => (qus.isSelected == true))
    let questionData = this.eventsService.populateQuestionToCollection(questions, this.eventData);
    questionData.status = 'UPCOMING';
    this.firestore.collection('events').doc(this.eventData.id)
      .set(JSON.parse(JSON.stringify(questionData)), { merge: true }).then((data) => {
        this.navCtrl.back();
      });
  }


  checkUncheckAll(event) {
    this.isClicked = true;
    if (event.detail.checked) {
      this.questionList.forEach(qus => {
        qus.isSelected = true;
      });
    } else {
      this.questionList.forEach(qus => {
        if (qus.isExistPreviously) {
          qus.isSelected = true;
        } else {
          qus.isSelected = false;
        }

      });
    }
  }
  goBack() {
    this.navCtrl.back();
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController, ToastController } from '@ionic/angular';
import { BoardOfEducation } from 'src/app/model/board';
import { Classes } from 'src/app/model/classes';
import { FirebaseCollection } from 'src/app/model/comman/firebase-collection';
import { Module } from 'src/app/model/module';
import { Questions } from 'src/app/model/questions';
import { Subjects } from 'src/app/model/subject';
import { QuestionService } from 'src/app/services/question.service';
import { UtilityService } from 'src/app/utils/utils.service';
import { UploadQuestionComponent } from '../upload-question/upload-question.component';
import { ViewOptionsModalComponent } from '../view-options-modal/view-options-modal.component';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss'],
})
export class AddQuestionComponent implements OnInit {
  questionType: string = 'SINGLE_CHOICE';
  selectedSegment: string = 'SINGLE';
  allBoardDetails: BoardOfEducation[] = [];
  classes: Classes[] = [];
  subjects: Subjects[] = [];
  modules: Module[] = [];
  questions: any[] = [];
  filterBoard: any;
  filterClass: any;
  filterSubject: any;
  filterModule: any;
  @Input() type: any;
  @Input() question: any;
  recejctedRecords: any[] = [];
  constructor(private questionService: QuestionService,
    private firestore: AngularFirestore,
    private modalController: ModalController,
    private utilityService: UtilityService,
    private toastController: ToastController) { }

  ngOnInit() {
    if (this.type) {
      this.filterBoard = this.question.board;
      this.filterClass = this.question.class.displayName;
      this.filterSubject = this.question.subject.displayName;
      this.filterModule = this.question.module.displayName;
    }
    this.getAllBoards();
    this.questionService.getQuestionsPreview().subscribe((qs: Questions[]) => {
      this.questions = qs;
    })
    this.questionService.getRejectedQuestionsPreview().subscribe((rqs: Questions[]) => {
      this.recejctedRecords = rqs;
    })
  }

  ionViewWillEnter() {
    if (this.type) {
      this.filterBoard = this.question.board;
      this.filterClass = this.question.class.displayName;
      this.filterSubject = this.question.subject.displayName;
      this.filterModule = this.question.module.displayName;
    }
    this.getAllBoards();
    this.questionService.getQuestionsPreview().subscribe((qs: Questions[]) => {
      this.questions = qs;
    })
    this.questionService.getRejectedQuestionsPreview().subscribe((rqs: Questions[]) => {
      this.recejctedRecords = rqs;
    })
  }


  getAllBoards() {
    const query = this.firestore.collection(FirebaseCollection.BOARD_OF_EDUCATION);
    query.ref.get().then((board: any) => {
      if (!board.empty) {
        board.forEach(data => {
          this.allBoardDetails.push(data.data());
        });
      }
    })
  }

  selectBoard(event) {
    this.classes = [];
    this.filterBoard = event.detail.value;
    this.questionService.setSelectedBoard(this.filterBoard);
    let arr = [];
    this.firestore.collection("classes", ref => ref.where("boardId", "==", event.detail.value.id)).get().subscribe(data => {
      data.forEach((res: any) => {
        arr.push(res.data());
      });
      this.classes = arr.sort((a, b) => (a.displayName - b.displayName));
    });
  }

  selectClass(event) {
    this.filterClass = event.detail.value;
    this.questionService.setSelectedClass(this.filterClass);
    this.subjects = [];
    this.firestore.collection("subjects", ref => ref.where("classId", "==", event.detail.value.id)).get().subscribe(data => {
      data.forEach((res: any) => {
        this.subjects.push(res.data());
      })
    });
  }


  selectSubject(event) {
    this.filterSubject = event.detail.value;
    this.questionService.setSelectedSubject(this.filterSubject);
    this.modules = [];
    this.firestore.collection("modules", ref => ref.where("subjectId", "==", event.detail.value.id)).get().subscribe(data => {
      data.forEach((res: any) => {
        this.modules.push(res.data());
      })
    });
  }

  selectModule(event) {

    this.filterModule = event.detail.value;
    this.questionService.setSelectedModule(this.filterModule);
  }

  selectChanged(event) {
    this.questionType = event.detail.value;
  }



  addMoreQuestion() {
    this.questionService.setSelectedBoard(this.filterBoard);
    this.questionService.setSelectedClass(this.filterClass);
    this.questionService.setSelectedSubject(this.filterSubject);
    this.questionService.setSelectedModule(this.filterModule);
  }

  onQuestionSegmentChange(event) {
    this.selectedSegment = event.detail.value;

  }

  confirmPreviewUpload() {
    if (this.questions.length > 0) {
      this.questions.forEach((ques: Questions) => {
        if (ques.id == undefined || ques.id == null) {
          ques.id = this.utilityService.generateAlphaNumericId();
        }
        let ansExplain = ques.ansExplanationText;
        let quesExplain = ques.questionExplanationText;
        if (null != ansExplain || null != quesExplain) {
          this.questionService.setQuestionExplainDetailsToCollection(ques, ansExplain, quesExplain);
        }
        ques.ansExplanationText = null;
        ques.questionExplanationText = null;
        this.questionService.setQuestionToCollection(ques);
      });
      this.presentToast('Data uploaded to DB successfully!!!.');
    } else {
      this.presentToast('No Data found for uploaded to DB.');
    }

  }

  async viewOptionsForSelectQuestion(question: Questions) {

    const modal = await this.modalController.create({
      component: ViewOptionsModalComponent,
      componentProps: {
        question: question
      },
      cssClass: 'option-modal',
      backdropDismiss: false
    });
    return await modal.present();

  }

  onClickEditForSelectedQuestion(question: Questions) {

  }

  deleteSelectedQuestion(question: Questions) {
    let findIndex = this.questions.findIndex(qus => qus.id == question.id);
    if (findIndex != -1) {
      this.questions.splice(findIndex, 1);
      this.presentToast('Question removed form review Sucessfully!!');
    }
  }

  async uploadBulkQuestion() {
    if (this.filterBoard && this.filterClass && this.filterSubject && this.filterModule) {
      this.questionService.setSelectedBoard(this.filterBoard);
      this.questionService.setSelectedClass(this.filterClass);
      this.questionService.setSelectedSubject(this.filterSubject);
      this.questionService.setSelectedModule(this.filterModule);

      const modal = await this.modalController.create({
        component: UploadQuestionComponent,
        cssClass: 'center-modal',
        backdropDismiss: false
      });
      await modal.present();
      await modal.onDidDismiss().then(result => {

      });
    } else {
      this.presentToast('Please select Board , Class , Subject and Module ');
    }

  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    await toast.present();
  }

  close() {
    this.modalController.dismiss();
  }
}

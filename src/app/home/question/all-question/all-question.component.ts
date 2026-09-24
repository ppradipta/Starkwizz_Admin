import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IonModal, ModalController, ToastController } from '@ionic/angular';
import { BoardOfEducation } from 'src/app/model/board';
import { Classes } from 'src/app/model/classes';
import { FirebaseCollection } from 'src/app/model/comman/firebase-collection';
import { Module } from 'src/app/model/module';
import { Questions } from 'src/app/model/questions';
import { Subjects } from 'src/app/model/subject';
import { LoadingService } from 'src/app/services/loading.service';
import { QuestionService } from 'src/app/services/question.service';
import { AddQuestionComponent } from '../add-question/add-question.component';
import { ViewQuestionImageModalComponent } from '../questions-list/view-question-image-modal/view-question-image-modal.component';
import { ViewOptionsModalComponent } from '../view-options-modal/view-options-modal.component';

@Component({
  selector: 'app-all-question',
  templateUrl: './all-question.component.html',
  styleUrls: ['./all-question.component.scss'],
})
export class AllQuestionComponent implements OnInit {
  @ViewChild(IonModal) questionExplainModal: IonModal = {} as IonModal;
  @ViewChild(IonModal) answerExplainModal: IonModal = {} as IonModal;
  allBoardDetails: BoardOfEducation[] = [];
  classes: Classes[] = [];
  subjects: Subjects[] = [];
  modules: Module[] = [];
  questionDetails: any[] = [];
  filterBoard: any;
  filterClass: any;
  filterSubject: any;
  filterModule: any;
  questions: any[] = [];
  isQuesExplainModalOpen: boolean = false;
  isAnsExplainModalOpen: boolean = false;
  selectQuestion: any = {};
  ansExplainDetails: any = {};
  qusExplainDetails: any = {};
  constructor(
    private questionService: QuestionService,
    private firestore: AngularFirestore,
    private loaderService: LoadingService,
    private modalController: ModalController,
    private toastController: ToastController
  ) {


  }

  ngOnInit() {
    this.getAllBoards();
  }

  ionViewWillEnter() {
    this.getAllBoards();
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

  search() {
    this.loaderService.present;
    this.questionDetails = [];
    let query;
    if (this.filterBoard && this.filterClass && this.filterSubject && this.filterModule) {
      query = this.firestore.collection(FirebaseCollection.QUESTIONS).ref
        .where('board', '==', this.filterBoard.name)
        .where('class.id', '==', this.filterClass.id)
        .where('subject.id', '==', this.filterSubject.id)
        .where('module.id', '==', this.filterModule.id);
      query.get().then((questionDetails: any) => {
        questionDetails.forEach(data => {
          this.questionDetails.push(data.data());
        });
      });
    }
  }

  async viewOptionsForSelectQuestion(question: Questions) {
    const modal = await this.modalController.create({
      component: ViewOptionsModalComponent,
      componentProps: {
        question: question
      },
      cssClass: 'option-modal',
      backdropDismiss: true
    });
    return await modal.present();
  }

  async onClickEditForSelectedQuestion(question, type) {
    const modal = await this.modalController.create({
      component: AddQuestionComponent,
      componentProps: {
        type: type,
        question: question
      },
      cssClass: 'addQuestion-modal',
      backdropDismiss: true
    });
    return await modal.present();
  }

  deleteSelectedQuestion(question: Questions) {
    let findIndex = this.questionDetails.findIndex(qus => qus.id == question.id);
    if (findIndex != -1) {
      this.questionDetails.splice(findIndex, 1);
      this.firestore.collection(FirebaseCollection.QUESTIONS).doc(question.id).delete();
      this.presentToast('Question Delete Sucessfully!!');

    }
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    await toast.present();
  }

  async imageQUestion(question) {
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

  onClickAnswerExplainModal(question) {
    this.ansExplainDetails = {};
    this.loaderService.present();
    this.selectQuestion = question;
    this.firestore.collection("questions_explain").doc(question.id).get().subscribe((questionDetails: any) => {
      this.isAnsExplainModalOpen = true;
      if (questionDetails.exists) {
        this.ansExplainDetails = questionDetails.data();
      }

    });

  }
  onClickQuestionExplainModal(question) {
    this.qusExplainDetails = {};
    this.loaderService.present();
    this.selectQuestion = question;
    this.firestore.collection("questions_explain").doc(question.id).get().subscribe((questionDetails: any) => {
      this.isQuesExplainModalOpen = true;
      if (questionDetails.exists) {
        // this.selectQuestion['explainDetails'] = questionDetails.data();
        this.qusExplainDetails = questionDetails.data();
      }
    });
  }

  modalDismiss() {
    this.isQuesExplainModalOpen = false;
    this.isAnsExplainModalOpen = false;
    this.questionExplainModal.dismiss(null, 'cancel');
    this.answerExplainModal.dismiss(null, 'cancel');
  }

  onConfirmQuestionExplain() {
    this.loaderService.present();
    this.firestore.collection("questions_explain").doc(this.selectQuestion.id).update({
      questionExplanationText: this.selectQuestion.explainDetails.questionExplanationText
    }).then(result => {
      this.presentToast('Question explain updated');
    })
  }

  onConfirmAnswerExplainChange() {
    this.loaderService.present();
    this.firestore.collection("questions_explain").doc(this.selectQuestion.id).update({
      ansExplanationText: this.selectQuestion.explainDetails.ansExplanationText
    }).then(result => {
      this.presentToast('Question Answer explain updated');
    })
  }


}

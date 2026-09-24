import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { FirebaseCollection } from 'src/app/model/comman/firebase-collection';
import { Questions } from 'src/app/model/questions';
import { UploadQuestionComponent } from '../upload-question/upload-question.component';
import { ViewOptionsModalComponent } from '../view-options-modal/view-options-modal.component';

@Component({
  selector: 'app-questions-list',
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.scss'],
})
export class QuestionsListComponent implements OnInit {
  questions: Questions[] = []
  constructor(private modalController: ModalController, private firestore: AngularFirestore, private alertController: AlertController,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getAllQuestions();
  }



  async uploadQuestion() {
    const modal = await this.modalController.create({
      component: UploadQuestionComponent,
      cssClass: 'center-modal',
      backdropDismiss: false
    });
    await modal.present();
    await modal.onDidDismiss().then(result => {

    });

  }

  getAllQuestions() {
    this.firestore.collection(FirebaseCollection.QUESTIONS,
      (ref) => ref)
      .valueChanges().subscribe((ques: Questions[]) => {
        this.questions = ques;
      });
  }

  viewOptions(question) {
    console.log(question)
    // question.options.forEach(option => {
    this.showOptionsAlert(question)
    // });
  }


  async showOptionsAlert(question) {
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


  // async showOptionsAlert(question) {
  //  // question.options.forEach(async option => {
  //     const alert = await this.alertController.create({
  //       // cssClass: 'my-custom-class',
  //       header: "Options",
  //       message: `<p> ${question.text} </p>`,
  //     });
  //     await alert.present();
  // //  });

  // }

  onClickAdd() {
    this.router.navigate(['home/addQuestion']);
  }

  onClickEdit() {
    this.router.navigate(['home/addQuestion']);
  }
}

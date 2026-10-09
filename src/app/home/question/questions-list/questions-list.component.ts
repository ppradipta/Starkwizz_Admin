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
        this.questions = this.sortQuestionsDeterministically(ques);
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

  sortQuestionsDeterministically(questions: any[]): any[] {
    if (!questions || !Array.isArray(questions)) return [];

    return questions.slice().sort((a, b) => {
      // 1. Primary: seqno (assigned upload sequence)
      const aSeq = a.seqno != null && !isNaN(Number(a.seqno)) ? Number(a.seqno) : null;
      const bSeq = b.seqno != null && !isNaN(Number(b.seqno)) ? Number(b.seqno) : null;
      if (aSeq !== null && bSeq !== null && aSeq !== bSeq) {
        return aSeq - bSeq;
      }
      if (aSeq !== null && bSeq === null) return -1;
      if (aSeq === null && bSeq !== null) return 1;

      // 2. Secondary: order
      const aOrder = a.order != null && !isNaN(Number(a.order)) ? Number(a.order) : null;
      const bOrder = b.order != null && !isNaN(Number(b.order)) ? Number(b.order) : null;
      if (aOrder !== null && bOrder !== null && aOrder !== bOrder) {
        return aOrder - bOrder;
      }
      if (aOrder !== null && bOrder === null) return -1;
      if (aOrder === null && bOrder !== null) return 1;

      // 3. Tertiary: Leading question number from question text (e.g. "1. ", "Q1", "1)")
      const aNum = this.extractLeadingNumber(a.text);
      const bNum = this.extractLeadingNumber(b.text);
      if (aNum !== null && bNum !== null && aNum !== bNum) {
        return aNum - bNum;
      }

      // 4. Quaternary: createdAt
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (aTime && bTime && aTime !== bTime) {
        return aTime - bTime;
      }

      // 5. Final deterministic tie-breaker: document ID
      const aId = String(a.id || '');
      const bId = String(b.id || '');
      return aId.localeCompare(bId);
    });
  }

  private extractLeadingNumber(text: string): number | null {
    if (!text || typeof text !== 'string') return null;
    const match = text.trim().match(/^(?:q(?:uestion)?\s*[\.\:\-]?\s*)?(\d+)[\.\)\:\s]/i);
    if (match && match[1]) {
      const num = parseInt(match[1], 10);
      return !isNaN(num) ? num : null;
    }
    return null;
  }
}

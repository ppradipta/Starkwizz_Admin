import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController, ToastController } from '@ionic/angular';
import { BoardOfEducation } from 'src/app/model/board';
import { Classes } from 'src/app/model/classes';
import { FirebaseCollection } from 'src/app/model/comman/firebase-collection';
import { Module } from 'src/app/model/module';
import { Subjects } from 'src/app/model/subject';
import { LoadingService } from 'src/app/services/loading.service';
import { QuestionService } from 'src/app/services/question.service';

@Component({
  selector: 'app-manage-syllabus',
  templateUrl: './manage-syllabus.component.html',
  styleUrls: ['./manage-syllabus.component.scss'],
})
export class ManageSyllabusComponent implements OnInit {
  segmentValue: string = "ACTIVE";
  enquiryList: any = [];
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
    private toastController: ToastController,
    private alertController: AlertController,
  ) { }

  ngOnInit() {
    //  this.getAllBoards();
    this.allSyllabusEnquiry();
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

  search() {
    this.loaderService.present;
    this.questionDetails = [];
    let query;
    if (this.filterBoard && this.filterClass && this.filterSubject && this.filterModule) {
      query = this.firestore.collection(FirebaseCollection.syllabus_enquiry).ref
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

  syllabusTabChanged(event) {
    this.segmentValue = event.detail.value;
    this.allSyllabusEnquiry();
  }


  allSyllabusEnquiry() {
    this.firestore.collection("syllabus_enquiry", ref => ref
      .where("status", "==", this.segmentValue)
    ).get().subscribe(data => {
      this.enquiryList = [];
      if (!data.empty) {
        data.forEach((res: any) => {
          let record = res.data();
          this.enquiryList.push(record);
        });
      }
    });
  }

  async presentAlertForUpdateStatus(record) {
    const alert = await this.alertController.create({
      message: 'Are you sure you want to Status Update!',
      cssClass: 'customAlert customAlert1',
      header: "Confirm",
      buttons: [{
        text: 'PENDING',
        role: 'NO',
        cssClass: 'secondary',
        handler: (blah) => {
          console.log('Confirm Cancel: blah');
          this.firestore.collection('syllabus_enquiry').doc(record.id).update({
            status: 'PENDING'
          }).then(result => {
            this.presentToast('Status updated sucessfully!!!');
            this.allSyllabusEnquiry();
          })
        }
      }, {
        text: 'REJECT',
        handler: () => {
          console.log('Confirm YES: Yeahh');
          this.firestore.collection('syllabus_enquiry').doc(record.id).update({
            status: 'REJECT'
          }).then(result => {
            this.presentToast('Status updated sucessfully!!!');
            this.allSyllabusEnquiry();
          })
        }
      }, {
        text: 'APPROVE',
        handler: () => {
          console.log('Confirm YES: Yeahh');
            this.manageSyllabus(record);
        }
      }]
    });
    await alert.present();
  }

  async presentAlertForStatusPending(record) {
    const alert = await this.alertController.create({
      message: 'Are you sure you want to Status Update!',
      cssClass: 'customAlert',
      header: "Confirm",
      buttons: [{
        text: 'REJECT',
        role: 'NO',
        cssClass: 'secondary',
        handler: (blah) => {
          console.log('Confirm Cancel: blah');
          this.firestore.collection('syllabus_enquiry').doc(record.id).update({
            status: 'REJECT'
          }).then(result => {
            this.presentToast('Status updated sucessfully!!!');
            this.allSyllabusEnquiry();
          })
        }
      }, {
        text: 'APPROVE',
        handler: () => {
          console.log('Confirm YES: Yeahh');
         this.manageSyllabus(record);
        }
      }]
    });
    await alert.present();
  }

  manageSyllabus(record) {
    this.firestore.collection('syllabus_enquiry').doc(record.id).update({
      status: 'APPROVE'
    }).then(result => {
      this.presentToast('Status updated sucessfully!!!');
      this.allSyllabusEnquiry();
    })
  }

  async presentAlertForDelete(record) {
    const alert = await this.alertController.create({
      message: 'Are you sure you want to Delete!',
      cssClass: 'customAlert',
      header: "Confirm",
      buttons: [{
        text: 'NO',
        role: 'NO',
        cssClass: 'secondary',
        handler: (blah) => {
          console.log('Confirm Cancel: blah');
    
        }
      }, {
        text: 'YES',
        handler: () => {
          console.log('Confirm YES: Yeahh');
            this.firestore.collection('syllabus_enquiry').doc(record.id).delete().then(result => {
              this.presentToast('Syllabus Deleted sucessfully!!');
              this.allSyllabusEnquiry();
            });
          
        }
      }]
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

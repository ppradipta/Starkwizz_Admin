import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController } from '@ionic/angular';
import { BoardOfEducation } from 'src/app/model/board';
import { Classes } from 'src/app/model/classes';
import { FirebaseCollection } from 'src/app/model/comman/firebase-collection';
import { Module } from 'src/app/model/module';
import { Subjects } from 'src/app/model/subject';
import { UploadService } from 'src/app/services/upload.service';

@Component({
  selector: 'app-events-video',
  templateUrl: './events-video.component.html',
  styleUrls: ['./events-video.component.scss'],
})
export class EventsVideoComponent implements OnInit {
  EventVideoList: any[] = [];
  tabValue: string = "EXAM";
  classes: Classes[] = [];
  subjects: Subjects[] = [];
  modules: Module[] = [];
  allBoardDetails: BoardOfEducation[]=[];
  filterBoardId: string;
  filterClassId: string;
  filterSubjectId: string;
  filterModuleId: string;

  constructor(public firestore: AngularFirestore, private alertCtrl: AlertController, public uploadService: UploadService) { }

  ngOnInit() {
    this.getVideoList();
    this.getAllBoards();
  }


  getVideoList() {
    this.EventVideoList = [];
    this.firestore.collection('user_events', ref => ref.where('type', '==', this.tabValue)).get().subscribe((videos: any) => {
      if (!videos.empty) {
        videos.forEach(data => {
          this.EventVideoList.push(data.data());
        });
        console.log(this.EventVideoList);

      }
    });
  }

  tabChanged(event) {
    console.log(event.detail.value);
    this.tabValue = event.detail.value;
    this.getVideoList();
  }

  async approved(item, status) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Marks',
      inputs: [
        {
          name: 'marks',
          type: 'number',
          placeholder: 'Enter marks'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (marks) => {
            console.log('Confirm Ok', marks.marks);
            this.approvedAndMarks(item, status, marks.marks);
          }
        }
      ]
    });

    await alert.present();
  }

  approvedAndMarks(item, status, marks) {
    this.uploadService.approvedAndMarksEven(item.id, status, marks);
    this.getVideoList();

  }

  // getAllClasses() {
  //   const query = this.firestore.collection(FirebaseCollection.CLASSES);
  //   query.ref.get().then((classes: any) => {
  //     if (!classes.empty) {
  //       classes.forEach(data => {
  //         this.allClassesDetials.push(data.data());
  //       });
  //     }
  //   })
  // }

  // getSubjects(event) {
  //   this.subjects = [];
  //   this.firestore.collection("subjects", ref => ref.where("className", "==", event.detail.value)).get().subscribe(data => {
  //     data.forEach((res: any) => {
  //       this.subjects.push(res.data());
  //     })
  //   });
  // }

  // getModules(event) {
  //   this.modules = [];
  //   this.firestore.collection("modules", ref => ref.where("subjectName", "==", event.detail.value)).get().subscribe(data => {
  //     data.forEach((res: any) => {
  //       this.modules.push(res.data());
  //     })
  //   });
  // }

  // selectClass(event) {
  //   console.log(event);

  // }
  // selectSubject(event) {
  //   console.log(event);
  // }

  // selectModule(event) {
  //   console.log(event);
  // }

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

  selectBoard(event){
    this.classes = [];
    this.filterBoardId = event.detail.value.id;
    this.firestore.collection("classes", ref => ref.where("boardId", "==", event.detail.value.id)).get().subscribe(data => {
      data.forEach((res: any) => {
        this.classes.push(res.data());
        this.classes = this.classes.sort((a, b) => (a.displayName > b.displayName) ? 1 : -1);
      });
      console.log(this.classes);
    });
  }
  
  selectClass(event){
    this.filterClassId = event.detail.value.id;
    this.subjects = [];
    this.firestore.collection("subjects", ref => ref.where("classId", "==", event.detail.value.id)).get().subscribe(data => {
      data.forEach((res: any) => {
        this.subjects.push(res.data());
      })
    });
  }

  selectSubject(event){
    this.filterSubjectId = event.detail.value.id;
    this.modules = [];
    this.firestore.collection("modules", ref => ref.where("subjectId", "==", event.detail.value.id)).get().subscribe(data => {
      data.forEach((res: any) => {
        this.modules.push(res.data());
      })
    });
  }

 selectModule(event){
  this.filterModuleId = event.detail.value.id;
 }

 async search() {
 this.EventVideoList = [];
  let query;
 
  if (this.filterBoardId && this.filterClassId && this.filterSubjectId && this.filterModuleId) {
    query = this.firestore.collection(FirebaseCollection.USER_EVENTS).ref
    .where('boardId', '==', this.filterBoardId)
    .where('classId', '==', this.filterClassId)
    .where('subjectId', '==', this.filterSubjectId)
    .where('moduleId', '==', this.filterModuleId);
  }
 
 else if (this.filterBoardId && this.filterClassId && this.filterSubjectId) {
    query = this.firestore.collection(FirebaseCollection.USER_EVENTS).ref
    .where('boardId', '==', this.filterBoardId)
    .where('classId', '==', this.filterClassId)
    .where('subjectId', '==', this.filterSubjectId);
  }
  else if (this.filterBoardId && this.filterClassId) {
    query = this.firestore.collection(FirebaseCollection.USER_EVENTS).ref
      .where('boardId', '==', this.filterBoardId)
      .where('classId', '==', this.filterClassId);
  }
  else if (this.filterBoardId) {
    query = this.firestore.collection(FirebaseCollection.USER_EVENTS).ref
      .where('boardId', '==', this.filterBoardId);
  }
  query.get().then((eventDetail: any) => {
    if (!eventDetail.empty) {
      eventDetail.forEach(data => {
       this.EventVideoList.push(data.data());
      });
    }
  });
}
}

import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController, ToastController } from '@ionic/angular';
import { DateUtilService } from 'src/app/common/util/date-util.service';
import { BoardOfEducation } from 'src/app/model/board';
import { Classes } from 'src/app/model/classes';
import { FirebaseCollection } from 'src/app/model/comman/firebase-collection';
import { Module } from 'src/app/model/module';
import { Subjects } from 'src/app/model/subject';
import { PostedSnapshotModalComponent } from './posted-snapshot-modal/posted-snapshot-modal.component';

@Component({
  selector: 'app-posted-snapshots',
  templateUrl: './posted-snapshots.component.html',
  styleUrls: ['./posted-snapshots.component.scss'],
})
export class PostedSnapshotsComponent implements OnInit {
  selectedSegment: string = 'POSTED';
  allBoardDetails: BoardOfEducation[]=[];
  classes: Classes[] = [];
  subjects: Subjects[] = [];
  modules: Module[] = [];
  filterBoardId: string;
  filterClassId: string;
  filterSubjectId: string;
  filterModuleId: string;
  postedSnapshots: any = [];
  achieve = [1,2,3,4,5,6]
  constructor(
    public firestore: AngularFirestore,
    public modalController: ModalController,
    private dateUtilService: DateUtilService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.getAllBoards();
    this.getAllPostedSnapshots();
  }

  onSegmentChange(event) {
    this.selectedSegment = event.detail.value;
    this.postedSnapshots = [];
    this.firestore.collection('image_upload', ref => ref.where('status', '==', event.detail.value)).get().subscribe((images: any) => {
      if (!images.empty) {
        let uploaded_image: any[] = [];
        images.forEach(data => {
          uploaded_image.push(data.data());
        });

        this.postedSnapshots = uploaded_image.reduce(function (r, a) {
          r[a.categoryName] = r[a.categoryName] || [];
          r[a.categoryName].push(a);
          return r;
        }, Object.create(null));
      }
    });
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

  getAllPostedSnapshots() {
    this.postedSnapshots = [];
    this.firestore.collection('image_upload', ref => ref.where('status', '==', 'POSTED')).get().subscribe((images: any) => {
      if (!images.empty) {
        let uploaded_image: any[] = [];
        images.forEach(data => {
          uploaded_image.push(data.data());
        });
        this.postedSnapshots = uploaded_image.reduce(function (r, a) {
          r[a.categoryName] = r[a.categoryName] || [];
          r[a.categoryName].push(a);
          return r;
          console.log('r: ', r);
        }, Object.create(null));
      }
    });


  }

  approveVideo(list) {
    this.firestore.collection('image_upload').doc(list.id)
      .update({
        status: 'APPROVED',
        publishdate: this.dateUtilService.getCurrentDateWithTime(),
        publishBy: 'ADMIN'
      }).then(result => {
        this.presentToast('Snapshot Approved Sucessfully');

      })
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      position: "bottom",
      color: 'dark',
      cssClass: 'customDarkToaster'
    });
    toast.present();
  }


  rejectVideo(list) {
    this.firestore.collection('image_upload').doc(list.id)
      .update({
        status: 'REJECTED',
        rejectedDate: this.dateUtilService.getCurrentDateWithTime(),
        rejectedBy: 'ADMIN'
      }).then(result => {
        this.presentToast('Snapshot Rejected Sucessfully');
      })

  }

  async playVideo(list: any) {
    const modal = await this.modalController.create({
      component: PostedSnapshotModalComponent,
      cssClass: 'addEvent-modal',
      backdropDismiss: true,
      componentProps: { image: list },
    });
    await modal.present();
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
  this.postedSnapshots = [];
  let query;
  
   if (this.filterBoardId && this.filterClassId && this.filterSubjectId && this.filterModuleId) {
     query = this.firestore.collection(FirebaseCollection.IMAGE_UPLOAD).ref
     .where('boardId', '==', this.filterBoardId)
     .where('classId', '==', this.filterClassId)
     .where('subjectId', '==', this.filterSubjectId)
     .where('moduleId', '==', this.filterModuleId)
     .where('status', '==', this.selectedSegment)
     
   }
  
  else if (this.filterBoardId && this.filterClassId && this.filterSubjectId) {
     query = this.firestore.collection(FirebaseCollection.IMAGE_UPLOAD).ref
     .where('boardId', '==', this.filterBoardId)
     .where('classId', '==', this.filterClassId)
     .where('subjectId', '==', this.filterSubjectId)
     .where('status', '==', this.selectedSegment);
   }
   else if (this.filterBoardId && this.filterClassId) {
     query = this.firestore.collection(FirebaseCollection.IMAGE_UPLOAD).ref
       .where('boardId', '==', this.filterBoardId)
       .where('classId', '==', this.filterClassId)
       .where('status', '==', this.selectedSegment);
   }
   else if (this.filterBoardId) {
     query = this.firestore.collection(FirebaseCollection.IMAGE_UPLOAD).ref
       .where('boardId', '==', this.filterBoardId)
       .where('status', '==', this.selectedSegment);
   }
   query.get().then((images: any) => {
     if (!images.empty) {
      let uploaded_image: any[] = [];
      images.forEach(data => {
        uploaded_image.push(data.data());
       });
       this.postedSnapshots = uploaded_image.reduce(function (r, a) {
        r[a.categoryName] = r[a.categoryName] || [];
        r[a.categoryName].push(a);
        return r;
        console.log('r: ', r);
      }, Object.create(null));
     }
    
   });
 }
}

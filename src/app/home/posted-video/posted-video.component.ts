import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController, ToastController } from '@ionic/angular';
import { DateUtilService } from 'src/app/common/util/date-util.service';
import { BoardOfEducation } from 'src/app/model/board';
import { Classes } from 'src/app/model/classes';
import { FirebaseCollection } from 'src/app/model/comman/firebase-collection';
import { Module } from 'src/app/model/module';
import { Subjects } from 'src/app/model/subject';
import { PostedVideoModalComponent } from './playpostedvideo/posted-video-modal.component';

@Component({
  selector: 'app-posted-video',
  templateUrl: './posted-video.component.html',
  styleUrls: ['./posted-video.component.scss'],
})
export class PostedVideoComponent implements OnInit {
  selectedSegment: string = "POSTED";

  postedVideos: any = [];
  classes: Classes[] = [];
  subjects: Subjects[] = [];
  modules: Module[] = [];
  allBoardDetails: BoardOfEducation[]=[];
  filterBoardId: string;
  filterClassId: string;
  filterSubjectId: string;
  filterModuleId: string;

  constructor(public firestore: AngularFirestore,
    public modalController: ModalController,
    private dateUtilService: DateUtilService,
    private toastController: ToastController) { }

  ngOnInit() {
    this.getAllPostedVideos();
    this.getAllBoards();

  }

  getAllPostedVideos() {
    this.postedVideos = [];
    this.firestore.collection('video_upload', ref => ref.where('status', '==', 'POSTED')).get().subscribe((videos: any) => {
      if (!videos.empty) {
        let uploaded_videos: any[] = [];
        videos.forEach(data => {
          uploaded_videos.push(data.data());
        });

        this.postedVideos = uploaded_videos.reduce(function (r, a) {
          r[a.categoryName] = r[a.categoryName] || [];
          r[a.categoryName].push(a);
          return r;
        }, Object.create(null));
      }
    });


  }

  approveVideo(pvideo) {
    this.firestore.collection('video_upload').doc(pvideo.id)
      .update({
        status: 'APPROVED',
        publishdate: this.dateUtilService.getCurrentDateWithTime(),
        publishBy: 'ADMIN'
      }).then(result => {
        this.presentToast('Video Approved Sucessfully');

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


  rejectVideo(pvideo) {
    this.firestore.collection('video_upload').doc(pvideo.id)
      .update({
        status: 'REJECTED',
        rejectedDate: this.dateUtilService.getCurrentDateWithTime(),
        rejectedBy: 'ADMIN'
      }).then(result => {
        this.presentToast('Video Rejected Sucessfully');
      })

  }

  async playVideo(pvideo: any) {
    const modal = await this.modalController.create({
      component: PostedVideoModalComponent,
      cssClass: 'addEvent-modal',
      backdropDismiss: false,
      componentProps: { video: pvideo },
    });
    await modal.present();
  }


  onSegmentChange(event) {
    this.selectedSegment = event.detail.value;
    this.postedVideos = [];
    this.firestore.collection('video_upload', ref => ref.where('status', '==', event.detail.value)).get().subscribe((videos: any) => {
      if (!videos.empty) {
        let uploaded_videos: any[] = [];
        videos.forEach(data => {
          uploaded_videos.push(data.data());
        });

        this.postedVideos = uploaded_videos.reduce(function (r, a) {
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
    this.postedVideos = [];
    let query;
    
     if (this.filterBoardId && this.filterClassId && this.filterSubjectId && this.filterModuleId) {
       query = this.firestore.collection(FirebaseCollection.VIDEO_UPLOAD).ref
       .where('boardId', '==', this.filterBoardId)
       .where('classId', '==', this.filterClassId)
       .where('subjectId', '==', this.filterSubjectId)
       .where('moduleId', '==', this.filterModuleId)
       .where('status', '==', this.selectedSegment)
       
     }
    
    else if (this.filterBoardId && this.filterClassId && this.filterSubjectId) {
       query = this.firestore.collection(FirebaseCollection.VIDEO_UPLOAD).ref
       .where('boardId', '==', this.filterBoardId)
       .where('classId', '==', this.filterClassId)
       .where('subjectId', '==', this.filterSubjectId)
       .where('status', '==', this.selectedSegment);
     }
     else if (this.filterBoardId && this.filterClassId) {
       query = this.firestore.collection(FirebaseCollection.VIDEO_UPLOAD).ref
         .where('boardId', '==', this.filterBoardId)
         .where('classId', '==', this.filterClassId)
         .where('status', '==', this.selectedSegment);
     }
     else if (this.filterBoardId) {
       query = this.firestore.collection(FirebaseCollection.VIDEO_UPLOAD).ref
         .where('boardId', '==', this.filterBoardId)
         .where('status', '==', this.selectedSegment);
     }
     query.get().then((video: any) => {
       if (!video.empty) {
        let uploaded_videos: any[] = [];
         video.forEach(data => {
          uploaded_videos.push(data.data());
         });
         this.postedVideos = uploaded_videos.reduce(function (r, a) {
          r[a.categoryName] = r[a.categoryName] || [];
          r[a.categoryName].push(a);
          return r;
        }, Object.create(null));
       }
      
     });
   }
}

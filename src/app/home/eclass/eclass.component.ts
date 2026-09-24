import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController, ToastController } from '@ionic/angular';
import { FirebaseCollection } from 'src/app/model/comman/firebase-collection';
import { Eclass } from 'src/app/model/eclass';
import { EventsService } from 'src/app/services/events.service';
import { AddEclassComponent } from './add-eclass/add-eclass.component';

@Component({
  selector: 'app-eclass',
  templateUrl: './eclass.component.html',
  styleUrls: ['./eclass.component.scss'],
})
export class EclassComponent implements OnInit {
  eClass: Eclass = new Eclass();
  allBoardDetails: any[] = [];
  allClasses: any[] = [];
  allSubjects: any[] = [];
  allModules: any[] = [];
  language: string;
  examSegmentValue: string = "ADDED";
  eClassList: Eclass[] = [];
  queryRef = this.firestore.collection('eclass').ref;
  filterBoardId: string;
  filterClassId: string;
  filterSubjectId: string;
  filterModuleId: string;
  constructor(
    private firestore: AngularFirestore,
    private eventsService: EventsService,
    private modalController: ModalController,
    private toastController: ToastController,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.getAllBoardDetails();
  }

  getAllBoardDetails() {
    const query = this.firestore.collection(FirebaseCollection.BOARD_OF_EDUCATION);
    query.ref
      .get().then((boards: any) => {
        if (!boards.empty) {
          boards.forEach(data => {
            this.allBoardDetails.push(data.data());
          });
        }
      })
  }

  selectBoard(event) {
    this.eClass.boardName = event.detail.value.displayName
    this.filterBoardId = event.detail.value.id;
    this.allClasses = [];
    this.firestore.collection(FirebaseCollection.CLASSES, (ref) => ref.where("boardId", "==", event.detail.value.id))
      .valueChanges().subscribe((events) => {
        this.allClasses = events;
        this.allClasses = this.allClasses.sort((a, b) => (a.displayName - b.displayName))
      });
  }

  selectClasses(event) {
    this.eClass.className = event.detail.value.displayName;
    this.filterClassId = event.detail.value.id;
    this.allSubjects = [];
    this.firestore.collection(FirebaseCollection.SUBJECTS, (ref) => ref.where("classId", "==", event.detail.value.id))
      .valueChanges().subscribe((events) => {
        this.allSubjects = events;
      });
  }

  selectSubjects(event) {
    this.eClass.subjectName = event.detail.value.displayName;
    this.filterSubjectId = event.detail.value.id;
    this.allModules = [];
    this.firestore.collection(FirebaseCollection.MODULES, (ref) => ref.where("subjectId", "==", event.detail.value.id))
      .valueChanges().subscribe((events) => {
        this.allModules = events;
      });
  }

  selectModule(event) {
    this.eClass.moduleName = event.detail.value.displayName;
    this.filterModuleId = event.detail.value.id;

  }
  selectLanguage(event) {
    this.language = event.detail.value
  }

  saveEclass() {
    this.eventsService.setDataToEClassCollection(this.eClass)
  }

  eventTabChanged(event: any) {
    this.examSegmentValue = event.detail.value;
    this.eClassList = [];
    this.search();
  }



  async search() {
    this.eClassList = [];
    let query;
    if (this.filterBoardId && this.filterClassId && this.filterSubjectId && this.filterModuleId) {
      query = this.queryRef
        .where('boardId', '==', this.filterBoardId)
        .where('classId', '==', this.filterClassId)
        .where('subjectId', '==', this.filterSubjectId)
        .where('moduleId', '==', this.filterModuleId)
        .where('status', '==', this.examSegmentValue)
        .orderBy('subjectName');
    } else if (this.filterBoardId && this.filterClassId && this.filterSubjectId) {
      query = this.queryRef
        .where('boardId', '==', this.filterBoardId)
        .where('classId', '==', this.filterClassId)
        .where('subjectId', '==', this.filterSubjectId)
        .where('status', '==', this.examSegmentValue)
        .orderBy('subjectName');
    }

    else if (this.filterBoardId && this.filterClassId) {
      query = this.queryRef
        .where('boardId', '==', this.filterBoardId)
        .where('classId', '==', this.filterClassId)
        .where('status', '==', this.examSegmentValue)
        .orderBy('subjectName');
    }
    else if (this.filterBoardId) {
      query = this.queryRef
        .where('boardId', '==', this.filterBoardId)
        .where('status', '==', this.examSegmentValue)
        .orderBy('subjectName');
    }
    if (query) {
      query.get().then((eventDetail: any) => {
        if (!eventDetail.empty) {
          eventDetail.forEach(data => {
            let document = data.data();
            document['id'] = data.id;
            this.eClassList.push(document);
          });
        }
      });
    }

  }

  editEvent(event) {
    this.eventsService.setEventData(event);
    this.addEvents('EDIT');
  }

  changeEventStatus(target, event) {
    event.status = target.detail.value;
    this.firestore.collection('eclass').doc(event.id).update({
      status: event.status
    }).then(result => {
      this.presentToast('Video status updated sucessfully!!!');
    })
  }

  deleteEvent(event) {
    this.firestore.collection('eclass').doc(event.id).delete().then(result => {
      this.presentToast('Video deleted sucessfully!!!');
    })
  }



  changeDownloadAllow(event) {
    this.firestore.collection('eclass').doc(event.id).update({
      isDownloadAllow: !event.isDownloadAllow
    }).then(result => {
      this.presentToast('Video  updated sucessfully!!!');
    })
  }

  changeCommentAllow(event) {
    this.firestore.collection('eclass').doc(event.id).update({
      isComment: !event.isComment
    }).then(result => {
      this.presentToast('Video updated sucessfully!!!');
    })
  }

  async addEvents(actionType) {
    const modal = await this.modalController.create({
      component: AddEclassComponent,
      componentProps: {
        actionType: actionType
      },
      cssClass: 'addEvent-modal',
      backdropDismiss: false
    });
    await modal.present();
    await modal.onDidDismiss().then(result => {

    });
  }


  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    await toast.present();
  }

}

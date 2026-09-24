import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/compat/storage';
import { ModalController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FirebaseCollection } from 'src/app/model/comman/firebase-collection';
import { Eclass } from 'src/app/model/eclass';
import { EventsService } from 'src/app/services/events.service';

@Component({
  selector: 'app-add-eclass',
  templateUrl: './add-eclass.component.html',
  styleUrls: ['./add-eclass.component.scss'],
})
export class AddEclassComponent implements OnInit {

  eClass: Eclass = new Eclass();
  allBoardDetails: any[] = [];
  allClasses: any[] = [];
  allSubjects: any[] = [];
  allModules: any[] = [];
  language: string;
  percentage: Observable<number>;
  ref: AngularFireStorageReference = {} as AngularFireStorageReference;
  constructor(
    private firestore: AngularFirestore,
    private eventsService: EventsService,
    private toastController: ToastController,
    private modalController: ModalController,
    private storage: AngularFireStorage
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
    this.eClass.boardName = event.detail.value.displayName;
    this.eClass.boardId = event.detail.value.id;
    this.allClasses = [];
    this.firestore.collection(FirebaseCollection.CLASSES, (ref) => ref.where("boardId", "==", event.detail.value.id))
      .valueChanges().subscribe((events) => {
        this.allClasses = events;
        this.allClasses = this.allClasses.sort((a, b) => (a.displayName - b.displayName))
      });
  }

  selectClasses(event) {
    this.eClass.className = event.detail.value.displayName
    this.eClass.classId = event.detail.value.id;
    this.allSubjects = [];
    this.firestore.collection(FirebaseCollection.SUBJECTS, (ref) => ref.where("classId", "==", event.detail.value.id))
      .valueChanges().subscribe((events) => {
        this.allSubjects = events;
      });
  }

  selectSubjects(event) {
    this.eClass.subjectName = event.detail.value.displayName;
    this.eClass.subjectId = event.detail.value.id;
    this.allModules = [];
    this.firestore.collection(FirebaseCollection.MODULES, (ref) => ref.where("subjectId", "==", event.detail.value.id))
      .valueChanges().subscribe((events) => {
        this.allModules = events;
      });
  }

  selectModule(event) {
    this.eClass.moduleName = event.detail.value.displayName;
    this.eClass.moduleId = event.detail.value.id;

  }
  selectLanguage(event) {
    this.language = event.detail.value
    this.eClass.language = this.language;
  }

  saveEclass() {
    this.eClass.status = 'ADDED';
    this.eventsService.setDataToEClassCollection(this.eClass);
    this.presentToast('Eclass added sucessfully!!!');
    this.modalController.dismiss();
  }


  close() {
    this.modalController.dismiss();
  }


  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    await toast.present();
  }

  onFileChange(evt: any) {
    if(null!=this.eClass.boardName && null!=this.eClass.classId && null!=this.eClass.subjectId){
      const newMetadata = {
        cacheControl: 'public,max-age=3000',
        contentType: 'video/mp4'
      };
      const file = evt.target.files[0];
      const filePath = `eclass/${this.eClass.boardName}/${this.eClass.classId}/${this.eClass.subjectId}`;
      this.ref = this.storage.ref(filePath);
      this.ref.put(file, newMetadata).snapshotChanges().pipe(
        finalize(() => {
          this.ref.getDownloadURL().subscribe(downloadURL => {
            this.eClass.videoURL = downloadURL;
            this.presentToast('Video file uploaded sucessfully!!');
          });
        })
      ).subscribe();
    }else{
      this.presentToast('Missing data for BoardName or Class or Subject')
    }

  }
}
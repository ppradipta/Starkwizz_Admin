import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController, ToastController } from '@ionic/angular';
import { BaseComponent } from 'src/app/base/base.component';
import { FirebaseCollection } from 'src/app/model/comman/firebase-collection';
import { Subjects } from 'src/app/model/subject';
import { BoardService } from 'src/app/services/board.service';
import { ClassesService } from 'src/app/services/classes.service';
import { ModuleService } from 'src/app/services/module.service';
import { SubjectService } from 'src/app/services/subject.service';
import { UtilityService } from 'src/app/utils/utils.service';

@Component({
  selector: 'app-add-subjects',
  templateUrl: './add-subjects.component.html',
  styleUrls: ['./add-subjects.component.scss'],
})
export class AddSubjectsComponent extends BaseComponent implements OnInit {

  newSubject: Subjects = new Subjects();

  categoryList: any[] = [];

  // imageFiles:any;

  constructor(
    private modalController: ModalController,
    private utilityService: UtilityService,
    private toastController: ToastController,
    public classesService: ClassesService,
    public subjectService: SubjectService,
    public boardService: BoardService,
    public moduleService: ModuleService,
    private firestore: AngularFirestore
  ) {
    super(classesService, subjectService, boardService, moduleService)
  }

  ngOnInit() {
    this.classesService.getSelectedClass().subscribe(classroom => {
      this.newSubject.className = classroom.name;
      this.newSubject.classId = classroom.id;
    });
    this.firestore.collection(FirebaseCollection.PARAMETER).doc('eventcategoryname').get().subscribe(records => {
      // this.categories = [];
      if (records.exists) {
        let fetchData = records.data();
        this.categoryList = fetchData['values'];
      }
    });
  }

  classChanged(event) {
    if (event.detail.value) {
      let classroom = this.classesList.find(classroom => classroom.name == event.detail.value);
      this.newSubject.classId = classroom.id
    }
  }


  addSubject() {
    this.newSubject.id = this.utilityService.generateAlphaNumericId();
    this.newSubject.name = this.utilityService.refactorName(this.newSubject.displayName);
    const findCat = this.categoryList.find(catl => catl.displayName == this.newSubject.category);
    //Default ColorCode
    this.newSubject.colorCode = '#DXARG';
    this.newSubject.categoryId = findCat.id;
    this.subjectService.setSubjectToCollection(this.newSubject);
    this.presentToast('Subject added successfully!!!.');
    this.modalController.dismiss("added");

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

  // imageSelected(event) {
  //   this.imageFiles = event.target.files[0];
  //   this.uploadImage();
  // }

  // uploadImage() {

  //   this.newSubject.id =this.utilityService.generateAlphaNumericId();

  //   let ref = this.storage.ref('strkwiz/subject/images/' + this.newSubject.id);
  //     ref.put(this.imageFiles).then(data => {
  //       ref.getDownloadURL().subscribe(iurl => {
  //         this.newSubject.imageURL = iurl;
  //       });
  //     });
  // }

}

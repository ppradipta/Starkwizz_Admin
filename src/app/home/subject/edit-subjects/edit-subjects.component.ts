import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ModalController, ToastController } from '@ionic/angular';
import { BaseComponent } from 'src/app/base/base.component';
import { FirebaseCollection } from 'src/app/model/comman/firebase-collection';
import { Module } from 'src/app/model/module';
import { Subjects } from 'src/app/model/subject';
import { BoardService } from 'src/app/services/board.service';
import { ClassesService } from 'src/app/services/classes.service';
import { ModuleService } from 'src/app/services/module.service';
import { SubjectService } from 'src/app/services/subject.service';
import { UtilityService } from 'src/app/utils/utils.service';

@Component({
  selector: 'app-edit-subjects',
  templateUrl: './edit-subjects.component.html',
  styleUrls: ['./edit-subjects.component.scss'],
})
export class EditSubjectsComponent extends BaseComponent implements OnInit {

  @Input() selectedSubject: Subjects;

  categoryList: any[] = [];

  imageFiles:any;

  constructor(
    private modalController: ModalController,
    private toastController: ToastController,
    private utilityService: UtilityService,
    private storage: AngularFireStorage, 
    public classesService: ClassesService,
    public subjectService: SubjectService,
    public boardService : BoardService,
    public moduleService : ModuleService,
    private firestore: AngularFirestore
    
    ) { 
     super(classesService,subjectService,boardService, moduleService)
    }

  ngOnInit() {
    this.firestore.collection(FirebaseCollection.PARAMETER).doc('eventcategoryname').get().subscribe(records => {
      let fetchData = records.data();
      this.categoryList = fetchData['values'];
      const findCat = this.categoryList.find(catl => catl.displayName == this.selectedSubject.category);
      this.selectedSubject.category = findCat.displayName;
    
  });
  }

  classChanged(event) {
    if (event.detail.value) {
      let classroom = this.classesList.find(classroom => classroom.name == event.detail.value);
      this.selectedSubject.classId = classroom.id
    }
  }

  updateModule(){
    this.moduleService.getModuleBySubjectId(this.selectedSubject.id).then((modList: any) => {
      if (!modList.empty) {         
        modList.forEach((mod: any) => {
          let module: Module = mod.data();
          module.classId = this.selectedSubject.classId;
          module.className = this.selectedSubject.className;
          module.subjectName =  this.selectedSubject.name
          this.updateModuleToCollection(module);
        })
      }
    });
  }

  updateModuleToCollection(module: Module){
    this.moduleService.setModuleToCollection(module);
  }


  updateSubject() {
    this.selectedSubject.name = this.utilityService.refactorName(this.selectedSubject.displayName);
    const findCat = this.categoryList.find(catl => catl.displayName == this.selectedSubject.category);
    this.selectedSubject.categoryId = findCat.id;
    this.updateModule();
    this.subjectService.setSubjectToCollection(this.selectedSubject);
    this.presentToast('Subject updated successfully!!!.');
    this.modalController.dismiss("updated");
    
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

  //   let ref = this.storage.ref('strkwiz/subject/images/' + this.selectedSubject.id);
  //     ref.put(this.imageFiles).then(data => {
  //       ref.getDownloadURL().subscribe(iurl => {
  //         this.selectedSubject.imageURL = iurl;
  //       });
  //     });
  // }

}

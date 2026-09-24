import { Component, Input, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ModalController, ToastController } from '@ionic/angular';
import { BaseComponent } from 'src/app/base/base.component';
import { Classes } from 'src/app/model/classes';
import { Module } from 'src/app/model/module';
import { Subjects } from 'src/app/model/subject';
import { BoardService } from 'src/app/services/board.service';
import { ClassesService } from 'src/app/services/classes.service';
import { ModuleService } from 'src/app/services/module.service';
import { SubjectService } from 'src/app/services/subject.service';
import { UtilityService } from 'src/app/utils/utils.service';

@Component({
  selector: 'app-edit-classes',
  templateUrl: './edit-classes.component.html',
  styleUrls: ['./edit-classes.component.scss'],
})
export class EditClassesComponent extends BaseComponent implements OnInit {

  @Input() selectedClass: Classes;
  imageFiles: any;

  
  constructor(
    private modalController: ModalController,
    private utilityService: UtilityService,
    private toastController: ToastController,
    private storage: AngularFireStorage, 
    public classesService: ClassesService,
    public subjectService: SubjectService,
    public boardService : BoardService,
    public moduleService : ModuleService
    ) {
     super(classesService,subjectService,boardService,moduleService)
     }

  ngOnInit() {
  }

  boardChanged(event) {
    if (event.detail.value) {
      let br = this.boardEducations.find(board => board.name == event.detail.value);
      this.selectedClass.boardId = br.id;
    }
  }
  
  updateClass(){
    this.selectedClass.name = this.utilityService.refactorName(this.selectedClass.displayName);

    //Updated associate Class name in Subject and module collection
    this.updateSubject();
    this.updateModule();
    this.classesService.setClassToCollection(this.selectedClass);
    this.presentToast('Classes added successfully!!!.');
    this.modalController.dismiss("updated");
  }


  updateSubject(){
    this.subjectService.getSubjectByClassId(this.selectedClass.id).then((subList: any) => {
      if (!subList.empty) {         
        subList.forEach((sub: any) => {
          let subject: Subjects = sub.data();
          subject.className = this.selectedClass.name;
          this.updateSubjectToCollection(subject);
        })
      }
    });
  }

  updateSubjectToCollection(subject: Subjects){
    this.subjectService.setSubjectToCollection(subject);
  }

  updateModule(){
    this.moduleService.getModuleByClassId(this.selectedClass.id).then((modList: any) => {
      if (!modList.empty) {         
        modList.forEach((mod: any) => {
          let module: Module = mod.data();
          module.className = this.selectedClass.name;
          this.updateModuleToCollection(module);
        })
      }
    });
  }

  updateModuleToCollection(module: Module){
    this.moduleService.setModuleToCollection(module);
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




}

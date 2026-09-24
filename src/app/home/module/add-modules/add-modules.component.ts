import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Classes } from 'src/app/model/classes';
import { Module } from 'src/app/model/module';
import { Subjects } from 'src/app/model/subject';
import { ModuleService } from 'src/app/services/module.service';
import { UtilityService } from 'src/app/utils/utils.service';

@Component({
  selector: 'app-add-modules',
  templateUrl: './add-modules.component.html',
  styleUrls: ['./add-modules.component.scss'],
})
export class AddModulesComponent implements OnInit {

  @Input() selectedSubjects: Subjects[];
  @Input() selectedClass: Classes;
  @Input() subjectName: string;
  newModule: Module = new Module();
  bookPublishers: any[] = [];
  imageFiles: any;

  constructor(
    private modalController: ModalController,
    private utilityService: UtilityService,
    private toastController: ToastController,
    public moduleService: ModuleService
  ) {

  }

  ngOnInit() {

    this.newModule.classId = this.selectedClass.id;
    this.newModule.className = this.selectedClass.name;

    if (this.subjectName) {
      this.newModule.subjectName = this.subjectName
    }

    this.moduleService.publishers$.subscribe(bookPublishers => {
      if (this.selectedClass && bookPublishers) {
        this.bookPublishers = bookPublishers.filter(bp => (bp.board == this.selectedClass.boardName && bp.classId === this.selectedClass.id));
      }
    });

  }


  addModule() {
    //Set default ColorCode
    this.newModule.colorCode = '#0A395A';
    this.newModule.id = this.utilityService.generateAlphaNumericId();
    this.newModule.name = this.utilityService.refactorName(this.newModule.displayName);
    this.findSubjectIdbyName();
    this.moduleService.setModuleToCollection(this.newModule);
    this.presentToast('Module added successfully!!!.');
    this.modalController.dismiss("added");
  }

  findSubjectIdbyName() {
    let subject = this.selectedSubjects.find(sub => sub.name == this.newModule.subjectName);
    this.newModule.subjectId = subject.id;
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

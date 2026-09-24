import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { BaseComponent } from 'src/app/base/base.component';
import { Classes } from 'src/app/model/classes';
import { BoardService } from 'src/app/services/board.service';
import { ClassesService } from 'src/app/services/classes.service';
import { ModuleService } from 'src/app/services/module.service';
import { SubjectService } from 'src/app/services/subject.service';
import { UtilityService } from 'src/app/utils/utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Subjects } from 'src/app/model/subject';
import { Module } from 'src/app/model/module';


@Component({
  selector: 'select-tag',
  templateUrl: './select-tag.component.html',
  styleUrls: ['./select-tag.component.scss'],
})
export class SelectTagComponent extends BaseComponent implements OnInit {

  newClass: Classes = new Classes();
  imageFiles: any;
  @Input() tag;
  classes: Classes[] = [];
  subjects: Subjects[] = [];
  modules: Module[] = [];
  selectedTag: string;
  constructor(
    private modalController: ModalController,
    private utilityService: UtilityService,
    private toastController: ToastController,
    private storage: AngularFireStorage ,                    // Injects the default storage instance
    public classesService: ClassesService,
    public subjectService: SubjectService,
    public boardService: BoardService,
    public moduleService: ModuleService
  ) {
    super(classesService, subjectService, boardService, moduleService)
  }

  ngOnInit() {
    if(this.tag == 'Class') {
     this.getClasses();
      
    } else if(this.tag == 'Subject') {
      this.getSubject();
    } else if(this.tag == 'Module') {
      this.getClasses();
    }
  }
  
  ionViewWillEnter() {
  
  }
  getClasses()  {
    this.classesService.classes$.subscribe(classesList => {
      this.classes = classesList;
    });
  }
  getSubject() {
    this.subjectService.subjects$.subscribe(subjectList => {
      this.subjects = subjectList
    });
  }
  getModules() {
    this.moduleService.modules$.subscribe(moduleList => {
      this.modules = moduleList
    });
  }
  boardChanged(event) {
    if (event.detail.value) {
      let br = this.boardEducations.find(board => board.name == event.detail.value);
      this.newClass.boardId = br.id;
    }
  }


  addClass() {
    this.newClass.name = this.utilityService.refactorName(this.newClass.displayName);
    this.classesService.setClassToCollection(this.newClass);
    this.presentToast('Classes added successfully!!!.');
    this.close();
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

  imageSelected(event) {
    this.imageFiles = event.target.files[0];
    this.uploadImage();
  }

  uploadImage() {

    this.newClass.id =this.utilityService.generateAlphaNumericId();

    let ref = this.storage.ref('strkwiz/classes/images/' + this.newClass.id);
      ref.put(this.imageFiles).then(data => {
        ref.getDownloadURL().subscribe(iurl => {
          this.newClass.imageURL = iurl;
        });
      });
  }
  tagChange(event){
 //   this.selectedTag = event.detail.value;
  }
  tagSelected(value) {
    this.selectedTag = value;
  }
  selectTag() {
    this.modalController.dismiss(this.selectedTag);
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { BaseComponent } from 'src/app/base/base.component';
import { BoardOfEducation } from 'src/app/model/board';
import { Classes } from 'src/app/model/classes';
import { BoardService } from 'src/app/services/board.service';
import { ClassesService } from 'src/app/services/classes.service';
import { ModuleService } from 'src/app/services/module.service';
import { SubjectService } from 'src/app/services/subject.service';
import { UtilityService } from 'src/app/utils/utils.service';


@Component({
  selector: 'app-add-classes',
  templateUrl: './add-classes.component.html',
  styleUrls: ['./add-classes.component.scss'],
})
export class AddClassesComponent extends BaseComponent implements OnInit {

  @Input() selectedBoard :BoardOfEducation;
  newClass: Classes = new Classes();
  imageFiles: any;


  constructor(
    private modalController: ModalController,
    private utilityService: UtilityService,
    private toastController: ToastController,
    public classesService: ClassesService,
    public subjectService: SubjectService,
    public boardService: BoardService,
    public moduleService: ModuleService
  ) {
    super(classesService, subjectService, boardService, moduleService)
  }

  ngOnInit() {
    if(this.selectedBoard.id){
      this.newClass.boardName =this.selectedBoard.name;
      this.newClass.boardId = this.selectedBoard.id;
    }
  }

  boardChanged(event) {
    if (event.detail.value) {
      let br = this.boardEducations.find(board => board.name == event.detail.value);
      this.newClass.boardId = br.id;
    }
  }


  addClass() {
    this.newClass.id =this.utilityService.generateAlphaNumericId();
    this.newClass.name = this.utilityService.refactorName(this.newClass.displayName);
    //Default ColorCode
    this.newClass.colorCode = '#DXARG'
    this.classesService.setClassToCollection(this.newClass);
    this.presentToast('Classes added successfully!!!.');
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

}

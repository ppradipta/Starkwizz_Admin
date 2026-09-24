import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IonModal, ModalController, ToastController } from '@ionic/angular';
import { BaseComponent } from 'src/app/base/base.component';
import { AlertMessageComponent } from 'src/app/common/component/alert-message/alert-message.component';
import { WarningMessageComponent } from 'src/app/common/component/warning-message/warning-message.component';
import { BoardOfEducation } from 'src/app/model/board';
import { Classes, ClassesView } from 'src/app/model/classes';
import { Module, ModuleView } from 'src/app/model/module';
import { SubjectView, Subjects } from 'src/app/model/subject';
import { BoardService } from 'src/app/services/board.service';
import { ClassesService } from 'src/app/services/classes.service';
import { EventsService } from 'src/app/services/events.service';
import { ModuleService } from 'src/app/services/module.service';
import { SubjectService } from 'src/app/services/subject.service';
import { UserService } from 'src/app/services/user.service';
import { UtilityService } from 'src/app/utils/utils.service';
import { AddClassesComponent } from '../classes/add-classes/add-classes.component';
import { EditClassesComponent } from '../classes/edit-classes/edit-classes.component';
import { LocationComponent } from '../location/location.component';
import { AddModulesComponent } from '../module/add-modules/add-modules.component';
import { EditModulesComponent } from '../module/edit-modules/edit-modules.component';
import { AddSubjectsComponent } from '../subject/add-subjects/add-subjects.component';
import { EditSubjectsComponent } from '../subject/edit-subjects/edit-subjects.component';
import { GenerateKeyService } from 'src/app/model/comman/common.generatekey';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent extends BaseComponent implements OnInit {
  @ViewChild(IonModal) bookPublisherModal: IonModal;
  user: any = {};
  selectedBoard: BoardOfEducation = new BoardOfEducation();
  selectClass: ClassesView = new Classes();
  selectSubject: Subjects = new Subjects();
  selectModule: Module = new Module();
  subjectChecked: number;
  moduleChecked: number;

  imageFiles: any;

  selectedClassList: ClassesView[] = [];
  selectedSubjectList: SubjectView[] = [];
  selectedModules: ModuleView[] = [];

  bookPublishers: any[] = [];
  bookPublisherName: string = '';
  bookPublisher: any = {};
  bookPublisherOperationType: string = 'ADD';
  isBookPublisherOpen: boolean = false;
  filterBookPublisher: any[] = [];
  constructor(
    private modalController: ModalController,
    private toastController: ToastController,
    private utilityService: UtilityService,
    public firestore: AngularFirestore,
    public classesService: ClassesService,
    public subjectService: SubjectService,
    public boardService: BoardService,
    public moduleService: ModuleService,
    private userService: UserService,
    private eventsService: EventsService,
    private generateKey: GenerateKeyService,
  ) {
    super(classesService, subjectService, boardService, moduleService)
  }

  ngOnInit() {

    this.userService.getUserDetails().subscribe(user => {
      this.user = user;
    });
    this.getBookPublishers();
  }

  boardChanged() {
    if (this.selectedBoard.id) {
      this.selectClass = new Classes();
      this.selectSubject = new Subjects();
      this.selectModule = new Module();

      this.selectedClassList = this.classesList.filter(clss => (clss.boardId === this.selectedBoard.id));
      this.selectedClassList = this.selectedClassList.sort(function (a, b) {
        return a.name.localeCompare(b.name, undefined, {
          numeric: true,
          sensitivity: 'base'
        });
      });
      // Sorting need to add 
      //For editing Color Code
      this.selectedClassList.forEach(clss => {
        clss.edit = true;  //Do not save this vaule to DB
        clss.isChecked = true;
      })
    }

  }

  getBookPublishers() {
    this.moduleService.publishers$.subscribe(publiserList => {
      this.bookPublishers = publiserList;
      if (this.selectedBoard && this.selectClass && this.bookPublishers) {
        this.filterBookPublisher = this.bookPublishers.filter(bp => (bp.board == this.selectedBoard.displayName && bp.classId === this.selectClass.id));
      }
    });
  }


  classChanged(cls: Classes) {
    this.selectClass = cls;
    if (this.selectClass.id) {
      //Null selected Sub
      this.selectSubject = new Subjects();
      this.selectModule = new Module();

      this.selectedSubjectList = this.subjectList.filter(sub => (sub.classId === this.selectClass.id));
      this.selectedSubjectList = this.selectedSubjectList.sort(function (a, b) {
        return a.name.localeCompare(b.name, undefined, {
          numeric: true,
          sensitivity: 'base'
        });
      });
      //For Button disabled
      this.selectedSubjectList.forEach(sub => {
        sub.edit = true;  //Do not save this vaule to DB
        sub.isChecked = true;
      })

      this.filterBookPublisher = this.bookPublishers.filter(bp => (bp.board == this.selectedBoard.displayName && bp.classId == this.selectClass.id));
      //For editing Color Code
      this.selectedClassList.forEach(clss => {
        if (this.selectClass.id == clss.id) {
          clss.isChecked = false
        } else {
          clss.isChecked = true
        }
      })
    }
  }

  subjectChanged(sub,) {
    this.selectSubject = sub;
    this.selectedModules = this.moduleList.filter(mod => (mod.subjectId === this.selectSubject.id));

    this.selectedModules = this.selectedModules.sort(function (a, b) {
      return a.name.localeCompare(b.name, undefined, {
        numeric: true,
        sensitivity: 'base'
      });
    });

    this.selectedModules.forEach(mod => {
      mod.edit = true;  //Do not save this vaule to DB
      mod.isChecked = true;
    })

    //For editing Color Code
    this.selectedSubjectList.forEach(subject => {
      if (this.selectSubject.id == subject.id) {
        subject.isChecked = false
      } else {
        subject.isChecked = true
      }
    })
  }

  moduleChanged(mod) {
    this.selectModule = mod;

    //For editing Color Code
    this.selectedSubjectList.forEach(subject => {
      if (this.selectSubject.id == subject.id) {
        subject.isChecked = false
      } else {
        subject.isChecked = true
      }
    })
  }

  async addClasses() {
    const modal = await this.modalController.create({
      component: AddClassesComponent,
      componentProps: {
        selectedBoard: this.selectedBoard
      },
      cssClass: 'center-modal',
      backdropDismiss: false
    });
    await modal.present();
    await modal.onDidDismiss().then(result => {
      if (result.data == "updated") {
        this.updateOrDeleteOperation();
      }
    });

  }
  updateOrDeleteOperation() {
    this.selectedBoard = new BoardOfEducation();
    this.selectClass = new Classes();
    this.selectSubject = new Subjects();
    this.selectModule = new Module();
  }


  async updateClass(cls) {
    this.selectClass = cls;
    const modal = await this.modalController.create({
      component: EditClassesComponent,
      componentProps: {
        selectedClass: this.selectClass
      },
      cssClass: 'center-modal',
      backdropDismiss: false
    });
    await modal.present();
    await modal.onDidDismiss().then(result => {
      if (result.data == "updated") {
        this.updateOrDeleteOperation();
      }
    });

  }

  async deleteClasses(cls) {
    this.selectClass = cls;
    this.buildInfoMessage(`Are you sure you want to delete Class ${this.selectClass.displayName}?`);
    const modal = await this.modalController.create({
      component: AlertMessageComponent,
      componentProps: {
        message: this.appMessage,
        header: 'Delete Class'
      },
      cssClass: 'small-center-modal',
      backdropDismiss: false
    });
    await modal.present();
    await modal.onDidDismiss().then(result => {
      if (result.data) {
        this.checkClassLink();
      }

    });

  }

  async deleteSubject(subject) {
    this.selectSubject = subject;
    this.buildInfoMessage(`Are you sure you want to delete Subject ${this.selectSubject.displayName}?`);
    const modal = await this.modalController.create({
      component: AlertMessageComponent,
      componentProps: {
        message: this.appMessage,
        header: 'Delete Subject'
      },
      cssClass: 'small-center-modal',
      backdropDismiss: false
    });
    await modal.present();
    await modal.onDidDismiss().then(result => {
      if (result.data) {
        this.checkSubjectLink();
      }
    });
  }

  checkSubjectLink() {

    this.moduleService.getModuleBySubjectId(this.selectSubject.id).then((modList: any) => {
      if (!modList.empty) {
        let moduleMessage: string;
        moduleMessage = `Subject ${this.selectSubject.displayName} can't be deleted! as it is linked with modules: `

        modList.forEach((mod: any) => {
          let module: Module = mod.data();
          moduleMessage = moduleMessage + module.name + ", "
        })
        this.buildInfoMessage(moduleMessage);
        this.presentWarningAlertModel(this.appMessage);
      } else {
        this.deleteSubjectById()
      }
    });
  }

  deleteSubjectById() {
    this.subjectService.deleteSubjectFromCollection(this.selectSubject.id);
    this.presentToast('Subject deleted successfully!!!.');
    this.selectSubject = new Subjects();
    this.getUpdatedSubjects();
  }


  checkClassLink() {

    this.subjectService.getSubjectByClassId(this.selectClass.id).then((subList: any) => {
      if (!subList.empty) {
        let subjectMessage: string;
        subjectMessage = `Class ${this.selectClass.displayName} cannot be deleted! as it is linked with subjects: `

        subList.forEach((sub: any) => {
          let subject: Subjects = sub.data();
          subjectMessage = subjectMessage + subject.displayName + ", "
        })
        this.buildInfoMessage(subjectMessage);
        this.presentWarningAlertModel(this.appMessage);
      } else {
        this.deleteClassById()
        this.updateOrDeleteOperation();
      }
    });
  }

  deleteClassById() {
    this.classesService.deleteClassFromCollection(this.selectClass.id);
    this.presentToast('Class deleted successfully!!!.');
  }

  async presentWarningAlertModel(msg) {
    const modal = await this.modalController.create({
      component: WarningMessageComponent,
      componentProps: {
        message: msg
      },
      cssClass: 'small-center-modal',
      backdropDismiss: false
    });
    return await modal.present();
  }

  //Add Subject
  async addSubject() {

    //Set selected class
    this.classesService.setSelectedClass(this.selectClass);

    const modal = await this.modalController.create({
      component: AddSubjectsComponent,
      cssClass: 'center-modal',
      backdropDismiss: false
    });
    await modal.present();
    await modal.onDidDismiss().then(result => {
      if (result.data == 'added') {
        this.getUpdatedSubjects();
        this.getUpdatedModules();
      }
    });

  }

  //Edit Subject
  async editSubject(subject) {
    this.selectSubject = subject;
    const modal = await this.modalController.create({
      component: EditSubjectsComponent,
      componentProps: {
        selectedSubject: subject,
      },
      cssClass: 'center-modal',
      backdropDismiss: false
    });
    await modal.present();
    await modal.onDidDismiss().then(result => {
      if (result.data == 'updated') {
        this.getUpdatedSubjects();
        this.getUpdatedModules();
      }
    });

  }

  getUpdatedSubjects() {
    this.selectSubject = new Subjects();
    this.selectedSubjectList = []
    this.subjectService.getSubjectByClassId(this.selectClass.id).then((subList: any) => {
      if (!subList.empty) {
        subList.forEach((sub: any) => {
          let subject: Subjects = sub.data();
          this.selectedSubjectList.push(subject);
        })
      }
    });
  }


  //Add Subject
  async addModuleToSubject() {

    const modal = await this.modalController.create({
      component: AddModulesComponent,
      componentProps: {
        selectedSubjects: this.selectedSubjectList,
        subjectName: this.selectSubject.name,
        selectedClass: this.selectClass,
      },
      cssClass: 'center-modal',

      backdropDismiss: false
    });
    await modal.present();
    await modal.onDidDismiss().then(result => {
      if (result.data == 'added') {
        this.getUpdatedModules();
      }

    });
  }

  //Add Subject
  async editModule(mod) {
    this.selectModule = mod;
    const modal = await this.modalController.create({
      component: EditModulesComponent,
      componentProps: {
        selectedModule: this.selectModule,
        selectedSubjects: this.selectedSubjectList,
        selectedClass: this.selectClass
      },
      cssClass: 'center-modal',
      backdropDismiss: false
    });
    await modal.present();
    await modal.onDidDismiss().then(result => {
      if (result.data == 'updated') {
        this.getUpdatedModules();
      }
    });

  }

  async deleteModule(mod) {
    this.selectModule = mod;
    this.buildInfoMessage(`Are you sure you want to delete Module ${this.selectModule.name}?`);
    const modal = await this.modalController.create({
      component: AlertMessageComponent,
      componentProps: {
        message: this.appMessage,
        header: 'Delete Module'
      },
      cssClass: 'small-center-modal',
      backdropDismiss: false
    });
    await modal.present();
    await modal.onDidDismiss().then(result => {
      if (result.data) {
        this.deleteModuleById();
      }
    });

  }

  deleteModuleById() {
    this.moduleService.deleteModuleFromCollection(this.selectModule.id);
    this.presentToast('Module deleted successfully!!!.');
    this.getUpdatedModules();
  }

  getUpdatedModules() {
    this.selectModule = new Module();
    this.selectedModules = []
    this.moduleService.getModuleBySubjectId(this.selectSubject.id).then((modList: any) => {
      if (!modList.empty) {
        modList.forEach((mod: any) => {
          let module: Module = mod.data();
          this.selectedModules.push(module);
        })
      }
    });
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    await toast.present();
  }

  presentActionSheet(fileLoader, educationObject, type) {
    //  if(!educationObject.isChecked){
    fileLoader.click();
    var that = this;
    fileLoader.onchange = function () {
      that.imageFiles = fileLoader.files[0];
      that.utilityService.uploadImage(that.imageFiles
        , educationObject, type)
    }
    // }else{
    //   this.presentToast('Please select some value');
    // }

  }


  enableColorCode(edu) {
    edu.edit = false
  }

  disableColorCode(education, type) {
    education.edit = true

    if (type === 'CLASSES') {
      this.classesService.setClassToCollection(this.classesService.populateClassToCollection(education));
    } else if (type === 'SUBJECT') {
      this.subjectService.setSubjectToCollection(this.subjectService.populateSubjectToCollection(education));
    } else if (type === 'MODULE') {
      this.moduleService.setModuleToCollection(this.moduleService.populateModuleToCollection(education));
    }

  }

  async addBookPublisher() {
    this.bookPublisherName = '';
    if (this.selectClass && this.selectedBoard) {
      this.isBookPublisherOpen = true;
      this.bookPublisherOperationType = 'ADD';
    } else {
      this.presentToast('Please select class and board for publisher');
      return;
    }

  }

  confirmAddBookPublisher() {
    this.bookPublisher = {
      name: this.bookPublisherName,
      id : this.generateKey.generateUniqueFirestoreId(),
      publisherCode: this.utilityService.refactorName(this.bookPublisherName),
      displayName: this.bookPublisherName.toUpperCase(),
      board: this.selectedBoard.name,
      classId: this.selectClass.id,
      className: this.selectClass.displayName
    }

    this.moduleService.setBookPublisherToCollection(this.bookPublisher).then(result => {
      this.presentToast('Publisher added sucessfully!!!');
      this.moduleService.getPublishers();
      this.modalDismiss();
    })
  }

  async deleteBookPublisher(bPublisher: any) {
    this.bookPublisherName = bPublisher.name;
    this.bookPublisher = bPublisher;
    this.isBookPublisherOpen = true;
    this.bookPublisherOperationType = 'DELETE';
  }

  confirmDeleteBookPublisher() {
    this.moduleService.deleteBookPublisherFromCollection(this.bookPublisher).then(result => {
      this.presentToast('Publisher deleted sucessfully!!!');
      this.moduleService.getPublishers();
      this.modalDismiss();
    });
  }
  async updateBookPublisher(bPublisher) {
    this.bookPublisherName = bPublisher.name;
    this.bookPublisher = bPublisher;
    this.isBookPublisherOpen = true;
    this.bookPublisherOperationType = 'EDIT';
  }

  confirmUpdateBookPublisher() {
    let newBookPublisher = {
      name: this.bookPublisherName,
      id: this.bookPublisher.id,
      PublisherCode: this.bookPublisherName.replace(/\s/g, "").toLowerCase(),
      displayName: this.bookPublisherName.toUpperCase(),
      board: this.selectedBoard.name,
      classId: this.selectClass.id,
      className: this.selectClass.displayName
    }

    this.moduleService.updateBookPublisherFromCollection(newBookPublisher, this.bookPublisher).then(result => {
      this.presentToast('Publisher updated sucessfully!!!');
      this.moduleService.getPublishers();
      this.modalDismiss();
    })
  }

  modalDismiss() {
    this.isBookPublisherOpen = false;
    this.bookPublisherModal.dismiss(null, 'cancel');
  }


  async linkSchoolForModule(module) {
    let event: any = {};
    event.boardName = this.selectClass.boardName;
    this.eventsService.setTabValue('SCHOOLS');
    const modal = await this.modalController.create({
      component: LocationComponent,
      componentProps: {
        actionType: 'LINK_SCHOOL',
        actionFor: 'MODULE',
        event: event,
        data: module
      },
      cssClass: 'addEvent-modal',
      backdropDismiss: false
    });
    await modal.present();
  }

}


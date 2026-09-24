import { Component, Input, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ModalController, ToastController } from '@ionic/angular';
import { ModuleService } from 'src/app/services/module.service';
import { UtilityService } from 'src/app/utils/utils.service';

@Component({
  selector: 'app-edit-modules',
  templateUrl: './edit-modules.component.html',
  styleUrls: ['./edit-modules.component.scss'],
})
export class EditModulesComponent implements OnInit {

  @Input() selectedModule: any;
  @Input() selectedSubjects: any[];
  @Input() selectedClass: any;

  imageFiles: any;
  bookPublishers: any[] = [];
  selectedPublisher: any = {};
  constructor(
    private modalController: ModalController,
    private toastController: ToastController,
    private utilityService: UtilityService,
    private storage: AngularFireStorage,
    public moduleService: ModuleService,
  ) {
  }

  ngOnInit() {
    this.moduleService.publishers$.subscribe(bookPublishers => {
      if (this.selectedClass && bookPublishers) {
        this.bookPublishers = bookPublishers.filter(bp => (bp.board == this.selectedClass.boardName && bp.classId === this.selectedClass.id));
      }
    });
  }



  close() {
    this.modalController.dismiss();
  }

  updateModule() {
    this.selectedModule.name = this.utilityService.refactorName(this.selectedModule.displayName);
    if (this.selectedPublisher) {
      this.selectedModule.publisherId = this.selectedPublisher.id;
      this.selectedModule.publisherName = this.selectedPublisher.name;
    }
    this.findSubjectIdbyName();
    this.moduleService.setModuleToCollection(this.selectedModule);
    this.presentToast('Module updated successfully!!!.');
    this.modalController.dismiss("updated");

  }

  findSubjectIdbyName() {
    let subject = this.selectedSubjects.find(sub => sub.name == this.selectedModule.subjectName);
    this.selectedModule.subjectId = subject.id;
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

    let ref = this.storage.ref('strkwiz/module/images/' + this.selectedModule.id);
    ref.put(this.imageFiles).then(data => {
      ref.getDownloadURL().subscribe(iurl => {
        this.selectedModule.imageURL = iurl;
      });
    });
  }

}
import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-edit-access-modal',
  templateUrl: './edit-access-modal.component.html',
  styleUrls: ['./edit-access-modal.component.scss'],
})
export class EditAccessModalComponent implements OnInit {
  // @Input() acess: any[] = [];
  @Input() user: any;
  selectedAcess: any[] = [];
  constructor(
    private modalController: ModalController,
    private firestore: AngularFirestore,
    private toastController: ToastController
  ) { }

  ngOnInit() {


  }

  close() {
    this.modalController.dismiss();
  }

  // updateSelectedAcess(event, acess: any) {
  //   if (event.detail.value) {
  //     this.selectedAcess.push(acess);
  //   } else {
  //     let acessIndex = this.selectedAcess.findIndex(acs => acs.id == acess.id);
  //     if (acessIndex != -1) {
  //       this.selectedAcess.splice(acessIndex, 1);
  //     }
  //   }
  // }



  updateSelectedAcess(event, acess: any) {
    if (event.detail.checked) {
      acess.isSelected = true;
    } else {
      acess.isSelected = false;
    }
  }

  confirmChangesForAcess() {
    this.firestore.collection('admin_user').doc(this.user.id).update({
      acess: this.user.acess,
    }).then(result => {
      this.presentToast('Profile Acess Updated ');
      this.close();
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

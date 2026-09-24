import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit {
  @Input() userDetail: any = {};
  selectedTpe: string = 'GENERAL';
  constructor(private firestore: AngularFirestore, private toastController: ToastController, private modalCtrl: ModalController) { }

  ngOnInit() { }


  userLinkTypeSelected(type: string) {
    this.selectedTpe = type;
  }

  updateUserLinkType() {
    this.firestore.collection("users", ref => ref).doc(this.userDetail.id).update({
      userLinkType: this.selectedTpe
    }).then(result => {
      this.modalCtrl.dismiss();
      this.presentToast('Type update sucessfully!!');
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

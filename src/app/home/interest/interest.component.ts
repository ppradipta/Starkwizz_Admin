import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController, ModalController, NavController, ToastController } from '@ionic/angular';
import { FirebaseCollection } from 'src/app/model/comman/firebase-collection';
import { UploadQuestionComponent } from '../question/upload-question/upload-question.component';

@Component({
  selector: 'app-interest',
  templateUrl: './interest.component.html',
  styleUrls: ['./interest.component.scss'],
})
export class InterestComponent implements OnInit {
  interests: any[] = [];
  actionType: string = 'NORMAL';
  constructor(private firestore: AngularFirestore,
    private alertController: AlertController,
    private modalController: ModalController,
    private toastController: ToastController,
    public navCtrl: NavController) { }

  ngOnInit() {
    if (this.actionType == 'NORMAL') {
      this.getAllIntrerests();
    }


  }
  goBack() {
    this.navCtrl.back();
  }

  searchRecords() {
    this.getAllIntrerests();
  }

  getAllIntrerests() {
    this.interests = [];
    this.actionType = 'NORMAL';
    const query = this.firestore.collection(FirebaseCollection.INTERESTS);
    query.ref.get().then((state: any) => {
      if (!state.empty) {
        state.forEach(data => {
          this.interests.push(data.data());
        });
        this.interests = this.interests.sort((a, b) => {
          if (a.displayName.toLowerCase() > b.displayName.toLowerCase())
            return 1;
          if (a.displayName.toLowerCase() < b.displayName.toLowerCase())
            return -1;
          return 0;
        });
      }
    })
  }

  async uploadData() {
    this.actionType = 'BULK_UPLOAD';
    const modal = await this.modalController.create({
      component: UploadQuestionComponent,
      cssClass: 'center-modal',
      backdropDismiss: false,
      componentProps: {
        uploadfor: "INTEREST",
        uploadforType: "INTEREST"
      },
    });
    await modal.present();
    await modal.onDidDismiss().then(result => {
      if (result['data']) {
        const uploadfor = result['data'].uploadfor;
        const records = result['data'].record;
        if (uploadfor == 'INTEREST') {
          this.interests = records;
        }
      } else {
        this.presentToast(`No records found for upload!!,Please check upload files `);
        this.interests = [];
      }
    });
  }

  confirmBulkUpload() {
    this.interests.forEach(stat => {
      this.firestore.collection(FirebaseCollection.INTERESTS).doc(stat.id).set(stat, { merge: true });
    });
    this.presentToast(`Interests Saved Successfully !!! `);

  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    await toast.present();
  }

  async deleteInterests(record) {
    const alert = await this.alertController.create({
      // cssClass: 'my-custom-class',
      header: "Confirm Alert",
      message: `Deleting <b>${record.displayName}</b>, Are you Sure ?`,
      buttons: [
        {
          text: `Cancel `,
          role: "CANCEL",
          cssClass: "secondary",
          handler: (CANCEL) => {
          }
        },
        {
          text: `Delete`,
          role: "DELETE",
          handler: async (DELETE) => {
            if (this.actionType == 'BULK_UPLOAD') {
              const index = this.interests.findIndex(ps => ps.id == record.id);
              if (index != -1) {
                this.interests.splice(index, 1);
              }
            } else {
              this.firestore.collection(FirebaseCollection.INTERESTS).doc(record.id).delete().then(() => {
                this.presentToast(`${record.displayName} Deleted Successfully !!! `);
              });
            }

          }
        }
      ]
    });
    await alert.present();
  }

}

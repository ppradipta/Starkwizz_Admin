import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController, ToastController } from '@ionic/angular';
import { AddClubPointComponent } from './add-club-point/add-club-point.component';

@Component({
  selector: 'app-club-points',
  templateUrl: './club-points.component.html',
  styleUrls: ['./club-points.component.scss'],
})
export class ClubPointsComponent implements OnInit {

  clubPointsList: any[] = [];
  constructor(private modalController: ModalController,
    private firestore: AngularFirestore,
    private toastController: ToastController) { }

  ngOnInit() {
  this.getClubPointsList();
  }

  getClubPointsList(){
    this.firestore.collection('events_club_points').valueChanges().subscribe((records: any[]) => {
      this.clubPointsList = records;
    });
  }


  deleteCopun(discount: any) {
    this.firestore.collection('events_club_points').doc(discount.id).delete().then(result => {
      this.presentToast('Club Point Deleted sucessfully!!');
      this.getClubPointsList();
    });
  }

  async addClubPoints(actionType) {
    const modal = await this.modalController.create({
      component: AddClubPointComponent,
      componentProps: {
        actionType: actionType,
      },
      cssClass: 'addEvent-modal',
      backdropDismiss: false
    });
    await modal.present();
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    await toast.present();
  }


}

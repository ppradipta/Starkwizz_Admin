import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IonModal, ModalController, ToastController } from '@ionic/angular';
import { AddComboOfferComponent } from './add-combo-offer/add-combo-offer.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-combo-offer',
  templateUrl: './combo-offer.component.html',
  styleUrls: ['./combo-offer.component.scss'],
})
export class ComboOfferComponent implements OnInit {
  offerList: any[] = [];
  constructor(private modalController: ModalController,
    private firestore: AngularFirestore,
    private toastController: ToastController,
    private router: Router,
  ) { }

  ngOnInit() {

    this.getComboList();
  }
  
  getComboList() {
    this.firestore.collection('combo_offers_subscription').valueChanges().subscribe((records: any[]) => {
      this.offerList = records;
    });
  }

  async addComboOffer(actionType) {
    const modal = await this.modalController.create({
      component: AddComboOfferComponent,
      componentProps: {
        actionType: actionType,
      },
      cssClass: 'addEvent-modal',
      backdropDismiss: false
    });
    await modal.present();
  }

  async editComboOffer(offer: any) {
    const modal = await this.modalController.create({
      component: AddComboOfferComponent,
      componentProps: {
        actionType: 'EDIT',
        comboSetup: offer
      },
      cssClass: 'addEvent-modal',
      backdropDismiss: false
    });
    await modal.present();
  }

  goTofreetrial() {
    this.router.navigate(['home/free-trial']);
  }

  deleteComboOffer(offer: any) {
    this.firestore.collection('combo_offers_subscription').doc(offer.id).delete().then(result => {
      this.presentToast('Combo Offer Deleted sucessfully!!');
      this.getComboList();
    });
  }

  activeComboOffer(offer: any) {
    this.firestore.collection('combo_offers_subscription').doc(offer.id).update({
      status: 'ACTIVE'
    }).then(result => {
      this.presentToast('Status updated sucessfully!!!');
    })
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    await toast.present();
  }

  goToCancel() {
    this.router.navigate(['home/cancel-subscription']);
  }
}

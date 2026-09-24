import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-price-management',
  templateUrl: './price-management.component.html',
  styleUrls: ['./price-management.component.scss'],
})
export class PriceManagementComponent implements OnInit {
  prices: {
    individual: { yearly: number };
    family: number;
    school: number;
    privateInstitution: number;
  } = {
    individual: { yearly: 0 },
    family: 0,
    school: 0,
    privateInstitution: 0,
  };

  constructor(
    private firestore: AngularFirestore,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.loadPrices();
  }

  loadPrices() {
    this.firestore.collection('price_management').doc('prices').valueChanges().subscribe((data: any) => {
      if (data) {
        this.prices = {
          individual: {
            yearly: Number(data?.individual?.yearly) || 0,
          },
          family: Number(data?.family) || 0,
          school: Number(data?.school) || 0,
          privateInstitution: Number(data?.privateInstitution) || 0,
        };
      }
    });
  }

  savePrices() {
    this.firestore.collection('price_management').doc('prices').set(this.prices).then(() => {
      this.presentToast('Prices saved successfully!');
    }).catch(error => {
      this.presentToast('Error saving prices: ' + error.message);
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    await toast.present();
  }
}

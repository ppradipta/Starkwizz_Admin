import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { FirebaseCollection } from 'src/app/model/comman/firebase-collection';
import { EventsService } from 'src/app/services/events.service';

@Component({
  selector: 'app-view-data',
  templateUrl: './view-data.page.html',
  styleUrls: ['./view-data.page.scss'],
})
export class ViewDataPage implements OnInit {
  locData: any;
  locationData: any[];
  constructor(
    private eventsService: EventsService,
    private firestore: AngularFirestore,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.eventsService.getLocationData().subscribe((data) => {
      this.locData = data;
    });
    if (this.locData) {
      this.getLocationData();
    }
  }

  goBack(){
    this.eventsService.setTabValue(this.locData.tabValue)
    this.router.navigate(['home/location']);
  }

  async getLocationData() {
    let query; this.locationData = []
    if (this.locData.collectionName == 'district') {
      query = this.firestore.collection(FirebaseCollection.DISTRICT).ref
        .where('stateid', '==', this.locData.id);
    }else if(this.locData.collectionName == 'cities'){
      query = this.firestore.collection(FirebaseCollection.CITIES).ref
        .where('stateid', '==', this.locData.stateid);
    }
    else if(this.locData.collectionName == 'school'){
      query = this.firestore.collection(FirebaseCollection.SCHOOL).ref
        .where('stateid', '==', this.locData.stateid)
        .where('districtid', '==', this.locData.districtid);
    }

    query.get().then((eventDetail: any) => {
      if (!eventDetail.empty) {
        eventDetail.forEach(data => {
          this.locationData.push(data.data());
        });
      }
    });





    // let collectionName = await this.selectCollectionName(this.locData.tabValue);
    // this.locationData = []
    // const query = this.firestore.collection(this.locData.collectionName);
    // query.ref
    //   .where("stateid", "==", this.locData.id)
    //   .get().then((dist: any) => {
    //     if (!dist.empty) {
    //       dist.forEach(data => {
    //         this.locationData.push(data.data());
    //       });
    //     }
    //   })
  }

  async delete(data) {
    const alert = await this.alertController.create({
      // cssClass: 'my-custom-class',
      header: "Confirm Alert",
      message: `Delete ${this.locData.collectionName.toLocaleLowerCase()} <b>${data.displayName}</b>, Are you Sure ?`,
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

            this.firestore.collection(this.locData.collectionName).doc(data.id).delete().then(() => {
              this.presentToast(`${this.locData.collectionName} Deleted Successfully !!! `);
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    await toast.present();
  }
}

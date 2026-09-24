import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { FirebaseCollection } from 'src/app/model/comman/firebase-collection';
import { EventsService } from 'src/app/services/events.service';
import { UtilityService } from 'src/app/utils/utils.service';

@Component({
  selector: 'app-hubs',
  templateUrl: './hubs.component.html',
  styleUrls: ['./hubs.component.scss'],
})
export class HubsComponent implements OnInit {
  hubsDetails: any[] = [];
  imageFiles: any;

  constructor(
    private utilityService: UtilityService,
    private modalController: ModalController,
    private firestore: AngularFirestore,
    private router: Router,
    private toastController: ToastController,
    private eventsService: EventsService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.getAllHubData();
  }

  getAllHubData() {
    this.firestore.collection(FirebaseCollection.HUBS).valueChanges().subscribe((hub) => {
      this.hubsDetails = hub;
    });
  }

  createHubs() {
    this.router.navigate(['home/hubs/create']);
  }

  editHub(data) {
    this.eventsService.setHubDetails(data)
    this.router.navigate(['home/hubs/create', { isEdit: true }]);
  }

  async deleteHubAlert(hub) {

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: "Confirm Alert",
      message: "Are you Sure ?",
      buttons: [
        {
          text: "Cancel",
          role: "CANCEL",
          cssClass: "secondary",
          handler: () => {
            this.alertController.dismiss();
          }
        },
        {
          text: "Delete Hub",
          role: "DELETE",
          handler: (DELETE) => {
            this.firestore.collection('hubs').doc(hub.id).delete().then(() => {
              this.deleteHubNotices(hub.id);
              this.deleteHubOffers(hub.id);
              this.presentToast('Hub DELETED SuccessFully !!!.');
            });


          }
        }
      ]
    });
    await alert.present();
  }


  deleteHubNotices(hubId) {
    this.firestore.collection("hubNotices", ref => ref.where("hubId", "==", hubId)).get().subscribe(data => {
      if (!data.empty) {
        data.forEach((res: any) => {
          this.firestore.collection('hubNotices').doc(res.id).delete().then(() => {
          });
        })
      }
    });
  }

  deleteHubOffers(hubId) {
    this.firestore.collection("hubOffers", ref => ref.where("hubId", "==", hubId)).get().subscribe(data => {
      if (!data.empty) {
        data.forEach((res: any) => {
          this.firestore.collection('hubOffers').doc(res.id).delete().then(() => {
          });
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

  async approvalAlert(hub) {

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: "Approve Alert",
      message: "Are you Sure ?",
      buttons: [
        {
          text: "Cancel",
          role: "CANCEL",
          cssClass: "secondary",
          handler: () => {
            this.alertController.dismiss();
          }
        },
        {
          text: "Approve Hub",
          role: "APPROVE",
          handler: (APPROVE) => {
            this.firestore.collection('hubs').doc(hub.id)
              .update({
                status: 'APPROVED',

              })
          }
        }
      ]
    });
    await alert.present();
  }

  addOffers(hub) {
    this.router.navigate(['home/hubs/offer'], { queryParams: { hubId: hub.id } });
  }

  addNotice(hub) {
    this.router.navigate(['home/hubs/notice'], { queryParams: { hubId: hub.id } });
  }


  fileChangeEvent(event, hubdetails) {
      this.imageFiles = event.target.files[0];
      this.utilityService.uploadImage(this.imageFiles
        , hubdetails, 'HUB')
  }

}

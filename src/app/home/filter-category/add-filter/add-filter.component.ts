import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController, ToastController } from '@ionic/angular';
import { arrayUnion } from "firebase/firestore";
import { FirebaseCollection } from 'src/app/model/comman/firebase-collection';

@Component({
  selector: 'app-add-filter',
  templateUrl: './add-filter.component.html',
  styleUrls: ['./add-filter.component.scss'],
})
export class AddFilterComponent implements OnInit {
  @Input() type: string;
  @Input() typeId: string;
  @Input() filterType: any;
  filterName: string;
  description: string;
  constructor(private firestore: AngularFirestore, private toastController: ToastController, private modalController: ModalController) { }

  ngOnInit() {


  }

  close() {
    this.modalController.dismiss();
  }

  addFilterName() {
    let filterId = this.filterName.replace(/\s/g, '').toLocaleLowerCase();
    let data = {
      'displayName': this.filterName,
      'id': filterId,
      'name': filterId,
      'description': this.description
    }
    let docId = this.type.toLocaleLowerCase() + this.typeId;
    this.firestore.collection(FirebaseCollection.PARAMETER).doc(docId).get().subscribe(records => {
      if (records.exists) {
        this.firestore.collection(FirebaseCollection.PARAMETER).doc(docId).update({
          values: arrayUnion(data)
        }).then(res => {
          this.modalController.dismiss();
          this.presentToast(`${this.filterName} added sucessfully!! `);
        })
      } else {
        let paramrecord = {
          id: this.typeId,
          type: this.filterType.id,
          filterfor: this.type,
          values: [data]
        }
        this.firestore.collection(FirebaseCollection.PARAMETER).doc(docId)
          .set(JSON.parse(JSON.stringify(paramrecord)), { merge: true });
        this.modalController.dismiss();
        this.presentToast(`${this.filterName} added sucessfully!! `);
      }
    })


  }


  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    await toast.present();
  }


}

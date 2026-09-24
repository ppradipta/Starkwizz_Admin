import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController, ToastController } from '@ionic/angular';
import { DateUtilService } from 'src/app/common/util/date-util.service';
import { GenerateKeyService } from 'src/app/model/comman/common.generatekey';

@Component({
  selector: 'app-add-club-point',
  templateUrl: './add-club-point.component.html',
  styleUrls: ['./add-club-point.component.scss'],
})
export class AddClubPointComponent implements OnInit {
  clubName: '';
  minScore: '';
  maxScore: '';
  testType: '';
  points: '';
  constructor(private generateKey: GenerateKeyService, private dateUtil: DateUtilService,
    private modalCtrl: ModalController,
    private firestore: AngularFirestore, private toastController: ToastController) {
  }

  ngOnInit() {

  }

  createClubPoints() {
    let clubPointData = {
      id: this.generateKey.generateUniqueFirestoreId(),
      name: this.clubName,
      score: {
        min: this.minScore + '%',
        max: this.maxScore + '%',
      },
      type: this.testType,
      points: this.points,
      creationdate: this.dateUtil.getCurrentDateWithYYYYMMDD(),
      createDateUnix: this.dateUtil.getCurrentEpochTime(),
    }

    this.firestore.collection('events_club_points').doc(clubPointData.id)
      .set(JSON.parse(JSON.stringify(clubPointData)), { merge: true }).then(result => {
        this.presentToast('Discounts added sucessfully!!');
        this.modalCtrl.dismiss();
      });
  }

  close() {
    this.modalCtrl.dismiss();
  }


  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    await toast.present();
  }
}

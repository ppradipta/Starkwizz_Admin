import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController, ToastController } from '@ionic/angular';
import * as moment from 'moment';
import { DateUtilService } from 'src/app/common/util/date-util.service';
import { GenerateKeyService } from 'src/app/model/comman/common.generatekey';
import { FirebaseCollection } from 'src/app/model/comman/firebase-collection';

@Component({
  selector: 'app-add-combo-offer',
  templateUrl: './add-combo-offer.component.html',
  styleUrls: ['./add-combo-offer.component.scss'],
})
export class AddComboOfferComponent implements OnInit {
  comboSetup: any = {
    id: '',
    code: '',
    name: '',
    offerApplicables: [
      {id: 0, name: 'Dynamo Subscription', price: 0, desc: 'All Chapters, All Subjects', startDate: '', endDate: '', 
        type: 'DYNAMO', desc1: 'Academic Test Series I 5 Steps Analysis', discount: 0},
      {id: 1, name: 'Quizwhizz Subscription', price: 0, desc: 'GK, Current Affairs, Mental Ability', startDate: '', endDate: '', 
        type: 'QUIZWHIZZ', desc1: 'Sunday Events I The Game Changer', discount: 0},
      {id: 2, name: 'Event Subscription', price: 0, desc: 'On all academic subjects', startDate: '', endDate: '', 
        type: 'EVENT', desc1: 'Scholarships & Talent Search Competitions', discount: 0},
    ],
    discount: '',
    totalPrice: '',
    status: '',
    creationdate: '',
    createDateUnix: '',
  }
  public minDate = moment().format();
  public maxDate = moment().add(400, 'd').format();
  constructor(private generateKey: GenerateKeyService, private dateUtil: DateUtilService,
    private modalCtrl: ModalController,
    private firestore: AngularFirestore, private toastController: ToastController) {
    this.comboSetup.code = 'SKC-' + this.generateKey.generateApplicationId();
    this.comboSetup.creationdate = this.dateUtil.getCurrentDateWithYYYYMMDD();
    this.comboSetup.createDateUnix = this.dateUtil.getCurrentEpochTime();
    this.comboSetup.id = this.generateKey.generateUniqueFirestoreId();
    this.comboSetup.status='CREATE';
    this.comboSetup.desc='HURRY UP!';
    this.comboSetup.desc1='LIMITED PERIOD OFFER';
    this.comboSetup.desc2='Subscribe NOW for the Academic Year 2025-26. Enjoy the seamless benefits of these Platforms for the Academic Year 2024-25 [ABSOLUTELY FREE]*';
  }

  ngOnInit() {

  }

  createComboOffer() {
    this.comboSetup.totalPrice = this.comboSetup.offerApplicables?.reduce((sum, item) => sum + item.price, 0);
    this.firestore.collection('combo_offers_subscription').doc(this.comboSetup.id)
      .set(JSON.parse(JSON.stringify(this.comboSetup)), { merge: true }).then(result => {
        this.presentToast('Combo Offer added sucessfully!!');
        this.modalCtrl.dismiss();
      });
  }

  close(){
    this.modalCtrl.dismiss();
  }

  offerStartDateChange(list, value) {
    let classdetls = this.comboSetup.offerApplicables?.find(cld => cld.id == list.id);
    if (classdetls) {
      list.startDate = this.dateUtil.getFormatDate(value);
    }
  }

  offerEndDateChange(list, value) {
    let classdetls = this.comboSetup.offerApplicables?.find(cld => cld.id == list.id);
    if (classdetls) {
      list.endDate = this.dateUtil.getFormatDate(value);
      list.countDays = this.dateUtil.getDateOFRemailningDays(list.startDate, list.endDate);
    }
  }


  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    await toast.present();
  }
   
}



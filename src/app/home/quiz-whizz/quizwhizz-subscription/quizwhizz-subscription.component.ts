import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import { Events } from 'src/app/model/events';
import { EventsService } from 'src/app/services/events.service';
import { AddQuizwhizzSubscriptionComponent } from '../add-quizwhizz-subscription/add-quizwhizz-subscription.component';


@Component({
  selector: 'app-quizwhizz-subscription',
  templateUrl: './quizwhizz-subscription.component.html',
  styleUrls: ['./quizwhizz-subscription.component.scss'],
})
export class QuizwhizzSubscriptionComponent implements OnInit {
  boardDetails: any[] = [];
  classDetails: any[] = [];
  eventDetails: Events = new Events();
  quizSubsData: any[] = [];
  
  constructor(
    private firestore: AngularFirestore,
    public eventsService: EventsService,
    private toastController: ToastController,
    private modalController: ModalController,
    private navCtrl: NavController,

  ) { }

  ngOnInit() {
    this.getDiscountList();
    }

    goBack() {
      this.navCtrl.back();
    }
  
    getDiscountList(){
      this.firestore.collection('quizWhizz_subscription').valueChanges().subscribe((records: any[]) => {
        this.quizSubsData = records;
      });
    }

    async gotoAddQuizWhizz() {
      const modal = await this.modalController.create({
        component: AddQuizwhizzSubscriptionComponent,
        componentProps: {
          actionType: 'ADD',
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


  deletesubs(discount: any) {
    this.firestore.collection('quizWhizz_subscription').doc(discount.id).delete().then(result => {
      this.presentToast('QuizWhizz Subscription Deleted sucessfully!!');
      this.getDiscountList();
    });
  }

}

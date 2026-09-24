import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import { FirebaseCollection } from 'src/app/model/comman/firebase-collection';
import { DashBoardService } from 'src/app/services/dashboard.service';
import { EventsService } from 'src/app/services/events.service';
import { EventActivityDetailComponent } from './event-activity-detail/event-activity-detail.component';

@Component({
  selector: 'app-event-activity',
  templateUrl: './event-activity.component.html',
  styleUrls: ['./event-activity.component.scss'],
})
export class EventActivityComponent implements OnInit {
  event: any;
  eventActivities: any[] = [];
  constructor(
    private eventsService: EventsService,
    private dashboardService: DashBoardService,
    private modalController: ModalController,
    private firestore: AngularFirestore,
    private toastController: ToastController,
    private navCtrl: NavController) {


  }

  ngOnInit() {
    this.eventsService.getEventData().subscribe(event => {
      this.event = event;

    });

  }


  showAllActivities() {
    let collectionName = this.event.type == 'QUIZWHIZZ EXAM' ? 'user_quizwhizz_events' : this.event.type == 'DYNAMO EXAM' ? 'user_dyanmo_exam' : FirebaseCollection.USER_EVENTS;
    //    this.dashboardService.getUserEventActivityDetailsWithNextQuery(this.event);
    this.firestore.collection<any>(collectionName, ref => ref.where('eventId', '==', this.event.id)).get().subscribe(results => {
      this.eventActivities = [];
      if (results.size > 0) {
        results.forEach(docSnapshot => {
          let data = docSnapshot.data();
          data['isSubjectiveEvaluationPending'] = false;
          if (null != data.questions && data.questions.length > 0) {
            let questionTheory = data.questions.filter(qustype => qustype.type === 'SUBJECTIVE_NO_OPTION');
            if (null != questionTheory && questionTheory.length > 0) {
              data['isSubjectiveEvaluationPending'] = true;
            }
          }
          let userEVentIndex = this.eventActivities.findIndex(evData => evData.userId == data.userId);
          if (userEVentIndex != -1) {
            this.eventActivities[userEVentIndex] = data;
          } else {
            this.eventActivities.push(data);
          }

        });
      }

    })
  }

  async evealuateQuestionAns(useractivity) {
    const modal = await this.modalController.create({
      component: EventActivityDetailComponent,
      backdropDismiss: true,
      cssClass: 'addQuestion-modal',
      componentProps: {
        activity: useractivity
      }
    })

    await modal.present();
  }

  async findNext(event) {
    await this.dashboardService.getUserEventActivityDetailsWithNextQuery(this.event);
    event.target.complete();
  }

  goBack() {
    this.navCtrl.back();
  }

  deleteActivities(useractivity) {
    let collectionName = useractivity.type == 'QUIZWHIZZ EXAM' ? 'user_quizwhizz_events' : useractivity.type == 'DYNAMO EXAM' ? 'user_dyanmo_exam' : FirebaseCollection.USER_EVENTS;
    this.firestore.collection(collectionName).doc(useractivity.id).delete().then((result: any) => {
      this.presentToast('Activity removed Sucessfully!!');
      this.showAllActivities();
    });

  }


  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    await toast.present();
  }

}

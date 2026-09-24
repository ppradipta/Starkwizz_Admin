
import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController, ToastController } from '@ionic/angular';
import { FirebaseCollection } from 'src/app/model/comman/firebase-collection';
import { EventsService } from 'src/app/services/events.service';
import { LoadingService } from 'src/app/services/loading.service';


@Component({
  selector: 'app-calculate-rank',
  templateUrl: './calculate-rank.component.html',
  styleUrls: ['./calculate-rank.component.scss'],
})
export class CalculateRankComponent implements OnInit {

  @Input() event: any;
  @Input() eventType: string;
  eventFilterType: string;
  eventData: any[] = [];
  constructor(private modalController: ModalController,
    private firestore: AngularFirestore,
    private eventService: EventsService,
    private toastController: ToastController,
    private loaderService: LoadingService) { }

  ngOnInit() {
  }

  close() {
    this.modalController.dismiss();
  }

  calculateRankByType(event) {
    this.eventFilterType = event.detail.value;
    let query;

    if (this.eventType == 'QUIZWHIZZ') {
      query = this.firestore.collection(FirebaseCollection.QUIZWHIZZ_EVENTS).ref
        .where('eventId', '==', this.event.id)
        .where('status', '==', 'COMPLETED');
    } else {
      query = this.firestore.collection(FirebaseCollection.USER_EVENTS).ref
        .where('eventId', '==', this.event.id)
        .where('status', '==', 'COMPLETED');
    }
    query.get().then((eventDetail: any) => {
      if (!eventDetail.empty) {
        eventDetail.forEach(data => {
          this.eventData.push(data.data());
        });
      } else {
        this.presentToast('Plase check No data present for the event !!!');
      }
    });
  }

  groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }

  claculateRank() {
    this.loaderService.present();
    if (this.eventType == 'QUIZWHIZZ') {
      if (this.eventFilterType == 'SCHOOL') {
        const schoolGroupData = this.groupBy(this.eventData, event => event.schoolId);
        this.userCalculateRank(schoolGroupData);
      }
      else if (this.eventFilterType == 'CITY') {
        const cityGroupData = this.groupBy(this.eventData, event => event.cityId);
        this.userCalculateRank(cityGroupData);
      }
      else if (this.eventFilterType == 'DISTRICT') {
        const districtGroupData = this.groupBy(this.eventData, event => event.districtId);
        this.userCalculateRank(districtGroupData);
      }
      else if (this.eventFilterType == 'STATE') {
        const stateGroupData = this.groupBy(this.eventData, event => event.stateId);
        this.userCalculateRank(stateGroupData);
      }
      else {
        const allGroupData = this.groupBy(this.eventData, event => event.eventId);
        this.userCalculateRank(allGroupData);
      }
    } else {
      if (this.eventFilterType == 'SCHOOL') {
        const schoolGroupData = this.groupBy(this.eventData, event => event.schoolId);
        this.userCalculateRank(schoolGroupData);
      }
      else if (this.eventFilterType == 'CITY') {
        const cityGroupData = this.groupBy(this.eventData, event => event.cityId);
        this.userCalculateRank(cityGroupData);
      }
      else if (this.eventFilterType == 'DISTRICT') {
        const districtGroupData = this.groupBy(this.eventData, event => event.districtId);
        this.userCalculateRank(districtGroupData);
      }
      else if (this.eventFilterType == 'STATE') {
        const stateGroupData = this.groupBy(this.eventData, event => event.stateId);
        this.userCalculateRank(stateGroupData);
      }
      else {
        const allGroupData = this.groupBy(this.eventData, event => event.eventId);
        this.userCalculateRank(allGroupData);
      }
    }

  }



  userCalculateRank(groupData) {
    for (const [key, value] of groupData.entries()) {
      let mark = value.sort((a, b) => {
        if (a.totalSecuredMark === b.totalSecuredMark) {
          return a.totalExamTime > b.totalExamTime ? 1 : a.totalExamTime < b.totalExamTime ? -1 : 0;
        }
        return a.totalSecuredMark < b.totalSecuredMark ? 1 : a.totalSecuredMark > b.totalSecuredMark ? -1 : 0;
      });
      let position = [];
      let rank = 0;
      for (let i = 0; i < mark.length; i++) {
        rank++;
        mark[i]['cacluateRank'] = rank;
        position.push(mark[i]);
      }
      let calculateRank = this.eventService.populateRank(position);
      for (var i = 0; i < calculateRank.length; i++) {
        //  calculateRank.forEach(rankData => {
        let rankData = calculateRank[i];
        if (this.eventFilterType == 'SCHOOL') {
          this.eventService.setDataToSchoolRank(rankData, this.eventType);
        }
        else if (this.eventFilterType == 'CITY') {
          this.eventService.setDataToCityRank(rankData, this.eventType);
        }
        else if (this.eventFilterType == 'DISTRICT') {
          this.eventService.setDataToDistrictRank(rankData, this.eventType);
        }
        else if (this.eventFilterType == 'STATE') {
          this.eventService.setDataToStateRank(rankData, this.eventType);
        }
        else {
          this.eventService.setDataToAllRank(rankData, this.eventType);
        }
      }
    };
    this.modalController.dismiss();
  }


  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    await toast.present();
  }

}



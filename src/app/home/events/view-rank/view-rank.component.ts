import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FirebaseCollection } from 'src/app/model/comman/firebase-collection';
import { EventsService } from 'src/app/services/events.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-view-rank',
  templateUrl: './view-rank.component.html',
  styleUrls: ['./view-rank.component.scss'],
})
export class ViewRankComponent implements OnInit {
  rankData: any[] = [];
  eventDetails: any;
  rankTypeView: string = 'ALL';
  rankGroupedData: any;
  rankStateFilter: any;
  rankDistrictFilter: any;
  rankCityFilter: any;
  rankSchoolFilter: any;
  states: any[] = [];
  districts: any[] = [];
  cities: any[] = [];
  schools: any[] = [];
  selectedCountry: string = 'India';
  eventType: string = '';
  constructor(
    private firestore: AngularFirestore,
    private route: ActivatedRoute,
    private eventsService: EventsService,
    private loadingService: LoadingService,
    public navCtrl: NavController,
  ) {
    this.eventType = this.route.snapshot.queryParams['EVENTTYPE'];
  }

  ngOnInit() {
    this.eventsService.getEventData().subscribe((events) => {
      if (events) {
        this.eventDetails = events;
      }
    })
    this.getAllStat();
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


  viewRank() {
    this.loadingService.presentLoading(6000);
    if (this.rankTypeView == 'ALL') {
      this.rankData = [];
      let query: any = {};
      if (this.eventType == 'QUIZWHIZZ') {
        query = this.firestore.collection(FirebaseCollection.all_rank_quizwhizz).ref.where('status', '==', 'COMPLETED')
          .where('eventId', '==', this.eventDetails.id)
          .orderBy('calculateRank');
      } else {
        query = this.firestore.collection(FirebaseCollection.all_rank).ref.where('status', '==', 'COMPLETED')
          .where('eventId', '==', this.eventDetails.id)
          .orderBy('calculateRank');
      }
      query.get().then((eventRankDetail: any) => {
        if (!eventRankDetail.empty) {
          eventRankDetail.forEach(data => {
            this.rankData.push(data.data());
          });
          this.rankGroupedData = this.groupBy(this.rankData, rank => rank.boardId);
        }
      });
    }
    if (this.rankTypeView == 'STATE') {
      this.rankData = [];
      let query: any = {};
      if (this.eventType == 'QUIZWHIZZ') {
        query = this.firestore.collection(FirebaseCollection.state_rank_quizwhizz).ref
          .where('status', '==', 'COMPLETED')
          .where('eventId', '==', this.eventDetails.id)
          .where('stateId', "==", this.rankStateFilter.id)
          .orderBy('calculateRank');
      } else {
        query = this.firestore.collection(FirebaseCollection.state_rank).ref
          .where('status', '==', 'COMPLETED')
          .where('eventId', '==', this.eventDetails.id)
          .where('stateId', "==", this.rankStateFilter.id)
          .orderBy('calculateRank');
      }
      query.get().then((eventRankDetail: any) => {
        if (!eventRankDetail.empty) {
          eventRankDetail.forEach(data => {
            this.rankData.push(data.data());
          });
          this.rankGroupedData = this.groupBy(this.rankData, rank => rank.stateName);
        }
      });
    }
    if (this.rankTypeView == 'DISTRICT') {
      this.rankData = [];
      let query: any = {};
      if (this.eventType == 'QUIZWHIZZ') {
        query = this.firestore.collection(FirebaseCollection.district_rank_quizwhizz).ref
          .where('status', '==', 'COMPLETED')
          .where('eventId', '==', this.eventDetails.id)
          .where('stateId', "==", this.rankStateFilter.id)
          .where('districtId', "==", this.rankDistrictFilter.id)
          .orderBy('calculateRank');
      } else {
        query = this.firestore.collection(FirebaseCollection.district_rank).ref
          .where('status', '==', 'COMPLETED')
          .where('eventId', '==', this.eventDetails.id)
          .where('stateId', "==", this.rankStateFilter.id)
          .where('districtId', "==", this.rankDistrictFilter.id)
          .orderBy('calculateRank');
      }
      query.get().then((eventRankDetail: any) => {
        if (!eventRankDetail.empty) {
          eventRankDetail.forEach(data => {
            this.rankData.push(data.data());
          });
          this.rankGroupedData = this.groupBy(this.rankData, rank => rank.stateName);
        }
      });
    }

    if (this.rankTypeView == 'CITY') {
      this.rankData = [];
      let query: any = {};
      if (this.eventType == 'QUIZWHIZZ') {
        query = this.firestore.collection(FirebaseCollection.city_rank_quizwhizz).ref
          .where('status', '==', 'COMPLETED')
          .where('eventId', '==', this.eventDetails.id)
          .where('stateId', "==", this.rankStateFilter.id)
          .where('districtId', "==", this.rankDistrictFilter.id)
          .where('cityId', "==", this.rankCityFilter.id)
          .orderBy('calculateRank');
      } else {
        query = this.firestore.collection(FirebaseCollection.city_rank).ref
          .where('status', '==', 'COMPLETED')
          .where('eventId', '==', this.eventDetails.id)
          .where('stateId', "==", this.rankStateFilter.id)
          .where('districtId', "==", this.rankDistrictFilter.id)
          .where('cityId', "==", this.rankCityFilter.id)
          .orderBy('calculateRank');
      }
      query.get().then((eventRankDetail: any) => {
        if (!eventRankDetail.empty) {
          eventRankDetail.forEach(data => {
            this.rankData.push(data.data());
          });
          this.rankGroupedData = this.groupBy(this.rankData, rank => rank.stateName);
        }
      });
    }

    if (this.rankTypeView == 'SCHOOL') {
      this.rankData = [];
      let query: any = {};
      if (this.eventType == 'QUIZWHIZZ') {
        query = this.firestore.collection(FirebaseCollection.school_rank_quizwhizz).ref
          .where('status', '==', 'COMPLETED')
          .where('eventId', '==', this.eventDetails.id)
          .where('stateId', "==", this.rankStateFilter.id)
          .where('districtId', "==", this.rankDistrictFilter.id)
          .where('cityId', "==", this.rankCityFilter.id)
          .where('schoolId', "==", this.rankSchoolFilter.id)
          .orderBy('calculateRank');
      } else {
        query = this.firestore.collection(FirebaseCollection.school_rank).ref
          .where('status', '==', 'COMPLETED')
          .where('eventId', '==', this.eventDetails.id)
          .where('stateId', "==", this.rankStateFilter.id)
          .where('districtId', "==", this.rankDistrictFilter.id)
          .where('cityId', "==", this.rankCityFilter.id)
          .where('schoolId', "==", this.rankSchoolFilter.id)
          .orderBy('calculateRank');
      }
      query.get().then((eventRankDetail: any) => {
        if (!eventRankDetail.empty) {
          eventRankDetail.forEach(data => {
            this.rankData.push(data.data());
          });
          this.rankGroupedData = this.groupBy(this.rankData, rank => rank.stateName);
        } else {
          this.rankGroupedData = null;
        }
      });
    }
  }

  getAllRank() {
    this.rankTypeView = 'ALL';
    this.rankStateFilter = null;
    this.rankDistrictFilter = null;
    this.rankCityFilter = null;
    this.rankSchoolFilter = null;
  }

  getAllStateRank(event) {
    this.rankDistrictFilter = null;
    this.rankCityFilter = null;
    this.rankSchoolFilter = null;
    this.rankTypeView = 'STATE';
    this.states = [];
    this.getAllStat();
  }

  getAllDistrictRank(event) {
    this.rankCityFilter = null;
    this.rankSchoolFilter = null;
    this.rankTypeView = 'DISTRICT';
    this.districts = [];
    this.firestore.collection("district", ref => ref.where("stateid", "==", this.rankStateFilter.id)).get().subscribe(data => {
      data.forEach((res: any) => {
        this.districts.push(res.data());
      })
    });
  }

  getAllCityRank(event) {
    this.rankSchoolFilter = null;
    this.rankTypeView = 'CITY';
    this.cities = [];
    this.firestore.collection("cities", ref => ref.where("stateid", "==", this.rankStateFilter.id)
      .where("districtid", "==", this.rankDistrictFilter.id)).get().subscribe(data => {
        data.forEach((res: any) => {
          this.cities.push(res.data());
        });
        this.cities = this.cities.sort((a, b) => {
          if (a.displayName.toLowerCase() > b.displayName.toLowerCase())
            return 1;
          if (a.displayName.toLowerCase() < b.displayName.toLowerCase())
            return -1;
          return 0;
        });
      });
  }

  getAllSchool(event) {
    this.rankTypeView = 'SCHOOL';
    this.schools = [];
    this.firestore.collection("school", ref => ref.where("stateid", "==", this.rankStateFilter.id)
      .where("districtid", "==", this.rankDistrictFilter.id).where("board", "==", this.eventDetails.boardName)).get().subscribe(data => {
        data.forEach((res: any) => {
          this.schools.push(res.data());
        });
        this.schools = this.schools.sort((a, b) => {
          if (a.displayName.toLowerCase() > b.displayName.toLowerCase())
            return 1;
          if (a.displayName.toLowerCase() < b.displayName.toLowerCase())
            return -1;
          return 0;
        });
      });
  }

  getAllStat() {
    const query = this.firestore.collection(FirebaseCollection.STATE);
    query.ref.get().then((rank: any) => {
      if (!rank.empty) {
        rank.forEach(data => {
          this.states.push(data.data());
        });
      }
    })
  }

  goBack() {
    this.navCtrl.back();
  }

}
